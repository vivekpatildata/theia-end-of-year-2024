// animate4.js - ANSHUN II Vessel Tracking Animation (Complete Mobile-Responsive Version)

(function(global) {
  // Detection points with annotations based on the tracking narrative
  const chapter10Points = [
    {
      coords: [102.0239, 2.2881],
      isSTS: true,
      popupOffset: [10, -40], // Custom offset for this popup
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter10A.png" class="annotation-img" alt="Satellite image STS">
        </div>
      `,
      delay: 500,
      hasGlow: true // Add red glow effect
    },
    {
      coords: [104.7115, 2.1147],
      isSTS: true,
      popupOffset: [130, -20], // Offset to the right to avoid overlap
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter10B.png" class="annotation-img" alt="Satellite image holding">
        </div>
      `,
      delay: 800,
      hasGlow: true // Add red glow effect
    }
  ];

  // Storage for cleanup
  let chapter10Markers = [];
  let chapter10Popups = [];
  let pathAnimationFrame = null;

  /**
   * Main animation function for ANSHUN II path
   */
  async function animateAnshunPath(map) {
    try {
      // Fetch the ANSHUN II path data
      const response = await fetch('data/anshun2.geojson');
      if (!response.ok) {
        console.error('Failed to fetch anshun2.geojson');
        return;
      }
      
      const anshunData = await response.json();
      const coords = anshunData.features?.[0]?.geometry?.coordinates;
      
      if (!Array.isArray(coords) || coords.length === 0) {
        console.warn('anshun2.geojson has no coordinates.');
        return;
      }

      // Remove existing source/layer if present
      cleanupPathLayers(map);

      // Add source with empty data initially
      map.addSource('anshun2Anim', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [] }
        }
      });

      // Add the animated line layer with neon green color
      map.addLayer({
        id: 'anshun2-anim-line',
        type: 'line',
        source: 'anshun2Anim',
        layout: { 'line-cap': 'round', visibility: 'visible' },
        paint: {
          'line-color': '#39ff14', // Neon green
          'line-width': 2,
          'line-opacity': 0.9
        }
      });

      // Add glow effect layer
      map.addLayer({
        id: 'anshun2-glow',
        type: 'line',
        source: 'anshun2Anim',
        layout: { 'line-cap': 'round', visibility: 'visible' },
        paint: {
          'line-color': '#39ff14',
          'line-width': 10,
          'line-opacity': 0.3,
          'line-blur': 6
        }
      }, 'anshun2-anim-line');

      // Animate the path drawing (reduced duration for faster animation)
      await animatePathDrawing(map, coords, 1500);
      
      // Add detection markers immediately
      flashChapter10Markers(map);
      
    } catch (error) {
      console.error('Error in animateAnshunPath:', error);
    }
  }

  /**
   * Animate path drawing progressively
   */
  function animatePathDrawing(map, coords, duration) {
    return new Promise(resolve => {
      const startTime = performance.now();
      const totalPoints = coords.length;

      function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      function updatePath(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);
        
        const pointsToShow = Math.floor(totalPoints * easedProgress);
        const partialCoords = coords.slice(0, pointsToShow + 1);

        if (partialCoords.length > 1) {
          const partialFeature = {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: partialCoords }
          };
          map.getSource('anshun2Anim').setData(partialFeature);

          // Pulse the line width for dynamic effect
          const widthPulse = 4 + Math.sin(elapsed * 0.003) * 0.5;
          map.setPaintProperty('anshun2-anim-line', 'line-width', widthPulse);
        }

        if (progress < 1) {
          pathAnimationFrame = requestAnimationFrame(updatePath);
        } else {
          // Reset line width after animation
          map.setPaintProperty('anshun2-anim-line', 'line-width', 4);
          resolve();
        }
      }

      pathAnimationFrame = requestAnimationFrame(updatePath);
    });
  }

  /**
   * Add detection markers immediately
   */
  function flashChapter10Markers(map) {
    chapter10Points.forEach((pt) => {
      let marker;
      
      // Create marker at exact coordinates
      if (pt.isSTS) {
        // Create two co-joined circular red blinking dots for STS
        const el = document.createElement('div');
        el.className = 'sts-marker';
        el.innerHTML = `
          <div class="sts-container">
            <div class="red-dot dot-1"></div>
            <div class="red-dot dot-2"></div>
          </div>
        `;
        marker = new mapboxgl.Marker(el)
          .setLngLat(pt.coords)
          .addTo(map);
      } else {
        // Create single red blinking dot
        const el = document.createElement('div');
        el.className = 'red-ping-marker';
        marker = new mapboxgl.Marker(el)
          .setLngLat(pt.coords)
          .addTo(map);
      }
      
      chapter10Markers.push(marker);

      // Show popup immediately with custom offset and red glow
      const popupClassName = pt.hasGlow ? 'anshun-popup red-glow' : 'anshun-popup';
      
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: pt.popupOffset || [0, -20], // Use custom offset or default
        className: popupClassName,
        maxWidth: 'none' // Remove width constraint
      })
        .setLngLat(pt.coords)
        .setHTML(pt.popupHtml)
        .addTo(map);
      
      chapter10Popups.push(popup);
    });
  }

  /**
   * Clear all Chapter 10 elements
   */
  function clearChapter10(map) {
    // Cancel animation if running
    if (pathAnimationFrame) {
      cancelAnimationFrame(pathAnimationFrame);
      pathAnimationFrame = null;
    }

    // Fade out path layers
    ['anshun2-glow', 'anshun2-anim-line'].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setPaintProperty(layerId, 'line-opacity', 0);
      }
    });

    // Remove path layers after fade
    setTimeout(() => {
      cleanupPathLayers(map);
    }, 300);

    // Remove markers immediately
    chapter10Markers.forEach((marker) => {
      marker.remove();
    });
    chapter10Markers = [];

    // Remove popups
    chapter10Popups.forEach(p => p.remove());
    chapter10Popups = [];
  }

  /**
   * Clean up path layers
   */
  function cleanupPathLayers(map) {
    ['anshun2-glow', 'anshun2-anim-line'].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });
    
    if (map.getSource('anshun2Anim')) {
      map.removeSource('anshun2Anim');
    }
  }

  // Expose functions globally
  global.animateAnshunPath = animateAnshunPath;
  global.clearChapter10 = clearChapter10;

  // Add CSS styles for Chapter 10 - COMPLETE MOBILE-RESPONSIVE VERSION
  if (!document.getElementById('chapter10-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter10-styles';
    style.textContent = `
      /* STS Marker - Two co-joined dots */
      .sts-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        pointer-events: none;
      }

      .sts-container {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .red-dot {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #ff0000;
        box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000;
        animation: red-blink 1.5s ease-in-out infinite;
        position: relative;
      }

      .red-dot::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        border: 2px solid #ff0000;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: red-ring-expand 2s ease-out infinite;
      }

      /* Single red blinking marker */
      .red-ping-marker {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ff0000;
        box-shadow: 0 0 25px #ff0000, 0 0 50px #ff0000;
        animation: red-blink 1.5s ease-in-out infinite;
        transform: translate(-50%, -50%);
        position: absolute;
      }

      .red-ping-marker::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 35px;
        height: 35px;
        border: 2px solid #ff0000;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: red-ring-expand 2s ease-out infinite;
      }

      .red-ping-marker::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3px;
        height: 30px;
        background: linear-gradient(to top, #ff0000, transparent);
        transform: translateX(-50%) translateY(12px);
        animation: red-beam 1.5s ease-in-out infinite;
      }

      @keyframes red-blink {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.7;
          transform: scale(0.95);
        }
      }

      @keyframes red-ring-expand {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }

      @keyframes red-beam {
        0%, 100% {
          opacity: 0.8;
          height: 30px;
        }
        50% {
          opacity: 1;
          height: 35px;
        }
      }

      /* POPUP STYLES - WHITE BACKGROUND */
      .anshun-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
      }

      .anshun-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }

      /* RED GLOW EFFECT for popups */
      .anshun-popup.red-glow .mapboxgl-popup-content {
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3);
        border: 1px solid rgba(255, 0, 0, 0.5);
      }

      .anshun-popup.red-glow .mapboxgl-popup-tip {
        border-top-color: rgba(255, 0, 0, 0.2);
      }

      /* COMPLETE RESPONSIVE IMAGE SIZING */
      /* DEFAULT (LARGE DESKTOP 1200px+) - Full size */
      .anshun-popup .enhanced-popup .annotation-img {
        width: 200px !important;
        height: 204px !important;
        object-fit: cover !important;
        display: block;
        border-radius: 4px;
      }

      /* DESKTOP (1024px - 1199px) - Slightly smaller */
      @media screen and (max-width: 1199px) and (min-width: 1024px) {
        .anshun-popup .enhanced-popup .annotation-img {
          width: 180px !important;
          height: 184px !important;
        }
      }

      /* TABLET LANDSCAPE (900px - 1023px) - Good size for tablets */
      @media screen and (max-width: 1023px) and (min-width: 900px) {
        .anshun-popup .enhanced-popup .annotation-img {
          width: 160px !important;
          height: 164px !important;
        }
        
        .anshun-popup .mapboxgl-popup-content {
          max-width: 85vw !important;
          max-height: 75vh !important;
          overflow: auto;
        }
      }

      /* TABLET PORTRAIT (768px - 899px) - Tablet optimized */
      @media screen and (max-width: 899px) and (min-width: 768px) {
        .anshun-popup .enhanced-popup .annotation-img {
          width: 140px !important;
          height: 144px !important;
        }
        
        .anshun-popup .mapboxgl-popup-content {
          max-width: 80vw !important;
          max-height: 70vh !important;
          overflow: auto;
        }
      }

      /* MOBILE LANDSCAPE (600px - 767px) - Mobile landscape */
      @media screen and (max-width: 767px) and (min-width: 600px) {
        .red-dot {
          width: 20px;
          height: 20px;
        }

        .red-ping-marker {
          width: 22px;
          height: 22px;
        }

        .anshun-popup .enhanced-popup .annotation-img {
          width: 120px !important;
          height: 124px !important;
        }
        
        .anshun-popup .mapboxgl-popup-content {
          max-width: 85vw !important;
          max-height: 65vh !important;
          overflow: auto;
        }
      }

      /* MOBILE PORTRAIT (480px - 599px) - Standard mobile */
      @media screen and (max-width: 599px) and (min-width: 480px) {
        .red-dot {
          width: 18px;
          height: 18px;
        }

        .red-ping-marker {
          width: 20px;
          height: 20px;
        }

        .anshun-popup .enhanced-popup .annotation-img {
          width: 100px !important;
          height: 104px !important;
        }
        
        .anshun-popup .mapboxgl-popup-content {
          max-width: 90vw !important;
          max-height: 60vh !important;
          overflow: auto;
        }
      }

      /* SMALL MOBILE (400px - 479px) - Smaller phones */
      @media screen and (max-width: 479px) and (min-width: 400px) {
        .red-dot {
          width: 16px;
          height: 16px;
        }

        .red-ping-marker {
          width: 18px;
          height: 18px;
        }

        .anshun-popup .enhanced-popup .annotation-img {
          width: 85px !important;
          height: 89px !important;
        }
        
        .anshun-popup .mapboxgl-popup-content {
          max-width: 92vw !important;
          max-height: 55vh !important;
          overflow: auto;
        }
      }

      /* EXTRA SMALL MOBILE (350px - 399px) - Very small phones */
      @media screen and (max-width: 399px) and (min-width: 350px) {
        .red-dot {
          width: 14px;
          height: 14px;
        }

        .red-ping-marker {
          width: 16px;
          height: 16px;
        }

        .anshun-popup .enhanced-popup .annotation-img {
          width: 70px !important;
          height: 74px !important;
        }
        
        .anshun-popup .mapboxgl-popup-content {
          max-width: 95vw !important;
          max-height: 50vh !important;
          overflow: auto;
        }
      }

      /* TINY MOBILE (320px - 349px) - Smallest phones */
      @media screen and (max-width: 349px) and (min-width: 320px) {
        .red-dot {
          width: 12px;
          height: 12px;
        }

        .red-ping-marker {
          width: 14px;
          height: 14px;
        }

        .anshun-popup .enhanced-popup .annotation-img {
          width: 60px !important;
          height: 64px !important;
        }
        
        .anshun-popup .mapboxgl-popup-content {
          max-width: 98vw !important;
          max-height: 45vh !important;
          overflow: auto;
        }
      }

      /* ULTRA SMALL (under 320px) - Safety fallback */
      @media screen and (max-width: 319px) {
        .red-dot {
          width: 10px;
          height: 10px;
        }

        .red-ping-marker {
          width: 12px;
          height: 12px;
        }

        .anshun-popup .enhanced-popup .annotation-img {
          width: 50px !important;
          height: 54px !important;
        }
        
        .anshun-popup .mapboxgl-popup-content {
          max-width: 98vw !important;
          max-height: 40vh !important;
          overflow: auto;
        }
      }

      /* ENHANCED MOBILE TOUCH OPTIMIZATIONS */
      @media screen and (max-width: 768px) {
        .anshun-popup .mapboxgl-popup-content {
          /* Better touch scrolling */
          -webkit-overflow-scrolling: touch;
          /* Better readability on mobile */
          font-size: 14px;
          line-height: 1.4;
        }

        .anshun-popup .enhanced-popup .annotation-img {
          /* Better touch interaction */
          touch-action: manipulation;
          /* Prevent image selection on mobile */
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Adjust marker ring effects for mobile performance */
        .red-dot::before,
        .red-ping-marker::before {
          animation-duration: 2.5s; /* Slightly slower for battery life */
        }

        /* Reduce glow intensity on mobile to save battery */
        .red-dot {
          box-shadow: 0 0 15px #ff0000, 0 0 30px #ff0000;
        }

        .red-ping-marker {
          box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000;
        }
      }

      /* HIGH-DPI DISPLAY OPTIMIZATIONS */
      @media screen and (-webkit-min-device-pixel-ratio: 2), 
             screen and (min-resolution: 192dpi) {
        .anshun-popup .enhanced-popup .annotation-img {
          /* Better image rendering on retina displays */
          image-rendering: -webkit-optimize-contrast;
          image-rendering: optimize-contrast;
        }
      }

      /* LANDSCAPE ORIENTATION ADJUSTMENTS */
      @media screen and (orientation: landscape) and (max-height: 500px) {
        .anshun-popup .mapboxgl-popup-content {
          max-height: 80vh !important; /* More height in landscape */
        }
      }

      /* PORTRAIT ORIENTATION ADJUSTMENTS */
      @media screen and (orientation: portrait) and (max-width: 768px) {
        .anshun-popup .mapboxgl-popup-content {
          max-height: 60vh !important; /* Less height in portrait to keep map visible */
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
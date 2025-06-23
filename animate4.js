// animate4.js - ANSHUN II Vessel Tracking Animation

(function(global) {
  // Detection points with annotations based on the tracking narrative
  const chapter10Points = [
    {
      coords: [102.0239, 2.2881],
      isSTS: true,
      popupOffset: [0, -30], // Custom offset for this popup
      popupHtml: `
        <div class="enhanced-popup">
          <img src="pointi.png" class="annotation-img" alt="Satellite image STS">
        </div>
      `,
      delay: 500
    },
    {
      coords: [104.7115, 2.1147],
      isSTS: true,
      popupOffset: [60, -20], // Offset to the right to avoid overlap
      popupHtml: `
        <div class="enhanced-popup">
          <img src="pointi.png" class="annotation-img" alt="Satellite image holding">
        </div>
      `,
      delay: 800
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
      const response = await fetch('anshun2.geojson');
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

      // Show popup immediately with custom offset
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: pt.popupOffset || [0, -20], // Use custom offset or default
        className: 'anshun-popup',
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

  // Add CSS styles for Chapter 10
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

      /* Enhanced popup styles */
      .anshun-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 12px;
        overflow: hidden;
        min-width: 180px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(57, 255, 20, 0.3);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(57, 255, 20, 0.2);
      }

      .anshun-popup .mapboxgl-popup-tip {
        border-top-color: rgba(0, 0, 0, 0.9);
      }

      .enhanced-popup .annotation-img {
        width: 100%;
        height: 100px;
        object-fit: cover;
        display: block;
      }

      .enhanced-popup .popup-info {
        padding: 1rem;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.95));
      }

      .popup-label {
        display: block;
        font-size: 1rem;
        font-weight: 600;
        color: #39ff14;
        margin-bottom: 0.25rem;
        text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
      }

      .popup-date {
        display: block;
        font-size: 0.85rem;
        color: #999;
        margin-bottom: 0.5rem;
        font-family: monospace;
      }

      .popup-description {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.4;
      }

      /* Mobile optimizations */
      @media screen and (max-width: 768px) {
        .red-dot {
          width: 18px;
          height: 18px;
        }

        .red-ping-marker {
          width: 20px;
          height: 20px;
        }

        .enhanced-popup .annotation-img {
          width: 150px;
          height: 150px;
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
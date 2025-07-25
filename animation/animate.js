// animate.js - MV Tutor Animation (Mobile-Friendly with Enhanced Styling)

(function(global) {
  // Chapter state tracking for Chapter 7
  let isChapter7Active = false;
  let chapter7CleanupCallbacks = [];

  // Enhanced blinking points with satellite images and different marker types
  const chapter7Points = [
    {
      coords: [34.604001, 26.873599], // Red Sea off Hurghada
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter7A.png" class="annotation-img" alt="Satellite imagery">
        </div>
      `,
      offset: [-10, 250],
      delay: 500,
      markerType: 'orange', // Orange marker - using medium-yellow to avoid CSS interference
      hasGlow: false
    },
    {
      coords: [39.5328, 18.2419], // Red Sea off Hurghada
      // NO POPUP - just orange blinking dot
      delay: 700,
      markerType: 'orange', // Orange marker - using medium-yellow to avoid CSS interference
      hasPopup: false // New flag to skip popup creation
    },
    {
      coords: [41.6407, 14.4260], // Red Sea off Eritrea
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter7B.png" class="annotation-img" alt="Satellite imagery">
        </div>
      `,
      offset: [30, -50],
      delay: 1000,
      markerType: 'red-final', // Special red marker for final AIS signal
      hasGlow: true // This one gets the red glow
    }
  ];

  // Israel annotation with enhanced styling
  const israelAnnotationCoord = [34.78131795015321, 31.557678607979483]; // Your specified coordinates
  const israelAnnotationText = 'Regional EMI affecting AIS location';

  // Storage for cleanup
  let chapter7Markers = [];
  let chapter7Popups = [];
  let israelAnnotationMarker = null;
  let pathAnimationFrame = null;
  let glowEffect = null;

  /**
   * Force cleanup function for Chapter 7
   */
  function forceCleanupChapter7(map) {
    console.log('🧹 Force cleanup Chapter 7 triggered');
    
    // Set chapter as inactive
    isChapter7Active = false;
    
    // Cancel any ongoing animations immediately
    if (pathAnimationFrame) {
      cancelAnimationFrame(pathAnimationFrame);
      pathAnimationFrame = null;
    }
    
    // Execute all cleanup callbacks
    chapter7CleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (e) {
        console.warn('Chapter 7 cleanup callback error:', e);
      }
    });
    chapter7CleanupCallbacks = [];
    
    // Remove all Chapter 7 popups IMMEDIATELY
    const tutorPopups = document.querySelectorAll('.tutor-popup');
    tutorPopups.forEach(popup => {
      popup.remove();
    });
    
    // Remove all Chapter 7 markers IMMEDIATELY
    chapter7Markers.forEach(marker => {
      marker.remove();
    });
    chapter7Markers = [];
    
    // Remove Chapter 7 popups from array
    chapter7Popups.forEach(p => p.remove());
    chapter7Popups = [];
    
    // Clean up Israel annotation
    if (israelAnnotationMarker) {
      israelAnnotationMarker.remove();
      israelAnnotationMarker = null;
    }
    
    // Clean up path layers
    cleanupPathLayers(map);
    
    console.log('✅ Force cleanup Chapter 7 completed');
  }

  /**
   * Enhanced path animation with progressive drawing and glow
   */
  async function animateTutorPath(map) {
    try {
      // Set chapter as active
      isChapter7Active = true;
      
      // Only cleanup path layers, not the entire chapter
      cleanupPathLayers(map);
      
      // Fetch the GeoJSON
      const response = await fetch('data/mv_tutor_path.geojson');
      if (!response.ok) {
        console.error('Failed to fetch mv_tutor_path.geojson');
        return;
      }
      const tutorData = await response.json();

      const coords = tutorData.features?.[0]?.geometry?.coordinates;
      if (!Array.isArray(coords) || coords.length === 0) {
        console.warn('mv_tutor_path.geojson has no coordinates.');
        return;
      }

      // Remove existing source/layer if present
      cleanupPathLayers(map);

      // Add source with empty data
      map.addSource('tutorAnim', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [] }
        }
      });

      // Add multiple layers for enhanced effect
      // Base line
      map.addLayer({
        id: 'tutor-anim-line',
        type: 'line',
        source: 'tutorAnim',
        layout: { 'line-cap': 'round', 'visibility': 'visible' },
        paint: { 
          'line-color': '#ff0000', 
          'line-width': 4, 
          'line-opacity': 0.9,
          'line-blur': 0
        }
      });

      // Glow effect layer
      map.addLayer({
        id: 'tutor-anim-glow',
        type: 'line',
        source: 'tutorAnim',
        layout: { 'line-cap': 'round', 'visibility': 'visible' },
        paint: { 
          'line-color': '#ff0066', 
          'line-width': 12, 
          'line-opacity': 0.3,
          'line-blur': 8
        }
      }, 'tutor-anim-line');

      // Check if chapter is still active before proceeding
      if (!isChapter7Active) return;

      // Animate path drawing with easing
      await animatePathDrawing(map, coords, 1000);
      
      // Check again before adding markers
      if (!isChapter7Active) return;
      
      // After path is complete, flash the markers
      flashChapter7Markers(map);
    } catch (error) {
      console.error('Error in animateTutorPath:', error);
    }
  }

  /**
   * Smooth path drawing animation with easing
   */
  function animatePathDrawing(map, coords, duration) {
    return new Promise(resolve => {
      const startTime = performance.now();
      const totalPoints = coords.length;

      function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      function updatePath(currentTime) {
        // Check if chapter is still active
        if (!isChapter7Active) {
          resolve();
          return;
        }
        
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
          
          // Check if source still exists
          if (map.getSource('tutorAnim')) {
            map.getSource('tutorAnim').setData(partialFeature);
          }

          // Update line width based on progress for dynamic effect
          const widthModifier = 0.5 + (0.5 * Math.sin(progress * Math.PI));
          if (map.getLayer('tutor-anim-line')) {
            map.setPaintProperty('tutor-anim-line', 'line-width', 3 + widthModifier);
          }
        }

        if (progress < 1) {
          pathAnimationFrame = requestAnimationFrame(updatePath);
        } else {
          // Add completion pulse
          if (isChapter7Active) {
            pulseLineEffect(map);
          }
          resolve();
        }
      }

      pathAnimationFrame = requestAnimationFrame(updatePath);
    });
  }

  /**
   * Pulse effect for completed line
   */
  function pulseLineEffect(map) {
    let pulseCount = 0;
    const maxPulses = 3;

    function pulse() {
      if (pulseCount >= maxPulses) return;

      if (map.getLayer('tutor-anim-glow')) {
        map.setPaintProperty('tutor-anim-glow', 'line-opacity', 0.6);
        map.setPaintProperty('tutor-anim-glow', 'line-width', 20);
      }

      setTimeout(() => {
        if (map.getLayer('tutor-anim-glow')) {
          map.setPaintProperty('tutor-anim-glow', 'line-opacity', 0.3);
          map.setPaintProperty('tutor-anim-glow', 'line-width', 12);
        }
        pulseCount++;
        
        if (pulseCount < maxPulses) {
          setTimeout(pulse, 400);
        }
      }, 200);
    }

    pulse();
  }

  /**
   * Enhanced marker flashing with different marker types
   */
  function flashChapter7Markers(map) {
    chapter7Points.forEach((pt, idx) => {
      const timeoutId = setTimeout(() => {
        // Check if chapter is still active
        if (!isChapter7Active) return;
        
        // Create marker based on type
        const el = document.createElement('div');
        
        if (pt.markerType === 'orange') {
          // Orange marker - using medium-yellow to avoid CSS interference with animate2.js
          el.className = 'impact-marker medium-yellow';
          el.innerHTML = `
            <div class="impact-core"></div>
            <div class="impact-ring"></div>
            <div class="impact-pulse"></div>
          `;
        } else if (pt.markerType === 'red-final') {
          // Special red marker for final AIS signal
          el.className = 'final-ais-marker';
          el.innerHTML = `
            <div class="final-ais-core"></div>
            <div class="final-ais-ring"></div>
            <div class="ais-fade-indicator"></div>
          `;
        }
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(pt.coords)
          .addTo(map);
        
        chapter7Markers.push(marker);

        // Add cleanup callback
        chapter7CleanupCallbacks.push(() => {
          marker.remove();
        });

        // Add entry animation
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%, -50%) scale(0)';
        requestAnimationFrame(() => {
          el.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          el.style.opacity = '1';
          el.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Show popup after marker animation - SKIP for hasPopup: false
        if (pt.hasPopup !== false && pt.popupHtml) {
          const popupTimeoutId = setTimeout(() => {
            // Check if chapter is still active
            if (!isChapter7Active) return;
            
            const popupClassName = pt.hasGlow ? 'tutor-popup glow-effect' : 'tutor-popup';
            
            const popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: pt.offset,
              className: popupClassName,
              maxWidth: 'none'
            })
              .setLngLat(pt.coords)
              .setHTML(pt.popupHtml)
              .addTo(map);
            
            chapter7Popups.push(popup);

            // Add cleanup callback
            chapter7CleanupCallbacks.push(() => {
              popup.remove();
            });
          }, 100);
          
          chapter7CleanupCallbacks.push(() => {
            clearTimeout(popupTimeoutId);
          });
        }

        // Show Israel annotation after last popup
        if (idx === chapter7Points.length - 1) {
          const israelTimeoutId = setTimeout(() => {
            if (!isChapter7Active) return;
            addIsraelAnnotation(map);
          }, 100);
          
          chapter7CleanupCallbacks.push(() => {
            clearTimeout(israelTimeoutId);
          });
        }
      }, pt.delay);
      
      // Add timeout cleanup callback
      chapter7CleanupCallbacks.push(() => {
        clearTimeout(timeoutId);
      });
    });
  }

  /**
   * Enhanced Israel annotation with red styling
   */
  function addIsraelAnnotation(map) {
    if (israelAnnotationMarker) return;

    const el = document.createElement('div');
    el.className = 'chapter7-text-annotation';
    el.innerHTML = `
      <div class="chapter7-annotation-text">
        <span class="warning-icon">⚠️</span>
        ${israelAnnotationText}
      </div>
    `;
    
    // Initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';

    israelAnnotationMarker = new mapboxgl.Marker(el, { 
      offset: [50, 0] // ADJUST TEXT BOX POSITION HERE: [x, y] - negative y moves up
    })
      .setLngLat(israelAnnotationCoord)
      .addTo(map);

    // Add cleanup callback
    chapter7CleanupCallbacks.push(() => {
      if (israelAnnotationMarker) {
        israelAnnotationMarker.remove();
        israelAnnotationMarker = null;
      }
    });

    // Animate in
    requestAnimationFrame(() => {
      el.style.transition = 'all 0.6s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  /**
   * Enhanced cleanup with fade-out animations
   */
  function clearChapter7(map) {
    console.log('🧹 clearChapter7 called');
    
    // Set chapter as inactive and use force cleanup
    forceCleanupChapter7(map);
  }

  /**
   * Helper to clean up path layers
   */
  function cleanupPathLayers(map) {
    ['tutor-anim-glow', 'tutor-anim-line'].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });
    
    if (map.getSource('tutorAnim')) {
      map.removeSource('tutorAnim');
    }
  }

  // Expose functions globally
  global.animateTutorPath = animateTutorPath;
  global.clearChapter7 = clearChapter7;
  global.forceCleanupChapter7 = forceCleanupChapter7;

  // Add enhanced CSS with mobile-friendly sizing and red text box
  if (!document.getElementById('chapter7-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter7-styles';
    style.textContent = `
      /* YELLOW-ORANGE MARKER (to avoid interference with animate2.js) */
      .impact-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        pointer-events: none;
      }

      .impact-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        transform: translate(-50%, -50%);
        background: #ff0000;
        border-radius: 50%;
        box-shadow: 0 0 20px currentColor;
      }

      .impact-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border: 2px solid #ff0000;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: impact-ring 2s ease-out infinite;
      }

      .impact-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        animation: impact-pulse 1.5s ease-out infinite;
      }

      /* MEDIUM-YELLOW marker styling - using #ffaa00 as requested */
      .impact-marker.medium-yellow .impact-core {
        background: #ffaa00;
        animation: medium-yellow-impact-glow 2s ease-in-out infinite;
      }

      .impact-marker.medium-yellow .impact-ring {
        border-color: #ffaa00;
      }

      .impact-marker.medium-yellow .impact-pulse {
        background: radial-gradient(circle, rgba(255,170,0,0.8) 0%, transparent 70%);
      }

      @keyframes medium-yellow-impact-glow {
        0%, 100% {
          box-shadow: 0 0 15px #ffaa00, 0 0 30px #ffaa00;
        }
        50% {
          box-shadow: 0 0 25px #ffaa00, 0 0 50px #ffaa00;
        }
      }

      @keyframes impact-ring {
        0% {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2.5);
          opacity: 0;
        }
      }

      @keyframes impact-pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.8;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.3);
          opacity: 0.4;
        }
      }

      /* FINAL AIS MARKER (red, slow, creative for last signal) */
      .final-ais-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        pointer-events: none;
      }

      .final-ais-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        transform: translate(-50%, -50%);
        background: #ff0000;
        border-radius: 50%;
        box-shadow: 0 0 25px #ff0000, 0 0 50px #ff0000;
        animation: final-ais-heartbeat 3s ease-in-out infinite;
      }

      .final-ais-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border: 3px solid #ff0000;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: final-ais-slow-expand 4s ease-out infinite;
      }

      .ais-fade-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 80%;
        height: 80%;
        background: radial-gradient(circle, transparent 30%, rgba(255,0,0,0.2) 70%, transparent 100%);
        transform: translate(-50%, -50%);
        animation: ais-signal-fade 5s ease-in-out infinite;
      }

      /* Final AIS animations - slow and dramatic */
      @keyframes final-ais-heartbeat {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          box-shadow: 0 0 25px #ff0000, 0 0 50px #ff0000;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.15);
          box-shadow: 0 0 35px #ff0000, 0 0 70px #ff0000;
        }
      }

      @keyframes final-ais-slow-expand {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(3);
          opacity: 0;
        }
      }

      @keyframes ais-signal-fade {
        0%, 80% {
          opacity: 0.6;
        }
        90%, 100% {
          opacity: 0.1;
        }
      }

      /* POPUP STYLES - WHITE BACKGROUND */
      .tutor-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
      }

      .tutor-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }

      /* Second popup with red glow effect */
      .tutor-popup.glow-effect .mapboxgl-popup-content {
        box-shadow: 0 0 40px rgba(255, 0, 102, 0.6), 0 0 80px rgba(255, 0, 102, 0.3);
        border: 1px solid rgba(255, 0, 102, 0.5);
      }

      .tutor-popup.glow-effect .mapboxgl-popup-tip {
        border-top-color: rgba(255, 0, 102, 0.2);
      }

      /* DESKTOP: Satellite image sizes - FINAL SIZES */
      .tutor-popup .enhanced-popup .annotation-img {
        width: 220px !important;    
        height: 200px !important;   
        object-fit: cover !important;
        display: block;
        border-radius: 4px;
      }

      /* RED TEXT BOX - Chapter 7 Style */
      .chapter7-text-annotation {
        position: absolute;
        transform: translate(-50%, -50%);
        background: rgba(204, 68, 68, 0.95);
        color: white;
        padding: 12px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 300;
        font-family: 'Roboto', sans-serif;
        line-height: 1.3;
        white-space: nowrap;
        box-shadow: 
          0 4px 20px rgba(204, 68, 68, 0.4),
          0 2px 10px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(180, 50, 50, 0.8);
        pointer-events: none;
        backdrop-filter: blur(2px);
      }

      .chapter7-annotation-text {
        display: flex;
        align-items: center;
        gap: 8px;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        letter-spacing: 0.5px;
      }

      .warning-icon {
        font-size: 16px;
        filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
      }

      /* TABLET OPTIMIZATIONS (1024px) - Proportional scaling from desktop */
      @media screen and (max-width: 1024px) {
        .tutor-popup .enhanced-popup .annotation-img {
          width: 190px !important;    /* 86% of desktop 220px */
          height: 173px !important;   /* 86% of desktop 200px */
        }

        .chapter7-text-annotation {
          font-size: 13px;
          padding: 11px 15px;
        }

        .warning-icon {
          font-size: 15px;
        }
      }

      /* MOBILE OPTIMIZATIONS (768px) - Better mobile scaling */
      @media screen and (max-width: 768px) {
        .tutor-popup .enhanced-popup .annotation-img {
          width: 154px !important;    /* 70% of desktop 220px */
          height: 140px !important;   /* 70% of desktop 200px */
        }

        .chapter7-text-annotation {
          font-size: 12px;
          padding: 10px 13px;
        }

        .warning-icon {
          font-size: 14px;
        }

        /* Mobile marker adjustments */
        .impact-marker {
          width: 45px;
          height: 45px;
        }

        .final-ais-marker {
          width: 55px;
          height: 55px;
        }

        .final-ais-core {
          width: 15px;
          height: 15px;
        }
      }

      /* SMALL MOBILE OPTIMIZATIONS (480px) - Smaller but usable */
      @media screen and (max-width: 480px) {
        .tutor-popup .enhanced-popup .annotation-img {
          width: 121px !important;    /* 55% of desktop 220px */
          height: 110px !important;   /* 55% of desktop 200px */
        }

        .chapter7-text-annotation {
          font-size: 11px;
          padding: 8px 11px;
        }

        .warning-icon {
          font-size: 13px;
        }

        /* Further mobile marker adjustments */
        .impact-marker {
          width: 40px;
          height: 40px;
        }

        .final-ais-marker {
          width: 50px;
          height: 50px;
        }

        .impact-core, .final-ais-core {
          width: 14px;
          height: 14px;
        }
      }

      /* EXTRA SMALL MOBILE (320px) - Minimum usable sizes */
      @media screen and (max-width: 320px) {
        .tutor-popup .enhanced-popup .annotation-img {
          width: 88px !important;     /* 40% of desktop 220px */
          height: 80px !important;    /* 40% of desktop 200px */
        }

        .chapter7-text-annotation {
          font-size: 10px;
          padding: 6px 9px;
        }

        .warning-icon {
          font-size: 12px;
        }

        /* Smallest mobile marker adjustments */
        .impact-marker {
          width: 35px;
          height: 35px;
        }

        .final-ais-marker {
          width: 45px;
          height: 45px;
        }

        .impact-core, .final-ais-core {
          width: 12px;
          height: 12px;
        }
      }

      /* Ensure popups don't overflow on mobile screens */
      @media screen and (max-width: 768px) {
        .tutor-popup .mapboxgl-popup-content {
          max-width: 95vw;
          max-height: 80vh;
          overflow: auto;
        }
      }

      /* Extra safety for very small screens */
      @media screen and (max-width: 320px) {
        .tutor-popup .mapboxgl-popup-content {
          max-width: 98vw;
          max-height: 75vh;
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
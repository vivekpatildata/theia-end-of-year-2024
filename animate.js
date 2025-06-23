// animate.js - MV Tutor Animation (Simplified popups)

(function(global) {
  // Enhanced blinking points with satellite images
  const chapter7Points = [
    {
      coords: [34.604001, 26.873599], // Red Sea off Hurghada
      popupHtml: `
        <div class="enhanced-popup">
          <img src="mvtutora.png" class="annotation-img" alt="Satellite imagery">
        </div>
      `,
      offset: [-70, 250],
      delay: 500,
      pulseColor: '#ff0066',
      hasGlow: false
    },
    {
      coords: [42.5325, 14.8114], // Red Sea off Eritrea
      popupHtml: `
        <div class="enhanced-popup">
          <img src="mvtutorb.png" class="annotation-img" alt="Satellite imagery">
        </div>
      `,
      offset: [0, -30],
      delay: 1000,
      pulseColor: '#ff0066',
      hasGlow: true // This one gets the red glow
    }
  ];

  // Israel annotation with enhanced styling
  const israelAnnotationCoord = [34.78131795015321, 31.557678607979483]; // Your specified coordinates
  const israelAnnotationText = 'AIS manipulation';

  // Storage for cleanup
  let chapter7Markers = [];
  let chapter7Popups = [];
  let israelAnnotationMarker = null;
  let pathAnimationFrame = null;
  let glowEffect = null;

  /**
   * Enhanced path animation with progressive drawing and glow
   */
  async function animateTutorPath(map) {
    try {
      // Fetch the GeoJSON
      const response = await fetch('mv_tutor_path.geojson');
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

      // Animate path drawing with easing
      await animatePathDrawing(map, coords, 1000);
      
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
          map.getSource('tutorAnim').setData(partialFeature);

          // Update line width based on progress for dynamic effect
          const widthModifier = 0.5 + (0.5 * Math.sin(progress * Math.PI));
          map.setPaintProperty('tutor-anim-line', 'line-width', 3 + widthModifier);
        }

        if (progress < 1) {
          pathAnimationFrame = requestAnimationFrame(updatePath);
        } else {
          // Add completion pulse
          pulseLineEffect(map);
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

      map.setPaintProperty('tutor-anim-glow', 'line-opacity', 0.6);
      map.setPaintProperty('tutor-anim-glow', 'line-width', 20);

      setTimeout(() => {
        map.setPaintProperty('tutor-anim-glow', 'line-opacity', 0.3);
        map.setPaintProperty('tutor-anim-glow', 'line-width', 12);
        pulseCount++;
        
        if (pulseCount < maxPulses) {
          setTimeout(pulse, 400);
        }
      }, 200);
    }

    pulse();
  }

  /**
   * Enhanced marker flashing with staggered appearance
   */
  function flashChapter7Markers(map) {
    chapter7Points.forEach((pt, idx) => {
      setTimeout(() => {
        // Create enhanced blinking marker
        const el = document.createElement('div');
        el.className = 'enhanced-red-ping';
        el.innerHTML = `
          <div class="ping-core"></div>
          <div class="ping-ring"></div>
          <div class="ping-ring-2"></div>
        `;
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(pt.coords)
          .addTo(map);
        
        chapter7Markers.push(marker);

        // Add entry animation
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%, -50%) scale(0)';
        requestAnimationFrame(() => {
          el.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          el.style.opacity = '1';
          el.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Show popup after marker animation
        setTimeout(() => {
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

          // Show Israel annotation after last popup
          if (idx === chapter7Points.length - 1) {
            setTimeout(() => addIsraelAnnotation(map), 100);
          }
        }, 100);
      }, pt.delay);
    });
  }

  /**
   * Enhanced Israel annotation with fade-in effect
   */
  function addIsraelAnnotation(map) {
    if (israelAnnotationMarker) return;

    const el = document.createElement('div');
    el.className = 'annotation-text ais-warning';
    el.innerHTML = `
      <div class="warning-icon">⚠️</div>
      <div class="warning-text">${israelAnnotationText}</div>
    `;
    
    // Initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';

    israelAnnotationMarker = new mapboxgl.Marker(el, { 
      offset: [50,0] // ADJUST TEXT BOX POSITION HERE: [x, y] - negative y moves up
    })
      .setLngLat(israelAnnotationCoord)
      .addTo(map);

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
    // Cancel any ongoing animations
    if (pathAnimationFrame) {
      cancelAnimationFrame(pathAnimationFrame);
      pathAnimationFrame = null;
    }

    // Fade out and remove path layers
    if (map.getLayer('tutor-anim-line')) {
      map.setPaintProperty('tutor-anim-line', 'line-opacity', 0);
      map.setPaintProperty('tutor-anim-glow', 'line-opacity', 0);
      
      setTimeout(() => {
        cleanupPathLayers(map);
      }, 300);
    }

    // Fade out and remove markers
    chapter7Markers.forEach(marker => {
      const el = marker.getElement();
      el.style.transition = 'all 0.3s ease-in';
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(0)';
      
      setTimeout(() => marker.remove(), 300);
    });
    chapter7Markers = [];

    // Remove popups
    chapter7Popups.forEach(p => p.remove());
    chapter7Popups = [];

    // Fade out and remove Israel annotation
    if (israelAnnotationMarker) {
      const el = israelAnnotationMarker.getElement();
      el.style.transition = 'all 0.3s ease-in';
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        israelAnnotationMarker.remove();
        israelAnnotationMarker = null;
      }, 300);
    }
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

  // Add CSS for enhanced animations
  if (!document.getElementById('chapter7-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter7-styles';
    style.textContent = `
      /* Enhanced red ping markers - KEEPING ALL ANIMATIONS */
      .enhanced-red-ping {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        pointer-events: none;
      }
      
      .ping-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 12px;
        height: 12px;
        transform: translate(-50%, -50%);
        background: #ff0066;
        border-radius: 50%;
        box-shadow: 0 0 20px #ff0066, 0 0 40px #ff0066;
        animation: ping-glow 1.5s ease-in-out infinite;
      }
      
      .ping-ring,
      .ping-ring-2 {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border: 2px solid #ff0066;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: ping-expand 2s ease-out infinite;
      }
      
      .ping-ring-2 {
        animation-delay: 0.5s;
      }
      
      @keyframes ping-glow {
        0%, 100% {
          box-shadow: 0 0 20px #ff0066, 0 0 40px #ff0066;
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          box-shadow: 0 0 30px #ff0066, 0 0 60px #ff0066;
          transform: translate(-50%, -50%) scale(1.1);
        }
      }
      
      @keyframes ping-expand {
        0% {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
      
      /* SIMPLIFIED POPUPS */
      .tutor-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 0;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
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

      /* ADJUST SATELLITE IMAGE SIZE HERE - DESKTOP */
      .tutor-popup .enhanced-popup .annotation-img {
        width: 200px !important;    /* <-- CHANGE THIS to increase/decrease image width */
        height: 200px !important;   /* <-- CHANGE THIS to increase/decrease image height */
        object-fit: fill;
        display: block;
        border-radius: 4px;
      }
      
      /* AIS warning text box - matching animate2.js style */
      .ais-warning {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 14px;
        white-space: nowrap;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 0, 102, 0.3);
      }

      .warning-icon {
        font-size: 16px;
        filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
      }

      .warning-text {
        font-weight: 500;
      }

      /* Mobile optimizations */
      @media screen and (max-width: 768px) {
        /* MOBILE: ADJUST SATELLITE IMAGE SIZE HERE */
        .tutor-popup .enhanced-popup .annotation-img {
          width: 150px !important;    /* <-- CHANGE THIS for mobile image width */
          height: 150px !important;   /* <-- CHANGE THIS for mobile image height */
        }

        .ais-warning {
          font-size: 12px;
          padding: 8px 12px;
        }

        .warning-icon {
          font-size: 14px;
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
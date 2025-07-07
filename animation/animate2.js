// animate2.js - Rubymar Animation (Mobile-Friendly with Red Text Box)

(function(global) {
  // Enhanced data for Chapter 8 with richer details
  const chapter8Points = [
    {
      blinkCoords: [53.15667, 14.566292],
      popupCoords: [53.25667, 14.666292],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter8A.png" class="annotation-img" alt="Rubymar Sat 2">
        </div>
      `,
      offset: [-60, -40],
      delay: 500,
      impactLevel: 'medium'
    },
    {
      blinkCoords: [43.3232, 12.8447],
      popupCoords: [43.2878616667, 12.7729116667],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter8B.png" class="annotation-img" alt="Rubymar Sat 3">
        </div>
      `,
      offset: [-170, 190],
      delay: 800,
      impactLevel: 'critical'
    }
  ];

  // Final text annotation
  const textAnnotationCoord = [43.3232, 12.8447]; // Changed to be near the sinking location
  const textAnnotationContent = 'Ship sank location after Houthis attacked';

  // Storage for cleanup
  let chapter8Markers = [];
  let chapter8Popups = [];
  let chapter8TextMarker = null;
  let pathAnimationFrame = null;
  let waveEffects = [];

  /**
   * Enhanced Rubymar path animation with dynamic effects
   */
  async function animateRubymarPath(map) {
    try {
      const resp = await fetch('data/rubymar_path.geojson');
      if (!resp.ok) {
        console.error('Failed to fetch rubymar_path.geojson');
        return;
      }
      
      const rubymarData = await resp.json();
      const coords = rubymarData.features?.[0]?.geometry?.coordinates;
      
      if (!Array.isArray(coords) || coords.length === 0) {
        console.warn('rubymar_path.geojson has no coordinates.');
        return;
      }

      // Clean up existing layers
      cleanupPathLayers(map);

      // Add source
      map.addSource('rubymarAnim', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [] }
        }
      });

      // Add multiple layers for enhanced visual effect
      // Shadow layer
      map.addLayer({
        id: 'rubymar-shadow',
        type: 'line',
        source: 'rubymarAnim',
        layout: { 'line-cap': 'round', visibility: 'visible' },
        paint: {
          'line-color': '#000000',
          'line-width': 8,
          'line-opacity': 0.3,
          'line-blur': 6,
          'line-translate': [2, 2]
        }
      });

      // Main path
      map.addLayer({
        id: 'rubymar-anim-line',
        type: 'line',
        source: 'rubymarAnim',
        layout: { 'line-cap': 'round', visibility: 'visible' },
        paint: {
          'line-color': '#ff0000',
          'line-width': 4,
          'line-opacity': 0.9
        }
      });

      // Glow effect
      map.addLayer({
        id: 'rubymar-glow',
        type: 'line',
        source: 'rubymarAnim',
        layout: { 'line-cap': 'round', visibility: 'visible' },
        paint: {
          'line-color': '#ff6600',
          'line-width': 12,
          'line-opacity': 0.4,
          'line-blur': 10
        }
      }, 'rubymar-anim-line');

      // Animate the path with dynamic effects
      await animatePathWithEffects(map, coords, 800);
      
      // Flash markers immediately after path
      flashChapter8Markers(map);
      
    } catch (error) {
      console.error('Error in animateRubymarPath:', error);
    }
  }

  /**
   * Animate path with wave effects and dynamic coloring
   */
  function animatePathWithEffects(map, coords, duration) {
    return new Promise(resolve => {
      const startTime = performance.now();
      const totalPoints = coords.length;

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function updatePath(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        
        const pointsToShow = Math.floor(totalPoints * easedProgress);
        const partialCoords = coords.slice(0, pointsToShow + 1);

        if (partialCoords.length > 1) {
          const partialFeature = {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: partialCoords }
          };
          map.getSource('rubymarAnim').setData(partialFeature);

          // Dynamic color based on progress (red to darker red)
          const colorProgress = Math.sin(progress * Math.PI);
          const r = 255;
          const g = Math.floor(100 * colorProgress);
          const b = 0;
          map.setPaintProperty('rubymar-anim-line', 'line-color', `rgb(${r}, ${g}, ${b})`);

          // Pulsing width
          const widthPulse = 3 + Math.sin(elapsed * 0.005) * 1;
          map.setPaintProperty('rubymar-anim-line', 'line-width', widthPulse);
        }

        if (progress < 1) {
          pathAnimationFrame = requestAnimationFrame(updatePath);
        } else {
          // Add distress wave effect at end
          createDistressWaves(map, coords[coords.length - 1]);
          resolve();
        }
      }

      pathAnimationFrame = requestAnimationFrame(updatePath);
    });
  }

  /**
   * Create expanding wave circles to indicate distress
   */
  function createDistressWaves(map, centerCoord) {
    const waveCount = 3;
    
    for (let i = 0; i < waveCount; i++) {
      setTimeout(() => {
        const waveId = `distress-wave-${Date.now()}-${i}`;
        
        // Add wave source
        map.addSource(waveId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: centerCoord
            }
          }
        });

        // Add wave layer
        map.addLayer({
          id: waveId,
          type: 'circle',
          source: waveId,
          paint: {
            'circle-radius': 0,
            'circle-color': '#ff0000',
            'circle-opacity': 0.6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ff6600',
            'circle-stroke-opacity': 0.8
          }
        });

        waveEffects.push(waveId);

        // Animate wave expansion
        let radius = 0;
        const maxRadius = 30;
        const waveAnimation = setInterval(() => {
          radius += 3;
          const opacity = Math.max(0, 0.6 * (1 - radius / maxRadius));
          
          map.setPaintProperty(waveId, 'circle-radius', radius);
          map.setPaintProperty(waveId, 'circle-opacity', opacity);
          map.setPaintProperty(waveId, 'circle-stroke-opacity', opacity * 1.3);

          if (radius >= maxRadius) {
            clearInterval(waveAnimation);
          }
        }, 30);
      }, i * 500);
    }
  }

  /**
   * Enhanced marker flashing with impact indicators
   */
  function flashChapter8Markers(map) {
    chapter8Points.forEach((pt, idx) => {
      setTimeout(() => {
        // Create impact-based marker
        const el = document.createElement('div');
        el.className = `impact-marker ${pt.impactLevel}`;
        el.innerHTML = `
          <div class="impact-core"></div>
          <div class="impact-ring"></div>
          <div class="impact-pulse"></div>
          ${pt.impactLevel === 'critical' ? '<div class="danger-beacon"></div>' : ''}
        `;
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(pt.blinkCoords)
          .addTo(map);
        
        chapter8Markers.push(marker);

        // Entrance animation
        animateMarkerEntrance(el, pt.impactLevel);

        // Show popup after marker animation
        setTimeout(() => {
          const popupClassName = pt.impactLevel === 'critical' ? 'rubymar-popup critical-glow' : 'rubymar-popup';
          
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: pt.offset,
            className: popupClassName,
            maxWidth: 'none'
          })
            .setLngLat(pt.popupCoords)
            .setHTML(pt.popupHtml)
            .addTo(map);
          
          chapter8Popups.push(popup);

          // Show final annotation after last popup
          if (idx === chapter8Points.length - 1) {
            setTimeout(() => addChapter8TextAnnotation(map), 300);
          }
        }, 300);
      }, pt.delay);
    });
  }

  /**
   * Animate marker entrance based on impact level
   */
  function animateMarkerEntrance(el, impactLevel) {
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%, -50%) scale(0)';

    const animations = {
      high: 'marker-slam 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      medium: 'marker-bounce 0.8s ease-out',
      critical: 'marker-explosive 1s ease-out'
    };

    requestAnimationFrame(() => {
      el.style.animation = animations[impactLevel] || animations.medium;
      el.style.opacity = '1';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }

  /**
   * Enhanced final text annotation with RED styling
   */
  function addChapter8TextAnnotation(map) {
    if (chapter8TextMarker) return;

    const el = document.createElement('div');
    el.className = 'chapter8-text-annotation';
    el.innerHTML = `<div class="chapter8-annotation-text">${textAnnotationContent}</div>`;

    el.style.opacity = '0';
    el.style.transform = 'translateY(20px) scale(0.9)';

    chapter8TextMarker = new mapboxgl.Marker(el, { 
      offset: [0, -60] // ADJUST TEXT BOX POSITION HERE: [x, y] - negative y moves up
    })
      .setLngLat(textAnnotationCoord)
      .addTo(map);

    requestAnimationFrame(() => {
      el.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
    });
  }

  /**
   * Enhanced cleanup with smooth transitions
   */
  function clearChapter8(map) {
    if (pathAnimationFrame) {
      cancelAnimationFrame(pathAnimationFrame);
      pathAnimationFrame = null;
    }

    // Fade out path layers
    ['rubymar-glow', 'rubymar-anim-line', 'rubymar-shadow'].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setPaintProperty(layerId, 'line-opacity', 0);
      }
    });

    // Remove wave effects
    waveEffects.forEach(waveId => {
      if (map.getLayer(waveId)) {
        map.removeLayer(waveId);
      }
      if (map.getSource(waveId)) {
        map.removeSource(waveId);
      }
    });
    waveEffects = [];

    setTimeout(() => {
      cleanupPathLayers(map);
    }, 300);

    // Animate out markers
    chapter8Markers.forEach(marker => {
      const el = marker.getElement();
      el.style.transition = 'all 0.4s ease-in';
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(0) rotate(180deg)';
      
      setTimeout(() => marker.remove(), 400);
    });
    chapter8Markers = [];

    // Remove popups
    chapter8Popups.forEach(p => p.remove());
    chapter8Popups = [];

    // Fade out text annotation
    if (chapter8TextMarker) {
      const el = chapter8TextMarker.getElement();
      el.style.transition = 'all 0.4s ease-in';
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px) scale(0.9)';
      
      setTimeout(() => {
        chapter8TextMarker.remove();
        chapter8TextMarker = null;
      }, 400);
    }
  }

  /**
   * Clean up path layers
   */
  function cleanupPathLayers(map) {
    ['rubymar-glow', 'rubymar-anim-line', 'rubymar-shadow'].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });
    
    if (map.getSource('rubymarAnim')) {
      map.removeSource('rubymarAnim');
    }
  }

  // Expose functions
  global.animateRubymarPath = animateRubymarPath;
  global.clearChapter8 = clearChapter8;

  // Add enhanced styles with RED text box and mobile-friendly sizing
  if (!document.getElementById('chapter8-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter8-styles';
    style.textContent = `
      /* Impact markers - KEEPING ALL ANIMATIONS */
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

      /* Impact levels */
      .impact-marker.high .impact-core {
        background: #ff6600;
        animation: high-impact-glow 1.5s ease-in-out infinite;
      }

      .impact-marker.medium .impact-core {
        background: #ffaa00;
        animation: medium-impact-glow 2s ease-in-out infinite;
      }

      .impact-marker.critical .impact-core {
        background: #ff0000;
        animation: critical-impact-glow 1s ease-in-out infinite;
      }

      .danger-beacon {
        position: absolute;
        top: -10px;
        left: 50%;
        width: 4px;
        height: 20px;
        background: linear-gradient(to top, #ff0000, transparent);
        transform: translateX(-50%);
        animation: beacon-flash 0.5s ease-in-out infinite;
      }

      /* All marker animations - KEEPING THESE */
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

      @keyframes high-impact-glow {
        0%, 100% {
          box-shadow: 0 0 20px #ff6600, 0 0 40px #ff6600;
        }
        50% {
          box-shadow: 0 0 30px #ff6600, 0 0 60px #ff6600;
        }
      }

      @keyframes medium-impact-glow {
        0%, 100% {
          box-shadow: 0 0 15px #ffaa00, 0 0 30px #ffaa00;
        }
        50% {
          box-shadow: 0 0 25px #ffaa00, 0 0 50px #ffaa00;
        }
      }

      @keyframes critical-impact-glow {
        0%, 100% {
          box-shadow: 0 0 30px #ff0000, 0 0 60px #ff0000;
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          box-shadow: 0 0 40px #ff0000, 0 0 80px #ff0000;
          transform: translate(-50%, -50%) scale(1.1);
        }
      }

      @keyframes beacon-flash {
        0%, 100% {
          opacity: 1;
          height: 20px;
        }
        50% {
          opacity: 0.3;
          height: 25px;
        }
      }

      /* Marker entrance animations - KEEPING THESE */
      @keyframes marker-slam {
        0% {
          transform: translate(-50%, -50%) scale(0) rotate(-180deg);
          opacity: 0;
        }
        60% {
          transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
      }

      @keyframes marker-bounce {
        0% {
          transform: translate(-50%, -50%) scale(0) translateY(-50px);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1) translateY(10px);
          opacity: 1;
        }
        70% {
          transform: translate(-50%, -50%) scale(0.9) translateY(-5px);
        }
        100% {
          transform: translate(-50%, -50%) scale(1) translateY(0);
        }
      }

      @keyframes marker-explosive {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
        30% {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 1;
        }
        50% {
          transform: translate(-50%, -50%) scale(0.8);
        }
        70% {
          transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
        }
      }

      /* POPUP STYLES - WHITE BACKGROUND */
      .rubymar-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
      }

      .rubymar-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }

      /* Critical popup with red glow */
      .rubymar-popup.critical-glow .mapboxgl-popup-content {
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3);
        border: 1px solid rgba(255, 0, 0, 0.5);
      }

      .rubymar-popup.critical-glow .mapboxgl-popup-tip {
        border-top-color: rgba(255, 0, 0, 0.2);
      }

      /* DESKTOP: Satellite image sizes */
      .rubymar-popup .enhanced-popup .annotation-img {
        width: 230px !important;    
        height: 205px !important;   
        object-fit: cover !important;
        display: block;
        border-radius: 4px;
      }

      /* RED TEXT BOX - Chapter 5 Style */
      .chapter8-text-annotation {
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

      .chapter8-annotation-text {
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        letter-spacing: 0.5px;
      }

      /* TABLET OPTIMIZATIONS (1024px) */
      @media screen and (max-width: 1024px) {
        .rubymar-popup .enhanced-popup .annotation-img {
          width: 184px !important;    /* 80% of desktop */
          height: 164px !important;   /* 80% of desktop */
        }

        .chapter8-text-annotation {
          font-size: 12px;
          padding: 10px 14px;
        }
      }

      /* MOBILE OPTIMIZATIONS (768px) */
      @media screen and (max-width: 768px) {
        .rubymar-popup .enhanced-popup .annotation-img {
          width: 138px !important;    /* 60% of desktop */
          height: 123px !important;   /* 60% of desktop */
        }

        .chapter8-text-annotation {
          font-size: 11px;
          padding: 8px 12px;
        }
      }

      /* SMALL MOBILE OPTIMIZATIONS (480px) */
      @media screen and (max-width: 480px) {
        .rubymar-popup .enhanced-popup .annotation-img {
          width: 104px !important;    /* 45% of desktop */
          height: 92px !important;    /* 45% of desktop */
        }

        .chapter8-text-annotation {
          font-size: 10px;
          padding: 6px 10px;
        }
      }

      /* EXTRA SMALL MOBILE (320px) */
      @media screen and (max-width: 320px) {
        .rubymar-popup .enhanced-popup .annotation-img {
          width: 81px !important;     /* 35% of desktop */
          height: 72px !important;    /* 35% of desktop */
        }

        .chapter8-text-annotation {
          font-size: 9px;
          padding: 5px 8px;
        }
      }

      /* Ensure popups don't overflow on mobile screens */
      @media screen and (max-width: 768px) {
        .rubymar-popup .mapboxgl-popup-content {
          max-width: 95vw;
          max-height: 80vh;
          overflow: auto;
        }
      }

      /* Extra safety for very small screens */
      @media screen and (max-width: 320px) {
        .rubymar-popup .mapboxgl-popup-content {
          max-width: 98vw;
          max-height: 75vh;
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
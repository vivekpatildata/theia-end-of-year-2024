// animate5.js - Chapter 11 Sea Trials Animation (Simplified like other animate files)

(function(global) {
    // Detection points for Chinese amphibious assault barges sea trials
    const chapter11Points = [
      {
        coords: [113.6451, 22.7048], // First detection point - 2 images
        type: 'single',
        popupHtml: `
          <div class="enhanced-popup">
            <img src="chinese1.png" class="annotation-img" alt="Sea trial detection 1A">
            <img src="chinese2.png" class="annotation-img" alt="Sea trial detection 1B">
          </div>
        `,
        offset: [0, -50], // ADJUST POPUP POSITION: [x, y] - negative y moves up, positive x moves right
        delay: 500
      },
      {
        coords: [113.7080, 21.8732], // Group detection point - 4 images
        type: 'group',
        isGroupLead: true, // This marker will show the group popup
        popupHtml: `
          <div class="enhanced-popup quad-popup">
            <div class="quad-row">
              <img src="chinese3.png" class="annotation-img" alt="4-legged barge">
              <img src="chinese4.png" class="annotation-img" alt="6-legged barge">
            </div>
            <div class="quad-row">
              <img src="chinese5.png" class="annotation-img" alt="8-legged barge">
              <img src="chinese6.png" class="annotation-img" alt="Operations">
            </div>
          </div>
        `,
        offset: [250, 100], // ADJUST GROUP POPUP POSITION: [x, y] - adjust to prevent overlap
        delay: 800
      },
      {
        coords: [113.7690, 21.8991], // Group detection point 2
        type: 'group',
        isGroupLead: false,
        delay: 1000
      },
      {
        coords: [113.7934, 21.9079], // Group detection point 3
        type: 'group', 
        isGroupLead: false,
        delay: 1200
      },
      {
        coords: [113.3423, 21.7784], // Group detection point 4
        type: 'group',
        isGroupLead: false,
        delay: 1400
      }
    ];
  
    // Storage for cleanup
    let chapter11Markers = [];
    let chapter11Popups = [];
  
    /**
     * Main animation function for Chapter 11 sea trials
     */
    function animateChapter11SeaTrials(map) {
      console.log('Starting Chapter 11 sea trials animation...');
      
      chapter11Points.forEach((pt, idx) => {
        setTimeout(() => {
          // Create detection marker
          const el = document.createElement('div');
          el.className = pt.type === 'group' ? 'detection-marker group-marker' : 'detection-marker single-marker';
          el.innerHTML = `
            <div class="detection-core">
              <div class="detection-symbol">⚠</div>
            </div>
            <div class="detection-ring"></div>
            <div class="detection-pulse"></div>
            ${pt.type === 'group' ? '<div class="group-indicator"></div>' : ''}
          `;
          
          const marker = new mapboxgl.Marker(el)
            .setLngLat(pt.coords)
            .addTo(map);
          
          chapter11Markers.push(marker);
  
          // Add entrance animation
          el.style.opacity = '0';
          el.style.transform = 'translate(-50%, -50%) scale(0)';
          requestAnimationFrame(() => {
            el.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            el.style.opacity = '1';
            el.style.transform = 'translate(-50%, -50%) scale(1)';
          });
  
          // Show popup only for single markers and group lead
          if ((pt.type === 'single') || (pt.type === 'group' && pt.isGroupLead)) {
            setTimeout(() => {
              const popupClassName = pt.type === 'group' ? 'sea-trials-popup red-glow' : 'sea-trials-popup red-glow';
              
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
              
              chapter11Popups.push(popup);
            }, 300);
          }
  
          // Add connecting lines for group markers (visual effect)
          if (pt.type === 'group' && idx > 1 && idx < 5) {
            addGroupConnectionLine(map, pt.coords, chapter11Points[1].coords, idx);
          }
        }, pt.delay);
      });
  
      // Removed THEIA Assessment summary - was causing positioning issues
    }
  
    /**
     * Add visual connection lines between group markers
     */
    function addGroupConnectionLine(map, fromCoords, toCoords, index) {
      const lineId = `group-connection-${index}`;
      
      map.addSource(lineId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [fromCoords, toCoords]
          }
        }
      });
  
      map.addLayer({
        id: lineId,
        type: 'line',
        source: lineId,
        paint: {
          'line-color': '#ff6600',
          'line-width': 1,
          'line-opacity': 0.3,
          'line-dasharray': [2, 4]
        }
      });
    }
  
    // THEIA Assessment function removed due to positioning issues
  
    /**
     * Enhanced cleanup for Chapter 11
     */
    function clearChapter11(map) {
      console.log('Clearing Chapter 11...');
  
      // Fade out and remove markers
      chapter11Markers.forEach(marker => {
        const el = marker.getElement();
        if (el) {
          el.style.transition = 'all 0.4s ease-in';
          el.style.opacity = '0';
          el.style.transform = 'translate(-50%, -50%) scale(0)';
          
          setTimeout(() => marker.remove(), 400);
        } else {
          marker.remove();
        }
      });
      chapter11Markers = [];
  
      // Remove popups
      chapter11Popups.forEach(p => p.remove());
      chapter11Popups = [];
  
      // Remove connection lines
      for (let i = 2; i <= 5; i++) {
        const lineId = `group-connection-${i}`;
        if (map.getLayer(lineId)) {
          map.removeLayer(lineId);
        }
        if (map.getSource(lineId)) {
          map.removeSource(lineId);
        }
      }
    }
  
    // Expose functions globally
    global.animateChapter11SeaTrials = animateChapter11SeaTrials;
    global.clearChapter11 = clearChapter11;
  
    // Add simplified CSS styles matching other animate files
    if (!document.getElementById('chapter11-styles')) {
      const style = document.createElement('style');
      style.id = 'chapter11-styles';
      style.textContent = `
        /* Detection markers with warning symbol */
        .detection-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          pointer-events: none;
        }
  
        .detection-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 28px;
          height: 28px;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #ff6600, #ff4400);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(255, 102, 0, 0.6), 0 0 40px rgba(255, 102, 0, 0.3);
          animation: detection-glow 2s ease-in-out infinite;
        }
  
        .detection-symbol {
          color: white;
          font-size: 16px;
          font-weight: bold;
          text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
        }
  
        .detection-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 2px solid #ff6600;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: detection-ring-expand 3s ease-out infinite;
        }
  
        .detection-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(255, 102, 0, 0.4) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          animation: detection-pulse 2.5s ease-out infinite;
        }
  
        /* Group marker indicator */
        .group-marker .group-indicator {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 16px;
          height: 16px;
          background: #ff0000;
          border-radius: 50%;
          border: 2px solid white;
          animation: group-indicator-blink 1s ease-in-out infinite;
        }
  
        /* Marker animations */
        @keyframes detection-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 102, 0, 0.6), 0 0 40px rgba(255, 102, 0, 0.3);
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 102, 0, 0.8), 0 0 60px rgba(255, 102, 0, 0.4);
            transform: translate(-50%, -50%) scale(1.05);
          }
        }
  
        @keyframes detection-ring-expand {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }
  
        @keyframes detection-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.2;
          }
        }
  
        @keyframes group-indicator-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
  
        /* SIMPLIFIED POPUP STYLES - Like other animate files */
        .sea-trials-popup .mapboxgl-popup-content {
          padding: 0;
          border-radius: 0;
          overflow: hidden;
          background: white;
          border: 1px solid #ccc;
          border-radius: 1px;
        }
  
        .sea-trials-popup .mapboxgl-popup-tip {
          border-top-color: white;
        }
  
        /* RED GLOW EFFECT for both popups */
        .sea-trials-popup.red-glow .mapboxgl-popup-content {
          box-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3);
          border: 1px solid rgba(255, 0, 0, 0.5);
        }
  
        .sea-trials-popup.red-glow .mapboxgl-popup-tip {
          border-top-color: rgba(255, 0, 0, 0.2);
        }
  
        /* DUAL IMAGES (side by side) - ADJUST SIZES HERE */
        .enhanced-popup {
          display: flex;
          gap: 4px;
        }
  
        .enhanced-popup .annotation-img {
          width: 130px !important;    /* <-- CHANGE THIS for dual image width */
          height: 130px !important;   /* <-- CHANGE THIS for dual image height */
          object-fit: fill;
          display: block;
          border-radius: 1px;
        }
  
        /* QUAD IMAGES (2x2 grid) - ADJUST SIZES HERE */
        .enhanced-popup.quad-popup {
          display: block;
        }
  
        .quad-row {
          display: flex;
          gap: 4px;
          margin-bottom: 4px;
        }
  
        .quad-row:last-child {
          margin-bottom: 0;
        }
  
        .quad-popup .annotation-img {
          width: 120px !important;    /* <-- CHANGE THIS for quad image width */
          height: 120px !important;   /* <-- CHANGE THIS for quad image height */
          object-fit: cover;
          display: block;
        }
  
        /* MOBILE OPTIMIZATIONS */
        @media screen and (max-width: 768px) {
          .detection-marker {
            width: 40px;
            height: 40px;
          }
  
          .detection-core {
            width: 24px;
            height: 24px;
          }
  
          .detection-symbol {
            font-size: 14px;
          }
  
          /* MOBILE: DUAL IMAGES */
          .enhanced-popup .annotation-img {
            width: 120px !important;   /* <-- CHANGE THIS for mobile dual image width */
            height: 120px !important;  /* <-- CHANGE THIS for mobile dual image height */
          }
  
          /* MOBILE: QUAD IMAGES */
          .quad-popup .annotation-img {
            width: 100px !important;   /* <-- CHANGE THIS for mobile quad image width */
            height: 100px !important;  /* <-- CHANGE THIS for mobile quad image height */
          }
        }
      `;
      document.head.appendChild(style);
    }
  
  })(window);
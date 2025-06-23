// animate3.js - MSC Aries Animation (Simplified)

(function(global) {
  // Data for Chapter 9 with adjusted offsets
  const chapter9Points = [
    {
      coords: [54.64783492662988, 24.81671945499157],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="mc-ariesA.png" class="annotation-img" alt="MSC Aries Sat 1">
        </div>
      `,
      offset: [0, 170], // Standard offset
      isDetained: false
    },
    {
      coords: [56.296427695851236, 26.948014954863964],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="mscariesB.png" class="annotation-img" alt="MSC Aries Sat 2">
        </div>
      `,
      offset: [90, 10], // Offset to the right to avoid overlap
      isDetained: false
    },
    {
      coords: [55.9852, 26.9852],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="mscariesC.png" class="annotation-img" alt="MSC Aries Sat 3">
        </div>
      `,
      offset: [-90, 10], // Offset to the left
      isDetained: true, // Special marker for detention
      hasGlow: true // Add red glow effect to satellite popup
    }
  ];

  // Storage
  let chapter9Markers = [];
  let chapter9Popups = [];

  /**
   * Main animation function
   */
  function animateMscAriesPoints(map) {
    // Add all points immediately
    chapter9Points.forEach((pt) => {
      // Create marker
      let marker;
      
      if (pt.isDetained) {
        // Create detention marker (red with text box)
        const el = document.createElement('div');
        el.className = 'detention-marker';
        el.innerHTML = `
          <div class="detention-core"></div>
          <div class="detention-text">Vessel has remained docked here since</div>
        `;
        marker = new mapboxgl.Marker(el)
          .setLngLat(pt.coords)
          .addTo(map);
      } else {
        // Create standard vessel marker (green)
        const el = document.createElement('div');
        el.className = 'vessel-marker';
        marker = new mapboxgl.Marker(el)
          .setLngLat(pt.coords)
          .addTo(map);
      }
      
      chapter9Markers.push(marker);

      // Show popup immediately with glow effect for detained vessel
      const popupClassName = pt.hasGlow ? 'msc-popup glow-effect' : 'msc-popup';
      
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
      
      chapter9Popups.push(popup);
    });
  }

  /**
   * Clear all Chapter 9 elements
   */
  function clearChapter9(map) {
    // Remove markers
    chapter9Markers.forEach(marker => marker.remove());
    chapter9Markers = [];

    // Remove popups
    chapter9Popups.forEach(p => p.remove());
    chapter9Popups = [];
  }

  // Expose functions
  global.animateMscAriesPoints = animateMscAriesPoints;
  global.clearChapter9 = clearChapter9;

  // Add simplified styles
  if (!document.getElementById('chapter9-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter9-styles';
    style.textContent = `
      /* Standard vessel marker */
      .vessel-marker {
        /* ADJUST GREEN MARKER SIZE HERE */
        width: 30px;      /* <-- CHANGE THIS for marker width */
        height: 30px;     /* <-- CHANGE THIS for marker height */
        border-radius: 4px;
        background: #00ff88;
        box-shadow: 0 0 20px #00ff88, 0 0 40px #00ff88;
        animation: vessel-pulse 2s ease-in-out infinite;
        transform: translate(-50%, -50%);
        position: absolute;
      }

      .vessel-marker::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 35px;
        height: 35px;
        border: 2px solid #00ff88;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: vessel-ring 2s ease-out infinite;
      }

      /* Detention marker */
      .detention-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
      }

      .detention-core {
        position: absolute;
        top: 50%;
        left: 50%;
        /* ADJUST RED DETENTION MARKER SIZE HERE */
        width: 20px;      /* <-- CHANGE THIS for red marker width */
        height: 20px;     /* <-- CHANGE THIS for red marker height */
        background: #ff0000;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        box-shadow: 0 0 30px #ff0000;
        animation: detention-pulse 1.5s ease-in-out infinite;
      }

      .detention-text {
        position: absolute;
        /* ADJUST TEXT BOX POSITION HERE */
        top: 100%;        /* <-- CHANGE THIS to move text up/down (100% = below marker) */
        left: -130%;        /* <-- CHANGE THIS to move text left/right (50% = centered) */
        transform: translateX(-50%);
        margin-top: 5px; /* <-- CHANGE THIS for space between marker and text */
        
        /* Text box styling */
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 0, 0, 0.3);
      }

      @keyframes vessel-pulse {
        0%, 100% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          opacity: 0.8;
          transform: translate(-50%, -50%) scale(0.95);
        }
      }

      @keyframes vessel-ring {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }

      @keyframes detention-pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          box-shadow: 0 0 30px #ff0000;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 0 50px #ff0000;
        }
      }

      /* Popup styles - WHITE BACKGROUND KEPT */
      .msc-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
      }

      .msc-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }

      /* Red glow effect for detained vessel popup */
      .msc-popup.glow-effect .mapboxgl-popup-content {
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3);
        border: 1px solid rgba(255, 0, 0, 0.5);
      }

      .msc-popup.glow-effect .mapboxgl-popup-tip {
        border-top-color: rgba(255, 0, 0, 0.2);
      }

      /* ADJUST SATELLITE IMAGE SIZE HERE - DESKTOP */
      .msc-popup .enhanced-popup .annotation-img {
        width: 150px !important;    /* <-- CHANGE THIS to increase/decrease image width */
        height: 150px !important;   /* <-- CHANGE THIS to increase/decrease image height */
        object-fit: fill;
        display: block;
        border-radius: 4px;
      }

      /* Mobile optimizations */
      @media screen and (max-width: 768px) {
        /* MOBILE: ADJUST GREEN MARKER SIZE HERE */
        .vessel-marker {
          width: 20px;    /* <-- CHANGE THIS for mobile marker width */
          height: 20px;   /* <-- CHANGE THIS for mobile marker height */
        }

        /* MOBILE: ADJUST RED DETENTION MARKER SIZE HERE */
        .detention-core {
          width: 24px;    /* <-- CHANGE THIS for mobile red marker width */
          height: 24px;   /* <-- CHANGE THIS for mobile red marker height */
        }

        .detention-text {
          font-size: 11px;
          padding: 6px 10px;
        }

        /* MOBILE: ADJUST SATELLITE IMAGE SIZE HERE */
        .msc-popup .enhanced-popup .annotation-img {
          width: 150px !important;    /* <-- CHANGE THIS for mobile image width */
          height: 150px !important;   /* <-- CHANGE THIS for mobile image height */
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
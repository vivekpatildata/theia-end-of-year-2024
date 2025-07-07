// animatechapter4.js - Chapter 4 STS Markers and Satellite Images (Mobile-Friendly)

(function(global) {
  // STS detection points with satellite images
  const chapter4STSPoints = [
    {
      coords: [-4.35634327710693, 35.76795866600577],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter4B.png" class="annotation-img" alt="STS Detection 1">
        </div>
      `,
      popupOffset: [20, -60],
      hasGlow: true // Add red glow effect
    },
    {
      coords: [-4.530137532155294, 35.58879860100882],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter4A.png" class="annotation-img" alt="STS Detection 2">
        </div>
      `,
      popupOffset: [70, 230],
      hasGlow: true // Add red glow effect
    }
  ];

  // Storage for cleanup
  let chapter4Markers = [];
  let chapter4Popups = [];

  /**
   * Show Chapter 4 STS markers and satellite images
   */
  function showChapter4STS(map) {
    chapter4STSPoints.forEach((pt) => {
      // Create STS marker (two co-joined red blinking dots)
      const el = document.createElement('div');
      el.className = 'sts-marker';
      el.innerHTML = `
        <div class="sts-container">
          <div class="red-dot dot-1"></div>
          <div class="red-dot dot-2"></div>
        </div>
      `;
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(pt.coords)
        .addTo(map);
      
      chapter4Markers.push(marker);

      // Show popup with satellite image immediately - with glow effect
      const popupClassName = pt.hasGlow ? 'chapter4-popup glow-effect' : 'chapter4-popup';
      
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: pt.popupOffset,
        className: popupClassName,
        maxWidth: 'none'
      })
        .setLngLat(pt.coords)
        .setHTML(pt.popupHtml)
        .addTo(map);
      
      chapter4Popups.push(popup);
    });
  }

  /**
   * Clear Chapter 4 elements
   */
  function clearChapter4STS(map) {
    // Remove markers immediately
    chapter4Markers.forEach((marker) => {
      marker.remove();
    });
    chapter4Markers = [];

    // Remove popups
    chapter4Popups.forEach(p => p.remove());
    chapter4Popups = [];
  }

  /**
   * Main animation function for Chapter 4
   */
  function animateChapter4(map) {
    // Show STS markers immediately
    showChapter4STS(map);
  }

  // Expose functions globally
  global.animateChapter4 = animateChapter4;
  global.clearChapter4STS = clearChapter4STS;

  // Add CSS styles for Chapter 4 with mobile-friendly sizing
  if (!document.getElementById('chapter4-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter4-styles';
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

      /* Popup styles - WHITE BACKGROUND KEPT */
      .chapter4-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
      }

      .chapter4-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }

      /* Red glow effect for popup containers */
      .chapter4-popup.glow-effect .mapboxgl-popup-content {
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3);
        border: 1px solid rgba(255, 0, 0, 0.5);
      }

      .chapter4-popup.glow-effect .mapboxgl-popup-tip {
        border-top-color: rgba(255, 0, 0, 0.2);
      }

      /* DESKTOP: Image sizes (200x200) */
      .chapter4-popup .enhanced-popup .annotation-img {
        width: 200px !important;
        height: 200px !important;
        min-width: 200px !important;
        min-height: 200px !important;
        max-width: 200px !important;
        max-height: 200px !important;
        object-fit: cover !important;
        border-radius: 4px;
        display: block;
      }

      /* TABLET OPTIMIZATIONS (1024px) */
      @media screen and (max-width: 1024px) {
        .chapter4-popup .enhanced-popup .annotation-img {
          width: 160px !important;        /* 80% of desktop */
          height: 160px !important;       /* 80% of desktop */
          min-width: 160px !important;
          min-height: 160px !important;
          max-width: 160px !important;
          max-height: 160px !important;
        }
      }

      /* MOBILE OPTIMIZATIONS (768px) */
      @media screen and (max-width: 768px) {
        /* Marker adjustments */
        .red-dot {
          width: 18px;
          height: 18px;
        }

        .red-dot::before {
          width: 25px;
          height: 25px;
        }

        .sts-container {
          gap: 3px;
        }

        /* Image sizing - 60% of desktop */
        .chapter4-popup .enhanced-popup .annotation-img {
          width: 120px !important;        /* 60% of desktop */
          height: 120px !important;       /* 60% of desktop */
          min-width: 120px !important;
          min-height: 120px !important;
          max-width: 120px !important;
          max-height: 120px !important;
        }
      }

      /* SMALL MOBILE OPTIMIZATIONS (480px) */
      @media screen and (max-width: 480px) {
        .red-dot {
          width: 16px;
          height: 16px;
        }

        .red-dot::before {
          width: 22px;
          height: 22px;
        }

        .sts-container {
          gap: 2px;
        }

        /* Image sizing - 45% of desktop */
        .chapter4-popup .enhanced-popup .annotation-img {
          width: 90px !important;         /* 45% of desktop */
          height: 90px !important;        /* 45% of desktop */
          min-width: 90px !important;
          min-height: 90px !important;
          max-width: 90px !important;
          max-height: 90px !important;
        }
      }

      /* EXTRA SMALL MOBILE (320px) */
      @media screen and (max-width: 320px) {
        .red-dot {
          width: 14px;
          height: 14px;
        }

        .red-dot::before {
          width: 20px;
          height: 20px;
        }

        /* Image sizing - 35% of desktop */
        .chapter4-popup .enhanced-popup .annotation-img {
          width: 70px !important;         /* 35% of desktop */
          height: 70px !important;        /* 35% of desktop */
          min-width: 70px !important;
          min-height: 70px !important;
          max-width: 70px !important;
          max-height: 70px !important;
        }
      }

      /* Ensure popups don't overflow on mobile screens */
      @media screen and (max-width: 768px) {
        .chapter4-popup .mapboxgl-popup-content {
          max-width: 95vw;
          max-height: 80vh;
          overflow: auto;
        }
      }

      /* Extra safety for very small screens */
      @media screen and (max-width: 320px) {
        .chapter4-popup .mapboxgl-popup-content {
          max-width: 98vw;
          max-height: 75vh;
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
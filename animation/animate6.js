// animate6.js - Chapter 12 Contested Islands Animation (NO DELAYS, NO ANIMATIONS - DIRECT PLOTTING)

(function(global) {
  // Enhanced Chapter 12 points with red markers, text boxes, and satellite images
  const chapter12Points = [
    {
      coords: [115.5287, 10.4919], // Point 1: Red marker
      textContent: 'Vessel Chinese exercise surveying waters within the Philippines\' Exclusive Economic Zone',
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter12B.png" class="annotation-img point1-img" alt="Chinese vessel satellite image">
        </div>
      `,
      textOffset: [-200, -10], // ADJUST TEXT BOX POSITION: [x, y] - positive y moves down
      popupOffset: [150, -90] // ADJUST SATELLITE IMAGE POSITION: [x, y] - positive y moves down
    },
    {
      coords: [115.0953, 15.2563], // Point 2: Red marker
      textContent: 'QSSY9 was detected light by Theia as well as other Chinese Coast Guard vessels, all travelling in formation east towards the Scarborough Shoal arriving prior to 02:42 on 12 Oct 24.',
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter12A.png" class="annotation-img point2-img" alt="QSSY9 satellite image">
        </div>
      `,
      textOffset: [-200, -10], // ADJUST TEXT BOX POSITION: [x, y]
      popupOffset: [165, 350] // ADJUST SATELLITE IMAGE POSITION: [x, y]
    }
  ];

  // Storage for cleanup
  let chapter12Markers = [];
  let chapter12Popups = [];

  /**
   * Main animation function for Chapter 12 - DIRECT PLOTTING (NO DELAYS/ANIMATIONS)
   */
  function animateChapter12ContestedIslands(map) {
    console.log('Starting Chapter 12 contested islands - direct plotting...');
    
    chapter12Points.forEach((pt, idx) => {
      try {
        // 1. Create red blinking marker - DIRECT PLOTTING
        const markerEl = document.createElement('div');
        markerEl.className = 'chapter12-red-marker';
        markerEl.innerHTML = `
          <div class="red-marker-core"></div>
          <div class="red-marker-ring"></div>
          <div class="red-marker-pulse"></div>
        `;
        
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat(pt.coords)
          .addTo(map);
        
        chapter12Markers.push(marker);
        console.log(`✅ Direct plot: Red marker ${idx + 1} at:`, pt.coords);

        // 2. Create text annotation box - DIRECT PLOTTING
        const textEl = document.createElement('div');
        textEl.className = 'chapter12-text-annotation';
        textEl.innerHTML = `<div class="chapter12-annotation-text">${pt.textContent}</div>`;

        const textMarker = new mapboxgl.Marker(textEl, { 
          offset: pt.textOffset
        })
          .setLngLat(pt.coords)
          .addTo(map);
        
        chapter12Markers.push(textMarker);
        console.log(`✅ Direct plot: Text box ${idx + 1}`);

        // 3. Create satellite image popup - DIRECT PLOTTING
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: pt.popupOffset,
          className: 'chapter12-popup red-glow',
          maxWidth: 'none'
        })
          .setLngLat(pt.coords)
          .setHTML(pt.popupHtml)
          .addTo(map);
        
        chapter12Popups.push(popup);
        console.log(`✅ Direct plot: Satellite popup ${idx + 1}`);

      } catch (error) {
        console.error(`❌ Error in Chapter 12 direct plotting for point ${idx + 1}:`, error);
      }
    });
  }

  /**
   * Cleanup for Chapter 12 - IMMEDIATE REMOVAL
   */
  function clearChapter12(map) {
    console.log('🧹 Clearing Chapter 12 - immediate removal...');

    try {
      // Remove markers immediately
      chapter12Markers.forEach((marker, idx) => {
        try {
          marker.remove();
          console.log(`✅ Removed marker ${idx + 1}`);
        } catch (error) {
          console.error(`❌ Error removing marker ${idx + 1}:`, error);
        }
      });
      chapter12Markers = [];

      // Remove popups immediately
      chapter12Popups.forEach((popup, idx) => {
        try {
          popup.remove();
          console.log(`✅ Removed popup ${idx + 1}`);
        } catch (error) {
          console.error(`❌ Error removing popup ${idx + 1}:`, error);
        }
      });
      chapter12Popups = [];

      console.log('✅ Chapter 12 cleanup complete');
    } catch (error) {
      console.error('❌ Error in Chapter 12 cleanup:', error);
    }
  }

  // Expose functions globally
  global.animateChapter12ContestedIslands = animateChapter12ContestedIslands;
  global.clearChapter12 = clearChapter12;

  // Add enhanced CSS styles with mobile responsiveness - ADJUSTED FOR YOUR CHANGES
  if (!document.getElementById('chapter12-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter12-styles';
    style.textContent = `
      /* ─────────── Red Blinking Markers ─────────── */
      .chapter12-red-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 45px;
        height: 45px;
        pointer-events: none;
        z-index: 1;
      }

      .red-marker-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff0000, #cc0000);
        border-radius: 50%;
        box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 50px rgba(255, 0, 0, 0.4);
        animation: red-marker-blink 2s ease-in-out infinite;
        z-index: 2;
      }

      .red-marker-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        border: 2px solid #ff0000;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: red-marker-ring-expand 3s ease-out infinite;
        z-index: 1;
      }

      .red-marker-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        background: radial-gradient(circle, rgba(255, 0, 0, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: red-marker-pulse 2.5s ease-in-out infinite;
        z-index: 0;
      }

      @keyframes red-marker-blink {
        0%, 100% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          opacity: 0.7;
          transform: translate(-50%, -50%) scale(0.95);
        }
      }

      @keyframes red-marker-ring-expand {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2.5);
          opacity: 0;
        }
      }

      @keyframes red-marker-pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(0.9);
          opacity: 0.4;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0.2;
        }
      }

      /* ─────────── Text Annotation Boxes (SMALLER SIZE) ─────────── */
      .chapter12-text-annotation {
        position: absolute;
        transform: translate(-50%, -50%);
        background: rgba(204, 68, 68, 0.95);
        color: white;
        padding: 8px 12px; /* SMALLER: Reduced from 12px 16px */
        border-radius: 6px;
        font-size: 12px; /* SMALLER: Reduced from 14px */
        font-weight: 300;
        font-family: 'Roboto', 'Arial', sans-serif;
        line-height: 1.3;
        max-width: 220px; /* SMALLER: Reduced from 280px - ADJUST TEXT BOX WIDTH */
        box-shadow: 
          0 4px 20px rgba(204, 68, 68, 0.4),
          0 2px 10px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(180, 50, 50, 0.8);
        pointer-events: none;
        backdrop-filter: blur(2px);
        z-index: 10;
      }

      .chapter12-annotation-text {
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        letter-spacing: 0.3px; /* SMALLER: Reduced from 0.5px */
        word-wrap: break-word;
        white-space: normal;
      }

      /* ─────────── Satellite Image Popups ─────────── */
      .chapter12-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
      }

      .chapter12-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }

      /* Red glow effect for satellite popups */
      .chapter12-popup.red-glow .mapboxgl-popup-content {
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3);
        border: 1px solid rgba(255, 0, 0, 0.5);
      }

      .chapter12-popup.red-glow .mapboxgl-popup-tip {
        border-top-color: rgba(255, 0, 0, 0.2);
      }

      /* DESKTOP: Default satellite image sizes (YOUR UPDATED SIZES) */
      .chapter12-popup .enhanced-popup .annotation-img {
        object-fit: cover !important;
        display: block;
        border-radius: 4px;
      }

      /* POINT 1 IMAGE SIZE - ADJUSTABLE (YOUR NEW SIZE: 250x180) */
      .chapter12-popup .enhanced-popup .annotation-img.point1-img {
        width: 250px !important;    /* <-- POINT 1: CHANGE THIS to adjust width */
        height: 180px !important;   /* <-- POINT 1: CHANGE THIS to adjust height */
      }

      /* POINT 2 IMAGE SIZE - ADJUSTABLE (YOUR NEW SIZE: 250x180) */
      .chapter12-popup .enhanced-popup .annotation-img.point2-img {
        width: 250px !important;    /* <-- POINT 2: CHANGE THIS to adjust width */
        height: 180px !important;   /* <-- POINT 2: CHANGE THIS to adjust height */
      }

      /* ─────────── TABLET OPTIMIZATIONS (1024px) ─────────── */
      @media screen and (max-width: 1024px) {
        .chapter12-red-marker {
          width: 40px;
          height: 40px;
        }

        .red-marker-core {
          width: 18px;
          height: 18px;
        }

        .red-marker-ring {
          width: 35px;
          height: 35px;
        }

        .red-marker-pulse {
          width: 25px;
          height: 25px;
        }

        .chapter12-text-annotation {
          font-size: 11px; /* SMALLER for tablet */
          padding: 7px 10px; /* SMALLER padding */
          max-width: 200px; /* SMALLER: Tablet text box width */
        }

        /* Tablet image sizes - 80% of your new desktop sizes */
        .chapter12-popup .enhanced-popup .annotation-img.point1-img {
          width: 200px !important;    /* 80% of 250px */
          height: 144px !important;   /* 80% of 180px */
        }

        .chapter12-popup .enhanced-popup .annotation-img.point2-img {
          width: 200px !important;    /* 80% of 250px */
          height: 144px !important;   /* 80% of 180px */
        }
      }

      /* ─────────── MOBILE OPTIMIZATIONS (768px) ─────────── */
      @media screen and (max-width: 768px) {
        .chapter12-red-marker {
          width: 35px;
          height: 35px;
        }

        .red-marker-core {
          width: 16px;
          height: 16px;
        }

        .red-marker-ring {
          width: 30px;
          height: 30px;
        }

        .red-marker-pulse {
          width: 22px;
          height: 22px;
        }

        .chapter12-text-annotation {
          font-size: 10px; /* SMALLER for mobile */
          padding: 6px 8px; /* SMALLER padding */
          max-width: 180px; /* SMALLER: Mobile text box width */
        }

        /* Mobile image sizes - 60% of your new desktop sizes */
        .chapter12-popup .enhanced-popup .annotation-img.point1-img {
          width: 150px !important;    /* 60% of 250px */
          height: 108px !important;   /* 60% of 180px */
        }

        .chapter12-popup .enhanced-popup .annotation-img.point2-img {
          width: 150px !important;    /* 60% of 250px */
          height: 108px !important;   /* 60% of 180px */
        }
      }

      /* ─────────── SMALL MOBILE OPTIMIZATIONS (480px) ─────────── */
      @media screen and (max-width: 480px) {
        .chapter12-red-marker {
          width: 30px;
          height: 30px;
        }

        .red-marker-core {
          width: 14px;
          height: 14px;
        }

        .red-marker-ring {
          width: 25px;
          height: 25px;
        }

        .red-marker-pulse {
          width: 18px;
          height: 18px;
        }

        .chapter12-text-annotation {
          font-size: 9px; /* SMALLER for small mobile */
          padding: 5px 7px; /* SMALLER padding */
          max-width: 150px; /* SMALLER: Small mobile text box width */
        }

        /* Small mobile image sizes - 45% of your new desktop sizes */
        .chapter12-popup .enhanced-popup .annotation-img.point1-img {
          width: 113px !important;    /* 45% of 250px */
          height: 81px !important;    /* 45% of 180px */
        }

        .chapter12-popup .enhanced-popup .annotation-img.point2-img {
          width: 113px !important;    /* 45% of 250px */
          height: 81px !important;    /* 45% of 180px */
        }
      }

      /* ─────────── EXTRA SMALL MOBILE (320px) ─────────── */
      @media screen and (max-width: 320px) {
        .chapter12-red-marker {
          width: 25px;
          height: 25px;
        }

        .red-marker-core {
          width: 12px;
          height: 12px;
        }

        .red-marker-ring {
          width: 22px;
          height: 22px;
        }

        .red-marker-pulse {
          width: 16px;
          height: 16px;
        }

        .chapter12-text-annotation {
          font-size: 8px; /* SMALLER for extra small mobile */
          padding: 4px 6px; /* SMALLER padding */
          max-width: 120px; /* SMALLER: Extra small text box width */
        }

        /* Extra small image sizes - 35% of your new desktop sizes */
        .chapter12-popup .enhanced-popup .annotation-img.point1-img {
          width: 88px !important;     /* 35% of 250px */
          height: 63px !important;    /* 35% of 180px */
        }

        .chapter12-popup .enhanced-popup .annotation-img.point2-img {
          width: 88px !important;     /* 35% of 250px */
          height: 63px !important;    /* 35% of 180px */
        }
      }

      /* ─────────── Viewport Safety for Mobile ─────────── */
      @media screen and (max-width: 768px) {
        .chapter12-popup .mapboxgl-popup-content {
          max-width: 95vw;
          max-height: 80vh;
          overflow: auto;
        }
      }

      /* Extra safety for very small screens */
      @media screen and (max-width: 320px) {
        .chapter12-popup .mapboxgl-popup-content {
          max-width: 98vw;
          max-height: 75vh;
        }
      }
    `;
    document.head.appendChild(style);
    console.log('✅ Chapter 12 styles injected');
  }

})(window);
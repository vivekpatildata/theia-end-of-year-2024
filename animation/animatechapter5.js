// animatechapter5.js - Chapter 5 Enhanced Markers and Annotations

(function(global) {
  // ── Configuration Points ─────────────────────────────────────────────────────
  const chapter5Points = [
    {
      coords: [31.3342, -33.0657], // Red marker 1
      type: 'red-marker',
      text: 'Vessel Position 1'
    },
    {
      coords: [0.4646, 50.4052], // Red marker 2
      type: 'red-marker',
      text: 'Vessel Position 2'
    },
    {
      coords: [30.4056, 	-11.0713], // Satellite image with red glow
      type: 'satellite-popup',
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter5A.png" class="annotation-img" alt="Satellite Detection">
        </div>
      `,
      popupOffset: [0, 50],
      hasGlow: true
    },
    {
      coords: [53.8779, -25.1195], // Red text box - vessel to China
      type: 'text-annotation',
      text: 'ATILA was further on its way to China',
      textOffset: [130, -30]
    },
    {
      coords: [-11.0573, 59.9656], // Satellite image popup
      type: 'satellite-popup',
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter5B.png" class="annotation-img" alt="Satellite Detection">
        </div>
      `,
      popupOffset: [-70, 70],
      hasGlow: true
    },
    {
      coords: [42.9621, 61.5122], // Red text box - vessel to Murmansk
      type: 'text-annotation',
      text: 'SAKARYA was on its way to Murmansk',
      textOffset: [0, -40]
    }
  ];

  // ── Internal storage ─────────────────────────────────────────────────────────
  let chapter5Markers = [];
  let chapter5Popups = [];
  let stylesInjected = false;

  // ── Main Animation Function ─────────────────────────────────────────────────
  function animateChapter5(map) {
    console.log('Starting Chapter 5 enhanced animation...');
    
    // Inject CSS only once
    if (!stylesInjected) {
      injectChapter5Styles();
      stylesInjected = true;
    }

    // Create all elements
    chapter5Points.forEach((pt) => {
      if (pt.type === 'red-marker') {
        createRedMarker(map, pt);
      } else if (pt.type === 'satellite-popup') {
        createSatellitePopup(map, pt);
      } else if (pt.type === 'text-annotation') {
        createTextAnnotation(map, pt);
      }
    });
  }

  // ── Create Red Marker (Non-blinking) ────────────────────────────────────────
  function createRedMarker(map, pt) {
    const el = document.createElement('div');
    el.className = 'chapter5-red-marker';
    el.innerHTML = `
      <div class="red-marker-core"></div>
      <div class="red-marker-ring"></div>
      <div class="red-marker-glow"></div>
    `;
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat(pt.coords)
      .addTo(map);
    
    chapter5Markers.push(marker);

    // Entry animation
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%, -50%) scale(0)';
    requestAnimationFrame(() => {
      el.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      el.style.opacity = '1';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }

  // ── Create Satellite Popup with Red Glow ───────────────────────────────────
  function createSatellitePopup(map, pt) {
    const popupClassName = pt.hasGlow ? 'chapter5-popup glow-effect' : 'chapter5-popup';
    
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
    
    chapter5Popups.push(popup);
  }

  // ── Create Text Annotation Box ──────────────────────────────────────────────
  function createTextAnnotation(map, pt) {
    const el = document.createElement('div');
    el.className = 'chapter5-text-annotation';
    el.innerHTML = `<div class="chapter5-annotation-text">${pt.text}</div>`;
    
    // Initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';

    const marker = new mapboxgl.Marker(el, { 
      offset: pt.textOffset
    })
      .setLngLat(pt.coords)
      .addTo(map);
    
    chapter5Markers.push(marker);

    // Animate in
    requestAnimationFrame(() => {
      el.style.transition = 'all 0.6s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  // ── Clear All Chapter 5 Elements ────────────────────────────────────────────
  function clearChapter5(map) {
    console.log('Clearing Chapter 5 animations...');
    
    // Fade out and remove markers
    chapter5Markers.forEach(marker => {
      const el = marker.getElement();
      el.style.transition = 'all 0.4s ease-in';
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(0)';
      
      setTimeout(() => marker.remove(), 400);
    });
    chapter5Markers = [];

    // Remove popups
    chapter5Popups.forEach(popup => {
      const popupEl = popup.getElement();
      if (popupEl) {
        popupEl.style.transition = 'all 0.3s ease-in';
        popupEl.style.opacity = '0';
        popupEl.style.transform = 'scale(0.8)';
        
        setTimeout(() => popup.remove(), 300);
      } else {
        popup.remove();
      }
    });
    chapter5Popups = [];
  }

  // ── Inject Enhanced CSS Styles ──────────────────────────────────────────────
  function injectChapter5Styles() {
    if (document.getElementById('chapter5-styles')) return;

    const style = document.createElement('style');
    style.id = 'chapter5-styles';
    style.textContent = `
      /* ─────────── Red Marker (Non-blinking) ─────────── */
      .chapter5-red-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        pointer-events: none;
      }

      .red-marker-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 18px;
        height: 18px;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff4444, #cc0000);
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(255, 68, 68, 0.8), 0 0 40px rgba(255, 68, 68, 0.4);
        border: none;
      }

      .red-marker-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 35px;
        height: 35px;
        border: 2px solid #ff4444;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: red-marker-ring 3s ease-out infinite;
      }

      .red-marker-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 25px;
        height: 25px;
        background: radial-gradient(circle, rgba(255, 68, 68, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: red-marker-glow 2.5s ease-in-out infinite;
      }

      @keyframes red-marker-ring {
        0% {
          transform: translate(-50%, -50%) scale(0.7);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.8);
          opacity: 0;
        }
      }

      @keyframes red-marker-glow {
        0%, 100% {
          transform: translate(-50%, -50%) scale(0.9);
          opacity: 0.4;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0.2;
        }
      }

      /* ─────────── Satellite Popup Styles ─────────── */
      .chapter5-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
      }

      .chapter5-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }

      /* Red glow effect for satellite popups */
      .chapter5-popup.glow-effect .mapboxgl-popup-content {
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3);
        border: 1px solid rgba(255, 0, 0, 0.5);
      }

      .chapter5-popup.glow-effect .mapboxgl-popup-tip {
        border-top-color: rgba(255, 0, 0, 0.2);
      }

      /* DESKTOP: Satellite image sizes - FINAL SIZES */
      .chapter5-popup .enhanced-popup .annotation-img {
        width: 160px !important;    /* Desktop final size */
        height: 160px !important;   /* Desktop final size */
        object-fit: fill !important;
        border-radius: 4px;
        display: block;
      }

      /* ─────────── Text Annotation Boxes (Venezuela Style) ─────────── */
      .chapter5-text-annotation {
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

      .chapter5-annotation-text {
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        letter-spacing: 0.5px;
      }

      /* ─────────── TABLET OPTIMIZATIONS (1024px) ─────────── */
      @media screen and (max-width: 1024px) {
        .chapter5-popup .enhanced-popup .annotation-img {
          width: 140px !important;    /* 87.5% of desktop 160px */
          height: 140px !important;   /* 87.5% of desktop 160px */
        }

        .chapter5-text-annotation {
          font-size: 13px;
          padding: 11px 15px;
        }
      }

      /* ─────────── MOBILE OPTIMIZATIONS (768px) ─────────── */
      @media screen and (max-width: 768px) {
        .chapter5-red-marker {
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

        .red-marker-glow {
          width: 20px;
          height: 20px;
        }

        .chapter5-popup .enhanced-popup .annotation-img {
          width: 120px !important;    /* 75% of desktop 160px */
          height: 120px !important;   /* 75% of desktop 160px */
        }

        .chapter5-text-annotation {
          font-size: 12px;
          padding: 10px 13px;
        }
      }

      /* ─────────── SMALL MOBILE OPTIMIZATIONS (480px) ─────────── */
      @media screen and (max-width: 480px) {
        .chapter5-red-marker {
          width: 32px;
          height: 32px;
        }

        .red-marker-core {
          width: 14px;
          height: 14px;
        }

        .red-marker-ring {
          width: 28px;
          height: 28px;
        }

        .red-marker-glow {
          width: 18px;
          height: 18px;
        }

        .chapter5-popup .enhanced-popup .annotation-img {
          width: 96px !important;     /* 60% of desktop 160px */
          height: 96px !important;    /* 60% of desktop 160px */
        }

        .chapter5-text-annotation {
          font-size: 11px;
          padding: 8px 11px;
        }
      }

      /* ─────────── EXTRA SMALL MOBILE (320px) ─────────── */
      @media screen and (max-width: 320px) {
        .chapter5-red-marker {
          width: 28px;
          height: 28px;
        }

        .red-marker-core {
          width: 12px;
          height: 12px;
        }

        .red-marker-ring {
          width: 24px;
          height: 24px;
        }

        .red-marker-glow {
          width: 16px;
          height: 16px;
        }

        .chapter5-popup .enhanced-popup .annotation-img {
          width: 80px !important;     /* 50% of desktop 160px */
          height: 80px !important;    /* 50% of desktop 160px */
        }

        .chapter5-text-annotation {
          font-size: 10px;
          padding: 6px 9px;
        }
      }

      /* ─────────── Popup Overflow Protection ─────────── */
      @media screen and (max-width: 768px) {
        .chapter5-popup .mapboxgl-popup-content {
          max-width: 95vw;
          max-height: 80vh;
          overflow: auto;
        }
      }

      /* Extra safety for very small screens */
      @media screen and (max-width: 320px) {
        .chapter5-popup .mapboxgl-popup-content {
          max-width: 98vw;
          max-height: 75vh;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Expose to global ─────────────────────────────────────────────────────────
  global.animateChapter5 = animateChapter5;
  global.clearChapter5 = clearChapter5;

})(window);
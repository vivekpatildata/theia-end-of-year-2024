// animatechapter3.js - Chapter 3 Animation (Submarine Path with Blinking Markers) - SMALLER CONTAINERS

(function(global) {
  // Enhanced data for Chapter 3 with satellite imagery
  const chapter3Points = [
    {
      coords: [11.1118, 55.1107],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter3ANEW.png" class="annotation-img img-wide" alt="Submarine detection point">
        </div>
      `,
      offset: [100, 130],
      delay: 0,
      pulseColor: '#39ff14',
      hasGlow: false
    },
    {
      coords: [1.3960, 51.0416],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter3BNEW.png" class="annotation-img img-wide2" alt="Submarine detection point">
        </div>
      `,
      offset: [-170, -30],
      delay: 0,
      pulseColor: '#39ff14',
      hasGlow: true // This one gets the green glow
    },
    {
      coords: [8.7887, 38.0477],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter3C.png" class="annotation-img" alt="Submarine detection point">
        </div>
      `,
      offset: [10, -20],
      delay: 0,
      pulseColor: '#39ff14',
      hasGlow: true
    },
    {
      coords: [21.9554, 34.4292],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter3E.png" class="annotation-img" alt="Submarine detection point">
        </div>
      `,
      offset: [10, -20],
      delay: 0,
      pulseColor: '#39ff14',
      hasGlow: true
    },
    {
      coords: [34.1678, 34.6261],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter3D.png" class="annotation-img" alt="Submarine detection point">
        </div>
      `,
      offset: [100, -30],
      delay: 0,
      pulseColor: '#39ff14',
      hasGlow: true // Final one also gets glow
    }
  ];

  // Storage for cleanup
  let chapter3Markers = [];
  let chapter3Popups = [];

  /**
   * Enhanced marker animation for Chapter 3
   */
  function animateChapter3Markers(map) {
    console.log('Starting Chapter 3 marker animation...');
    
    chapter3Points.forEach((pt, idx) => {
      // Create enhanced blinking marker with submarine theme - NO DELAY
      const el = document.createElement('div');
      el.className = 'enhanced-green-ping';
      el.innerHTML = `
        <div class="ping-core submarine-core"></div>
        <div class="ping-ring submarine-ring"></div>
        <div class="ping-ring-2 submarine-ring"></div>
        <div class="sonar-sweep"></div>
      `;
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(pt.coords)
        .addTo(map);
      
      chapter3Markers.push(marker);

      // Add entry animation with submarine-like emergence
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(0) rotateY(180deg)';
      requestAnimationFrame(() => {
        el.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        el.style.opacity = '1';
        el.style.transform = 'translate(-50%, -50%) scale(1) rotateY(0deg)';
      });

      // Show popup immediately after marker - NO DELAY
      setTimeout(() => {
        const popupClassName = pt.hasGlow ? 'chapter3-popup glow-effect' : 'chapter3-popup';
        
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
        
        chapter3Popups.push(popup);

        // Add scanning effect for enhanced markers
        if (pt.hasGlow) {
          addScanningEffect(el);
        }
      }, 100); // Minimal delay just for animation smoothness
    });
  }

  /**
   * Add scanning effect to special markers
   */
  function addScanningEffect(markerElement) {
    const scanLine = document.createElement('div');
    scanLine.className = 'submarine-scan-line';
    markerElement.appendChild(scanLine);
    
    // Animate scanning line
    let scanPosition = 0;
    const scanInterval = setInterval(() => {
      scanPosition = (scanPosition + 1) % 360;
      scanLine.style.transform = `translate(-50%, -50%) rotate(${scanPosition}deg)`;
    }, 50);
    
    // Store interval for cleanup
    markerElement._scanInterval = scanInterval;
  }

  /**
   * Enhanced cleanup with submarine-themed fade-out
   */
  function clearChapter3(map) {
    console.log('Clearing Chapter 3 animations...');
    
    // Fade out and remove markers with submarine dive effect
    chapter3Markers.forEach(marker => {
      const el = marker.getElement();
      
      // Clear any scanning intervals
      if (el._scanInterval) {
        clearInterval(el._scanInterval);
      }
      
      el.style.transition = 'all 0.6s ease-in';
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(0) rotateY(-180deg)';
      
      setTimeout(() => marker.remove(), 600);
    });
    chapter3Markers = [];

    // Remove popups with fade effect
    chapter3Popups.forEach(popup => {
      const popupEl = popup.getElement();
      if (popupEl) {
        popupEl.style.transition = 'all 0.4s ease-in';
        popupEl.style.opacity = '0';
        popupEl.style.transform = 'scale(0.8)';
        
        setTimeout(() => popup.remove(), 400);
      } else {
        popup.remove();
      }
    });
    chapter3Popups = [];
  }

  // Expose functions globally
  global.animateChapter3Markers = animateChapter3Markers;
  global.clearChapter3 = clearChapter3;

  // Add CSS for Chapter 3 submarine-themed animations - SMALLER CONTAINERS
  if (!document.getElementById('chapter3-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter3-styles';
    style.textContent = `
      /* Enhanced green ping markers with submarine theme - KEEPING ALL ANIMATIONS */
      .enhanced-green-ping {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 45px;
        height: 45px;
        pointer-events: none;
      }
      
      .submarine-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 14px;
        height: 14px;
        transform: translate(-50%, -50%);
        background: #39ff14;
        border-radius: 50%;
        box-shadow: 0 0 25px #39ff14, 0 0 50px #39ff14;
        animation: submarine-glow 2s ease-in-out infinite;
      }
      
      .submarine-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border: 2px solid #39ff14;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: submarine-expand 2.5s ease-out infinite;
      }
      
      .ping-ring-2.submarine-ring {
        animation-delay: 0.8s;
      }
      
      @keyframes submarine-glow {
        0%, 100% {
          box-shadow: 0 0 25px #39ff14, 0 0 50px #39ff14;
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          box-shadow: 0 0 35px #39ff14, 0 0 70px #39ff14;
          transform: translate(-50%, -50%) scale(1.1);
        }
      }
      
      @keyframes submarine-expand {
        0% {
          transform: translate(-50%, -50%) scale(0.6);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2.2);
          opacity: 0;
        }
      }
      
      @keyframes sonar-sweep {
        0% {
          transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.5) rotate(360deg);
          opacity: 0;
        }
      }
      
      /* SIMPLIFIED POPUPS */
      .chapter3-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 4px;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
      }

      .chapter3-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }

      /* Special markers with green glow effect */
      .chapter3-popup.glow-effect .mapboxgl-popup-content {
        box-shadow: 0 0 40px rgba(57, 255, 20, 0.6), 0 0 80px rgba(57, 255, 20, 0.3);
        border: 1px solid rgba(57, 255, 20, 0.5);
      }

      .chapter3-popup.glow-effect .mapboxgl-popup-tip {
        border-top-color: rgba(57, 255, 20, 0.2);
      }

      /* CONTAINER SIZE CONTROLS - IMAGES SCALE WITH CONTAINER */
      .chapter3-popup .enhanced-popup {
        display: block;
        overflow: hidden;
      }

      /* DEFAULT CONTAINER SIZE - DESKTOP (for regular images C, D, E) */
      .chapter3-popup .enhanced-popup .annotation-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block;
        border-radius: 4px;
      }

      /* SPECIAL HANDLING for images A & B - use contain to show full image without cropping */
      .chapter3-popup .enhanced-popup .annotation-img.img-wide,
      .chapter3-popup .enhanced-popup .annotation-img.img-wide2 {
        object-fit: contain !important;  /* Shows full image without cropping */
        background: black;  /* Optional: add background color for letterboxing */
      }

      /* Regular container size for images C, D, E (unchanged) */
      .chapter3-popup .enhanced-popup {
        width: 170px;    /* Container width for regular images */
        height: 150px;   /* Container height for regular images */
      }

      /* DESKTOP SIZES FOR IMAGES A & B - FINAL SIZES FROM YOUR FILE */

      /* Image A (img-wide) - YOUR FINAL DESKTOP SIZE */
      .chapter3-popup .enhanced-popup:has(.img-wide) {
        width: 297px !important;    /* Your final desktop size */
        height: 99px !important;    /* Your final desktop size */
      }

      /* Image B (img-wide2) - YOUR FINAL DESKTOP SIZE */
      .chapter3-popup .enhanced-popup:has(.img-wide2) {
        width: 290px !important;    /* Your final desktop size */
        height: 115px !important;   /* Your final desktop size */
      }

      /* TABLET OPTIMIZATIONS (1024px) - 80% of YOUR final desktop sizes */
      @media screen and (max-width: 1024px) {
        .enhanced-green-ping {
          width: 40px;
          height: 40px;
        }

        .submarine-core {
          width: 13px;
          height: 13px;
        }

        /* Regular containers (C, D, E) - 80% of desktop */
        .chapter3-popup .enhanced-popup {
          width: 136px !important;    /* 80% of 170px */
          height: 120px !important;   /* 80% of 150px */
        }

        /* Image A container - 80% of YOUR final desktop size */
        .chapter3-popup .enhanced-popup:has(.img-wide) {
          width: 238px !important;    /* 80% of 297px */
          height: 79px !important;    /* 80% of 99px */
        }

        /* Image B container - 80% of YOUR final desktop size */
        .chapter3-popup .enhanced-popup:has(.img-wide2) {
          width: 232px !important;    /* 80% of 290px */
          height: 92px !important;    /* 80% of 115px */
        }
      }

      /* MOBILE OPTIMIZATIONS (768px) - 65% of YOUR final desktop sizes */
      @media screen and (max-width: 768px) {
        .enhanced-green-ping {
          width: 35px;
          height: 35px;
        }

        .submarine-core {
          width: 12px;
          height: 12px;
        }

        /* Regular containers (C, D, E) - 65% of desktop */
        .chapter3-popup .enhanced-popup {
          width: 111px !important;    /* 65% of 170px */
          height: 98px !important;    /* 65% of 150px */
        }

        /* Image A container - 65% of YOUR final desktop size */
        .chapter3-popup .enhanced-popup:has(.img-wide) {
          width: 193px !important;    /* 65% of 297px */
          height: 64px !important;    /* 65% of 99px */
        }

        /* Image B container - 65% of YOUR final desktop size */
        .chapter3-popup .enhanced-popup:has(.img-wide2) {
          width: 189px !important;    /* 65% of 290px */
          height: 75px !important;    /* 65% of 115px */
        }
      }

      /* SMALL MOBILE OPTIMIZATIONS (480px) - 50% of YOUR final desktop sizes */
      @media screen and (max-width: 480px) {
        .enhanced-green-ping {
          width: 30px;
          height: 30px;
        }

        .submarine-core {
          width: 10px;
          height: 10px;
        }

        /* Regular containers (C, D, E) - 50% of desktop */
        .chapter3-popup .enhanced-popup {
          width: 85px !important;     /* 50% of 170px */
          height: 75px !important;    /* 50% of 150px */
        }

        /* Image A container - 50% of YOUR final desktop size */
        .chapter3-popup .enhanced-popup:has(.img-wide) {
          width: 149px !important;    /* 50% of 297px */
          height: 50px !important;    /* 50% of 99px */
        }

        /* Image B container - 50% of YOUR final desktop size */
        .chapter3-popup .enhanced-popup:has(.img-wide2) {
          width: 145px !important;    /* 50% of 290px */
          height: 58px !important;    /* 50% of 115px */
        }
      }

      /* EXTRA SMALL MOBILE (320px) - 40% of YOUR final desktop sizes */
      @media screen and (max-width: 320px) {
        .enhanced-green-ping {
          width: 25px;
          height: 25px;
        }

        .submarine-core {
          width: 8px;
          height: 8px;
        }

        /* Regular containers (C, D, E) - 40% of desktop */
        .chapter3-popup .enhanced-popup {
          width: 68px !important;     /* 40% of 170px */
          height: 60px !important;    /* 40% of 150px */
        }

        /* Image A container - 40% of YOUR final desktop size */
        .chapter3-popup .enhanced-popup:has(.img-wide) {
          width: 119px !important;    /* 40% of 297px */
          height: 40px !important;    /* 40% of 99px */
        }

        /* Image B container - 40% of YOUR final desktop size */
        .chapter3-popup .enhanced-popup:has(.img-wide2) {
          width: 116px !important;    /* 40% of 290px */
          height: 46px !important;    /* 40% of 115px */
        }
      }

      /* Viewport safety for all mobile screens */
      @media screen and (max-width: 768px) {
        .chapter3-popup .mapboxgl-popup-content {
          max-width: 95vw;
          max-height: 80vh;
        }
      }

      /* Extra safety for very small screens */
      @media screen and (max-width: 320px) {
        .chapter3-popup .mapboxgl-popup-content {
          max-width: 98vw;
          max-height: 75vh;
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
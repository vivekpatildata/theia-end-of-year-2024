// animatechapter3.js - Chapter 3 Animation (Submarine Path with Blinking Markers)

(function(global) {
  // Enhanced data for Chapter 3 with satellite imagery
  const chapter3Points = [
    {
      coords: [11.1118, 55.1107],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="pointb.png" class="annotation-img" alt="Submarine detection point">
        </div>
      `,
      offset: [120, 70],
      delay: 0,
      pulseColor: '#39ff14',
      hasGlow: false
    },
    {
      coords: [1.3960, 51.0416],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="pointd.png" class="annotation-img" alt="Submarine detection point">
        </div>
      `,
      offset: [-90, -30],
      delay: 0,
      pulseColor: '#39ff14',
      hasGlow: true // This one gets the green glow
    },
    {
      coords: [8.7887, 38.0477],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="pointh.png" class="annotation-img" alt="Submarine detection point">
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
          <img src="pointi.png" class="annotation-img" alt="Submarine detection point">
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
          <img src="pointj.png" class="annotation-img" alt="Submarine detection point">
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

  // Add CSS for Chapter 3 submarine-themed animations
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
      
      .sonar-sweep {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60px;
        height: 60px;
        border: 1px solid rgba(57, 255, 20, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: sonar-sweep 3s linear infinite;
      }
      
      .submarine-scan-line {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2px;
        height: 30px;
        background: linear-gradient(to top, #39ff14, transparent);
        transform-origin: bottom center;
        opacity: 0.7;
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
        border-radius: 1;
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

      /* ADJUST SATELLITE IMAGE SIZE HERE - DESKTOP */
      .chapter3-popup .enhanced-popup .annotation-img {
        width: 203px !important;    /* <-- CHANGE THIS to increase/decrease image width */
        height: 170px !important;   /* <-- CHANGE THIS to increase/decrease image height */
        object-fit: fill;
        display: block;
      }

      /* Mobile optimizations */
      @media screen and (max-width: 768px) {
        /* MOBILE: ADJUST SATELLITE IMAGE SIZE HERE */
        .chapter3-popup .enhanced-popup .annotation-img {
          width: 80px !important;    /* <-- CHANGE THIS for mobile image width */
          height: 80px !important;   /* <-- CHANGE THIS for mobile image height */
        }

        .enhanced-green-ping {
          width: 35px;
          height: 35px;
        }

        .submarine-core {
          width: 12px;
          height: 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
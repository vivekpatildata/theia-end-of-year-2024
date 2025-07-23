// animatechapter1.js - Chapter 1 Animation (Gulfstream Crash)

(function(global) {
    // Crash location and related coordinates
    const crashCoord = [-60.780901682834156,	11.1326348402241 ];
    const oilSpillLabelCoord = [-60.7210, 11.1068];
    
    // Satellite popup configuration
    const satellitePopupConfig = {
      coords: [-60.780901682834156,	11.1326348402241], // Same as crash, but can be adjusted
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter1A.png" class="annotation-img" alt="Gulfstream crash satellite imagery">
        </div>
      `,
      offset: [0, -100] // ADJUST POPUP POSITION HERE: [x, y] - negative y moves up
    };
  
    // Storage for cleanup
    let crashMarker = null;
    let crashPopup = null;
    let textAnnotation = null;
    let oilSpillLabel = null;
  
    /**
     * Animate Chapter 1 - Gulfstream crash sequence
     */
    function animateChapter1Crash(map) {
      console.log('Starting Chapter 1 Gulfstream crash animation...');
      
      // Create all elements immediately - NO DELAYS
      createCrashMarker(map);
      addCrashTextAnnotation(map);
      addSatellitePopup(map);
      addOilSpillLabel(map);
    }
  
    /**
     * Create red blinking crash marker
     */
    function createCrashMarker(map) {
      const el = document.createElement('div');
      el.className = 'enhanced-red-ping crash-marker';
      el.innerHTML = `
        <div class="ping-core crash-core"></div>
        <div class="ping-ring crash-ring"></div>
        <div class="ping-ring-2 crash-ring"></div>
        <div class="crash-explosion"></div>
      `;
      
      crashMarker = new mapboxgl.Marker(el)
        .setLngLat(crashCoord)
        .addTo(map);
  
      // Entry animation with dramatic crash effect
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(0) rotate(45deg)';
      requestAnimationFrame(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.opacity = '1';
        el.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
      });
    }
  
    /**
     * Add crash text annotation above marker
     */
    function addCrashTextAnnotation(map) {
      const el = document.createElement('div');
      el.className = 'annotation-text crash-annotation';
      el.innerHTML = `
        <div class="crash-text">GULFSTREAM Wreck Location</div>
      `;
      
      // Initial state
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
  
      textAnnotation = new mapboxgl.Marker(el, { 
        offset: [0, -50] // ADJUST TEXT POSITION HERE: [x, y] - negative y moves up
      })
        .setLngLat(crashCoord)
        .addTo(map);
  
      // Animate in
      requestAnimationFrame(() => {
        el.style.transition = 'all 0.5s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  
    /**
     * Add satellite popup
     */
    function addSatellitePopup(map) {
      crashPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: satellitePopupConfig.offset,
        className: 'chapter1-popup glow-effect', // Added glow-effect class
        maxWidth: 'none'
      })
        .setLngLat(satellitePopupConfig.coords)
        .setHTML(satellitePopupConfig.popupHtml)
        .addTo(map);
    }
  
    /**
     * Add oil spill region label (simple text overlay)
     */
    function addOilSpillLabel(map) {
      const el = document.createElement('div');
      el.className = 'oil-spill-label';
      el.textContent = 'Estimated Oil Spill Affected Region';
      
      // Initial state
      el.style.opacity = '0';
      el.style.transform = 'scale(0.8)';
  
      oilSpillLabel = new mapboxgl.Marker(el, { 
        offset: [0, 0] // ADJUST LABEL POSITION HERE: [x, y]
      })
        .setLngLat(oilSpillLabelCoord)
        .addTo(map);
  
      // Animate in
      requestAnimationFrame(() => {
        el.style.transition = 'all 0.4s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
    }
  
    /**
     * Clear Chapter 1 animations
     */
    function clearChapter1(map) {
      console.log('Clearing Chapter 1 animations...');
      
      // Fade out crash marker
      if (crashMarker) {
        const el = crashMarker.getElement();
        el.style.transition = 'all 0.4s ease-in';
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%, -50%) scale(0) rotate(-45deg)';
        
        setTimeout(() => {
          crashMarker.remove();
          crashMarker = null;
        }, 400);
      }
  
      // Fade out text annotation
      if (textAnnotation) {
        const el = textAnnotation.getElement();
        el.style.transition = 'all 0.3s ease-in';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          textAnnotation.remove();
          textAnnotation = null;
        }, 300);
      }
  
      // Remove satellite popup
      if (crashPopup) {
        const popupEl = crashPopup.getElement();
        if (popupEl) {
          popupEl.style.transition = 'all 0.3s ease-in';
          popupEl.style.opacity = '0';
          popupEl.style.transform = 'scale(0.8)';
          
          setTimeout(() => {
            crashPopup.remove();
            crashPopup = null;
          }, 300);
        } else {
          crashPopup.remove();
          crashPopup = null;
        }
      }
  
      // Fade out oil spill label
      if (oilSpillLabel) {
        const el = oilSpillLabel.getElement();
        el.style.transition = 'all 0.3s ease-in';
        el.style.opacity = '0';
        el.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          oilSpillLabel.remove();
          oilSpillLabel = null;
        }, 300);
      }
    }
  
    // Expose functions globally
    global.animateChapter1Crash = animateChapter1Crash;
    global.clearChapter1 = clearChapter1;
  
    // Add CSS for Chapter 1 crash-themed animations
    if (!document.getElementById('chapter1-styles')) {
      const style = document.createElement('style');
      style.id = 'chapter1-styles';
      style.textContent = `
        /* Enhanced red ping markers with crash theme - KEEPING ALL ANIMATIONS */
        .enhanced-red-ping.crash-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          pointer-events: none;
        }
        
        .crash-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          transform: translate(-50%, -50%);
          background: #ff0000;
          border-radius: 50%;
          box-shadow: 0 0 30px #ff0000, 0 0 60px #ff0000;
          animation: crash-glow 1.5s ease-in-out infinite;
        }
        
        .crash-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 2px solid #ff0000;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: crash-expand 2s ease-out infinite;
        }
        
        .ping-ring-2.crash-ring {
          animation-delay: 0.5s;
        }
        
        .crash-explosion {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 80px;
          border: 1px solid rgba(255, 0, 0, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: crash-explosion 3s linear infinite;
        }
        
        @keyframes crash-glow {
          0%, 100% {
            box-shadow: 0 0 30px #ff0000, 0 0 60px #ff0000;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            box-shadow: 0 0 40px #ff0000, 0 0 80px #ff0000;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        
        @keyframes crash-expand {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }
        
        @keyframes crash-explosion {
          0% {
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8) rotate(360deg);
            opacity: 0;
          }
        }
        
        /* SIMPLIFIED POPUP */
        .chapter1-popup .mapboxgl-popup-content {
          padding: 0;
          border-radius: 2;
          overflow: hidden;
          background: white;
          border: 1px solid #ccc;
        }
  
        .chapter1-popup .mapboxgl-popup-tip {
          border-top-color: black;
        }
  
        /* Red glow effect for satellite popup */
        .chapter1-popup.glow-effect .mapboxgl-popup-content {
          box-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3);
          border: 1px solid rgba(255, 0, 0, 0.5);
        }
  
        .chapter1-popup.glow-effect .mapboxgl-popup-tip {
          border-top-color: rgba(255, 0, 0, 0.2);
        }
  
        /* ADJUST SATELLITE IMAGE SIZE HERE - DESKTOP */
        .chapter1-popup .enhanced-popup .annotation-img {
          width: 184px !important;    /* <-- CHANGE THIS to increase/decrease image width */
          height: 170px !important;   /* <-- CHANGE THIS to increase/decrease image height */
          object-fit: fill;
          display: block;
        }
  
        /* Crash text annotation box */
        .crash-annotation {
          background: rgba(255, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          white-space: nowrap;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
  
        .crash-text {
          font-weight: 500;
        }
  
        /* Oil spill region label - simple black text */
        /* Oil spill region label - plain black text no background */
        .oil-spill-label {
          color: white;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }
  
        /* Mobile optimizations */
        @media screen and (max-width: 768px) {
          /* MOBILE: ADJUST SATELLITE IMAGE SIZE HERE */
          .chapter1-popup .enhanced-popup .annotation-img {
            width: 120px !important;    /* <-- CHANGE THIS for mobile image width */
            height: 120px !important;   /* <-- CHANGE THIS for mobile image height */
          }
  
          .crash-annotation {
            font-size: 12px;
            padding: 6px 10px;
          }
  
          .oil-spill-label {
            font-size: 12px;
          }
  
          .enhanced-red-ping.crash-marker {
            width: 40px;
            height: 40px;
          }
  
          .crash-core {
            width: 14px;
            height: 14px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  
  })(window);
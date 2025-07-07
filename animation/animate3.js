// animate3.js - MSC Aries Animation (Mobile-Friendly with Enhanced Text Box)

(function(global) {
  // Data for Chapter 9 with adjusted offsets
  const chapter9Points = [
    {
      coords: [54.64783492662988, 24.81671945499157],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter9A.png" class="annotation-img" alt="MSC Aries Sat 1">
        </div>
      `,
      offset: [140, 100], // Standard offset
      isDetained: false
    },
    {
      coords: [56.296427695851236, 26.948014954863964],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter9B.png" class="annotation-img" alt="MSC Aries Sat 2">
        </div>
      `,
      offset: [100, 10], // Offset to the right to avoid overlap
      isDetained: false
    },
    {
      coords: [55.9852, 26.9852],
      popupHtml: `
        <div class="enhanced-popup">
          <img src="sat-images/chapter9C.png" class="annotation-img" alt="MSC Aries Sat 3">
        </div>
      `,
      offset: [-100, 10], // Offset to the left
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
          <div class="detention-text">Vessel has remained in this location since</div>
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

  // Add mobile-friendly styles with enhanced text box
  if (!document.getElementById('chapter9-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter9-styles';
    style.textContent = `
      // /* Standard vessel marker (green) */
      // .vessel-marker {
      //   /* DESKTOP: Green marker size */
      //   width: 30px;      
      //   height: 30px;     
      //   border-radius: 4px;
      //   background: #00ff88;
      //   box-shadow: 0 0 20px #00ff88, 0 0 40px #00ff88;
      //   animation: vessel-pulse 2s ease-in-out infinite;
      //   transform: translate(-50%, -50%);
      //   position: relative;
      // }

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

      /* Detention marker (red) */
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
        /* DESKTOP: Red detention marker size */
        width: 20px;      
        height: 20px;     
        background: #ff0000;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        box-shadow: 0 0 30px #ff0000;
        animation: detention-pulse 1.5s ease-in-out infinite;
      }

      /* ENHANCED TEXT BOX - Chapter 5 Style */
      .detention-text {
        position: absolute;
        top: 100%;        
        left: -160%;        
        transform: translateX(-50%);
        margin-top: 3px; 
        
        /* Enhanced styling matching Chapter 5 */
        background: rgba(204, 68, 68, 0.95);
        color: white;
        padding: 10px 10px;
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
        backdrop-filter: blur(2px);
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        letter-spacing: 0.5px;
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

      /* Popup styles - WHITE BACKGROUND */
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

      /* DESKTOP: Satellite image sizes */
      .msc-popup .enhanced-popup .annotation-img {
        width: 170px !important;    
        height: 180px !important;   
        object-fit: cover !important;
        display: block;
        border-radius: 4px;
      }

      /* TABLET OPTIMIZATIONS (1024px) */
      @media screen and (max-width: 1024px) {
        .vessel-marker {
          width: 24px;    
          height: 24px;   
        }

        .detention-core {
          width: 16px;    
          height: 16px;   
        }

        .detention-text {
          font-size: 12px;
          padding: 10px 14px;
        }

        .msc-popup .enhanced-popup .annotation-img {
          width: 136px !important;    /* 80% of desktop */
          height: 144px !important;   /* 80% of desktop */
        }
      }

      /* MOBILE OPTIMIZATIONS (768px) */
      @media screen and (max-width: 768px) {
        .vessel-marker {
          width: 20px;    /* Mobile green marker size */
          height: 20px;   
        }

        .detention-core {
          width: 24px;    /* Mobile red detention marker size */
          height: 24px;   
        }

        .detention-text {
          font-size: 11px;
          padding: 8px 12px;
          left: -100%;    /* Adjust position for mobile */
        }

        .msc-popup .enhanced-popup .annotation-img {
          width: 102px !important;    /* 60% of desktop */
          height: 108px !important;   /* 60% of desktop */
        }
      }

      /* SMALL MOBILE OPTIMIZATIONS (480px) */
      @media screen and (max-width: 480px) {
        .vessel-marker {
          width: 16px;    
          height: 16px;   
        }

        .detention-core {
          width: 20px;    
          height: 20px;   
        }

        .detention-text {
          font-size: 10px;
          padding: 6px 10px;
          left: -80%;     /* Further adjust for small screens */
        }

        .msc-popup .enhanced-popup .annotation-img {
          width: 77px !important;     /* 45% of desktop */
          height: 81px !important;    /* 45% of desktop */
        }
      }

      /* EXTRA SMALL MOBILE (320px) */
      @media screen and (max-width: 320px) {
        .vessel-marker {
          width: 14px;    
          height: 14px;   
        }

        .detention-core {
          width: 18px;    
          height: 18px;   
        }

        .detention-text {
          font-size: 9px;
          padding: 5px 8px;
          left: -60%;     /* Adjust for extra small screens */
        }

        .msc-popup .enhanced-popup .annotation-img {
          width: 60px !important;     /* 35% of desktop */
          height: 63px !important;    /* 35% of desktop */
        }
      }

      /* Ensure popups don't overflow on mobile screens */
      @media screen and (max-width: 768px) {
        .msc-popup .mapboxgl-popup-content {
          max-width: 95vw;
          max-height: 80vh;
          overflow: auto;
        }
      }

      /* Extra safety for very small screens */
      @media screen and (max-width: 320px) {
        .msc-popup .mapboxgl-popup-content {
          max-width: 98vw;
          max-height: 75vh;
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
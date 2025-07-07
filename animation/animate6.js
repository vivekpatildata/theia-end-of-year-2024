// animate6.js - Chapter 12 Contested Islands Animation (SIMPLIFIED - NO FANCY ANIMATIONS)

(function(global) {
  // Key contested locations in South China Sea
  const chapter12Points = [
    {
      coords: [116.1167, 8.9167], // Union Banks - South China Sea
      type: 'single',
      popupHtml: `
        <div class="enhanced-popup">
          <img src="pointk.png" class="annotation-img" alt="Union Banks satellite image">
        </div>
      `,
      offset: [-120, -60], // Position popup to avoid overlap
      delay: 500
    },
    {
      coords: [117.7583, 15.1833], // Scarborough Shoal - Exact coordinates (15°10'60"N, 117°45'59.99"E)
      type: 'single',
      popupHtml: `
        <div class="enhanced-popup">
          <img src="pointk.png" class="annotation-img" alt="Scarborough Shoal satellite image">
        </div>
      `,
      offset: [100, -50], // Position popup to avoid overlap
      delay: 800
    }
  ];

  // SIMPLE Detection points - EXACTLY LIKE CHAPTER 4
  const chapter12DetectionPoints = [
    {
      coords: [116.5631, 11.1339] // First detection point
    },
    {
      coords: [	115.9795, 16.2224] // Second detection point
    }
  ];

  // Storage for cleanup
  let chapter12Markers = [];
  let chapter12Popups = [];

  /**
   * Main animation function for Chapter 12 - SIMPLE VERSION
   */
  function animateChapter12ContestedIslands(map) {
    console.log('Starting Chapter 12 contested islands animation...');
    
    // Show popup-only markers first
    chapter12Points.forEach((pt, idx) => {
      setTimeout(() => {
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: pt.offset,
          className: 'contested-popup red-glow',
          maxWidth: 'none'
        })
          .setLngLat(pt.coords)
          .setHTML(pt.popupHtml)
          .addTo(map);
        
        chapter12Popups.push(popup);
      }, pt.delay);
    });

    // Add SIMPLE detection markers - NO ANIMATIONS
    chapter12DetectionPoints.forEach((pt) => {
      // Create detection marker with warning symbol - NO ANIMATIONS
      const el = document.createElement('div');
      el.className = 'detection-marker contested-detection';
      el.innerHTML = `
        <div class="detection-core">
          <div class="detection-symbol">⚠</div>
        </div>
        <div class="detection-ring"></div>
        <div class="detection-pulse"></div>
      `;
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(pt.coords)
        .addTo(map);
      
      chapter12Markers.push(marker);
      
      console.log('Detection marker added at:', pt.coords);
    });
  }

  /**
   * Simple cleanup for Chapter 12
   */
  function clearChapter12(map) {
    console.log('Clearing Chapter 12...');

    // Remove markers immediately
    chapter12Markers.forEach((marker) => {
      marker.remove();
    });
    chapter12Markers = [];

    // Remove popups
    chapter12Popups.forEach(p => p.remove());
    chapter12Popups = [];
  }

  // Expose functions globally
  global.animateChapter12ContestedIslands = animateChapter12ContestedIslands;
  global.clearChapter12 = clearChapter12;

  // Add SIMPLE CSS styles - EXACTLY LIKE CHAPTER 4
  if (!document.getElementById('chapter12-styles')) {
    const style = document.createElement('style');
    style.id = 'chapter12-styles';
    style.textContent = `
      /* Detection markers - NO ANIMATIONS */
      .detection-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        pointer-events: none;
      }

      .detection-marker.contested-detection .detection-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 28px;
        height: 28px;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff0000, #cc0000);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 50px rgba(255, 0, 0, 0.4);
      }

      .detection-symbol {
        color: white;
        font-size: 16px;
        font-weight: bold;
        text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
      }

      .contested-detection .detection-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border: 3px solid #ff0000;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }

      .contested-detection .detection-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        background: radial-gradient(circle, rgba(255, 0, 0, 0.5) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }

      /* Popup styles - SAME AS BEFORE */
      .contested-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 0;
        overflow: hidden;
        background: white;
        border: 1px solid #ccc;
      }

      .contested-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }

      .contested-popup.red-glow .mapboxgl-popup-content {
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3);
        border: 1px solid rgba(255, 0, 0, 0.5);
      }

      .contested-popup.red-glow .mapboxgl-popup-tip {
        border-top-color: rgba(255, 0, 0, 0.2);
      }

      .enhanced-popup {
        display: block;
      }

      .enhanced-popup .annotation-img {
        width: 150px !important;
        height: 150px !important;
        object-fit: cover;
        display: block;
      }

      /* Mobile optimizations */
      @media screen and (max-width: 768px) {
        .red-ping-marker {
          width: 20px;
          height: 20px;
        }

        .enhanced-popup .annotation-img {
          width: 120px !important;
          height: 120px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

})(window);
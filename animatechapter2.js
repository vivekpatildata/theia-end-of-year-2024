// animatechapter2.js - Chapter 2 Venezuela STS Operations (SIMPLIFIED - DIRECT PLOTTING)

(function(global) {
    // Venezuela annotation points - UPDATED: Removed STS Transfer Zone point
    const chapter2Points = [
        {
            coords: [-65.74221069043337, 12.391632177006642], // Venezuela Territorial Waters
            type: 'annotation',
            text: 'Venezuela Territorial Waters'
        },
        {
            coords: [-70.88380, 12.43455], // Los Monjes Islands
            type: 'marker',
            text: 'Los Monjes Islands',
            subtitle: 'Strategic Transfer Hub'
        }
    ];

    // Storage for cleanup
    let chapter2Markers = [];
    let chapter2Popups = [];

    /**
     * Main animation function for Chapter 2 - SIMPLE VERSION
     */
    function animateChapter2Venezuela(map) {
        console.log('Starting Chapter 2 Venezuela STS animation...');
        
        // Plot all points directly
        chapter2Points.forEach((pt) => {
            if (pt.type === 'annotation') {
                // Create Venezuela territorial waters annotation
                const el = document.createElement('div');
                el.className = 'venezuela-annotation';
                el.innerHTML = `<div class="venezuela-text">${pt.text}</div>`;
                
                const marker = new mapboxgl.Marker(el)
                    .setLngLat(pt.coords)
                    .addTo(map);
                
                chapter2Markers.push(marker);
                
            } else if (pt.type === 'marker') {
                // Create Los Monjes Islands marker
                const el = document.createElement('div');
                el.className = 'los-monjes-marker';
                el.innerHTML = `
                    <div class="marker-core">
                        <div class="marker-dot"></div>
                    </div>
                    <div class="marker-ring"></div>
                    <div class="marker-glow"></div>
                `;
                
                const marker = new mapboxgl.Marker(el)
                    .setLngLat(pt.coords)
                    .addTo(map);
                
                chapter2Markers.push(marker);
                
                // Add popup for Los Monjes Islands
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    offset: [0, -40],
                    className: 'los-monjes-popup',
                    maxWidth: 'none'
                })
                    .setLngLat(pt.coords)
                    .setHTML(`
                        <div class="los-monjes-info">
                            <div class="island-title">${pt.text}</div>
                            <div class="island-subtitle">${pt.subtitle}</div>
                        </div>
                    `)
                    .addTo(map);
                
                chapter2Popups.push(popup);
            }
            
            console.log('Chapter 2 element added at:', pt.coords, 'Type:', pt.type);
        });
    }

    /**
     * Simple cleanup for Chapter 2
     */
    function clearChapter2Venezuela(map) {
        console.log('Clearing Chapter 2 Venezuela...');

        // Remove markers immediately
        chapter2Markers.forEach((marker) => {
            marker.remove();
        });
        chapter2Markers = [];

        // Remove popups
        chapter2Popups.forEach(p => p.remove());
        chapter2Popups = [];
    }

    // Expose functions globally
    global.animateChapter2Venezuela = animateChapter2Venezuela;
    global.clearChapter2Venezuela = clearChapter2Venezuela;

    // Add UPDATED CSS styles - Removed STS zone styles
    if (!document.getElementById('chapter2-styles')) {
        const style = document.createElement('style');
        style.id = 'chapter2-styles';
        style.textContent = `
            /* Venezuela Territorial Waters Annotation */
            .venezuela-annotation {
                position: absolute;
                transform: translate(-50%, -50%);
                background: rgba(204, 68, 68, 0.95);
                color: white;
                padding: 12px 16px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                line-height: 1.3;
                white-space: nowrap;
                box-shadow: 
                    0 4px 20px rgba(204, 68, 68, 0.4),
                    0 2px 10px rgba(0, 0, 0, 0.3);
                border: 2px solid rgba(180, 50, 50, 0.8);
                pointer-events: none;
                backdrop-filter: blur(2px);
            }

            .venezuela-text {
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
                letter-spacing: 0.5px;
            }

            /* Los Monjes Islands Marker */
            .los-monjes-marker {
                position: absolute;
                transform: translate(-50%, -50%);
                width: 50px;
                height: 50px;
                pointer-events: none;
            }

            .marker-core {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 24px;
                height: 24px;
                transform: translate(-50%, -50%);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .marker-dot {
                width: 20px;
                height: 20px;
                background: linear-gradient(135deg, #ff4444, #cc0000);
                border-radius: 50%;
                box-shadow: 
                    0 0 20px rgba(255, 68, 68, 0.8),
                    0 0 40px rgba(255, 68, 68, 0.4);
                animation: marker-throb 2s ease-in-out infinite;
                
            }

            .marker-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                border: 2px solid #ff4444;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: marker-ring-expand 3.5s ease-out infinite;
            }

            .marker-glow {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 30px;
                height: 30px;
                background: radial-gradient(circle, rgba(255, 68, 68, 0.4) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: marker-glow-pulse 2.2s ease-in-out infinite;
            }

            /* Los Monjes Popup */
            .los-monjes-popup .mapboxgl-popup-content {
                padding: 0;
                border-radius: 8px;
                overflow: hidden;
                background: rgba(30, 30, 30, 0.95);
                border: 2px solid rgba(255, 68, 68, 0.6);
                box-shadow: 
                    0 0 30px rgba(255, 68, 68, 0.5),
                    0 4px 20px rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(3px);
            }

            .los-monjes-popup .mapboxgl-popup-tip {
                border-top-color: rgba(30, 30, 30, 0.95);
            }

            .los-monjes-info {
                padding: 12px 16px;
                text-align: center;
            }

            .island-title {
                color: #ffffff;
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 4px;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
                letter-spacing: 0.3px;
            }

            .island-subtitle {
                color: #ffaaaa;
                font-size: 11px;
                font-weight: 500;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                letter-spacing: 0.2px;
            }

            /* Animations */
            @keyframes marker-throb {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 
                        0 0 20px rgba(255, 68, 68, 0.8),
                        0 0 40px rgba(255, 68, 68, 0.4);
                }
                50% {
                    transform: scale(1.1);
                    box-shadow: 
                        0 0 30px rgba(255, 68, 68, 1),
                        0 0 60px rgba(255, 68, 68, 0.6);
                }
            }

            @keyframes marker-ring-expand {
                0% {
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }

            @keyframes marker-glow-pulse {
                0%, 100% {
                    transform: translate(-50%, -50%) scale(0.9);
                    opacity: 0.4;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 0.2;
                }
            }

            /* Mobile Optimizations */
            @media screen and (max-width: 768px) {
                .venezuela-annotation {
                    font-size: 12px;
                    padding: 10px 12px;
                }

                .los-monjes-marker {
                    width: 40px;
                    height: 40px;
                }

                .marker-dot {
                    width: 16px;
                    height: 16px;
                }

                .marker-ring {
                    width: 32px;
                    height: 32px;
                }

                .marker-glow {
                    width: 24px;
                    height: 24px;
                }

                .island-title {
                    font-size: 12px;
                }

                .island-subtitle {
                    font-size: 10px;
                }

                .los-monjes-info {
                    padding: 10px 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }

})(window);
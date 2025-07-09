// Enhanced map.js - Complete Version with Intro Geographic Coverage Data Layers

// 1. Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoidml2ZWtwYXRpbDE3IiwiYSI6ImNseHV4bzJoMzFycXgybG9tN3ptZXd1d2QifQ.wbdQPBUeYDHlbwnmgHHI9g';

// 2. Mobile detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

// 3. Global variables with transition protection
let map = null;
let miniMaps = [];
let mapLoaded = false;
let camera = null;
let isTransitioning = false;
let currentChapter = '';
let animationTimeouts = new Set();

// 4. Enhanced timeout utility
function safeTimeout(callback, delay) {
  const timeoutId = setTimeout(() => {
    animationTimeouts.delete(timeoutId);
    callback();
  }, delay);
  animationTimeouts.add(timeoutId);
  return timeoutId;
}

function clearAllTimeouts() {
  animationTimeouts.forEach(id => clearTimeout(id));
  animationTimeouts.clear();
}

// 5. Simple Camera class
class CinematicCamera {
  constructor(map) {
    this.map = map;
  }

  async flyTo(config, options = {}) {
    return new Promise(resolve => {
      try {
        this.map.flyTo({
          ...config,
          duration: options.duration || 1000,
          essential: true
        });
        this.map.once('moveend', resolve);
      } catch (error) {
        console.error('Error in flyTo:', error);
        resolve();
      }
    });
  }

  shake(intensity = 5, duration = 300) {
    const container = this.map.getContainer();
    const keyframes = [];
    const steps = 10;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const offset = Math.sin(progress * Math.PI * 4) * intensity * (1 - progress);
      keyframes.push({
        transform: `translateX(${offset}px) translateY(${offset * 0.5}px)`
      });
    }

    container.animate(keyframes, { duration, easing: 'ease-out' });
  }
}

// 6. Initialize map immediately - SKIP DEFAULT POSITIONING
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing map...');
  
  // Initialize main map - HIDDEN INITIALLY
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vivekpatil17/cm91pwom6000901qm7ozm33jg',
    center: [0, 0], // Default center (hidden anyway)
    zoom: 1, // Low zoom (hidden anyway)
    pitch: 0, // Flat view (hidden anyway)
    bearing: 0, // No rotation (hidden anyway)
    interactive: false,
    attributionControl: false,
    fadeDuration: 0
  });

  camera = new CinematicCamera(map);

  // Initialize mini-maps
  for (let i = 1; i <= 4; i++) {
    const m = new mapboxgl.Map({
      container: `mini-map-${i}`,
      style: 'mapbox://styles/vivekpatil17/cm91pwom6000901qm7ozm33jg',
      center: [0, 0],
      zoom: 1,
      interactive: false,
      attributionControl: false
    });
    m.getContainer().style.visibility = 'hidden';
    miniMaps.push(m);
  }

  // Handle map load
  map.on('load', async () => {
    console.log('Map loaded');
    mapLoaded = true;
    
    // Add fog
    try {
      map.setFog({
        'range': [0.5, 10],
        'color': 'rgb(10, 10, 10)',
        'horizon-blend': 0.05
      });
    } catch (e) {
      console.warn('Could not set fog:', e);
    }

    // Load data sources
    await loadDataSources();
    
    // IMMEDIATE INTRO START - NO DEFAULT POSITIONING
    currentChapter = 'intro';
    chapters.intro.onEnter();
    
    // Setup scrollama
    setupScrollama();
  });

  // Handle errors
  map.on('error', (e) => {
    console.error('Map error:', e);
  });
});

// 7. Load data sources
async function loadDataSources() {
  const sources = [
    { name: 'oilspill', file: 'data/oilspillfinal1.geojson' },
    { name: 'submarine', file: 'data/novorossiysk.geojson' },
    { name: 'sakaryaPath', file: 'data/final-sakarya_pathoct26dec6.geojson' },
    { name: 'atilaPath', file: 'data/final-atilaoct26dec6.geojson' },
    { name: 'mscariesCourse', file: 'data/mscaries_course.geojson' },
    { name: 'mscariesAssessed', file: 'data/mscaries_assessed_course.geojson' },
    { name: 'anshun2', file: 'data/anshun2.geojson' },
    { name: 'seaTrialArea', file: 'data/assessedseatrialarea.geojson' },
    { name: 'asiaTerritories', file: 'data/asia_territories.geojson' },
    { name: 'venezuela', file: 'data/venezuela.geojson' }
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source.file);
      if (response.ok) {
        const data = await response.json();
        map.addSource(source.name, { type: 'geojson', data });
        console.log(`Loaded ${source.name} successfully`);
      }
    } catch (error) {
      console.warn(`Failed to load ${source.file}:`, error);
    }
  }

  // Add layers
  addLayers();
}

// 8. NEW: Load Intro Coverage Data for Mini-Maps
async function loadIntroCoverageData() {
  console.log('🌍 Loading Intro Coverage Data (PARALLEL VERSION)...');
  
  // Coverage data sources for each mini-map
  const coverageFiles = [
    'data/South_america.geojson',     // Mini-map 1
    'data/middle_east.geojson',       // Mini-map 2
    'data/arctic_russia.geojson',     // Mini-map 3
    'data/south_china_sea.geojson'    // Mini-map 4
  ];

  // PARALLEL LOADING: Load all coverage files simultaneously
  const coverageDataArray = await Promise.all(
    coverageFiles.map(file => 
      fetch(file).then(response => {
        if (response.ok) return response.json();
        throw new Error(`${file}: ${response.status}`);
      }).catch(error => {
        console.warn(`❌ Failed to load ${file}:`, error);
        return null;
      })
    )
  );

  console.log('🌍 Coverage data loading complete:', {
    coverage: coverageDataArray.map((data, i) => ({
      file: coverageFiles[i],
      loaded: !!data,
      features: data?.features?.length || 0
    }))
  });

  // FAST SOURCE ADDITION: Add all coverage sources to mini-maps simultaneously
  const sourcePromises = [];
  
  for (let i = 0; i < miniMaps.length; i++) {
    const miniMap = miniMaps[i];
    const coverageData = coverageDataArray[i];
    
    if (!miniMap || !coverageData) continue;
    
    // Add coverage source
    const coverageSourceId = `intro-coverage-${i + 1}`;
    sourcePromises.push(
      new Promise(resolve => {
        try {
          // Remove existing source if it exists
          if (miniMap.getSource(coverageSourceId)) {
            miniMap.removeSource(coverageSourceId);
          }
          
          miniMap.addSource(coverageSourceId, {
            type: 'geojson',
            data: coverageData
          });
          
          console.log(`✅ Added coverage source ${i + 1}: ${coverageFiles[i]}`);
          resolve();
        } catch (error) {
          console.warn(`❌ Error adding coverage source ${i + 1}:`, error);
          resolve();
        }
      })
    );
  }
  
  // Wait for all sources to be added
  await Promise.all(sourcePromises);
  console.log('🏁 Coverage data loading complete - all sources added');
}

// 9. NEW: Add Coverage Layers to Mini-Maps
function addIntroCoverageLayers() {
  console.log('🎨 Adding Intro Coverage Layers...');
  
  // BATCH LAYER ADDITION: Add all layers simultaneously
  const layerPromises = [];
  
  miniMaps.forEach((miniMap, index) => {
    const mapIndex = index + 1;
    
    if (!miniMap) return;
    
    // Add coverage fill layer
    layerPromises.push(
      new Promise(resolve => {
        try {
          const coverageSourceId = `intro-coverage-${mapIndex}`;
          const coverageFillId = `intro-coverage-fill-${mapIndex}`;
          
          if (miniMap.getSource(coverageSourceId)) {
            // Remove existing layer if it exists
            if (miniMap.getLayer(coverageFillId)) {
              miniMap.removeLayer(coverageFillId);
            }
            
            miniMap.addLayer({
              id: coverageFillId,
              type: 'fill',
              source: coverageSourceId,
              layout: { visibility: 'visible' },
              paint: { 
                'fill-color': '#8b0000', // Deep red
                'fill-opacity': 0.15 // Low opacity for subtle coverage indication
              }
            });
            
            console.log(`✅ Added coverage fill layer ${mapIndex}`);
          }
          resolve();
        } catch (error) {
          console.warn(`❌ Error adding coverage fill layer ${mapIndex}:`, error);
          resolve();
        }
      })
    );
    
    // Add coverage border layer
    layerPromises.push(
      new Promise(resolve => {
        try {
          const coverageSourceId = `intro-coverage-${mapIndex}`;
          const coverageBorderId = `intro-coverage-border-${mapIndex}`;
          
          if (miniMap.getSource(coverageSourceId)) {
            // Remove existing layer if it exists
            if (miniMap.getLayer(coverageBorderId)) {
              miniMap.removeLayer(coverageBorderId);
            }
            
            miniMap.addLayer({
              id: coverageBorderId,
              type: 'line',
              source: coverageSourceId,
              layout: { visibility: 'visible' },
              paint: {
                'line-color': '#660000', // Darker red for borders
                'line-width': 1.5,
                'line-opacity': 1
              }
            });
            
            console.log(`✅ Added coverage border layer ${mapIndex}`);
          }
          resolve();
        } catch (error) {
          console.warn(`❌ Error adding coverage border layer ${mapIndex}:`, error);
          resolve();
        }
      })
    );
    
    // Add coverage labels layer
    layerPromises.push(
      new Promise(resolve => {
        try {
          const coverageSourceId = `intro-coverage-${mapIndex}`;
          const coverageLabelsId = `intro-coverage-labels-${mapIndex}`;
          
          if (miniMap.getSource(coverageSourceId)) {
            // Remove existing layer if it exists
            if (miniMap.getLayer(coverageLabelsId)) {
              miniMap.removeLayer(coverageLabelsId);
            }
            
            miniMap.addLayer({
              id: coverageLabelsId,
              type: 'symbol',
              source: coverageSourceId,
              layout: {
                visibility: 'visible',
                'text-field': ['get', 'Country'], // Assuming Countries field exists
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-size': [
                  'interpolate', ['linear'], ['zoom'],
                  2, 8,   // At zoom 2, size 8
                  4, 10,  // At zoom 4, size 10
                  6, 12   // At zoom 6, size 12
                ],
                'text-transform': 'uppercase',
                'text-letter-spacing': 0.1,
                'text-offset': [0, 0],
                'text-anchor': 'center',
                'text-max-width': 10,
                'text-padding': 4, // Prevent label crowding
                'text-allow-overlap': false, // Prevent overlapping
                'text-optional': true // Allow labels to be hidden if crowded
              },
              paint: {
                'text-color': '#ffffff',
                'text-halo-color': '#8b0000', // Deep red halo
                'text-halo-width': 2.5,
                'text-opacity': 0.9
              }
            });
            
            console.log(`✅ Added coverage labels layer ${mapIndex}`);
          }
          resolve();
        } catch (error) {
          console.warn(`❌ Error adding coverage labels layer ${mapIndex}:`, error);
          resolve();
        }
      })
    );
  });
  
  // Wait for all layers to be added, then trigger repaint
  Promise.all(layerPromises).then(() => {
    // Force all mini-maps to repaint simultaneously
    miniMaps.forEach(miniMap => {
      if (miniMap) {
        try {
          miniMap.triggerRepaint();
        } catch (e) {
          // Ignore repaint errors
        }
      }
    });
    console.log('🏁 Coverage layers addition complete');
  });
}

// 10. NEW: Remove Intro Coverage Layers
function removeIntroCoverageLayers() {
  console.log('🧹 Removing Intro Coverage Layers...');
  
  miniMaps.forEach((miniMap, index) => {
    const mapIndex = index + 1;
    
    if (!miniMap) {
      console.log(`❌ Mini-map ${mapIndex} does not exist`);
      return;
    }
    
    console.log(`🧹 Cleaning coverage layers from mini-map ${mapIndex}:`);
    
    try {
      const coverageFillId = `intro-coverage-fill-${mapIndex}`;
      const coverageBorderId = `intro-coverage-border-${mapIndex}`;
      const coverageLabelsId = `intro-coverage-labels-${mapIndex}`;
      const coverageSourceId = `intro-coverage-${mapIndex}`;
      
      // Remove coverage layers
      if (miniMap.getLayer(coverageFillId)) {
        console.log(`   - Removing coverage fill layer: ${coverageFillId}`);
        miniMap.removeLayer(coverageFillId);
      }
      
      if (miniMap.getLayer(coverageBorderId)) {
        console.log(`   - Removing coverage border layer: ${coverageBorderId}`);
        miniMap.removeLayer(coverageBorderId);
      }
      
      if (miniMap.getLayer(coverageLabelsId)) {
        console.log(`   - Removing coverage labels layer: ${coverageLabelsId}`);
        miniMap.removeLayer(coverageLabelsId);
      }
      
      // Remove source
      if (miniMap.getSource(coverageSourceId)) {
        console.log(`   - Removing coverage source: ${coverageSourceId}`);
        miniMap.removeSource(coverageSourceId);
      }
      
      console.log(`✅ Mini-map ${mapIndex} coverage cleaned`);
      
    } catch (error) {
      console.error(`❌ Error removing coverage layers from mini-map ${mapIndex}:`, error);
    }
  });
  
  console.log('🏁 Finished removing Intro Coverage Layers');
}

// 11. NEW: Load Chapter 6 mini-map vessel data - FAST VERSION
async function loadChapter6VesselData() {
  console.log('🚢 Loading Chapter 6 vessel data (FAST VERSION)...');
  
  // Data sources for each mini-map
  const vesselFiles = [
    'data/finalviz-pioneertanker.geojson',  // Mini-map 1
    'data/asya-path.geojson',               // Mini-map 2
    'data/everest20-25august.geojson',      // Mini-map 3
    'data/mulan(17sept-31dec2024-cleaned).geojson' // Mini-map 4
  ];

  // PARALLEL LOADING: Load all files simultaneously
  const [arcticData, ...vesselDataArray] = await Promise.all([
    // Load Arctic data
    fetch('data/arctic2.json').then(response => {
      if (response.ok) return response.json();
      throw new Error(`Arctic2.json: ${response.status}`);
    }).catch(error => {
      console.warn('❌ Failed to load arctic2.json:', error);
      return null;
    }),
    
    // Load all vessel files in parallel
    ...vesselFiles.map(file => 
      fetch(file).then(response => {
        if (response.ok) return response.json();
        throw new Error(`${file}: ${response.status}`);
      }).catch(error => {
        console.warn(`❌ Failed to load ${file}:`, error);
        return null;
      })
    )
  ]);

  console.log('📡 Parallel loading complete:', {
    arctic: !!arcticData,
    vessels: vesselDataArray.map((data, i) => ({
      file: vesselFiles[i],
      loaded: !!data,
      features: data?.features?.length || 0
    }))
  });

  // FAST SOURCE ADDITION: Add all sources to mini-maps simultaneously
  const sourcePromises = [];
  
  for (let i = 0; i < miniMaps.length; i++) {
    const miniMap = miniMaps[i];
    const vesselData = vesselDataArray[i];
    
    if (!miniMap) continue;
    
    // Add vessel source
    if (vesselData) {
      const vesselSourceId = `chapter6-vessel-${i + 1}`;
      sourcePromises.push(
        new Promise(resolve => {
          try {
            // Remove existing source if it exists
            if (miniMap.getSource(vesselSourceId)) {
              miniMap.removeSource(vesselSourceId);
            }
            
            miniMap.addSource(vesselSourceId, {
              type: 'geojson',
              data: vesselData
            });
            
            console.log(`✅ Fast-added vessel source ${i + 1}`);
            resolve();
          } catch (error) {
            console.warn(`❌ Error adding vessel source ${i + 1}:`, error);
            resolve();
          }
        })
      );
    }
    
    // Add Arctic source
    if (arcticData) {
      const arcticSourceId = `chapter6-arctic-${i + 1}`;
      sourcePromises.push(
        new Promise(resolve => {
          try {
            // Remove existing source if it exists
            if (miniMap.getSource(arcticSourceId)) {
              miniMap.removeSource(arcticSourceId);
            }
            
            miniMap.addSource(arcticSourceId, {
              type: 'geojson',
              data: arcticData
            });
            
            console.log(`✅ Fast-added Arctic source ${i + 1}`);
            resolve();
          } catch (error) {
            console.warn(`❌ Error adding Arctic source ${i + 1}:`, error);
            resolve();
          }
        })
      );
    }
  }
  
  // Wait for all sources to be added
  await Promise.all(sourcePromises);
  console.log('🏁 Fast loading complete - all sources added');
}

// 12. NEW: Add vessel layers to mini-maps - FAST VERSION
function addChapter6VesselLayers() {
  console.log('🎨 Adding Chapter 6 vessel layers (FAST VERSION)...');
  
  // BATCH LAYER ADDITION: Add all layers simultaneously
  const layerPromises = [];
  
  miniMaps.forEach((miniMap, index) => {
    const mapIndex = index + 1;
    
    if (!miniMap) return;
    
    // Add vessel layer promise
    layerPromises.push(
      new Promise(resolve => {
        try {
          const vesselSourceId = `chapter6-vessel-${mapIndex}`;
          const vesselLayerId = `chapter6-vessel-line-${mapIndex}`;
          
          if (miniMap.getSource(vesselSourceId)) {
            // Remove existing layer if it exists
            if (miniMap.getLayer(vesselLayerId)) {
              miniMap.removeLayer(vesselLayerId);
            }
            
            miniMap.addLayer({
              id: vesselLayerId,
              type: 'line',
              source: vesselSourceId,
              layout: { visibility: 'visible' },
              paint: { 
                'line-color': '#39ff14', // Neon green
                'line-width': 3, 
                'line-opacity': 0.9,
                'line-blur': 0.5
              }
            });
            
            console.log(`✅ Fast-added vessel layer ${mapIndex}`);
          }
          resolve();
        } catch (error) {
          console.warn(`❌ Error adding vessel layer ${mapIndex}:`, error);
          resolve();
        }
      })
    );
    
    // Add Arctic layer promise
    layerPromises.push(
      new Promise(resolve => {
        try {
          const arcticSourceId = `chapter6-arctic-${mapIndex}`;
          const arcticLayerId = `chapter6-arctic-marker-${mapIndex}`;
          
          if (miniMap.getSource(arcticSourceId)) {
            // Remove existing layer if it exists
            if (miniMap.getLayer(arcticLayerId)) {
              miniMap.removeLayer(arcticLayerId);
            }
            
            miniMap.addLayer({
              id: arcticLayerId,
              type: 'circle',
              source: arcticSourceId,
              layout: { visibility: 'visible' },
              paint: {
                'circle-radius': 8,
                'circle-color': '#ffb3b3', // Pastel red
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ff6666',
                'circle-opacity': 0.8,
                'circle-stroke-opacity': 1
              }
            });
            
            console.log(`✅ Fast-added Arctic layer ${mapIndex}`);
          }
          resolve();
        } catch (error) {
          console.warn(`❌ Error adding Arctic layer ${mapIndex}:`, error);
          resolve();
        }
      })
    );
  });
  
  // Wait for all layers to be added, then trigger repaint
  Promise.all(layerPromises).then(() => {
    // Force all mini-maps to repaint simultaneously
    miniMaps.forEach(miniMap => {
      if (miniMap) {
        try {
          miniMap.triggerRepaint();
        } catch (e) {
          // Ignore repaint errors
        }
      }
    });
    console.log('🏁 Fast layer addition complete');
  });
}

// 13. NEW: Remove Chapter 6 vessel layers - DEBUG VERSION
function removeChapter6VesselLayers() {
  console.log('🧹 Removing Chapter 6 vessel layers (DEBUG VERSION)...');
  
  miniMaps.forEach((miniMap, index) => {
    const mapIndex = index + 1;
    
    if (!miniMap) {
      console.log(`❌ Mini-map ${mapIndex} does not exist`);
      return;
    }
    
    console.log(`🧹 Cleaning mini-map ${mapIndex}:`);
    
    try {
      const vesselLayerId = `chapter6-vessel-line-${mapIndex}`;
      const arcticLayerId = `chapter6-arctic-marker-${mapIndex}`;
      const vesselSourceId = `chapter6-vessel-${mapIndex}`;
      const arcticSourceId = `chapter6-arctic-${mapIndex}`;
      
      // Remove vessel line layer
      if (miniMap.getLayer(vesselLayerId)) {
        console.log(`   - Removing vessel layer: ${vesselLayerId}`);
        miniMap.removeLayer(vesselLayerId);
      }
      
      // Remove Arctic marker layer
      if (miniMap.getLayer(arcticLayerId)) {
        console.log(`   - Removing Arctic layer: ${arcticLayerId}`);
        miniMap.removeLayer(arcticLayerId);
      }
      
      // Remove sources
      if (miniMap.getSource(vesselSourceId)) {
        console.log(`   - Removing vessel source: ${vesselSourceId}`);
        miniMap.removeSource(vesselSourceId);
      }
      
      if (miniMap.getSource(arcticSourceId)) {
        console.log(`   - Removing Arctic source: ${arcticSourceId}`);
        miniMap.removeSource(arcticSourceId);
      }
      
      console.log(`✅ Mini-map ${mapIndex} cleaned`);
      
    } catch (error) {
      console.error(`❌ Error removing layers from mini-map ${mapIndex}:`, error);
    }
  });
  
  console.log('🏁 Finished removing Chapter 6 vessel layers');
}

// 14. Add all layers
function addLayers() {
  // Oil spill
  if (map.getSource('oilspill')) {
    map.addLayer({
      id: 'oilspill-fill',
      type: 'fill',
      source: 'oilspill',
      layout: { visibility: 'none' },
      paint: {
        'fill-color': ['get', 'fill'],
        'fill-opacity': ['get', 'fill-opacity']
      }
    });
    map.addLayer({
      id: 'oilspill-line',
      type: 'line',
      source: 'oilspill',
      layout: { visibility: 'none' },
      paint: {
        'line-color': ['get', 'stroke'],
        'line-width': ['get', 'stroke-width'],
        'line-opacity': ['get', 'stroke-opacity'],
        'line-blur': ['get', 'stroke-blur']
      }
    });
  }

  // NEW: Venezuela layers for Chapter 2
  if (map.getSource('venezuela')) {
    // Venezuela fill layer
    map.addLayer({
      id: 'venezuela-fill',
      type: 'fill',
      source: 'venezuela',
      layout: { visibility: 'none' },
      paint: {
        'fill-color': '#cc4444', // Red fill as requested
        'fill-opacity': 0.3
      }
    });

    // Venezuela border layer
    map.addLayer({
      id: 'venezuela-border',
      type: 'line',
      source: 'venezuela',
      layout: { visibility: 'none' },
      paint: {
        'line-color': '#883333', // Dark red border
        'line-width': 2,
        'line-opacity': 0.8
      }
    });
  }

  // Submarine
  if (map.getSource('submarine')) {
    map.addLayer({
      id: 'submarine-path',
      type: 'line',
      source: 'submarine',
      layout: { visibility: 'none' },
      paint: { 
        'line-color': '#39ff14', 
        'line-width': 3, 
        'line-opacity': 0.9,
        'line-blur': 0.5,
        'line-dasharray': [5, 2] // Dashed line for submarine path
      }
    });
  }

  // Other paths
  const paths = [
    { id: 'sakarya-line', source: 'sakaryaPath', color: '#62fda0' },
    { id: 'atila-line', source: 'atilaPath', color: '#57aeff' },
    { id: 'mscaries-course-line', source: 'mscariesCourse', color: '#39ff14' },
    { id: 'mscaries-assessed-line', source: 'mscariesAssessed', color: '#39ff14', dash: [2, 4] },
    { id: 'anshun2-line', source: 'anshun2', color: '#39ff14' }
  ];

  paths.forEach(path => {
    if (map.getSource(path.source)) {
      const paint = {
        'line-color': path.color,
        'line-width': 3,
        'line-opacity': 0.8
      };
      if (path.dash) paint['line-dasharray'] = path.dash;
      
      map.addLayer({
        id: path.id,
        type: 'line',
        source: path.source,
        layout: { visibility: 'none' },
        paint
      });
    }
  });

  // Sea Trial Area layer for Chapter 11
  if (map.getSource('seaTrialArea')) {
    map.addLayer({
      id: 'sea-trial-area',
      type: 'line',
      source: 'seaTrialArea',
      layout: { visibility: 'none' },
      paint: {
        'line-color': '#ff6600',
        'line-width': 2,
        'line-opacity': 0.8,
        'line-dasharray': [3, 3]
      }
    });
  }

  // Asia Territories layers for Chapter 12
  if (map.getSource('asiaTerritories')) {
    // Main territories fill layer with red shading
    map.addLayer({
      id: 'asia-territories-fill',
      type: 'fill',
      source: 'asiaTerritories',
      layout: { visibility: 'none' },
      paint: {
        'fill-color': [
          'case',
          ['==', ['get', 'Country'], 'Paracel Islands'],
          '#cc4444', // Darker red for Paracel Islands
          ['==', ['get', 'Country'], 'Spratly Islands'],
          '#cc4444', // Darker red for Spratly Islands
          '#dd6666' // Light red for all other territories
        ],
        'fill-opacity': 0.25 // Low opacity to not overpower the dark grey sea
      }
    });

    // Territories border layer
    map.addLayer({
      id: 'asia-territories-border',
      type: 'line',
      source: 'asiaTerritories',
      layout: { visibility: 'none' },
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'Country'], 'Paracel Islands'],
          '#aa3333', // Darker border for Paracel Islands
          ['==', ['get', 'Country'], 'Spratly Islands'],
          '#aa3333', // Darker border for Spratly Islands
          '#bb4444' // Standard red border for all others
        ],
        'line-width': 1.5,
        'line-opacity': 0.7
      }
    });

    // Country labels layer
    map.addLayer({
      id: 'asia-territories-labels',
      type: 'symbol',
      source: 'asiaTerritories',
      layout: {
        visibility: 'none',
        'text-field': ['get', 'Country'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 11,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.1,
        'text-offset': [0, 0],
        'text-anchor': 'center'
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#aa3333',
        'text-halo-width': 2,
        'text-opacity': 0.9
      }
    });
  }
}

// 15. Helper functions
function setLegend(text) {
  const el = document.getElementById('map-legend');
  if (el) { 
    // Use innerHTML instead of innerText to support HTML colors
    el.innerHTML = text || ''; 
    if (text && text.trim() !== '') {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }
}

function setDateRange(text) {
  const el = document.getElementById('date-range');
  if (el) { 
    el.innerText = text || ''; 
    if (text && text.trim() !== '') {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }
}

// 16. Enhanced cleanup
function hideAllLayers() {
  const allLayers = [
    'oilspill-fill', 'oilspill-line', 'submarine-path', 
    'sakarya-line', 'atila-line', 'mscaries-course-line', 
    'mscaries-assessed-line', 'anshun2-line', 'sea-trial-area',
    'asia-territories-fill', 'asia-territories-border', 'asia-territories-labels',
    'venezuela-fill', 'venezuela-border' // NEW: Venezuela layers
  ];
  
  allLayers.forEach(id => {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', 'none');
    }
  });
  
  const animatedLayers = [
    'tutor-anim-line', 'tutor-anim-glow',
    'rubymar-anim-line', 'rubymar-glow', 'rubymar-shadow',
    'anshun2-anim-line', 'anshun2-glow',
    'msc-tracking-line'
  ];
  
  animatedLayers.forEach(id => {
    if (map.getLayer(id)) {
      map.removeLayer(id);
    }
  });
  
  const animatedSources = ['tutorAnim', 'rubymarAnim', 'anshun2Anim'];
  animatedSources.forEach(id => {
    if (map.getSource(id)) {
      map.removeSource(id);
    }
  });
}

function clearAllMarkers() {
  const cleanupFunctions = [
    'clearChapter1', 'clearChapter2Venezuela', 'clearChapter3', 'clearChapter4STS', 'clearChapter5', // UPDATED: Chapter 2 cleanup function
    'clearChapter7', 'clearChapter8', 'clearChapter9', 'clearChapter10', 
    'clearChapter11', 'clearChapter12'
  ];

  cleanupFunctions.forEach(funcName => {
    if (window[funcName] && typeof window[funcName] === 'function') {
      try { 
        window[funcName](map); 
      } catch(e) { 
        console.warn(`Error clearing ${funcName}:`, e); 
      }
    }
  });
  
  const popups = document.getElementsByClassName('mapboxgl-popup');
  Array.from(popups).forEach(popup => popup.remove());
  
  const markers = document.getElementsByClassName('mapboxgl-marker');
  Array.from(markers).forEach(marker => {
    if (!marker.classList.contains('mapboxgl-user-location-dot')) {
      marker.remove();
    }
  });
}

// Enhanced comprehensive cleanup
function comprehensiveCleanup() {
  console.log('Running comprehensive cleanup...');
  
  clearAllTimeouts();
  hideAllLayers();
  clearAllMarkers();
  
  const barChart = document.getElementById('bar-chart-overlay');
  if (barChart) barChart.style.display = 'none';
}

// 17. Chapter configurations with ENHANCED INTRO
const chapters = {
  intro: {
    config: { center: [0, 0], zoom: 1, pitch: 0, bearing: 0 },
    legend: '',
    dateRange: '',
    async onEnter() {
      console.log('Entering intro - using mini-maps with coverage data');
      comprehensiveCleanup();
      
      // Hide main map and show mini-maps container immediately
      document.getElementById('map').style.display = 'none';
      document.getElementById('map-legend').style.display = 'none';
      document.getElementById('date-range').style.display = 'none';
      document.getElementById('bar-chart-overlay').style.display = 'none';
      document.getElementById('mini-maps-container').style.display = 'grid';

      // Enhanced intro configurations
      // Enhanced intro configurations
       // Enhanced intro configurations
const configs = [
  { center: [-63.8, 13.17], zoom: 3.1, legend: 'South American Coverage', date: 'Jan 2024 – Dec 2024' },
  { center: [39.56, 23.69], zoom: 3.2, legend: 'Middle East Coverage', date: 'Multi-source intelligence fusion across critical maritime corridors' },
  { center: [102.62, 75.05], zoom: 2, legend: 'Russian Arctic Coverage', date: 'Jan 2024 – Dec 2024' },
  { center: [115.34, 17.32], zoom: 4, legend: 'South China Coverage', date: 'Apr 2024 – Sep 2024' }
];
      // Setup basic mini-maps first
      configs.forEach((cfg, i) => {
        try {
          miniMaps[i].getContainer().style.visibility = 'visible';
          miniMaps[i].jumpTo({ center: cfg.center, zoom: cfg.zoom });
          miniMaps[i].resize();
          
          // Only show legend and date range for Middle East (index 1)
          if (i === 1) {
            document.getElementById(`legend-${i + 1}`).innerText = cfg.legend;
            document.getElementById(`legend-${i + 1}`).style.display = 'none';
            document.getElementById(`daterange-${i + 1}`).innerText = cfg.date;
            document.getElementById(`daterange-${i + 1}`).style.display = 'block';
          } else {
            document.getElementById(`legend-${i + 1}`).style.display = 'none';
            document.getElementById(`daterange-${i + 1}`).style.display = 'none';
          }
        } catch (e) {
          console.warn(`Error setting up mini-map ${i + 1}:`, e);
        }
      });

      // ENHANCED: Load and add coverage data
      try {
        // Wait for mini-maps to be ready and then load coverage data in parallel
        Promise.all([
          // Wait for mini-maps to be ready
          Promise.all(miniMaps.map((miniMap, i) => {
            return new Promise(resolve => {
              if (miniMap && (miniMap.loaded() && miniMap.isStyleLoaded())) {
                resolve();
              } else if (miniMap) {
                const checkReady = () => {
                  if (miniMap.loaded() && miniMap.isStyleLoaded()) {
                    resolve();
                  } else {
                    setTimeout(checkReady, 50);
                  }
                };
                checkReady();
              } else {
                resolve();
              }
            });
          })),
          // Load coverage data immediately (parallel)
          loadIntroCoverageData()
        ]).then(() => {
          // Only proceed if still on intro
          if (currentChapter === 'intro') {
            console.log('🌍 Intro: Coverage data loading complete, adding layers...');
            addIntroCoverageLayers();
            console.log('✅ Intro: Coverage layers added successfully');
          }
        }).catch(error => {
          console.warn('❌ Intro: Coverage data loading failed, continuing without coverage data:', error);
        });

      } catch (error) {
        console.error('Error in Intro coverage data loading:', error);
      }
    },
    onExit() {
      try {
        // Remove coverage layers
        removeIntroCoverageLayers();
        
        // Standard mini-map cleanup
        miniMaps.forEach((m, i) => {
          m.getContainer().style.visibility = 'hidden';
          document.getElementById(`legend-${i + 1}`).style.display = 'none';
          document.getElementById(`daterange-${i + 1}`).style.display = 'none';
        });
        
        document.getElementById('mini-maps-container').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        document.getElementById('map-legend').style.display = 'block';
        document.getElementById('date-range').style.display = 'block';
        
        map.resize();
      } catch (error) {
        console.error('Error in Intro onExit:', error);
      }
    }
  },

  chapter1: {
    config: { center: [-60.7328, 11.1762], zoom: 11.5, pitch: 0, bearing: 0 },
    legend: '<span style="color: #ffd700; font-weight: 600;">Gulfstream Wreck Site & Oil Contamination Zone</span>',
    dateRange: 'Feb 7 2024 – Apr 27 2025',
    async onEnter() {
      console.log('Entering chapter1');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1200 });
      
      if (currentChapter !== 'chapter1') return;
      
      document.getElementById('bar-chart-overlay').style.display = 'block';
      
      safeTimeout(() => {
        if (currentChapter !== 'chapter1') return;
        
        if (map.getLayer('oilspill-fill')) map.setLayoutProperty('oilspill-fill', 'visibility', 'visible');
        if (map.getLayer('oilspill-line')) map.setLayoutProperty('oilspill-line', 'visibility', 'visible');
        
        if (window.animateChapter1Crash) {
          animateChapter1Crash(map);
        }
      }, 200);
    },
    onExit() {
      if (map.getLayer('oilspill-fill')) map.setLayoutProperty('oilspill-fill', 'visibility', 'none');
      if (map.getLayer('oilspill-line')) map.setLayoutProperty('oilspill-line', 'visibility', 'none');
      if (window.clearChapter1) clearChapter1(map);
      document.getElementById('bar-chart-overlay').style.display = 'none';
    }
  },

  // UPDATED CHAPTER 2 with Venezuela integration
  chapter2: {
    config: { center: [-66.28, 10.91], zoom: 4.89, pitch: 0, bearing: -8.8 },
    legend: '<span style="color: #ffd700; font-weight: 600;">Venezuela STS Detection & Dark Fleet Tracking</span>',
    dateRange: 'Apr 2024 – May 31 2024',
    async onEnter() {
      console.log('Entering chapter2 - Venezuela STS Operations');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1200 });
      
      if (currentChapter !== 'chapter2') return;
      
      // Show Venezuela polygon layers
      if (map.getLayer('venezuela-fill')) {
        map.setLayoutProperty('venezuela-fill', 'visibility', 'visible');
      }
      if (map.getLayer('venezuela-border')) {
        map.setLayoutProperty('venezuela-border', 'visibility', 'visible');
      }
      
      // Start Venezuela annotations animation
      safeTimeout(() => {
        if (currentChapter !== 'chapter2') return;
        if (window.animateChapter2Venezuela) {
          console.log('Starting Chapter 2 Venezuela animation...');
          animateChapter2Venezuela(map);
        } else {
          console.warn('animateChapter2Venezuela function not found');
        }
      }, 500);
    },
    onExit() {
      console.log('Exiting chapter2');
      // Hide Venezuela layers
      if (map.getLayer('venezuela-fill')) {
        map.setLayoutProperty('venezuela-fill', 'visibility', 'none');
      }
      if (map.getLayer('venezuela-border')) {
        map.setLayoutProperty('venezuela-border', 'visibility', 'none');
      }
      // Clear Venezuela annotations
      if (window.clearChapter2Venezuela) {
        clearChapter2Venezuela(map);
      }
    }
  },

  chapter3: {
    config: { center: [11.95, 47.87], zoom: 3.43, pitch: 0, bearing: 3 },
    legend: 'Assessed Submarine Course',
    dateRange: 'Aug 21 2024 – Sep 21 2024',
    async onEnter() {
      console.log('Entering chapter3');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1200 });
      
      if (currentChapter !== 'chapter3') return;
      
      if (map.getLayer('submarine-path')) map.setLayoutProperty('submarine-path', 'visibility', 'visible');
      
      safeTimeout(() => {
        if (currentChapter !== 'chapter3') return;
        if (window.animateChapter3Markers) {
          animateChapter3Markers(map);
        }
      }, 200);
    },
    onExit() {
      if (map.getLayer('submarine-path')) map.setLayoutProperty('submarine-path', 'visibility', 'none');
      if (window.clearChapter3) clearChapter3(map);
    }
  },

  chapter4: {
    config: { center: [-5.284,36.058], zoom: 7.4, pitch: 0, bearing: 3 },
    legend: '<span style="color: #62fda0; font-weight: 600;">Sakarya</span> & <span style="color: #57aeff; font-weight: 600;">Atila</span> <span style="color: #ffd700; font-weight: 600;">– AIS Path STS Operations</span>',
    dateRange: 'Nov 6 2024 – Nov 12 2024',
    async onEnter() {
      console.log('Entering chapter4');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1100 });
      
      if (currentChapter !== 'chapter4') return;
      
      if (map.getLayer('sakarya-line')) map.setLayoutProperty('sakarya-line', 'visibility', 'visible');
      if (map.getLayer('atila-line')) map.setLayoutProperty('atila-line', 'visibility', 'visible');
      
      safeTimeout(() => {
        if (currentChapter !== 'chapter4') return;
        if (window.animateChapter4) animateChapter4(map);
      }, 500);
    },
    onExit() {
      if (map.getLayer('sakarya-line')) map.setLayoutProperty('sakarya-line', 'visibility', 'none');
      if (map.getLayer('atila-line')) map.setLayoutProperty('atila-line', 'visibility', 'none');
      if (window.clearChapter4STS) clearChapter4STS(map);
    }
  },

  chapter5: {
    config: { center: [52.2,37.1 ], zoom: 1.62, pitch: 0, bearing: 0 },
    legend: '<span style="color: #62fda0; font-weight: 600;">Sakarya</span> & <span style="color: #57aeff; font-weight: 600;">Atila</span><span style="color: #ffd700; font-weight: 600;">– Post-STS Dispersal Routes</span>',
    dateRange: 'Nov 9 2024 – Dec 6 2024',
    async onEnter() {
      console.log('Entering chapter5');
      comprehensiveCleanup();
      await camera.flyTo(this.config, { duration: 1300 });
      
      if (currentChapter !== 'chapter5') return;
      
      if (map.getLayer('atila-line')) map.setLayoutProperty('atila-line', 'visibility', 'visible');
      if (map.getLayer('sakarya-line')) map.setLayoutProperty('sakarya-line', 'visibility', 'visible');
      setLegend(this.legend);
      setDateRange(this.dateRange);
      if (window.animateChapter5) animateChapter5(map);
    },
    onExit() {
      if (map.getLayer('atila-line')) map.setLayoutProperty('atila-line', 'visibility', 'none');
      if (map.getLayer('sakarya-line')) map.setLayoutProperty('sakarya-line', 'visibility', 'none');
      if (window.clearChapter5) clearChapter5(map);
    }
  },

  // UPDATED CHAPTER 6 with vessel data layers - SAFE VERSION
  chapter6: {
    config: { center: [0, 0], zoom: 1, pitch: 0, bearing: 0 },
    legend: '',
    dateRange: '',
    async onEnter() {
      console.log('Entering chapter6 - Dark LNG (safe version)');
      comprehensiveCleanup();
      
      try {
        document.getElementById('map').style.display = 'none';
        document.getElementById('map-legend').style.display = 'none';
        document.getElementById('date-range').style.display = 'none';
        document.getElementById('mini-maps-container').style.display = 'grid';

        // Chapter 6 configurations - first show basic mini-maps
        const configs = [
          { 
            center: [35.803,73.989], 
            zoom: 6.26, 
            legend: '<span style="color: #62fda0; font-weight: 600;">Pioneer</span> <span style="color: #ffd700; font-weight: 600;">- Symmetrical AIS Spoofing</span>', 
            date: '1 - 6 Aug 2024'
          },
          { 
            center: [35.408,74.148], 
            zoom: 6.3, 
            legend: '<span style="color: #62fda0; font-weight: 600;">Asya Energy</span><span style="color: #ffd700; font-weight: 600;">- Asymmetrical AIS Spoofing</span>', 
            date: '2 -15 Aug 2024'
          },
          { 
            center: [47.83, 73.6], 
            zoom: 3.2, 
            legend: '<span style="color: #62fda0; font-weight: 600;">Everest Energy</span> - <span style="color: #ffd700; font-weight: 600;">- AIS Switched Off for a brief time (Dark AIS) </span>', 
            date: '20 - 25 Aug 2024'
          },
          { 
            center: [47.83, 73.6], 
            zoom: 2.8, 
            legend: '<span style="color: #62fda0; font-weight: 600;">Mulan</span><span style="color: #ffd700; font-weight: 600;">- Loitering Ballast for days before picking up cargo from ALNG2   </span>', 
            date: 'Sept 17 – Dec 31 2024'
          }
        ];

        // Show mini-maps first
            // Show mini-maps first
configs.forEach((cfg, i) => {
  try {
    miniMaps[i].getContainer().style.visibility = 'visible';
    miniMaps[i].jumpTo({ center: cfg.center, zoom: cfg.zoom });
    miniMaps[i].resize();
    
    document.getElementById(`legend-${i + 1}`).innerHTML = cfg.legend;  // CHANGED: innerText to innerHTML
    document.getElementById(`legend-${i + 1}`).style.display = 'block';
    document.getElementById(`daterange-${i + 1}`).innerText = cfg.date;
    document.getElementById(`daterange-${i + 1}`).style.display = 'block';
  } catch (e) {
    console.warn(`Error setting up mini-map ${i + 1}:`, e);
  }
});
          

        // FAST LOADING: Start vessel data loading immediately in parallel
        Promise.all([
          // Wait for mini-maps to be ready (parallel)
          Promise.all(miniMaps.map((miniMap, i) => {
            return new Promise(resolve => {
              if (miniMap && (miniMap.loaded() && miniMap.isStyleLoaded())) {
                resolve();
              } else if (miniMap) {
                const checkReady = () => {
                  if (miniMap.loaded() && miniMap.isStyleLoaded()) {
                    resolve();
                  } else {
                    setTimeout(checkReady, 50); // Check every 50ms
                  }
                };
                checkReady();
              } else {
                resolve();
              }
            });
          })),
          // Start loading vessel data immediately (parallel)
          loadChapter6VesselData()
        ]).then(() => {
          // Only proceed if still on Chapter 6
          if (currentChapter === 'chapter6') {
            console.log('🚢 Chapter 6: Fast loading complete, adding layers...');
            addChapter6VesselLayers();
            console.log('✅ Chapter 6: Vessel layers added successfully');
          }
        }).catch(error => {
          console.warn('❌ Chapter 6: Fast loading failed, continuing without vessel data:', error);
        });

      } catch (error) {
        console.error('Error in Chapter 6 onEnter:', error);
        // Fallback: show basic mini-maps without vessel data
        this.showBasicMiniMaps();
      }
    },
    
    // Fallback method for basic mini-maps
    showBasicMiniMaps() {
      console.log('Showing basic Chapter 6 mini-maps (fallback)');
      const configs = [
        { center: [40.72, 70.8], zoom: 4.48, legend: 'Pioneer Tanker', date: 'August 2024' },
        { center: [34.31, 70.43], zoom: 4.87, legend: 'Asya Energy', date: 'August 2024' },
        { center: [45.96, 72.26], zoom: 3.48, legend: 'Everest Energy', date: '20 - 25 Aug 2024' },
        { center: [50.12, 73.72], zoom: 3.48, legend: 'Mulan', date: 'Sept 17 – Dec 31 2024' }
      ];

      configs.forEach((cfg, i) => {
        miniMaps[i].getContainer().style.visibility = 'visible';
        miniMaps[i].jumpTo({ center: cfg.center, zoom: cfg.zoom });
        miniMaps[i].resize();
        
        document.getElementById(`legend-${i + 1}`).innerText = cfg.legend;
        document.getElementById(`legend-${i + 1}`).style.display = 'block';
        document.getElementById(`daterange-${i + 1}`).innerText = cfg.date;
        document.getElementById(`daterange-${i + 1}`).style.display = 'block';
      });
    },

    onExit() {
      try {
        // Remove vessel layers safely
        removeChapter6VesselLayers();
        
        // Standard mini-map cleanup
        miniMaps.forEach((m, i) => {
          m.getContainer().style.visibility = 'hidden';
          document.getElementById(`legend-${i + 1}`).style.display = 'none';
          document.getElementById(`daterange-${i + 1}`).style.display = 'none';
        });
        
        document.getElementById('mini-maps-container').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        document.getElementById('map-legend').style.display = 'block';
        document.getElementById('date-range').style.display = 'block';
        
        map.resize();
      } catch (error) {
        console.error('Error in Chapter 6 onExit:', error);
      }
    }
  },

  chapter7: {
    config: { center: [39.92, 25.76], zoom: 4.44, pitch: 0, bearing: 30 },
    legend: '<span style="color: #ffd700; font-weight: 600;">MV Tutor Track & Final Position Analysis</span>',
    dateRange: 'Jun 8 2024 – Jun 18 2024',
    async onEnter() {
      console.log('Entering chapter7');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1200 });
      
      if (currentChapter !== 'chapter7') return;
      
      if (window.animateTutorPath) animateTutorPath(map);
    },
    onExit() {
      if (window.clearChapter7) clearChapter7(map);
    }
  },

  chapter8: {
    config: { center: [49.21, 16.29], zoom: 4, pitch: 0, bearing: 3 },
    legend: '<span style="color: #ffd700; font-weight: 600;">Rubymar Satellite-based damage assessment and ecological impact tracking</span>',
    dateRange: 'Feb 18 2024 – Mar 2 2024',
    async onEnter() {
      console.log('Entering chapter8');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1200 });
      
      if (currentChapter !== 'chapter8') return;
      
      if (window.animateRubymarPath) animateRubymarPath(map);
    },
    onExit() {
      if (window.clearChapter8) clearChapter8(map);
    }
  },

  chapter9: {
    config: { center: [56.285, 26.174], zoom: 6.72, pitch: 0, bearing: 0 },
    legend: 'MSC Aries – AIS Course & Assessed Course',
    dateRange: 'Apr 12 2024 – Oct 2024',
    async onEnter() {
      console.log('Entering chapter9');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1100 });
      
      if (currentChapter !== 'chapter9') return;
      
      if (map.getLayer('mscaries-course-line')) map.setLayoutProperty('mscaries-course-line', 'visibility', 'visible');
      if (map.getLayer('mscaries-assessed-line')) map.setLayoutProperty('mscaries-assessed-line', 'visibility', 'visible');
      
      safeTimeout(() => {
        if (currentChapter !== 'chapter9') return;
        if (window.animateMscAriesPoints) animateMscAriesPoints(map);
      }, 500);
    },
    onExit() {
      if (map.getLayer('mscaries-course-line')) map.setLayoutProperty('mscaries-course-line', 'visibility', 'none');
      if (map.getLayer('mscaries-assessed-line')) map.setLayoutProperty('mscaries-assessed-line', 'visibility', 'none');
      if (window.clearChapter9) clearChapter9(map);
    }
  },

  chapter10: {
    config: { center: [104.0, 2.5], zoom: 6, pitch: 0, bearing: 0 },
    legend: 'ANSHUN II – Multisource Tracking',
    dateRange: 'Jul 1 2024 – Aug 7 2024',
    async onEnter() {
      console.log('Entering chapter10');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1100 });
      
      if (currentChapter !== 'chapter10') return;
      
      if (map.getLayer('anshun2-line')) map.setLayoutProperty('anshun2-line', 'visibility', 'visible');
      
      if (window.animateAnshunPath) animateAnshunPath(map);
    },
    onExit() {
      if (map.getLayer('anshun2-line')) map.setLayoutProperty('anshun2-line', 'visibility', 'none');
      if (window.clearChapter10) clearChapter10(map);
    }
  },

  chapter11: {
    config: { center: [113.6742, 21.9049], zoom: 8.5, pitch: 0, bearing: 70.4 },
    legend: '<span style="color: #ffd700; font-weight: 600;">Assessed Sea Trial Area - Chinese Amphibious Assault Barges</span>',
    dateRange: 'Dec 1 2024 – Jan 20 2025',
    async onEnter() {
      console.log('Entering chapter11 - Sea Trials');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1300 });
      
      if (currentChapter !== 'chapter11') return;
      
      if (map.getLayer('sea-trial-area')) {
        map.setLayoutProperty('sea-trial-area', 'visibility', 'visible');
      }
      
      safeTimeout(() => {
        if (currentChapter !== 'chapter11') return;
        if (window.animateChapter11SeaTrials) {
          console.log('Starting Chapter 11 sea trials animation...');
          animateChapter11SeaTrials(map);
        } else {
          console.warn('animateChapter11SeaTrials function not found');
        }
      }, 600);
    },
    onExit() {
      console.log('Exiting chapter11');
      if (map.getLayer('sea-trial-area')) {
        map.setLayoutProperty('sea-trial-area', 'visibility', 'none');
      }
      if (window.clearChapter11) {
        clearChapter11(map);
      }
    }
  },

  chapter12: {
    config: { center: [115.0, 12.0], zoom: 4.5, pitch: 0, bearing: 0 },
    legend: '<span style="color: #ffd700; font-weight: 600;">South China Sea - Contested Territories & Key Incidents</span>',
    dateRange: 'Oct - Dec 2024',
    async onEnter() {
      console.log('Entering chapter12 - Contested Islands with Territories');
      comprehensiveCleanup();
      
      await camera.flyTo(this.config, { duration: 1300 });
      
      if (currentChapter !== 'chapter12') return;
      
      if (map.getLayer('asia-territories-fill')) {
        map.setLayoutProperty('asia-territories-fill', 'visibility', 'visible');
      }
      if (map.getLayer('asia-territories-border')) {
        map.setLayoutProperty('asia-territories-border', 'visibility', 'visible');
      }
      if (map.getLayer('asia-territories-labels')) {
        map.setLayoutProperty('asia-territories-labels', 'visibility', 'visible');
      }
      if (map.getLayer('sea-trial-area')) {
        map.setLayoutProperty('sea-trial-area', 'visibility', 'none');
      }
      
      safeTimeout(() => {
        if (currentChapter !== 'chapter12') return;
        if (window.animateChapter12ContestedIslands) {
          console.log('Starting Chapter 12 contested islands animation...');
          animateChapter12ContestedIslands(map);
        } else {
          console.warn('animateChapter12ContestedIslands function not found');
        }
      }, 600);
    },
    onExit() {
      console.log('Exiting chapter12');
      if (map.getLayer('asia-territories-fill')) {
        map.setLayoutProperty('asia-territories-fill', 'visibility', 'none');
      }
      if (map.getLayer('asia-territories-border')) {
        map.setLayoutProperty('asia-territories-border', 'visibility', 'none');
      }
      if (map.getLayer('asia-territories-labels')) {
        map.setLayoutProperty('asia-territories-labels', 'visibility', 'none');
      }
      if (window.clearChapter12) {
        clearChapter12(map);
      }
    }
  },
};

// 18. Enhanced Scrollama setup with better transition handling
function setupScrollama() {
  const scroller = scrollama();
  
  scroller
    .setup({ 
      step: '.step', 
      offset: 0.5, // Reduced from 0.6 to trigger Chapter 6 earlier
      debug: false 
    })
    .onStepEnter(async resp => {
      const id = resp.element.dataset.chapter;
      
      // Prevent rapid transitions but allow Chapter 6 to load properly
      if (isTransitioning && id !== 'chapter6') return;
      if (id === currentChapter) return;

      console.log(`Chapter transition: ${currentChapter} -> ${id}`);
      
      // For Chapter 6, reduce transition protection to allow faster entry
      const transitionDelay = id === 'chapter6' ? 50 : 100;
      
      isTransitioning = true;
      
      try {
        if (currentChapter && chapters[currentChapter] && chapters[currentChapter].onExit) {
          await chapters[currentChapter].onExit();
        }

        currentChapter = id;
        
        if (!chapters[id]) {
          console.error(`Chapter ${id} not found!`);
          return;
        }
        
        setLegend(chapters[id].legend || '');
        setDateRange(chapters[id].dateRange || '');

        if (chapters[id].onEnter) {
          await chapters[id].onEnter();
        }

        window.dispatchEvent(new CustomEvent('chapterChanged', {
          detail: { chapter: id }
        }));
        
      } catch (error) {
        console.error('Error during chapter transition:', error);
      } finally {
        setTimeout(() => {
          isTransitioning = false;
        }, transitionDelay);
      }
    });

  window.addEventListener('resize', () => {
    if (map) map.resize();
    miniMaps.forEach(m => m.resize());
    scroller.resize();
  });
}

// 19. Export for debugging
window.debugMap = {
  map: () => map,
  camera: () => camera,
  loaded: () => mapLoaded,
  cleanup: () => comprehensiveCleanup(),
  chapters: chapters,
  currentChapter: () => currentChapter,
  isTransitioning: () => isTransitioning,
  clearTimeouts: clearAllTimeouts,
  miniMaps: () => miniMaps,
  loadChapter6Data: loadChapter6VesselData,
  addChapter6Layers: addChapter6VesselLayers,
  removeChapter6Layers: removeChapter6VesselLayers,
  // NEW: Intro coverage debugging
  loadIntroCoverage: loadIntroCoverageData,
  addIntroCoverage: addIntroCoverageLayers,
  removeIntroCoverage: removeIntroCoverageLayers
};

// ═══════════════════════════════════════════════════════════
// 🚀 ESSENTIAL MAP.JS ENHANCEMENTS FOR MARITIME INTELLIGENCE
// ═══════════════════════════════════════════════════════════

// 1. 📊 PROGRESS TRACKER - Shows chapter completion
class ChapterProgressTracker {
  constructor() {
    this.totalChapters = 12;
    this.currentProgress = 0;
  }
  
  updateProgress(chapterNumber) {
    this.currentProgress = (chapterNumber / this.totalChapters) * 100;
    
    // Update CSS progress bar
    const progressBar = document.querySelector('.chapter-progress');
    if (progressBar) {
      progressBar.style.setProperty('--progress-width', `${this.currentProgress}%`);
    }
    
    console.log(`📊 Progress: ${Math.round(this.currentProgress)}% (Chapter ${chapterNumber}/${this.totalChapters})`);
  }
}

// 2. 🎬 ENHANCED CAMERA - Cinematic map transitions
class NextLevelCinematicCamera extends CinematicCamera {
  constructor(map) {
    super(map);
    this.isAnimating = false;
  }
  
  async dramaticZoom(config, options = {}) {
    this.isAnimating = true;
    
    // Stage 1: Overshoot zoom (like camera focusing)
    await this.flyTo({
      ...config,
      zoom: config.zoom + 2, // Zoom in too far
      duration: options.duration * 0.6 || 600
    });
    
    // Stage 2: Settle to final position
    await this.flyTo({
      ...config,
      duration: options.duration * 0.4 || 400
    });
    
    this.isAnimating = false;
  }
  
  async intelligenceReveal(config, options = {}) {
    // Start high up (satellite view)
    await this.flyTo({
      ...config,
      pitch: 45,
      zoom: config.zoom - 1,
      duration: options.duration * 0.5 || 500
    });
    
    // Descend to operational view
    await this.flyTo({
      ...config,
      pitch: 0,
      duration: options.duration * 0.5 || 500
    });
  }
  
  pulseEffect(intensity = 1.2, duration = 600) {
    const currentZoom = this.map.getZoom();
    
    // Zoom in slightly
    this.map.easeTo({
      zoom: currentZoom * intensity,
      duration: duration / 2
    });
    
    // Zoom back out
    setTimeout(() => {
      this.map.easeTo({
        zoom: currentZoom,
        duration: duration / 2
      });
    }, duration / 2);
  }
}

// 3. 🚀 SMART PRELOADER - Loads next chapter in background
class IntelligentPreloader {
  constructor() {
    this.preloadedChapters = new Set();
    this.preloadCache = new Map();
  }
  
  async preloadNextChapter(currentChapter) {
    const nextChapterNum = parseInt(currentChapter.replace('chapter', '')) + 1;
    const nextChapterId = `chapter${nextChapterNum}`;
    
    if (nextChapterNum <= 12 && !this.preloadedChapters.has(nextChapterId)) {
      console.log(`🚀 Preloading ${nextChapterId}...`);
      
      // Preload data for next chapter
      const nextChapterConfig = chapters[nextChapterId];
      if (nextChapterConfig) {
        await this.preloadChapterData(nextChapterId);
        this.preloadedChapters.add(nextChapterId);
      }
    }
  }
  
  async preloadChapterData(chapterId) {
    // Define which data files each chapter needs
    const chapterDataFiles = {
      'chapter1': ['data/oilspillfinal1.geojson'],
      'chapter2': ['data/venezuela.geojson'],
      'chapter3': ['data/novorossiysk.geojson'],
      'chapter4': ['data/final-sakarya_pathoct26dec6.geojson', 'data/final-atilaoct26dec6.geojson'],
      'chapter5': ['data/final-sakarya_pathoct26dec6.geojson', 'data/final-atilaoct26dec6.geojson'],
      'chapter7': ['data/mv_tutor_path.geojson'],
      'chapter9': ['data/mscaries_course.geojson', 'data/mscaries_assessed_course.geojson'],
      'chapter10': ['data/anshun2.geojson'],
      'chapter11': ['data/assessedseatrialarea.geojson'],
      'chapter12': ['data/asia_territories.geojson']
    };
    
    const files = chapterDataFiles[chapterId] || [];
    
    try {
      const promises = files.map(file => 
        fetch(file).then(response => {
          if (response.ok) return response.json();
          throw new Error(`Failed to load ${file}`);
        })
      );
      
      const data = await Promise.all(promises);
      this.preloadCache.set(chapterId, data);
      console.log(`✅ Preloaded data for ${chapterId}`);
    } catch (error) {
      console.warn(`❌ Failed to preload ${chapterId}:`, error);
    }
  }
  
  getPreloadedData(chapterId) {
    return this.preloadCache.get(chapterId);
  }
}

// 4. 🔄 LAYER TRANSITION MANAGER - Smooth fade effects
class LayerTransitionManager {
  constructor(map) {
    this.map = map;
    this.activeTransitions = new Set();
  }
  
  async smoothLayerTransition(fromLayers, toLayers, duration = 600) {
    const transitionId = Math.random().toString(36).substr(2, 9);
    this.activeTransitions.add(transitionId);
    
    console.log(`🔄 Transitioning layers: ${fromLayers.join(', ')} → ${toLayers.join(', ')}`);
    
    // Fade out old layers
    const fadeOutPromises = fromLayers.map(layerId => 
      this.fadeLayer(layerId, 0, duration / 2)
    );
    
    await Promise.all(fadeOutPromises);
    
    // Hide old layers and show new ones
    fromLayers.forEach(layerId => {
      if (this.map.getLayer(layerId)) {
        this.map.setLayoutProperty(layerId, 'visibility', 'none');
      }
    });
    
    toLayers.forEach(layerId => {
      if (this.map.getLayer(layerId)) {
        this.map.setLayoutProperty(layerId, 'visibility', 'visible');
        this.map.setPaintProperty(layerId, this.getOpacityProperty(layerId), 0);
      }
    });
    
    // Fade in new layers
    const fadeInPromises = toLayers.map(layerId => 
      this.fadeLayer(layerId, 1, duration / 2)
    );
    
    await Promise.all(fadeInPromises);
    this.activeTransitions.delete(transitionId);
  }
  
  fadeLayer(layerId, targetOpacity, duration) {
    return new Promise(resolve => {
      if (!this.map.getLayer(layerId)) {
        resolve();
        return;
      }
      
      const opacityProperty = this.getOpacityProperty(layerId);
      const startOpacity = this.map.getPaintProperty(layerId, opacityProperty) || 0;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress * (2 - progress); // Ease out
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * easeProgress;
        
        this.map.setPaintProperty(layerId, opacityProperty, currentOpacity);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  }
  
  getOpacityProperty(layerId) {
    const layer = this.map.getLayer(layerId);
    if (!layer) return 'opacity';
    
    const type = layer.type;
    switch (type) {
      case 'line': return 'line-opacity';
      case 'fill': return 'fill-opacity';
      case 'circle': return 'circle-opacity';
      case 'symbol': return 'text-opacity';
      default: return 'opacity';
    }
  }
}

// 5. 📱 MOBILE OPTIMIZER - Performance optimization for mobile
class MobileOptimizer {
  constructor() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
    this.isLowPower = navigator.hardwareConcurrency < 4;
    this.optimizations = new Set();
  }
  
  applyOptimizations() {
    if (this.isMobile || this.isLowPower) {
      console.log('📱 Applying mobile optimizations...');
      
      // Reduce transition durations for mobile
      document.documentElement.style.setProperty('--mobile-transition-speed', '0.3s');
      
      // Disable heavy animations
      this.optimizations.add('reduced-animations');
      
      // Simplify layer transitions
      this.optimizations.add('fast-transitions');
      
      console.log('✅ Mobile optimizations applied');
    }
  }
  
  isOptimizationActive(optimization) {
    return this.optimizations.has(optimization);
  }
  
  getMobileTransitionDuration() {
    return this.isMobile ? 400 : 800; // Faster on mobile
  }
}

// 6. 🚀 INITIALIZE ESSENTIAL SYSTEMS
function initializeEssentialSystems() {
  console.log('🚀 Initializing essential maritime systems...');
  
  // Replace the basic camera with enhanced version
  camera = new NextLevelCinematicCamera(map);
  
  // Initialize all systems
  const progressTracker = new ChapterProgressTracker();
  const preloader = new IntelligentPreloader();
  const layerManager = new LayerTransitionManager(map);
  const mobileOptimizer = new MobileOptimizer();
  
  // Apply mobile optimizations immediately
  mobileOptimizer.applyOptimizations();
  
  // Store globally for access
  window.maritimeEnhancements = {
    progressTracker,
    preloader,
    layerManager,
    mobileOptimizer
  };
  
  console.log('✅ Essential systems initialized!');
}

// 7. 🔧 ENHANCED CHAPTER TRANSITIONS
async function enhancedChapterTransition(fromChapter, toChapter) {
  console.log(`🔄 Enhanced transition: ${fromChapter} → ${toChapter}`);
  
  // Update progress tracker
  const chapterNum = parseInt(toChapter.replace('chapter', '')) || 0;
  if (window.maritimeEnhancements?.progressTracker) {
    window.maritimeEnhancements.progressTracker.updateProgress(chapterNum);
  }
  
  // Start preloading next chapter
  if (window.maritimeEnhancements?.preloader) {
    window.maritimeEnhancements.preloader.preloadNextChapter(toChapter);
  }
  
  // Enhanced camera movement
  if (chapters[toChapter] && chapters[toChapter].config && camera) {
    const config = chapters[toChapter].config;
    const mobileOptimizer = window.maritimeEnhancements?.mobileOptimizer;
    const duration = mobileOptimizer ? mobileOptimizer.getMobileTransitionDuration() : 800;
    
    // Use dramatic zoom for important chapters
    const dramaticChapters = ['chapter1', 'chapter7', 'chapter8', 'chapter12'];
    if (dramaticChapters.includes(toChapter)) {
      await camera.dramaticZoom(config, { duration });
    } else {
      await camera.intelligenceReveal(config, { duration });
    }
  }
}

// 8. 🎯 INTEGRATE WITH EXISTING SCROLLAMA
// Modify the existing chapter transition in setupScrollama
function enhanceScrollamaTransitions() {
  // Find the existing scroller setup and enhance it
  const originalOnStepEnter = async (resp) => {
    const id = resp.element.dataset.chapter;
    
    if (isTransitioning || id === currentChapter) return;
    
    console.log(`📍 Chapter transition triggered: ${currentChapter} → ${id}`);
    
    isTransitioning = true;
    
    try {
      // Run enhanced transition
      await enhancedChapterTransition(currentChapter, id);
      
      // Continue with original chapter logic
      if (currentChapter && chapters[currentChapter] && chapters[currentChapter].onExit) {
        await chapters[currentChapter].onExit();
      }

      currentChapter = id;
      
      if (!chapters[id]) {
        console.error(`Chapter ${id} not found!`);
        return;
      }
      
      setLegend(chapters[id].legend || '');
      setDateRange(chapters[id].dateRange || '');

      if (chapters[id].onEnter) {
        await chapters[id].onEnter();
      }

      window.dispatchEvent(new CustomEvent('chapterChanged', {
        detail: { chapter: id }
      }));
      
    } catch (error) {
      console.error('Error during enhanced chapter transition:', error);
    } finally {
      const transitionDelay = id === 'chapter6' ? 50 : 100;
      setTimeout(() => {
        isTransitioning = false;
      }, transitionDelay);
    }
  };
  
  // Return the enhanced function for use in setupScrollama
  return originalOnStepEnter;
}

// 9. 🚀 AUTO-INITIALIZE WHEN MAP LOADS
// Add this to your existing map.on('load') callback
function initializeEnhancementsOnMapLoad() {
  if (mapLoaded) {
    // Initialize enhanced systems
    initializeEssentialSystems();
    
    // Start preloading intro data
    if (window.maritimeEnhancements?.preloader) {
      window.maritimeEnhancements.preloader.preloadNextChapter('intro');
    }
  }
}

// 10. 📊 PROGRESS BAR CSS INTEGRATION
// Add this CSS to make progress bar work
const progressBarCSS = `
.chapter-progress::before {
  width: var(--progress-width, 0%);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
`;

// Inject CSS
if (!document.getElementById('progress-bar-styles')) {
  const style = document.createElement('style');
  style.id = 'progress-bar-styles';
  style.textContent = progressBarCSS;
  document.head.appendChild(style);
}

// 11. 🎯 READY TO USE
console.log('🌊 Essential maritime intelligence enhancements loaded and ready!');

// Initialize when map is ready
if (typeof map !== 'undefined' && map.loaded()) {
  initializeEnhancementsOnMapLoad();
} else {
  // Wait for map to load
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof map !== 'undefined') {
      map.on('load', initializeEnhancementsOnMapLoad);
    }
  });
}
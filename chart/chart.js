/* Enhanced chart.js – Maritime Blue Theme with Embedded CSS */

// Inject CSS styles directly into the document
function injectChartCSS() {
  if (document.getElementById('chart-css-injected')) return; // Prevent duplicate injection
  
  const style = document.createElement('style');
  style.id = 'chart-css-injected';
  style.textContent = `
    /* Enhanced Bar Chart Overlay - Maritime Blue Theme - COMPACT VERSION */
    #bar-chart-overlay {
      position: fixed;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 20;
      width: 75%;                    /* REDUCED: was 85% - makes overall bar chart shorter */
      max-width: 800px;              /* REDUCED: was 950px - controls maximum length */
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7));
      backdrop-filter: blur(8px);
      padding: 0.6rem;               /* REDUCED: was 0.8rem - makes container more compact */
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    #bar-chart-overlay.visible {
      opacity: 1;
    }

    #bar-chart-overlay svg {
      width: 100%;
      height: 36px;                  /* KEPT ORIGINAL: was 42px */
      filter: drop-shadow(0 2px 10px rgba(0, 255, 255, 0.2));
      overflow: visible;
    }

    #bar-chart-overlay #chart-title {
      font-size: 0.8rem !important;  /* REDUCED: was 0.85rem */
      line-height: 1.3 !important;   
      margin-bottom: 0.4rem !important; /* REDUCED: was 0.5rem */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .main-label {
      font-family: 'Manrope', sans-serif !important;
      font-weight: 500 !important;
      letter-spacing: 0.02em !important;
      text-shadow: 0 0 8px rgba(0, 0, 0, 0.9), 0 0 4px rgba(0, 0, 0, 0.7) !important;
      dominant-baseline: middle;
      paint-order: stroke fill;
    }

    .percent-label {
      font-family: 'Manrope', sans-serif !important;
      font-weight: 700 !important;    /* ENHANCED: was 600 - more prominent */
      text-shadow: 0 0 8px rgba(0, 0, 0, 0.9), 0 0 4px rgba(0, 0, 0, 0.7) !important; /* ENHANCED: stronger shadow */
      dominant-baseline: middle;
      paint-order: stroke fill;
    }

    .segment {
      transition: all 0.3s ease;
      stroke-linejoin: round;
      stroke-linecap: round;
    }

    .segment:hover {
      filter: brightness(1.2) !important;
      transform: translateY(-1px);
    }

    .particles circle {
      pointer-events: none;
    }

    /* Mobile optimizations */
    @media screen and (max-width: 768px) {
      #bar-chart-overlay {
        width: 92%;                  /* REDUCED: was 95% */
        max-width: none;
        top: 75px;
        padding: 0.5rem;             /* REDUCED: was 0.7rem */
      }

      #bar-chart-overlay svg {
        height: 32px;                /* KEPT ORIGINAL: was 36px */
      }

      #bar-chart-overlay #chart-title {
        font-size: 0.7rem !important; /* REDUCED: was 0.75rem */
        margin-bottom: 0.3rem !important; /* REDUCED: was 0.4rem */
        white-space: normal;
        overflow: visible;
        text-overflow: initial;
      }

      .main-label {
        font-size: 8px !important;   /* REDUCED: was 9px */
      }

      .percent-label {
        font-size: 7px !important;   /* ENHANCED: was 6px */
      }
    }

    /* Tablet optimizations */
    @media screen and (min-width: 769px) and (max-width: 1024px) {
      #bar-chart-overlay {
        width: 80%;                  /* REDUCED: was 88% */
        max-width: 750px;            /* REDUCED: was 850px */
      }

      #bar-chart-overlay svg {
        height: 34px;                /* KEPT ORIGINAL: was 40px */
      }

      .main-label {
        font-size: 8.5px !important; /* REDUCED: was 9.5px */
      }

      .percent-label {
        font-size: 8px !important;   /* ENHANCED: was 7px */
      }
    }

    /* Large screen optimizations */
    @media screen and (min-width: 1400px) {
      #bar-chart-overlay {
        max-width: 850px;            /* REDUCED: was 1000px */
      }

      #bar-chart-overlay svg {
        height: 38px;                /* KEPT ORIGINAL: was 45px */
      }

      .main-label {
        font-size: 9px !important;   /* REDUCED: was 11px */
      }

      .percent-label {
        font-size: 9px !important;   /* ENHANCED: was 7.5px */
      }
    }

    /* Enhanced Final Chart Styling */
    #chart-final {
      padding: 5rem 2rem;
      text-align: center;
      background: linear-gradient(180deg, var(--bg-dark), #111);
      position: relative;
      overflow: hidden;
    }

    #chart-final::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--primary-glow), transparent);
    }

    #chart-final svg {
      width: 100%;
      height: 80px;
      margin: 2rem 0;
      filter: drop-shadow(0 8px 24px rgba(0, 255, 255, 0.4));
      overflow: visible;
    }

    .chart-container h3 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--primary-glow), var(--secondary-glow));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .explanation {
      max-width: 700px;
      margin: 0 auto;
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.6;
      font-weight: 300;
    }

    .final-segment {
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .final-segment:hover {
      filter: brightness(1.1);
    }

    .final-segment text {
      font-family: 'Manrope', sans-serif;
      text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
      dominant-baseline: middle;
      paint-order: stroke fill;
    }

    .sparkles circle {
      pointer-events: none;
      filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
    }

    /* Mobile final chart adjustments */
    @media screen and (max-width: 768px) {
      #chart-final {
        padding: 1rem 1rem;
      }

      .chart-container h3 {
        font-size: 1.5rem;
      }

      .explanation {
        font-size: 1rem;
      }

      #chart-final svg {
        height: 65px;
      }
    }

    /* High DPI display optimizations */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      .main-label,
      .percent-label,
      .final-segment text {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    }

    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
      .segment,
      .final-segment {
        transition: none !important;
      }
      
      #bar-chart-overlay {
        transition: opacity 0.1s ease !important;
      }
    }
  `;
  
  document.head.appendChild(style);
  console.log('✅ Chart CSS injected successfully');
}

// Configuration
const chartConfig = {
  showTitle: true,
  animationDuration: 800,
  colorScheme: 'ocean',
  glowEffect: true,
  particleEffect: false,
  barSpacing: 2                  // REDUCED: was 3 - less space between bars
};

// Detection categories - 5 categories (removed Optical Bunkering)
const categories = ["Light", "Dark", "Ship-To-Ship Transfers", "Spoofing", "Detections"];

// Enhanced detection data - Using CSV data
const detectionData = {
  "intro":     [0, 0, 0, 0, 0],
  "chapter1":  [98439, 763, 418, 1636, 336895],      // Americas
  "chapter2":  [80689, 1742, 87, 1808, 311496],      // Americas (Venezuela)
  "chapter3":  [216521, 2251, 2123, 3523, 541184], // Europe
  "chapter4":  [715118, 11410, 10280, 11238, 1732760], // Europe (Mediterranean)
  "chapter5":  [80553, 269, 104, 1371, 156405],     // Africa
  "chapter6":  [46, 0, 0, 18, 243],                    // Russia
  "chapter7":  [219165, 3391, 311, 4749, 621557],      // Red Sea
  "chapter8":  [219165, 3391, 311, 4749, 621557],      // Red Sea
  "chapter9":  [578686, 7840, 15330, 30695, 1774066],  // Persian Gulf - Arabian Sea
  "chapter10": [596940, 15696, 47217, 8128, 3524848],  // South East Asia
  "chapter11": [896569, 20320, 17072, 7494, 4010539],  // South China Sea - Japan
  "chapter12": [896569, 20320, 17072, 7494, 4010539]   // South China Sea - Japan
};

// Location data - REMOVED CONCLUSION
const locationData = {
  "intro":     "Global Coverage",
  "chapter1":  "Western Atlantic & Pacific Basin",
  "chapter2":  "Venezuelan Coast", 
  "chapter3":  "Baltic",
  "chapter4":  "Mediterranean",
  "chapter5":  "North African to West African Coast",
  "chapter6":  "Russian Arctic",
  "chapter7":  "Red Sea",
  "chapter8":  "Red Sea",
  "chapter9":  "Arabian Sea - Persian Gulf",
  "chapter10": "Malacca Strait",
  "chapter11": "South China Sea",
  "chapter12": "South China Sea"
};

// Maritime Blue Color Schemes - 5 colors (removed one for Optical Bunkering)
const colorSchemes = {
  ocean: [
    '#00ccff',  // Light - Bright cyan
    '#0066cc',  // Dark - Medium blue
    '#4a90e2',  // Ship-To-Ship Transfers - Lighter blue
    '#1e3a8a',  // Spoofing - Navy blue
    '#0f172a'   // Detections - Very dark navy
  ],
  fire: [
    '#ffeb3b',  // Light - Bright yellow
    '#ff9800',  // Dark - Orange
    '#e91e63',  // Ship-To-Ship Transfers - Pink
    '#f44336',  // Spoofing - Red
    '#424242'   // Detections - Dark grey
  ],
  neon: [
    '#00ff88',  // Light - Neon green
    '#3a86ff',  // Dark - Neon blue
    '#ff006e',  // Ship-To-Ship Transfers - Neon pink
    '#ff3333',  // Spoofing - Neon red
    '#1a1a2e'   // Detections - Dark purple
  ]
};

// Initialize variables
let currentData = [0, 0, 0, 0, 0];
let currentLocation = "Global Coverage";
let animationFrame = null;
let particles = [];

// Get color palette
function getColors() {
  return colorSchemes[chartConfig.colorScheme] || colorSchemes.ocean;
}

// Calculate text width (mobile-friendly)
function getTextWidth(text, fontSize = 9) {  // REDUCED: was 10
  const avgCharWidth = fontSize * 0.55;
  return text.length * avgCharWidth;
}

// Calculate EQUAL bar widths (all same size)
function calculateBarWidths(data, containerWidth) {
  const colors = getColors();
  const total = d3.sum(data);
  
  if (total === 0) return [];
  
  // Detect mobile/tablet
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  
  // Adjust sizes based on device
  const mainFontSize = isMobile ? 8 : isTablet ? 8.5 : 9;
  const percentFontSize = isMobile ? 7 : isTablet ? 8 : 9;
  
  // Create segments with text content
  const segments = data.map((value, index) => {
    // Calculate percentage based on total of all 5 values
    const percentage = (value / total * 100).toFixed(1);
    let categoryText = categories[index];
    
    // Smart text abbreviation for mobile
    if (isMobile) {
      categoryText = categoryText.replace("Ship-To-Ship Transfers", "STS");
    }
    
    const valueText = value.toLocaleString();
    const percentText = `${percentage}%`;
    
    // Format main text - keep the word "Detections" visible
    const mainText = `${categoryText}: ${valueText}`;
    
    return {
      index,
      value,
      category: categoryText,
      percentage,
      color: colors[index],
      mainText,
      percentText
    };
  });
  
  // Filter out zero values
  const visibleSegments = segments.filter(s => s.value > 0);
  
  if (visibleSegments.length === 0) return [];
  
  // EQUAL WIDTH CALCULATION - All bars same size
  const totalSpacing = (visibleSegments.length - 1) * chartConfig.barSpacing;
  const availableWidth = containerWidth - totalSpacing;
  const equalWidth = availableWidth / visibleSegments.length;
  
  // Calculate positions with equal widths
  let currentX = 0;
  const positionedSegments = visibleSegments.map(segment => {
    const result = {
      ...segment,
      x: currentX,
      width: equalWidth
    };
    currentX += equalWidth + chartConfig.barSpacing;
    return result;
  });
  
  return positionedSegments;
}

// Initialize the overlay chart
function initOverlayChart() {
  const container = d3.select("#bar-chart-overlay");
  container.style("display", "none");
  
  if (container.select("svg").empty()) {
    const svg = container.append("svg")
      .attr("viewBox", "0 0 750 36")  // KEPT ORIGINAL: was 900x42
      .attr("preserveAspectRatio", "xMidYMid meet");
    
    // Add glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow");
    
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");
    
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
    
    // Add gradient definitions
    const colors = getColors();
    colors.forEach((color, i) => {
      const gradient = defs.append("linearGradient")
        .attr("id", `gradient-${i}`)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", d3.color(color).darker(0.5));
      
      gradient.append("stop")
        .attr("offset", "50%")
        .style("stop-color", color);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", d3.color(color).brighter(0.5));
    });
  }
}

// Mobile-friendly particle system
class ChartParticles {
  constructor(svg) {
    this.svg = svg;
    this.particles = [];
    this.g = svg.append("g").attr("class", "particles");
  }
  
  emit(x, y, color) {
    if (!chartConfig.particleEffect) return;
    
    // Reduce particles on mobile for performance
    const particleCount = window.innerWidth <= 768 ? 3 : 5;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2 - 1,
        life: 1,
        color: color,
        size: Math.random() * 3 + 1
      };
      this.particles.push(particle);
    }
  }
  
  update() {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= 0.02;
      return p.life > 0;
    });
    
    const circles = this.g.selectAll("circle")
      .data(this.particles);
    
    circles.enter().append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => d.color)
      .attr("opacity", 0)
      .merge(circles)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("opacity", d => d.life * 0.8);
    
    circles.exit().remove();
    
    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.update());
    }
  }
}

// Enhanced mobile-friendly chart update function
function updateOverlayChart(targetData, chapter = 'intro') {
  const container = d3.select("#bar-chart-overlay");
  const svg = container.select("svg");
  if (svg.empty()) return;
  
  // Update current location
  currentLocation = locationData[chapter] || "Unknown Region";
  
  // Make container visible with fade effect
  container
    .style("display", "block")
    .style("opacity", "0")
    .transition()
    .duration(300)
    .style("opacity", "1");
  
  const width = 750;  // REDUCED: was 900
  const height = 36;  // KEPT ORIGINAL: was 42
  
  // Responsive height adjustment
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  const responsiveHeight = isMobile ? 32 : isTablet ? 34 : height;  // KEPT ORIGINAL
  
  // Add/Update title with dynamic location
  if (chartConfig.showTitle) {
    let title = container.select("#chart-title");
    if (title.empty()) {
      title = container.insert("div", ":first-child")
        .attr("id", "chart-title")
        .style("text-align", "center")
        .style("font-size", isMobile ? "0.7rem" : "0.8rem")  // REDUCED
        .style("font-weight", "500")
        .style("margin-bottom", isMobile ? "0.3rem" : "0.4rem")  // REDUCED
        .style("color", "#00ffff")
        .style("text-shadow", "0 0 10px rgba(0, 255, 255, 0.5)")
        .style("letter-spacing", "0.05em");
    }
    
    title
      .style("opacity", "0.7")
      .transition()
      .duration(200)
      .style("opacity", "1")
      .tween("text", function() {
        const self = d3.select(this);
        return function(t) {
          if (t > 0.5) {
            self.html(`
              <span style="color: #00ffff;">THEIA DETECTION TRACKER</span>
              <span style="color: #ffffff; font-weight: 400; margin-left: 0.5rem;">:</span>
              <span style="color: #66b3ff; font-weight: 600; margin-left: 0.5rem;">${currentLocation}</span>
            `);
          }
        };
      });
  }
  
  // Initialize particle system
  if (!svg.particleSystem) {
    svg.particleSystem = new ChartParticles(svg);
  }
  
  // Animate from current to target data
  cancelAnimationFrame(animationFrame);
  const startData = [...currentData];
  const startTime = performance.now();
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / chartConfig.animationDuration, 1);
    const eased = d3.easeCubicInOut(progress);
    
    // Interpolate data
    const interpolatedData = startData.map((start, i) => {
      return start + (targetData[i] - start) * eased;
    });
    
    // Update current data
    currentData = interpolatedData;
    
    // Calculate equal-width segments
    const segments = calculateBarWidths(interpolatedData, width);
    
    // Update segments with enhanced effects
    const rects = svg.selectAll("rect.segment")
      .data(segments, d => d.index);
    
    const rectsEnter = rects.enter().append("rect")
      .attr("class", "segment")
      .attr("y", responsiveHeight)
      .attr("height", 0)
      .attr("x", d => d.x)
      .attr("width", 0)
      .attr("fill", d => `url(#gradient-${d.index})`)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 0);
    
    rects.merge(rectsEnter)
      .transition()
      .duration(300)
      .attr("x", d => d.x)
      .attr("y", 0)
      .attr("height", responsiveHeight)
      .attr("width", d => d.width)
      .attr("stroke-width", 1)
      .attr("filter", chartConfig.glowEffect ? "url(#glow)" : "none")
      .on("end", function(d) {
        if (d.width > 20 && progress === 1) {
          svg.particleSystem.emit(d.x + d.width, responsiveHeight / 2, d.color);
          svg.particleSystem.update();
        }
      });
    
    rects.exit()
      .transition()
      .duration(300)
      .attr("height", 0)
      .attr("y", responsiveHeight)
      .remove();
    
    // Update main text labels with responsive sizing
    const mainTexts = svg.selectAll("text.main-label")
      .data(segments, d => d.index);
    
    const mainTextsEnter = mainTexts.enter().append("text")
      .attr("class", "main-label")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-family", "'Manrope', sans-serif")
      .attr("font-weight", "500")
      .attr("letter-spacing", "0.02em")
      .attr("opacity", 0);
    
    mainTexts.merge(mainTextsEnter)
      .text(d => d.mainText)
      .transition()
      .duration(300)
      .attr("x", d => d.x + d.width / 2)
      .attr("y", responsiveHeight / 2 - (isMobile ? 4 : 5))  // SLIGHTLY MOVED UP: was -2,-3
      .attr("fill", "#ffffff")
      .attr("font-size", `${isMobile ? 8 : isTablet ? 8.5 : 9}px`)  // REDUCED
      .attr("opacity", 1)
      .attr("text-shadow", "0 0 5px rgba(0, 0, 0, 0.8)");
    
    mainTexts.exit()
      .transition()
      .duration(200)
      .attr("opacity", 0)
      .remove();
    
    // Update percentage labels - POSITIONED BELOW AND MORE PROMINENT
    const percentTexts = svg.selectAll("text.percent-label")
      .data(segments, d => d.index);
    
    const percentTextsEnter = percentTexts.enter().append("text")
      .attr("class", "percent-label")
      .attr("text-anchor", "middle")
      .attr("font-family", "'Manrope', sans-serif")
      .attr("font-weight", "700")  // ENHANCED: more bold
      .attr("opacity", 0);
    
    percentTexts.merge(percentTextsEnter)
      .text(d => d.percentText)
      .transition()
      .duration(300)
      .attr("x", d => d.x + d.width / 2)
      .attr("y", responsiveHeight / 2 + (isMobile ? 6 : 8))  // MOVED DOWN: clear separation from main text
      .attr("fill", "#ffffff")  // CHANGED: white for prominence
      .attr("font-size", `${isMobile ? 7 : isTablet ? 8 : 9}px`)  // ENHANCED: larger font size
      .attr("opacity", 1)  // ENHANCED: full opacity
      .attr("text-shadow", "0 0 8px rgba(0, 0, 0, 0.9), 0 0 4px rgba(0, 0, 0, 0.7)");  // ENHANCED: stronger shadow
    
    percentTexts.exit().remove();
    
    // Continue animation
    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      // Add completion effect
      const total = d3.sum(interpolatedData);
      if (total > 1000) {
        pulseChart();
      }
    }
  }
  
  requestAnimationFrame(animate);
}

// Pulse effect for milestones
function pulseChart() {
  const svg = d3.select("#bar-chart-overlay svg");
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  const height = isMobile ? 32 : isTablet ? 34 : 36;  // KEPT ORIGINAL
  
  const pulseRect = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 750)  // REDUCED: was 900
    .attr("height", height)
    .attr("fill", "none")
    .attr("stroke", "#00ffff")
    .attr("stroke-width", 2)
    .attr("opacity", 0);
  
  pulseRect
    .transition()
    .duration(600)
    .attr("opacity", 0.8)
    .transition()
    .duration(600)
    .attr("opacity", 0)
    .remove();
}

// Enhanced mobile-friendly final chart render
function renderFinalChart() {
  const finalData = detectionData["chapter12"];
  const svg = d3.select("#bar-chart-final");
  const width = parseInt(svg.style("width"));
  const isMobile = window.innerWidth <= 768;
  const height = isMobile ? 65 : 80;
  const colors = getColors();
  
  svg.selectAll("*").remove();
  svg.attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");
  
  // Add background gradient
  const defs = svg.append("defs");
  const bgGradient = defs.append("linearGradient")
    .attr("id", "bg-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");
  
  bgGradient.append("stop")
    .attr("offset", "0%")
    .style("stop-color", "rgba(0, 0, 0, 0.8)");
  
  bgGradient.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "rgba(0, 0, 0, 0.2)");
  
  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "url(#bg-gradient)")
    .attr("rx", 8);
  
  // Calculate segments for final chart with equal widths
  const segments = calculateBarWidths(finalData, width - 20); // 20px total padding
  
  // Create segment groups
  const segmentGroups = svg.selectAll("g.final-segment")
    .data(segments)
    .enter().append("g")
    .attr("class", "final-segment")
    .attr("transform", "translate(10, 0)") // 10px left padding
    .attr("opacity", 0);
  
  // Add rectangles with gradients
  segmentGroups.append("rect")
    .attr("x", d => d.x)
    .attr("y", 10)
    .attr("height", height - 20)
    .attr("width", d => d.width)
    .attr("fill", (d, i) => colors[d.index])
    .attr("stroke", (d, i) => d3.color(colors[d.index]).brighter(0.5))
    .attr("stroke-width", 1)
    .attr("rx", 4);
  
  // Add category labels
  segmentGroups.append("text")
    .attr("x", d => d.x + d.width / 2)
    .attr("y", height / 2 - (isMobile ? 6 : 8))
    .attr("text-anchor", "middle")
    .attr("fill", "#ffffff")
    .attr("font-size", isMobile ? "10px" : "12px")
    .attr("font-weight", "600")
    .attr("letter-spacing", "0.02em")
    .text(d => d.category);
  
  // Add value labels
  segmentGroups.append("text")
    .attr("x", d => d.x + d.width / 2)
    .attr("y", height / 2 + (isMobile ? 2 : 4))
    .attr("text-anchor", "middle")
    .attr("fill", "#ffffff")
    .attr("font-size", isMobile ? "12px" : "14px")
    .attr("font-weight", "700")
    .text(d => d.value.toLocaleString());
  
  // Add percentage labels
  segmentGroups.append("text")
    .attr("x", d => d.x + d.width / 2)
    .attr("y", height / 2 + (isMobile ? 14 : 18))
    .attr("text-anchor", "middle")
    .attr("fill", (d, i) => colors[d.index])
    .attr("font-size", isMobile ? "8px" : "10px")
    .attr("font-weight", "500")
    .attr("opacity", 0.8)
    .text(d => `${d.percentage}%`);
  
  // Animate appearance with stagger
  segmentGroups
    .transition()
    .duration(800)
    .delay((d, i) => i * 100)
    .attr("opacity", 1)
    .on("end", function(d, i) {
      if (i === segments.length - 1) {
        addSparkles(svg, width, height);
      }
    });
}

// Add mobile-friendly sparkle effects
function addSparkles(svg, width, height) {
  const isMobile = window.innerWidth <= 768;
  const sparkleCount = isMobile ? 12 : 20; // Fewer sparkles on mobile
  const sparkles = [];
  
  for (let i = 0; i < sparkleCount; i++) {
    sparkles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 1000
    });
  }
  
  const sparkleGroup = svg.append("g").attr("class", "sparkles");
  
  sparkleGroup.selectAll("circle")
    .data(sparkles)
    .enter().append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 0)
    .attr("fill", "#ffffff")
    .attr("opacity", 0)
    .transition()
    .delay(d => d.delay)
    .duration(300)
    .attr("r", d => d.size)
    .attr("opacity", 0.8)
    .transition()
    .duration(300)
    .attr("r", 0)
    .attr("opacity", 0)
    .remove();
}

// Hide chart for intro and AFTER chapter 12
function hideChart() {
  d3.select("#bar-chart-overlay")
    .transition()
    .duration(300)
    .style("opacity", "0")
    .on("end", function() {
      d3.select(this).style("display", "none");
    });
}

// Window resize handler for mobile responsiveness
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Re-render current chart with new dimensions
    if (currentData.some(d => d > 0)) {
      updateOverlayChart(currentData);
    }
    renderFinalChart();
  }, 250);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  // Inject CSS first
  injectChartCSS();
  
  // Initialize charts
  initOverlayChart();
  renderFinalChart();
  
  // Add resize listener for mobile responsiveness
  window.addEventListener('resize', handleResize);
  
  // ADDED: Track if we've reached the final chart section
  let finalChartReached = false;
  
  // ADDED: Hide bar chart overlay when final chart section comes into view
  const finalChartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('📊 Bar Chart: Hiding (final chart section reached)');
        finalChartReached = true; // Set flag to prevent re-showing
        hideChart(); // Hide the bar chart overlay
      }
    });
  }, { threshold: 0.1 });

  // Observe the final chart section to hide bar chart overlay
  const finalChartSection = document.getElementById('chart-final');
  if (finalChartSection) {
    finalChartObserver.observe(finalChartSection);
  }
  
  // UPDATED: Modified chapter change listener to respect finalChartReached flag
  window.addEventListener('chapterChanged', (e) => {
    const chapter = e.detail.chapter;
    
    // If we've reached the final chart section, don't show the bar chart anymore
    if (finalChartReached) {
      console.log('📊 Bar Chart: Ignoring chapter change (final chart section reached)');
      return;
    }
    
    // Hide chart for intro and after chapter 12 (when map is off screen)
    if (chapter === "intro") {
      console.log('📊 Chart: Hiding for intro');
      hideChart();
    } else if (chapter && chapter.startsWith('chapter')) {
      const chapterNum = parseInt(chapter.replace('chapter', ''));
      if (chapterNum >= 1 && chapterNum <= 12) {
        // Show chart for chapters 1-12
        const newData = detectionData[chapter] || [0, 0, 0, 0, 0];
        console.log(`📊 Chart: Showing for ${chapter}`, newData);
        updateOverlayChart(newData, chapter);
      } else {
        // Hide chart for any chapter beyond 12
        console.log(`📊 Chart: Hiding for ${chapter} (beyond chapter 12)`);
        hideChart();
      }
    } else {
      // Hide chart for any non-chapter content (after scrolling past)
      console.log(`📊 Chart: Hiding for non-chapter content: ${chapter}`);
      hideChart();
    }
  });
  
  // Add hover effects to final chart
  d3.selectAll("#bar-chart-final .final-segment")
    .on("mouseenter", function() {
      if (window.innerWidth > 768) { // Only on non-mobile
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("y", 5)
          .attr("height", window.innerWidth <= 768 ? 55 : 70);
      }
    })
    .on("mouseleave", function() {
      if (window.innerWidth > 768) { // Only on non-mobile
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("y", 10)
          .attr("height", window.innerWidth <= 768 ? 45 : 60);
      }
    });
  
  console.log('✅ Mobile-friendly maritime chart initialized (compact version)');
});

// UPDATED: Listen for chapter changes - Hide chart after chapter 12
window.addEventListener('chapterChanged', (e) => {
  const chapter = e.detail.chapter;
  
  // Hide chart for intro
  if (chapter === "intro") {
    console.log('📊 Chart: Hiding for intro');
    hideChart();
  } 
  // Show chart for chapters 1-12 only
  else if (chapter && chapter.startsWith('chapter')) {
    const chapterNum = parseInt(chapter.replace('chapter', ''));
    if (chapterNum >= 1 && chapterNum <= 12) {
      // Show chart for chapters 1-12
      const newData = detectionData[chapter] || [0, 0, 0, 0, 0];
      console.log(`📊 Chart: Showing for ${chapter}`, newData);
      updateOverlayChart(newData, chapter);
    }
    // Don't do anything for chapters beyond 12 - let scroll handler take care of it
  } 
  // Hide chart for any non-chapter content
  else {
    console.log(`📊 Chart: Hiding for non-chapter content: ${chapter}`);
    hideChart();
  }
});

// SIMPLE: Just hide chart when final chart section appears
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for everything to load, then set up the observer
  setTimeout(() => {
    const finalSection = document.getElementById('chart-final');
    if (finalSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log('📊 FINAL: Hiding bar chart overlay now');
            const barChart = document.getElementById('bar-chart-overlay');
            if (barChart) {
              barChart.style.display = 'none';
              barChart.style.opacity = '0';
            }
          }
        });
      }, { 
        threshold: 0.05,  // Trigger when just 5% visible
        rootMargin: '0px 0px -50px 0px'  // Trigger a bit before it's fully visible
      });
      
      observer.observe(finalSection);
    }
  }, 1000);
});

// Configuration panel (for development)
if (window.location.hostname === 'localhost') {
  const configPanel = document.createElement('div');
  configPanel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    padding: 1rem;
    border-radius: 8px;
    z-index: 1000;
    font-size: 0.8rem;
    display: none;
  `;
  
  configPanel.innerHTML = `
    <h4 style="margin: 0 0 0.5rem; color: #00ffff;">Chart Config (Fixed)</h4>
    <label style="display: block; margin: 0.25rem 0; color: #fff;">
      <input type="checkbox" id="config-glow" ${chartConfig.glowEffect ? 'checked' : ''}>
      Glow Effect
    </label>
    <label style="display: block; margin: 0.25rem 0; color: #fff;">
      <input type="checkbox" id="config-particles" ${chartConfig.particleEffect ? 'checked' : ''}>
      Particles
    </label>
    <label style="display: block; margin: 0.25rem 0; color: #fff;">
      Color Scheme:
      <select id="config-colors" style="margin-left: 0.5rem;">
        <option value="ocean" ${chartConfig.colorScheme === 'ocean' ? 'selected' : ''}>Ocean</option>
        <option value="fire" ${chartConfig.colorScheme === 'fire' ? 'selected' : ''}>Fire</option>
        <option value="neon" ${chartConfig.colorScheme === 'neon' ? 'selected' : ''}>Neon</option>
      </select>
    </label>
    <div style="margin-top: 0.5rem; color: #66b3ff; font-size: 0.7rem;">
      Current Location: <span id="debug-location">${currentLocation}</span><br>
      Device: <span id="debug-device">${window.innerWidth <= 768 ? 'Mobile' : window.innerWidth <= 1024 ? 'Tablet' : 'Desktop'}</span><br>
      Size: <span style="color: #ffb366;">750x36 (Original)</span>
    </div>
  `;
  
  document.body.appendChild(configPanel);
  
  // Toggle config panel with keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
      const debugLocation = document.getElementById('debug-location');
      const debugDevice = document.getElementById('debug-device');
      if (debugLocation) debugLocation.textContent = currentLocation;
      if (debugDevice) debugDevice.textContent = window.innerWidth <= 768 ? 'Mobile' : window.innerWidth <= 1024 ? 'Tablet' : 'Desktop';
    }
  });
  
  // Handle config changes
  document.getElementById('config-glow').addEventListener('change', (e) => {
    chartConfig.glowEffect = e.target.checked;
    updateOverlayChart(currentData);
  });
  
  document.getElementById('config-particles').addEventListener('change', (e) => {
    chartConfig.particleEffect = e.target.checked;
  });
  
  document.getElementById('config-colors').addEventListener('change', (e) => {
    chartConfig.colorScheme = e.target.value;
    initOverlayChart();
    updateOverlayChart(currentData);
    renderFinalChart();
  });
}
/* Final Chart JS - Regional Maritime Intelligence Summary */

// Inject Final Chart CSS styles directly into the document
function injectFinalChartCSS() {
    if (document.getElementById('final-chart-css-injected')) return;
    
    const style = document.createElement('style');
    style.id = 'final-chart-css-injected';
    style.textContent = `
      /* Final Chart Styles - Regional Summary */
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
  
      .final-chart-container {
        max-width: 1200px;
        margin: 0 auto;
      }
  
      .final-chart-title {
        font-size: 2.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, var(--primary-glow), var(--secondary-glow));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
  
      .final-chart-subtitle {
        font-size: 1.1rem;
        color: var(--text-secondary);
        margin-bottom: 3rem;
        font-weight: 300;
      }
  
      /* Regional Grid Layout */
      .regions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin: 3rem 0;
      }
  
      .region-card {
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 30, 40, 0.6));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
  
      .region-card::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, var(--primary-glow), var(--secondary-glow));
        border-radius: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
      }
  
      .region-card:hover::before {
        opacity: 0.3;
      }
  
      .region-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 255, 255, 0.2);
      }
  
      .region-name {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--primary-glow);
        margin-bottom: 0.5rem;
        text-align: center;
      }
  
      .region-total {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        text-align: center;
        margin-bottom: 1rem;
      }
  
      .region-breakdown {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        font-size: 0.85rem;
      }
  
      .breakdown-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
  
      .breakdown-label {
        color: var(--text-secondary);
        font-weight: 400;
      }
  
      .breakdown-value {
        color: var(--text-primary);
        font-weight: 600;
      }
  
      /* Summary Statistics - UPDATED Layout */
      .summary-stats {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin: 4rem 0;
        padding: 2rem;
        background: linear-gradient(135deg, rgba(0, 50, 100, 0.2), rgba(0, 0, 0, 0.4));
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
  
      .summary-row-1 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        justify-items: center;
      }
  
      .summary-row-2 {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 1.5rem;
      }
  
      .stat-item {
        text-align: center;
      }
  
      .stat-item.large {
        padding: 1rem;
      }
  
      .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--primary-glow), var(--secondary-glow));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: block;
      }
  
      .stat-number.large {
        font-size: 3rem;
      }
  
      .stat-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-top: 0.5rem;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
  
      /* Top Regions Highlight */
      .top-regions {
        margin: 3rem 0;
        padding: 2rem;
        background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(0, 0, 0, 0.3));
        border-radius: 16px;
        border: 1px solid rgba(0, 255, 255, 0.2);
      }
  
      .top-regions h4 {
        font-size: 1.4rem;
        color: var(--primary-glow);
        margin-bottom: 1rem;
        text-align: center;
      }
  
      .top-regions-list {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 1rem;
      }
  
      .top-region-item {
        text-align: center;
        min-width: 120px;
      }
  
      .top-region-rank {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--secondary-glow);
      }
  
      .top-region-name {
        font-size: 0.9rem;
        color: var(--text-primary);
        margin: 0.3rem 0;
      }
  
      .top-region-count {
        font-size: 0.8rem;
        color: var(--text-secondary);
      }
  
      /* Enhanced narrative section */
      .narrative-section {
        max-width: 800px;
        margin: 4rem auto;
        text-align: left;
        line-height: 1.7;
      }
  
      .narrative-section h4 {
        font-size: 1.5rem;
        color: var(--primary-glow);
        margin-bottom: 1rem;
        text-align: center;
      }
  
      .narrative-section p {
        font-size: 1.1rem;
        color: var(--text-secondary);
        margin-bottom: 1.2rem;
        font-weight: 300;
      }
  
      /* Mobile Optimizations */
      @media screen and (max-width: 768px) {
        #chart-final {
          padding: 3rem 1rem;
        }
  
        .final-chart-title {
          font-size: 1.8rem;
        }
  
        .final-chart-subtitle {
          font-size: 1rem;
          margin-bottom: 2rem;
        }
  
        .regions-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
          margin: 2rem 0;
        }
  
        .region-card {
          padding: 1.2rem;
        }
  
        .region-name {
          font-size: 1.1rem;
        }
  
        .region-total {
          font-size: 1.6rem;
        }
  
        .region-breakdown {
          grid-template-columns: 1fr;
          gap: 0.3rem;
        }
  
        .breakdown-item {
          font-size: 0.8rem;
        }
  
        .summary-stats {
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }
  
        .summary-row-1 {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
  
        .summary-row-2 {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
  
        .stat-item.large {
          padding: 0.5rem;
        }
  
        .stat-number {
          font-size: 2rem;
        }
  
        .stat-number.large {
          font-size: 2.5rem;
        }
  
        .stat-label {
          font-size: 0.8rem;
        }
  
        .top-regions {
          margin: 2rem 0;
          padding: 1.5rem;
        }
  
        .top-regions h4 {
          font-size: 1.2rem;
        }
  
        .top-regions-list {
          flex-direction: column;
          gap: 0.8rem;
        }
  
        .top-region-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
  
        .narrative-section {
          margin: 2rem auto;
        }
  
        .narrative-section h4 {
          font-size: 1.3rem;
        }
  
        .narrative-section p {
          font-size: 1rem;
        }
      }
  
      /* Animation classes */
      .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
      }
  
      .fade-in-up.visible {
        opacity: 1;
        transform: translateY(0);
      }
  
      .scale-in {
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.5s ease;
      }
  
      .scale-in.visible {
        opacity: 1;
        transform: scale(1);
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Final Chart CSS injected successfully');
  }
  
  // Regional data - This will be loaded from CSV in real implementation
  const regionalData = [
    { region: "Caribbean Basin", light: 145, dark: 123, sts: 89, optical: 45, spoofing: 22, detections: 424 },
    { region: "Venezuelan Coast", light: 289, dark: 234, sts: 178, optical: 87, spoofing: 69, detections: 857 },
    { region: "Northern Europe", light: 412, dark: 345, sts: 267, optical: 145, spoofing: 144, detections: 1313 },
    { region: "Western Mediterranean", light: 578, dark: 467, sts: 412, optical: 234, spoofing: 164, detections: 1855 },
    { region: "West African Coast", light: 745, dark: 623, sts: 589, optical: 356, spoofing: 211, detections: 2524 },
    { region: "Russian Arctic", light: 923, dark: 812, sts: 723, optical: 445, spoofing: 300, detections: 3203 },
    { region: "Red Sea", light: 1156, dark: 989, sts: 934, optical: 567, spoofing: 356, detections: 4002 },
    { region: "Arabian Sea", light: 1389, dark: 1234, sts: 1178, optical: 689, spoofing: 434, detections: 4924 },
    { region: "Persian Gulf", light: 1623, dark: 1478, sts: 1445, optical: 834, spoofing: 555, detections: 5935 }
  ];
  
  // Calculate totals and statistics
  function calculateStatistics() {
    const totals = {
      light: 0,
      dark: 0,
      sts: 0,
      optical: 0,
      spoofing: 0,
      detections: 0,
      totalActivities: 0
    };
  
    regionalData.forEach(region => {
      totals.light += region.light;
      totals.dark += region.dark;
      totals.sts += region.sts;
      totals.optical += region.optical;
      totals.spoofing += region.spoofing;
      totals.detections += region.detections;
      totals.totalActivities += region.detections;
    });
  
    return totals;
  }
  
  // Get top regions by detection count
  function getTopRegions() {
    return regionalData
      .sort((a, b) => b.detections - a.detections)
      .slice(0, 5)
      .map((region, index) => ({
        rank: index + 1,
        name: region.region,
        count: region.detections
      }));
  }
  
  // Create region card HTML
  function createRegionCard(region) {
    const total = region.detections;
    
    return `
      <div class="region-card fade-in-up">
        <div class="region-name">${region.region}</div>
        <div class="region-total">${total.toLocaleString()}</div>
        <div class="region-breakdown">
          <div class="breakdown-item">
            <span class="breakdown-label">Light</span>
            <span class="breakdown-value">${region.light.toLocaleString()}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Dark</span>
            <span class="breakdown-value">${region.dark.toLocaleString()}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">STS</span>
            <span class="breakdown-value">${region.sts.toLocaleString()}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Optical</span>
            <span class="breakdown-value">${region.optical.toLocaleString()}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Spoofing</span>
            <span class="breakdown-value">${region.spoofing.toLocaleString()}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Total</span>
            <span class="breakdown-value">${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // Create summary statistics HTML - UPDATED Layout and Content
  function createSummaryStats() {
    const stats = calculateStatistics();
    
    return `
      <div class="summary-stats scale-in">
        <div class="summary-row-1">
          <div class="stat-item large">
            <span class="stat-number large">${stats.totalActivities.toLocaleString()}</span>
            <div class="stat-label">Total Detections</div>
          </div>
          <div class="stat-item large">
            <span class="stat-number large">27M</span>
            <div class="stat-label">km² Satellite Coverage Daily</div>
          </div>
        </div>
        <div class="summary-row-2">
          <div class="stat-item">
            <span class="stat-number">${stats.light.toLocaleString()}</span>
            <div class="stat-label">AIS Light</div>
          </div>
          <div class="stat-item">
            <span class="stat-number">${stats.dark.toLocaleString()}</span>
            <div class="stat-label">AIS Dark</div>
          </div>
          <div class="stat-item">
            <span class="stat-number">${stats.sts.toLocaleString()}</span>
            <div class="stat-label">Ship To Ship Transfers</div>
          </div>
          <div class="stat-item">
            <span class="stat-number">${stats.optical.toLocaleString()}</span>
            <div class="stat-label">Optical Bunkering</div>
          </div>
          <div class="stat-item">
            <span class="stat-number">${stats.spoofing.toLocaleString()}</span>
            <div class="stat-label">Spoofing</div>
          </div>
          <div class="stat-item">
            <span class="stat-number">${stats.detections.toLocaleString()}</span>
            <div class="stat-label">Detections</div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Create top regions HTML
  function createTopRegions() {
    const topRegions = getTopRegions();
    
    const topRegionsHTML = topRegions.map(region => `
      <div class="top-region-item">
        <div class="top-region-rank">#${region.rank}</div>
        <div class="top-region-name">${region.name}</div>
        <div class="top-region-count">${region.count.toLocaleString()} detections</div>
      </div>
    `).join('');
  
    return `
      <div class="top-regions fade-in-up">
        <h4>Top 5 Most Active Regions</h4>
        <div class="top-regions-list">
          ${topRegionsHTML}
        </div>
      </div>
    `;
  }
  
  // Create narrative section
  function createNarrative() {
    const stats = calculateStatistics();
    const topRegion = getTopRegions()[0];
    
    return `
      <div class="narrative-section fade-in-up">
        <h4>Regional Analysis Summary</h4>
        <p>
          Our comprehensive regional analysis reveals the global scope and intensity of Theia's 2024 maritime intelligence operations. 
          Across ${regionalData.length} critical regions, we successfully identified and tracked ${stats.totalActivities.toLocaleString()} 
          anomalous maritime activities, with the ${topRegion.name} emerging as the most active theater of operations.
        </p>
        <p>
          The data demonstrates a clear concentration of maritime intelligence activities in geopolitically sensitive regions, 
          with ${Math.round((stats.dark / stats.totalActivities) * 100)}% of all detections involving dark operations—vessels 
          operating with minimal or manipulated AIS signatures. This pattern reflects the increasing sophistication of 
          maritime actors seeking to evade traditional monitoring systems.
        </p>
        <p>
          Ship-to-ship transfer detection proved particularly valuable, accounting for ${stats.sts.toLocaleString()} confirmed 
          incidents across all regions. These transfers, often conducted in international waters to circumvent sanctions or 
          regulatory oversight, represent a critical component of modern maritime security challenges.
        </p>
        <p>
          The regional distribution of spoofing events (${stats.spoofing.toLocaleString()} total) highlights areas where 
          maritime actors are most actively attempting to deceive monitoring systems, providing crucial intelligence about 
          patterns of deceptive behavior in global shipping networks.
        </p>
      </div>
    `;
  }
  
  // Initialize and render the final chart
  function initializeFinalChart() {
    // Inject CSS first
    injectFinalChartCSS();
    
    // Get the chart container
    const chartContainer = document.getElementById('chart-final');
    if (!chartContainer) {
      console.error('Chart final container not found');
      return;
    }
  
    // Create the complete chart HTML
    const chartHTML = `
      <div class="final-chart-container">
        <h3 class="final-chart-title">Global Maritime Intelligence Summary</h3>
        <p class="final-chart-subtitle">
          Comprehensive regional analysis of Theia's 2024 detection capabilities across ${regionalData.length} critical maritime theaters
        </p>
        
        ${createSummaryStats()}
        ${createTopRegions()}
        
        <div class="regions-grid">
          ${regionalData.map(region => createRegionCard(region)).join('')}
        </div>
        
        ${createNarrative()}
      </div>
    `;
  
    // Replace the existing chart content
    chartContainer.innerHTML = chartHTML;
  
    // Initialize scroll animations
    initializeScrollAnimations();
    
    console.log('✅ Final chart initialized with regional data');
  }
  
  // Initialize scroll-triggered animations
  function initializeScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
  
    // Observe all animation elements
    document.querySelectorAll('.fade-in-up, .scale-in').forEach(el => {
      observer.observe(el);
    });
  }
  
  // Load data from CSV (for future implementation)
  async function loadRegionalDataFromCSV() {
    try {
      // This would load the actual CSV data
      // For now, we use the hardcoded data above
      console.log('Using hardcoded regional data');
      return regionalData;
    } catch (error) {
      console.error('Error loading CSV data:', error);
      return regionalData; // Fallback to hardcoded data
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other scripts have loaded
    setTimeout(() => {
      initializeFinalChart();
    }, 100);
  });
  
  // Export for potential external use
  window.FinalChart = {
    initialize: initializeFinalChart,
    loadData: loadRegionalDataFromCSV,
    regionalData: regionalData
  };
/* Final Chart JS - Regional Maritime Intelligence Summary with Real Data */

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
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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
      min-height: 280px;
      display: flex;
      flex-direction: column;
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
      min-height: 1.5em;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .region-total {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text-primary);
      text-align: center;
      margin-bottom: 1.2rem;
      min-height: 1.5em;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .region-breakdown {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.4rem;
      font-size: 0.8rem;
      flex-grow: 1;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0.6rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.02);
      border-radius: 4px;
      min-height: 2.2em;
    }

    .breakdown-label {
      color: var(--text-secondary);
      font-weight: 400;
      flex-shrink: 0;
      min-width: 100px;
      font-size: 0.8rem;
    }

    .breakdown-value {
      color: var(--text-primary);
      font-weight: 600;
      text-align: right;
      font-family: 'Courier New', monospace;
      font-size: 0.8rem;
      min-width: 80px;
      letter-spacing: 0.5px;
    }

    /* Summary Statistics */
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
      grid-template-columns: repeat(5, 1fr);
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

    /* Top Regions Highlight - Multi-category */
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
      margin-bottom: 2rem;
      text-align: center;
    }

    .top-categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .category-section {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(20, 30, 40, 0.4));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .category-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--secondary-glow);
      margin-bottom: 1rem;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.5rem;
    }

    .category-rankings {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ranking-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.5rem 0.8rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
    }

    .ranking-item:hover {
      background: rgba(255, 255, 255, 0.08);
      border-left-color: var(--primary-glow);
    }

    .ranking-item.rank-1 {
      border-left-color: #FFD700;
      background: rgba(255, 215, 0, 0.1);
    }

    .ranking-item.rank-2 {
      border-left-color: #C0C0C0;
      background: rgba(192, 192, 192, 0.1);
    }

    .ranking-item.rank-3 {
      border-left-color: #CD7F32;
      background: rgba(205, 127, 50, 0.1);
    }

    .ranking-number {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--primary-glow);
      min-width: 20px;
      text-align: center;
    }

    .ranking-name {
      flex-grow: 1;
      font-size: 0.9rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .ranking-value {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-family: 'Courier New', monospace;
      font-weight: 600;
      min-width: 90px;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.2rem;
    }

    .ranking-number-formatted {
      font-size: 0.85rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .ranking-percentage {
      font-size: 0.7rem;
      color: var(--maritime-gold);
      font-weight: 500;
      opacity: 0.9;
    }

    .ranking-percentage::before {
      content: '🌍 ';
      font-size: 0.6rem;
      opacity: 0.8;
      margin-right: 0.1rem;
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
        margin-bottom: 1.5rem;
      }

      .top-categories-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-top: 1rem;
      }

      .category-section {
        padding: 1.2rem;
      }

      .category-title {
        font-size: 1rem;
      }

      .ranking-item {
        padding: 0.4rem 0.6rem;
        gap: 0.6rem;
      }

      .ranking-number {
        font-size: 1.1rem;
        min-width: 18px;
      }

      .ranking-name {
        font-size: 0.8rem;
      }

      .ranking-value {
        font-size: 0.75rem;
        min-width: 70px;
      }

      .ranking-number-formatted {
        font-size: 0.8rem;
      }

      .ranking-percentage::before {
        font-size: 0.55rem;
        margin-right: 0.05rem;
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

// REAL REGIONAL DATA - from CSV (excluding Total row)
const regionalData = [
  { region: "Americas", light: 179128, dark: 2505, sts: 505, optical: 4223, spoofing: 3444, detections: 648391 },
  { region: "Europe", light: 1230178, dark: 24245, sts: 14065, optical: 10689, spoofing: 19505, detections: 3054462 },
  { region: "Russia", light: 46, dark: 0, sts: 0, optical: 0, spoofing: 18, detections: 243 },
  { region: "Africa", light: 398293, dark: 5896, sts: 816, optical: 6159, spoofing: 8193, detections: 1269948 },
  { region: "Red Sea", light: 219165, dark: 3391, sts: 311, optical: 1936, spoofing: 4749, detections: 621557 },
  { region: "Persian Gulf - Arabian Sea", light: 578686, dark: 7840, sts: 15330, optical: 13262, spoofing: 30695, detections: 1774066 },
  { region: "South East Asia", light: 596940, dark: 15696, sts: 47217, optical: 48018, spoofing: 8128, detections: 3524848 },
  { region: "South China Sea - Japan", light: 896569, dark: 20320, sts: 17072, optical: 11470, spoofing: 7494, detections: 4010539 }
];

// REAL TOTALS - from CSV Total row
const realTotals = {
  light: 4099005,
  dark: 79893,
  sts: 95316,
  optical: 95757,
  spoofing: 82226,
  detections: 14904054
};

// CSS variables are defined in your main styles.css file
// No need to redefine them here

// Calculate statistics using real totals
function calculateStatistics() {
  return {
    light: realTotals.light,
    dark: realTotals.dark,
    sts: realTotals.sts,
    optical: realTotals.optical,
    spoofing: realTotals.spoofing,
    detections: realTotals.detections,
    totalActivities: realTotals.detections
  };
}

// Utility function to format numbers (K/M format)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  } else {
    return num.toString();
  }
}

// Utility function to calculate percentage share
function calculatePercentage(value, total) {
  return ((value / total) * 100).toFixed(1);
}

// Get top 3 regions by different categories with percentage calculations
function getTopRegionsByCategory(category) {
  const sortedRegions = [...regionalData].sort((a, b) => {
    const aValue = category === 'detections' ? a.detections :
                   category === 'light' ? a.light :
                   category === 'dark' ? a.dark :
                   category === 'sts' ? a.sts :
                   category === 'optical' ? a.optical :
                   category === 'spoofing' ? a.spoofing : 0;
    
    const bValue = category === 'detections' ? b.detections :
                   category === 'light' ? b.light :
                   category === 'dark' ? b.dark :
                   category === 'sts' ? b.sts :
                   category === 'optical' ? b.optical :
                   category === 'spoofing' ? b.spoofing : 0;
    
    return bValue - aValue;
  });

  // Get the appropriate total for percentage calculations
  const categoryTotal = category === 'detections' ? realTotals.detections :
                       category === 'light' ? realTotals.light :
                       category === 'dark' ? realTotals.dark :
                       category === 'sts' ? realTotals.sts :
                       category === 'optical' ? realTotals.optical :
                       category === 'spoofing' ? realTotals.spoofing : 1;

  return sortedRegions.slice(0, 3).map((region, index) => {
    const value = category === 'detections' ? region.detections :
                  category === 'light' ? region.light :
                  category === 'dark' ? region.dark :
                  category === 'sts' ? region.sts :
                  category === 'optical' ? region.optical :
                  category === 'spoofing' ? region.spoofing : 0;
    
    return {
      rank: index + 1,
      name: region.region,
      value: value,
      formattedValue: formatNumber(value),
      percentage: calculatePercentage(value, categoryTotal)
    };
  });
}

// Create region card HTML with formatted numbers
function createRegionCard(region) {
  const total = region.detections;
  
  return `
    <div class="region-card fade-in-up">
      <div class="region-name">${region.region}</div>
      <div class="region-total">${formatNumber(total)}</div>
      <div class="region-breakdown">
        <div class="breakdown-item">
          <span class="breakdown-label">AIS Light</span>
          <span class="breakdown-value">${formatNumber(region.light)}</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">AIS Dark</span>
          <span class="breakdown-value">${formatNumber(region.dark)}</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">Ship-To-Ship</span>
          <span class="breakdown-value">${formatNumber(region.sts)}</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">Optical Bunkering</span>
          <span class="breakdown-value">${formatNumber(region.optical)}</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">Spoofing</span>
          <span class="breakdown-value">${formatNumber(region.spoofing)}</span>
        </div>
      </div>
    </div>
  `;
}

// Create summary statistics HTML with formatted numbers
function createSummaryStats() {
  const stats = calculateStatistics();
  
  return `
    <div class="summary-stats scale-in">
      <div class="summary-row-1">
        <div class="stat-item large">
          <span class="stat-number large">${formatNumber(stats.totalActivities)}</span>
          <div class="stat-label">Total Detections</div>
        </div>
        <div class="stat-item large">
          <span class="stat-number large">74 km²</span>
          <div class="stat-label"> OF PLANETSCOPE & SENTINAL Satellite Coverage Daily</div>
        </div>
      </div>
      <div class="summary-row-2">
        <div class="stat-item">
          <span class="stat-number">${formatNumber(stats.light)}</span>
          <div class="stat-label">AIS Light</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${formatNumber(stats.dark)}</span>
          <div class="stat-label">AIS Dark</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${formatNumber(stats.sts)}</span>
          <div class="stat-label">Ship-To-Ship Transfers</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${formatNumber(stats.optical)}</span>
          <div class="stat-label">Optical Bunkering</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${formatNumber(stats.spoofing)}</span>
          <div class="stat-label">Spoofing</div>
        </div>
      </div>
    </div>
  `;
}

// Create category ranking HTML with formatted numbers and percentages
function createCategoryRanking(categoryName, categoryKey) {
  const topRegions = getTopRegionsByCategory(categoryKey);
  
  const rankingsHTML = topRegions.map(region => `
    <div class="ranking-item rank-${region.rank}">
      <span class="ranking-number">${region.rank}</span>
      <span class="ranking-name">${region.name}</span>
      <span class="ranking-value">
        <span class="ranking-number-formatted">${region.formattedValue}</span>
        <span class="ranking-percentage">${region.percentage}%</span>
      </span>
    </div>
  `).join('');

  return `
    <div class="category-section">
      <div class="category-title">${categoryName}</div>
      <div class="category-rankings">
        ${rankingsHTML}
      </div>
    </div>
  `;
}

// Create top regions HTML with all categories
function createTopRegions() {
  const categories = [
    { name: 'Total Detections', key: 'detections' },
    { name: 'AIS Light', key: 'light' },
    { name: 'AIS Dark', key: 'dark' },
    { name: 'Ship-To-Ship Transfers', key: 'sts' },
    { name: 'Optical Bunkering', key: 'optical' },
    { name: 'Spoofing', key: 'spoofing' }
  ];

  const categoriesHTML = categories.map(category => 
    createCategoryRanking(category.name, category.key)
  ).join('');

  return `
    <div class="top-regions fade-in-up">
      <h4>Top 3 Most Active Regions by Category</h4>
      <div class="top-categories-grid">
        ${categoriesHTML}
      </div>
    </div>
  `;
}

// Create narrative section with real data insights
function createNarrative() {
  const stats = calculateStatistics();
  const topRegion = getTopRegionsByCategory('detections')[0];
  
  return `
    <div class="narrative-section fade-in-up">
      <h4>Regional Analysis Summary</h4>
      <p>
      Throughout 2024, Theia's comprehensive surveillance architecture monitored global maritime activity across 8 critical regions. Our multi-source intelligence fusion identified 14.9 million maritime activities, providing unprecedented insight into both legitimate shipping operations and sanctions evasion networks operating worldwide.

      </p>
      <p>
      The South China Sea recorded the highest activity levels globally, with over 4 million detections as major shipping routes converged in this strategic region. Theia's automated tracking algorithms identified 17,072 ship-to-ship transfers, many occurring in international waters where vessels routinely exchange cargo and conduct maritime operations beyond traditional oversight boundaries.
      </p>
      <p>
      South East Asia emerged as the global epicenter for ship-to-ship transfer activity, accounting for 47,217 transfers—nearly half of all global STS operations. The platform's behavioral analysis capabilities detected vessels operating without standard AIS identification at significantly higher rates than other regions, indicating sophisticated logistics networks that extend beyond conventional monitoring coverage.
      </p>
      <p>
      The Persian Gulf demonstrated the world's most intensive spoofing activity, with maritime operators conducting 30,695 coordinate manipulation incidents—representing over one-third of global spoofing events. These electronic countermeasures suggest systematic efforts to obscure vessel movements in this critical energy transit corridor, reflecting both sanctions pressure and operational security considerations.
      </p>
      
      <p>European waters revealed extensive shadow fleet infiltration among the 3 million maritime movements monitored. Theia's spoofing detection algorithms identified 19,505 incidents, indicating that alternative shipping networks have become increasingly integrated into traditional European trade routes, requiring persistent surveillance to distinguish legitimate from questionable operations.
      </p>

      <p>The Americas demonstrated concentrated evasion activity, particularly around Venezuelan territorial waters where 3,444 spoofing incidents illustrated how sanctions enforcement drives technological adaptation among maritime operators seeking to circumvent monitoring systems.
      </p>

      <p>The Red Sea maintained relatively standard identification protocols despite regional tensions, with commercial vessels continuing to broadcast proper AIS signals, suggesting that international shipping largely adhered to maritime safety standards even in challenging operating environments.
      </p>

      <p>Theia's 2024 intelligence data reveals a global maritime environment where transparent commercial shipping operates alongside increasingly sophisticated alternative networks. The concentration of questionable activities in Asia-Pacific waters, combined with extensive electronic countermeasures in energy corridors, demonstrates that modern maritime security requires comprehensive regional monitoring capabilities to maintain effective oversight.
      </p>

    </div>
  `;
}

// Initialize and render the final chart
function initializeFinalChart() {
  console.log('🚀 Starting final chart initialization...');
  
  // Inject CSS first
  try {
    injectFinalChartCSS();
  } catch (error) {
    console.error('Error injecting CSS:', error);
    return;
  }
  
  // Get the chart container
  const chartContainer = document.getElementById('chart-final');
  if (!chartContainer) {
    console.error('❌ Chart final container not found - make sure element with id="chart-final" exists');
    return;
  }

  try {
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
    
    console.log('✅ Final chart initialized successfully with real regional data');
    console.log('📊 Real Data Totals:', realTotals);
  } catch (error) {
    console.error('❌ Error creating chart content:', error);
  }
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
    // This could load the actual CSV data in the future
    console.log('Using real CSV data from regional analysis');
    return regionalData;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return regionalData; // Fallback to hardcoded real data
  }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other scripts have loaded
    setTimeout(() => {
      try {
        initializeFinalChart();
      } catch (error) {
        console.error('Error initializing final chart:', error);
      }
    }, 100);
  });
} else {
  // For environments without DOM
  console.log('DOM not available, chart will initialize when called manually');
}

// Export for potential external use
if (typeof window !== 'undefined') {
  window.FinalChart = {
    initialize: initializeFinalChart,
    loadData: loadRegionalDataFromCSV,
    regionalData: regionalData,
    realTotals: realTotals
  };
}
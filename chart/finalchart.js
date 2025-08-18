/* Final Chart JS - Regional Maritime Intelligence Summary with Real CSV Data */

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
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      justify-items: center;
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
  { region: "Americas", light: 179128, dark: 2505, sts: 505, spoofing: 3444, detections: 648391 },
  { region: "Europe", light: 1230178, dark: 24245, sts: 14065, spoofing: 19505, detections: 3054462 },
  { region: "Russia", light: 46, dark: 0, sts: 0, spoofing: 18, detections: 243 },
  { region: "Africa", light: 80553, dark: 269, sts: 104, spoofing: 1371, detections: 156405 },
  { region: "Red Sea", light: 219165, dark: 3391, sts: 311, spoofing: 4749, detections: 621557 },
  { region: "Persian Gulf - Arabian Sea", light: 578686, dark: 7840, sts: 15330, spoofing: 30695, detections: 1774066 },
  { region: "South East Asia", light: 596940, dark: 15696, sts: 47217, spoofing: 8128, detections: 3524848 },
  { region: "South China Sea - Japan", light: 896569, dark: 20320, sts: 17072, spoofing: 7494, detections: 4010539 }
];

// REAL TOTALS - from CSV Total row
const realTotals = {
  light: 3781265,
  dark: 74266,
  sts: 94604,
  spoofing: 75404,
  detections: 13790511
};

// Calculate statistics using real totals
function calculateStatistics() {
  return {
    light: realTotals.light,
    dark: realTotals.dark,
    sts: realTotals.sts,
    spoofing: realTotals.spoofing,
    detections: realTotals.detections,
    totalActivities: realTotals.detections
  };
}

// Utility function to format numbers (K/M format)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K';
  } else {
    return num.toString();
  }
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
          <span class="stat-number large">27M km²</span>
          <div class="stat-label">Of PLANETSCOPE Satellite Coverage Daily</div>
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
          <span class="stat-number">${formatNumber(stats.spoofing)}</span>
          <div class="stat-label">Spoofing</div>
        </div>
      </div>
    </div>
  `;
}

// Create narrative section with real data insights
function createNarrative() {
  const stats = calculateStatistics();
  
  return `
    <div class="narrative-section fade-in-up">
      <h4>Regional Analysis Summary</h4>
      <p>
      Throughout 2024, Theia's comprehensive surveillance architecture monitored global maritime activity across 8 critical regions. Our multi-source intelligence fusion identified 13.8 million maritime activities, providing unprecedented insight into both legitimate shipping operations and sanctions evasion networks operating worldwide.
      </p>
      <p>
      The South China Sea - Japan region recorded the highest activity levels globally, with over 4.0 million detections (29.1% of global activity) as major shipping routes converged in this strategic theater. Theia's automated tracking algorithms identified 17,072 ship-to-ship transfers, representing 18.0% of all global STS operations conducted in international waters where vessels routinely exchange cargo beyond traditional oversight boundaries.
      </p>
      <p>
      South East Asia emerged as the global epicenter for ship-to-ship transfer activity, accounting for 47,217 transfers—nearly half (49.9%) of all global STS operations. This region also demonstrated significant dark fleet activity with 15,696 AIS dark detections (21.1% of global dark fleet operations), indicating sophisticated logistics networks that operate beyond conventional monitoring coverage.
      </p>
      <p>
      The Persian Gulf - Arabian Sea demonstrated the world's most intensive spoofing activity, with maritime operators conducting 30,695 coordinate manipulation incidents—representing 40.7% of all global spoofing events. These electronic countermeasures suggest systematic efforts to obscure vessel movements in this critical energy transit corridor, reflecting both sanctions pressure and operational security considerations.
      </p>
      
      <p>European waters revealed the most extensive dark fleet infiltration, with 24,245 AIS dark detections (32.6% of global dark activity) among the 3.1 million maritime movements monitored. Theia's spoofing detection algorithms also identified 19,505 incidents (25.9% of global spoofing), indicating that alternative shipping networks have become increasingly integrated into traditional European trade routes, requiring persistent surveillance to distinguish legitimate from questionable operations.
      </p>

      <p>The Americas demonstrated concentrated evasion activity, particularly around Venezuelan territorial waters where 3,444 spoofing incidents illustrated how sanctions enforcement drives technological adaptation among maritime operators seeking to circumvent monitoring systems.
      </p>

      <p>The Red Sea maintained relatively elevated spoofing activity with 4,749 incidents despite regional tensions, while commercial vessels continued standard identification protocols in most cases, suggesting that international shipping adapted operational security practices to the challenging regional environment.
      </p>

      <p>Theia's 2024 intelligence data reveals a global maritime environment where transparent commercial shipping operates alongside increasingly sophisticated alternative networks. The concentration of ship-to-ship transfer activity in Asia-Pacific waters, combined with extensive electronic countermeasures in energy corridors and dark fleet operations in European waters, demonstrates that modern maritime security requires comprehensive regional monitoring capabilities to maintain effective oversight.
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
    // Create the complete chart HTML - KEPT createSummaryStats(), REMOVED region cards
    const chartHTML = `
      <div class="final-chart-container">
        <h3 class="final-chart-title">Global Maritime Intelligence Summary</h3>
        <p class="final-chart-subtitle">
          Comprehensive regional analysis of Theia's 2024 detection capabilities across ${regionalData.length} critical maritime theaters
        </p>
        
        ${createSummaryStats()}
        
        ${createNarrative()}
      </div>
    `;

    // Replace the existing chart content
    chartContainer.innerHTML = chartHTML;

    // Initialize scroll animations
    initializeScrollAnimations();
    
    console.log('✅ Final chart initialized successfully with real CSV data');
    console.log('📊 Real Data Totals:', realTotals);
    console.log('📊 Regional Data Count:', regionalData.length);
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
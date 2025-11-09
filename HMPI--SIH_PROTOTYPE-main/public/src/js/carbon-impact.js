// Carbon Impact Tracking Module
console.log('Carbon Impact Module loaded');

// Carbon tracking data
let carbonImpact = {
    totalCO2Saved: 0,
    testsPerformed: 0,
    treesEquivalent: 0,
    carsRemoved: 0,
    energySaved: 0,
    lastUpdated: new Date(),
    milestones: []
};

// Constants
const CO2_PER_TRADITIONAL_TEST = 72.25; // kg
const CO2_PER_DIGITAL_TEST = 0.68; // kg
const CO2_SAVED_PER_TEST = 71.57; // kg
const CO2_PER_TREE_YEAR = 21; // kg CO2 absorbed per tree per year
const CO2_PER_CAR_YEAR = 4600; // kg CO2 per car per year
const ENERGY_SAVED_PER_TEST = 84.2; // kWh

// Load saved carbon data
function loadCarbonImpact() {
    try {
        const saved = localStorage.getItem('carbon-impact');
        if (saved) {
            carbonImpact = JSON.parse(saved);
            carbonImpact.lastUpdated = new Date(carbonImpact.lastUpdated);
        }
    } catch (e) {
        console.warn('Could not load carbon impact data');
    }
}

// Save carbon data
function saveCarbonImpact() {
    try {
        localStorage.setItem('carbon-impact', JSON.stringify(carbonImpact));
    } catch (e) {
        console.warn('Could not save carbon impact data');
    }
}

// Update carbon impact
function updateCarbonImpact(testsCount = 1) {
    carbonImpact.testsPerformed += testsCount;
    carbonImpact.totalCO2Saved += (CO2_SAVED_PER_TEST * testsCount);
    carbonImpact.energySaved += (ENERGY_SAVED_PER_TEST * testsCount);
    carbonImpact.treesEquivalent = (carbonImpact.totalCO2Saved / CO2_PER_TREE_YEAR).toFixed(1);
    carbonImpact.carsRemoved = (carbonImpact.totalCO2Saved / CO2_PER_CAR_YEAR).toFixed(3);
    carbonImpact.lastUpdated = new Date();
    
    // Check for milestones
    checkMilestones();
    
    saveCarbonImpact();
    displayCarbonImpact();
    displayCarbonComparison();
    displayMilestones();
}

// Check and celebrate milestones
function checkMilestones() {
    const milestones = [
        { tests: 10, message: '🎉 First 10 tests! You saved 715.7 kg CO₂', achieved: false },
        { tests: 50, message: '🌟 50 tests milestone! Equivalent to 170 trees planted', achieved: false },
        { tests: 100, message: '🏆 100 tests! You prevented 7,157 kg CO₂ emissions', achieved: false },
        { tests: 500, message: '🌍 500 tests! Impact of removing 7.8 cars from roads', achieved: false },
        { tests: 1000, message: '💚 1000 tests! 71,570 kg CO₂ saved - Amazing impact!', achieved: false }
    ];
    
    milestones.forEach(milestone => {
        if (carbonImpact.testsPerformed >= milestone.tests && 
            !carbonImpact.milestones.includes(milestone.tests)) {
            carbonImpact.milestones.push(milestone.tests);
            showMilestoneNotification(milestone.message);
        }
    });
}

// Show milestone notification
function showMilestoneNotification(message) {
    if (typeof showNotification === 'function') {
        showNotification(message, 'success');
    }
    
    // Add confetti effect
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    const colors = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c', '#9b59b6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Display carbon impact dashboard
function displayCarbonImpact() {
    const container = document.getElementById('carbon-impact-dashboard');
    if (!container) return;
    
    const homesEquivalent = (carbonImpact.energySaved / 10000).toFixed(2);
    const gallonsGasSaved = (carbonImpact.totalCO2Saved / 8.89).toFixed(0); // 8.89 kg CO2 per gallon
    
    container.innerHTML = `
        <div class="carbon-hero">
            <div class="carbon-hero-content">
                <h2>🌍 Your Environmental Impact</h2>
                <div class="carbon-main-stat">
                    <div class="carbon-number">${carbonImpact.totalCO2Saved.toFixed(2)}</div>
                    <div class="carbon-unit">kg CO₂ Prevented</div>
                </div>
                <p class="carbon-tagline">Making a difference, one test at a time</p>
            </div>
        </div>
        
        <div class="carbon-stats-grid">
            <div class="carbon-stat-card trees">
                <div class="carbon-stat-icon">🌳</div>
                <div class="carbon-stat-value">${carbonImpact.treesEquivalent}</div>
                <div class="carbon-stat-label">Trees Planted</div>
                <div class="carbon-stat-detail">Equivalent impact</div>
            </div>
            
            <div class="carbon-stat-card cars">
                <div class="carbon-stat-icon">🚗</div>
                <div class="carbon-stat-value">${carbonImpact.carsRemoved}</div>
                <div class="carbon-stat-label">Cars Removed</div>
                <div class="carbon-stat-detail">From roads annually</div>
            </div>
            
            <div class="carbon-stat-card energy">
                <div class="carbon-stat-icon">⚡</div>
                <div class="carbon-stat-value">${carbonImpact.energySaved.toFixed(0)}</div>
                <div class="carbon-stat-label">kWh Saved</div>
                <div class="carbon-stat-detail">≈ ${homesEquivalent} homes/year</div>
            </div>
            
            <div class="carbon-stat-card fuel">
                <div class="carbon-stat-icon">⛽</div>
                <div class="carbon-stat-value">${gallonsGasSaved}</div>
                <div class="carbon-stat-label">Gallons Gas</div>
                <div class="carbon-stat-detail">Equivalent saved</div>
            </div>
        </div>
        
        <div class="carbon-progress">
            <h4>🎯 Progress to Next Milestone</h4>
            ${getNextMilestoneProgress()}
        </div>
    `;
}

// Get next milestone progress
function getNextMilestoneProgress() {
    const milestones = [10, 50, 100, 500, 1000, 5000, 10000];
    const nextMilestone = milestones.find(m => m > carbonImpact.testsPerformed) || 10000;
    const progress = (carbonImpact.testsPerformed / nextMilestone * 100).toFixed(1);
    
    return `
        <div class="milestone-progress">
            <div class="milestone-info">
                <span>${carbonImpact.testsPerformed} / ${nextMilestone} tests</span>
                <span>${progress}%</span>
            </div>
            <div class="milestone-bar">
                <div class="milestone-fill" style="width: ${progress}%"></div>
            </div>
            <p class="milestone-reward">🏆 Unlock achievement at ${nextMilestone} tests!</p>
        </div>
    `;
}

// Display carbon comparison
function displayCarbonComparison() {
    const container = document.getElementById('carbon-comparison-chart');
    if (!container) return;
    
    const traditionalTotal = carbonImpact.testsPerformed * CO2_PER_TRADITIONAL_TEST;
    const digitalTotal = carbonImpact.testsPerformed * CO2_PER_DIGITAL_TEST;
    
    container.innerHTML = `
        <h4>📊 Traditional vs Digital Monitoring</h4>
        <div class="comparison-visual">
            <div class="comparison-method traditional">
                <div class="method-icon">🏭</div>
                <div class="method-name">Traditional Lab Testing</div>
                <div class="method-co2">${traditionalTotal.toFixed(2)} kg CO₂</div>
                <div class="method-bar">
                    <div class="bar-fill traditional-bar" style="width: 100%"></div>
                </div>
                <div class="method-details">
                    <span>🚗 Transport: 12 kg</span>
                    <span>🔬 Lab: 50 kg</span>
                    <span>⚗️ Processing: 10.25 kg</span>
                </div>
            </div>
            
            <div class="comparison-method digital">
                <div class="method-icon">💻</div>
                <div class="method-name">PURE-Intelligence Digital</div>
                <div class="method-co2">${digitalTotal.toFixed(2)} kg CO₂</div>
                <div class="method-bar">
                    <div class="bar-fill digital-bar" style="width: 1%"></div>
                </div>
                <div class="method-details">
                    <span>☀️ Solar Sensor: 0.43 kg</span>
                    <span>☁️ Cloud: 0.17 kg</span>
                    <span>📡 Data: 0.08 kg</span>
                </div>
            </div>
        </div>
        
        <div class="comparison-savings">
            <div class="savings-badge">
                <span class="savings-percent">99%</span>
                <span class="savings-label">Less Emissions</span>
            </div>
            <div class="savings-amount">
                <strong>${carbonImpact.totalCO2Saved.toFixed(2)} kg CO₂</strong> prevented
            </div>
        </div>
    `;
}

// Display milestones
function displayMilestones() {
    const container = document.getElementById('carbon-milestones');
    if (!container) return;
    
    const allMilestones = [
        { tests: 10, icon: '🌱', title: 'First Steps', reward: '715.7 kg CO₂ saved' },
        { tests: 50, icon: '🌿', title: 'Growing Impact', reward: '170 trees equivalent' },
        { tests: 100, icon: '🌳', title: 'Forest Builder', reward: '7,157 kg CO₂ saved' },
        { tests: 500, icon: '🌲', title: 'Climate Champion', reward: '7.8 cars removed' },
        { tests: 1000, icon: '🏆', title: 'Eco Warrior', reward: '71,570 kg CO₂ saved' },
        { tests: 5000, icon: '🌍', title: 'Planet Protector', reward: '357 tons CO₂ saved' },
        { tests: 10000, icon: '⭐', title: 'Sustainability Legend', reward: '715 tons CO₂ saved' }
    ];
    
    container.innerHTML = `
        <h4>🏅 Achievement Milestones</h4>
        <div class="milestones-grid">
            ${allMilestones.map(milestone => {
                const achieved = carbonImpact.milestones.includes(milestone.tests);
                const current = carbonImpact.testsPerformed >= milestone.tests;
                return `
                    <div class="milestone-card ${achieved ? 'achieved' : ''} ${current ? 'current' : ''}">
                        <div class="milestone-icon">${milestone.icon}</div>
                        <div class="milestone-title">${milestone.title}</div>
                        <div class="milestone-tests">${milestone.tests} tests</div>
                        <div class="milestone-reward">${milestone.reward}</div>
                        ${achieved ? '<div class="milestone-badge">✓ Unlocked</div>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Display real-time carbon counter
function displayRealtimeCarbonCounter() {
    const container = document.getElementById('realtime-carbon-counter');
    if (!container) return;
    
    // Animate counter
    let currentValue = 0;
    const targetValue = carbonImpact.totalCO2Saved;
    const duration = 2000; // 2 seconds
    const increment = targetValue / (duration / 16); // 60fps
    
    const counter = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(counter);
        }
        
        container.innerHTML = `
            <div class="realtime-counter">
                <div class="counter-label">Live CO₂ Prevented</div>
                <div class="counter-value">${currentValue.toFixed(2)}</div>
                <div class="counter-unit">kg CO₂</div>
                <div class="counter-pulse"></div>
            </div>
        `;
    }, 16);
}

// Generate carbon certificate
function generateCarbonCertificate() {
    const certificateWindow = window.open('', '_blank');
    const date = new Date().toLocaleDateString();
    
    certificateWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Carbon Impact Certificate</title>
            <style>
                body {
                    font-family: 'Georgia', serif;
                    margin: 0;
                    padding: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .certificate {
                    background: white;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 60px;
                    border: 20px solid #f8f9fa;
                    box-shadow: 0 10px 50px rgba(0,0,0,0.3);
                }
                .certificate-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .certificate-title {
                    font-size: 3rem;
                    color: #2c3e50;
                    margin: 20px 0;
                }
                .certificate-subtitle {
                    font-size: 1.5rem;
                    color: #7f8c8d;
                }
                .certificate-body {
                    text-align: center;
                    margin: 40px 0;
                }
                .certificate-stat {
                    font-size: 4rem;
                    color: #2ecc71;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .certificate-text {
                    font-size: 1.2rem;
                    line-height: 1.8;
                    color: #34495e;
                    margin: 20px 0;
                }
                .certificate-impact {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin: 40px 0;
                }
                .impact-item {
                    padding: 20px;
                    background: #ecf0f1;
                    border-radius: 10px;
                }
                .impact-icon {
                    font-size: 3rem;
                }
                .impact-value {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #2c3e50;
                }
                .certificate-footer {
                    text-align: center;
                    margin-top: 60px;
                    padding-top: 20px;
                    border-top: 2px solid #ecf0f1;
                }
                .seal {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #2ecc71, #27ae60);
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 2rem;
                    margin: 20px 0;
                }
                @media print {
                    body { background: white; padding: 0; }
                    .certificate { border: none; box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="certificate">
                <div class="certificate-header">
                    <div style="font-size: 4rem;">🌍</div>
                    <div class="certificate-title">Carbon Impact Certificate</div>
                    <div class="certificate-subtitle">Environmental Achievement Recognition</div>
                </div>
                
                <div class="certificate-body">
                    <p class="certificate-text">
                        This certifies that through the use of<br>
                        <strong>PURE-Intelligence Water Quality Monitoring System</strong>
                    </p>
                    
                    <div class="certificate-stat">${carbonImpact.totalCO2Saved.toFixed(2)} kg</div>
                    <p class="certificate-text">
                        of CO₂ emissions have been prevented through<br>
                        <strong>${carbonImpact.testsPerformed} sustainable water quality tests</strong>
                    </p>
                    
                    <div class="certificate-impact">
                        <div class="impact-item">
                            <div class="impact-icon">🌳</div>
                            <div class="impact-value">${carbonImpact.treesEquivalent}</div>
                            <div>Trees Planted</div>
                        </div>
                        <div class="impact-item">
                            <div class="impact-icon">🚗</div>
                            <div class="impact-value">${carbonImpact.carsRemoved}</div>
                            <div>Cars Removed</div>
                        </div>
                        <div class="impact-item">
                            <div class="impact-icon">⚡</div>
                            <div class="impact-value">${carbonImpact.energySaved.toFixed(0)}</div>
                            <div>kWh Saved</div>
                        </div>
                    </div>
                    
                    <p class="certificate-text">
                        By choosing energy-efficient digital monitoring over traditional lab testing,<br>
                        you have contributed to a <strong>99% reduction in carbon emissions</strong><br>
                        and helped build a sustainable future.
                    </p>
                </div>
                
                <div class="certificate-footer">
                    <div class="seal">✓</div>
                    <p><strong>Issued: ${date}</strong></p>
                    <p>PURE-Intelligence Environmental Monitoring System</p>
                    <p style="color: #95a5a6; font-size: 0.9rem;">
                        This certificate represents real environmental impact achieved through<br>
                        sustainable water quality monitoring practices.
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()" style="
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 15px 30px;
                    font-size: 1.1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                ">🖨️ Print Certificate</button>
            </div>
        </body>
        </html>
    `);
    
    certificateWindow.document.close();
}

// Initialize carbon impact module
function initializeCarbonImpact() {
    loadCarbonImpact();
    displayCarbonImpact();
    displayCarbonComparison();
    displayMilestones();
    displayRealtimeCarbonCounter();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCarbonImpact);
} else {
    initializeCarbonImpact();
}


// Social sharing functions
function shareOnTwitter() {
    const text = `I've prevented ${carbonImpact.totalCO2Saved.toFixed(2)} kg of CO₂ emissions using PURE-Intelligence water monitoring! That's equivalent to planting ${carbonImpact.treesEquivalent} trees! 🌍💚 #Sustainability #ClimateAction`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareOnLinkedIn() {
    const url = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank');
}

function copyImpactLink() {
    const text = `Check out my environmental impact: ${carbonImpact.totalCO2Saved.toFixed(2)} kg CO₂ prevented, equivalent to ${carbonImpact.treesEquivalent} trees planted!`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showNotification === 'function') {
                showNotification('Impact summary copied to clipboard!', 'success');
            }
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        if (typeof showNotification === 'function') {
            showNotification('Impact summary copied to clipboard!', 'success');
        }
    }
}

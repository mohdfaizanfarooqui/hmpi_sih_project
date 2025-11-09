// Energy Efficiency Calculator Module
console.log('Energy Calculator Module loaded');

// Energy consumption constants (kWh)
const ENERGY_CONSTANTS = {
    labTesting: {
        perSample: 50,        // kWh per lab test
        transport: 5,         // kWh per trip (avg 50km)
        processing: 30        // kWh for sample processing
    },
    iotMonitoring: {
        perSensor: 0.5,       // kWh per sensor per month
        dataTransfer: 0.1,    // kWh per data transmission
        cloudProcessing: 0.2  // kWh per analysis
    },
    treatment: {
        chemical: 100,        // kWh per 1000L
        uv: 80,              // kWh per 1000L
        ro: 150,             // kWh per 1000L
        phyto: 5             // kWh per 1000L (phytoremediation)
    }
};

// Carbon emission factors (kg CO2 per kWh)
const CARBON_FACTOR = 0.85; // Average grid carbon intensity

// Energy savings tracker
let energySavings = {
    totalSaved: 0,
    carbonOffset: 0,
    testsConducted: 0,
    lastUpdated: new Date()
};

// Load saved data
function loadEnergySavings() {
    try {
        const saved = localStorage.getItem('energy-savings');
        if (saved) {
            energySavings = JSON.parse(saved);
            energySavings.lastUpdated = new Date(energySavings.lastUpdated);
        }
    } catch (e) {
        console.warn('Could not load energy savings data');
    }
}

// Save energy data
function saveEnergySavings() {
    try {
        localStorage.setItem('energy-savings', JSON.stringify(energySavings));
    } catch (e) {
        console.warn('Could not save energy savings data');
    }
}

// Calculate energy saved per test
function calculateEnergySaved() {
    const labEnergy = ENERGY_CONSTANTS.labTesting.perSample + 
                     ENERGY_CONSTANTS.labTesting.transport + 
                     ENERGY_CONSTANTS.labTesting.processing;
    
    const iotEnergy = ENERGY_CONSTANTS.iotMonitoring.perSensor + 
                     ENERGY_CONSTANTS.iotMonitoring.dataTransfer + 
                     ENERGY_CONSTANTS.iotMonitoring.cloudProcessing;
    
    return labEnergy - iotEnergy;
}

// Update energy savings
function updateEnergySavings(testsCount = 1) {
    const energyPerTest = calculateEnergySaved();
    const totalEnergy = energyPerTest * testsCount;
    const carbonSaved = totalEnergy * CARBON_FACTOR;
    
    energySavings.totalSaved += totalEnergy;
    energySavings.carbonOffset += carbonSaved;
    energySavings.testsConducted += testsCount;
    energySavings.lastUpdated = new Date();
    
    saveEnergySavings();
    displayEnergySavings();
}

// Display energy savings dashboard
function displayEnergySavings() {
    const container = document.getElementById('energy-savings-dashboard');
    if (!container) return;

    const energyPerTest = calculateEnergySaved();
    const treesEquivalent = (energySavings.carbonOffset / 21).toFixed(1); // 1 tree absorbs ~21kg CO2/year
    const homesEquivalent = (energySavings.totalSaved / 10000).toFixed(2); // Avg home uses 10,000 kWh/year

    container.innerHTML = `
        <div class="energy-dashboard">
            <div class="energy-stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f39c12, #e67e22);">
                    <i class="fas fa-bolt"></i>
                </div>
                <div class="stat-content">
                    <h4>${energySavings.totalSaved.toFixed(2)} kWh</h4>
                    <p>Total Energy Saved</p>
                    <small>≈ ${homesEquivalent} homes powered for 1 year</small>
                </div>
            </div>

            <div class="energy-stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #2ecc71, #27ae60);">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="stat-content">
                    <h4>${energySavings.carbonOffset.toFixed(2)} kg</h4>
                    <p>CO₂ Emissions Prevented</p>
                    <small>≈ ${treesEquivalent} trees planted</small>
                </div>
            </div>

            <div class="energy-stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #3498db, #2980b9);">
                    <i class="fas fa-vial"></i>
                </div>
                <div class="stat-content">
                    <h4>${energySavings.testsConducted}</h4>
                    <p>Tests Conducted</p>
                    <small>${energyPerTest.toFixed(2)} kWh saved per test</small>
                </div>
            </div>

            <div class="energy-stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #9b59b6, #8e44ad);">
                    <i class="fas fa-percentage"></i>
                </div>
                <div class="stat-content">
                    <h4>94%</h4>
                    <p>Energy Efficiency</p>
                    <small>vs traditional lab testing</small>
                </div>
            </div>
        </div>

        <div class="energy-comparison">
            <h4><i class="fas fa-balance-scale"></i> Energy Comparison</h4>
            <div class="comparison-chart">
                <div class="comparison-bar">
                    <div class="bar-label">Traditional Lab Testing</div>
                    <div class="bar-container">
                        <div class="bar traditional" style="width: 100%;">
                            ${ENERGY_CONSTANTS.labTesting.perSample + ENERGY_CONSTANTS.labTesting.transport + ENERGY_CONSTANTS.labTesting.processing} kWh
                        </div>
                    </div>
                </div>
                <div class="comparison-bar">
                    <div class="bar-label">IoT Digital Monitoring</div>
                    <div class="bar-container">
                        <div class="bar iot" style="width: 6%;">
                            ${(ENERGY_CONSTANTS.iotMonitoring.perSensor + ENERGY_CONSTANTS.iotMonitoring.dataTransfer + ENERGY_CONSTANTS.iotMonitoring.cloudProcessing).toFixed(1)} kWh
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Calculate treatment energy requirements
function calculateTreatmentEnergy(contaminationLevel, volume = 1000) {
    const treatments = [];
    
    // Recommend treatment based on contamination
    if (contaminationLevel < 15) {
        treatments.push({
            method: 'Phytoremediation',
            energy: (ENERGY_CONSTANTS.treatment.phyto * volume / 1000).toFixed(2),
            cost: ((ENERGY_CONSTANTS.treatment.phyto * volume / 1000) * 0.12).toFixed(2), // $0.12 per kWh
            efficiency: 'High',
            carbonFootprint: ((ENERGY_CONSTANTS.treatment.phyto * volume / 1000) * CARBON_FACTOR).toFixed(2),
            recommended: true
        });
    }
    
    treatments.push(
        {
            method: 'UV Treatment',
            energy: (ENERGY_CONSTANTS.treatment.uv * volume / 1000).toFixed(2),
            cost: ((ENERGY_CONSTANTS.treatment.uv * volume / 1000) * 0.12).toFixed(2),
            efficiency: 'Medium',
            carbonFootprint: ((ENERGY_CONSTANTS.treatment.uv * volume / 1000) * CARBON_FACTOR).toFixed(2),
            recommended: contaminationLevel >= 15 && contaminationLevel < 30
        },
        {
            method: 'Chemical Treatment',
            energy: (ENERGY_CONSTANTS.treatment.chemical * volume / 1000).toFixed(2),
            cost: ((ENERGY_CONSTANTS.treatment.chemical * volume / 1000) * 0.12).toFixed(2),
            efficiency: 'Medium',
            carbonFootprint: ((ENERGY_CONSTANTS.treatment.chemical * volume / 1000) * CARBON_FACTOR).toFixed(2),
            recommended: contaminationLevel >= 30 && contaminationLevel < 45
        },
        {
            method: 'Reverse Osmosis',
            energy: (ENERGY_CONSTANTS.treatment.ro * volume / 1000).toFixed(2),
            cost: ((ENERGY_CONSTANTS.treatment.ro * volume / 1000) * 0.12).toFixed(2),
            efficiency: 'Low',
            carbonFootprint: ((ENERGY_CONSTANTS.treatment.ro * volume / 1000) * CARBON_FACTOR).toFixed(2),
            recommended: contaminationLevel >= 45
        }
    );
    
    return treatments;
}

// Display treatment recommendations
function displayTreatmentRecommendations(hpi) {
    const container = document.getElementById('treatment-recommendations');
    if (!container) return;

    const treatments = calculateTreatmentEnergy(hpi);
    const recommended = treatments.find(t => t.recommended);

    container.innerHTML = `
        <h4><i class="fas fa-filter"></i> Energy-Efficient Treatment Recommendations</h4>
        <p>Based on HPI: ${hpi} - ${getWaterQualityStatus(hpi).text}</p>
        
        <div class="treatment-grid">
            ${treatments.map(treatment => `
                <div class="treatment-card ${treatment.recommended ? 'recommended' : ''}">
                    ${treatment.recommended ? '<div class="recommended-badge"><i class="fas fa-star"></i> Recommended</div>' : ''}
                    <h5>${treatment.method}</h5>
                    <div class="treatment-stats">
                        <div class="treatment-stat">
                            <i class="fas fa-bolt"></i>
                            <span>${treatment.energy} kWh</span>
                            <small>per 1000L</small>
                        </div>
                        <div class="treatment-stat">
                            <i class="fas fa-dollar-sign"></i>
                            <span>$${treatment.cost}</span>
                            <small>energy cost</small>
                        </div>
                        <div class="treatment-stat">
                            <i class="fas fa-leaf"></i>
                            <span>${treatment.carbonFootprint} kg</span>
                            <small>CO₂ emissions</small>
                        </div>
                    </div>
                    <div class="efficiency-badge ${treatment.efficiency.toLowerCase()}">
                        ${treatment.efficiency} Efficiency
                    </div>
                </div>
            `).join('')}
        </div>

        ${recommended ? `
            <div class="alert alert-success" style="margin-top: 20px;">
                <i class="fas fa-lightbulb"></i>
                <strong>Energy Tip:</strong> ${recommended.method} is the most energy-efficient option for this contamination level, 
                saving up to ${((treatments[treatments.length-1].energy - recommended.energy) / treatments[treatments.length-1].energy * 100).toFixed(0)}% 
                energy compared to the most intensive method.
            </div>
        ` : ''}
    `;
}

// Calculate sustainability score
function calculateSustainabilityScore() {
    let score = 0;
    const factors = [];

    // Energy efficiency (40 points)
    const energyEfficiency = (energySavings.totalSaved / (energySavings.testsConducted || 1)) / calculateEnergySaved();
    score += Math.min(40, energyEfficiency * 40);
    factors.push({ name: 'Energy Efficiency', score: Math.min(40, Math.round(energyEfficiency * 40)), max: 40 });

    // Carbon offset (30 points)
    const carbonScore = Math.min(30, (energySavings.carbonOffset / 1000) * 30);
    score += carbonScore;
    factors.push({ name: 'Carbon Offset', score: Math.round(carbonScore), max: 30 });

    // Data coverage (20 points)
    const coverageScore = Math.min(20, (waterQualityData.length / 50) * 20);
    score += coverageScore;
    factors.push({ name: 'Monitoring Coverage', score: Math.round(coverageScore), max: 20 });

    // Frequency (10 points)
    const frequencyScore = Math.min(10, (energySavings.testsConducted / 100) * 10);
    score += frequencyScore;
    factors.push({ name: 'Testing Frequency', score: Math.round(frequencyScore), max: 10 });

    return {
        total: Math.round(score),
        factors: factors,
        grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D'
    };
}

// Display sustainability score
function displaySustainabilityScore() {
    const container = document.getElementById('sustainability-score');
    if (!container) return;

    const scoreData = calculateSustainabilityScore();

    container.innerHTML = `
        <div class="sustainability-card">
            <h4><i class="fas fa-award"></i> Sustainability Score</h4>
            <div class="score-display">
                <div class="score-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#ecf0f1" stroke-width="10"/>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#2ecc71" stroke-width="10"
                                stroke-dasharray="${scoreData.total * 2.83} 283"
                                transform="rotate(-90 50 50)"/>
                    </svg>
                    <div class="score-text">
                        <span class="score-number">${scoreData.total}</span>
                        <span class="score-grade">${scoreData.grade}</span>
                    </div>
                </div>
            </div>
            <div class="score-factors">
                ${scoreData.factors.map(factor => `
                    <div class="factor-row">
                        <span class="factor-name">${factor.name}</span>
                        <div class="factor-bar">
                            <div class="factor-fill" style="width: ${(factor.score/factor.max)*100}%"></div>
                        </div>
                        <span class="factor-score">${factor.score}/${factor.max}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Initialize energy calculator
function initializeEnergyCalculator() {
    loadEnergySavings();
    displayEnergySavings();
    displaySustainabilityScore();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnergyCalculator);
} else {
    initializeEnergyCalculator();
}

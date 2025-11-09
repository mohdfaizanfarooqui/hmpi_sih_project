// Climate Integration Module
console.log('Climate Integration Module loaded');

// OpenWeatherMap API configuration
const WEATHER_API_KEY = ''; // Users can add their own key
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

// Climate data storage
let climateData = {
    current: null,
    forecast: null,
    historical: []
};

// Initialize climate features
async function initializeClimate() {
    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                fetchWeatherData(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.log('Location access denied, using default location');
                fetchWeatherData(28.6139, 77.2090); // Default: Delhi
            }
        );
    }
}

// Fetch current weather data
async function fetchWeatherData(lat, lon) {
    if (!WEATHER_API_KEY) {
        // Use mock data if no API key
        displayMockWeatherData();
        return;
    }

    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        climateData.current = data;
        displayWeatherData(data);
        
        // Fetch forecast
        fetchForecastData(lat, lon);
    } catch (error) {
        console.error('Weather API error:', error);
        displayMockWeatherData();
    }
}

// Fetch forecast data
async function fetchForecastData(lat, lon) {
    if (!WEATHER_API_KEY) return;

    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        climateData.forecast = data;
        displayForecastData(data);
    } catch (error) {
        console.error('Forecast API error:', error);
    }
}

// Display weather data
function displayWeatherData(data) {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;

    const temp = data.main?.temp || 0;
    const humidity = data.main?.humidity || 0;
    const description = data.weather?.[0]?.description || 'Clear';
    const icon = data.weather?.[0]?.icon || '01d';

    weatherWidget.innerHTML = `
        <div class="weather-card">
            <div class="weather-header">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather">
                <div>
                    <h3>${Math.round(temp)}°C</h3>
                    <p>${description}</p>
                </div>
            </div>
            <div class="weather-details">
                <div class="weather-stat">
                    <i class="fas fa-tint"></i>
                    <span>Humidity: ${humidity}%</span>
                </div>
                <div class="weather-stat">
                    <i class="fas fa-wind"></i>
                    <span>Wind: ${data.wind?.speed || 0} m/s</span>
                </div>
            </div>
        </div>
    `;

    // Check for contamination risk based on weather
    checkWeatherRisk(data);
}

// Display mock weather data (when no API key)
function displayMockWeatherData() {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;

    weatherWidget.innerHTML = `
        <div class="weather-card">
            <div class="weather-header">
                <img src="https://openweathermap.org/img/wn/01d@2x.png" alt="Weather">
                <div>
                    <h3>28°C</h3>
                    <p>Partly Cloudy</p>
                </div>
            </div>
            <div class="weather-details">
                <div class="weather-stat">
                    <i class="fas fa-tint"></i>
                    <span>Humidity: 65%</span>
                </div>
                <div class="weather-stat">
                    <i class="fas fa-wind"></i>
                    <span>Wind: 3.5 m/s</span>
                </div>
            </div>
            <div class="alert alert-info" style="margin-top: 10px; font-size: 0.85rem;">
                <i class="fas fa-info-circle"></i>
                Add OpenWeatherMap API key for live data
            </div>
        </div>
    `;
}

// Display forecast data
function displayForecastData(data) {
    const forecastContainer = document.getElementById('forecast-container');
    if (!forecastContainer) return;

    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    forecastContainer.innerHTML = dailyForecasts.map(day => {
        const date = new Date(day.dt * 1000);
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;
        
        return `
            <div class="forecast-day">
                <p>${date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather">
                <p>${temp}°C</p>
            </div>
        `;
    }).join('');
}

// Check weather-based contamination risk
function checkWeatherRisk(weatherData) {
    const alerts = [];
    
    // Heavy rainfall risk
    if (weatherData.rain && weatherData.rain['1h'] > 10) {
        alerts.push({
            type: 'warning',
            message: 'Heavy rainfall detected - Increased contamination risk from runoff',
            icon: 'cloud-rain'
        });
    }
    
    // High temperature risk
    if (weatherData.main.temp > 35) {
        alerts.push({
            type: 'warning',
            message: 'High temperature - Metal concentration may increase due to evaporation',
            icon: 'temperature-high'
        });
    }
    
    // Humidity risk
    if (weatherData.main.humidity > 80) {
        alerts.push({
            type: 'info',
            message: 'High humidity - Monitor for increased microbial activity',
            icon: 'tint'
        });
    }

    displayClimateAlerts(alerts);
}

// Display climate alerts
function displayClimateAlerts(alerts) {
    const alertsContainer = document.getElementById('climate-alerts');
    if (!alertsContainer) return;

    if (alerts.length === 0) {
        alertsContainer.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                No weather-related contamination risks detected
            </div>
        `;
        return;
    }

    alertsContainer.innerHTML = alerts.map(alert => `
        <div class="alert alert-${alert.type}">
            <i class="fas fa-${alert.icon}"></i>
            ${alert.message}
        </div>
    `).join('');
}

// Analyze climate-contamination correlation
function analyzeClimateCorrelation() {
    if (waterQualityData.length === 0) {
        showNotification('No data available for climate correlation analysis', 'error');
        return;
    }

    // Group data by temperature ranges
    const correlationData = {
        temperature: [],
        contamination: []
    };

    waterQualityData.forEach(data => {
        if (data.climate && data.climate.temperature) {
            correlationData.temperature.push(data.climate.temperature);
            correlationData.contamination.push(parseFloat(data.indices.hpi));
        }
    });

    if (correlationData.temperature.length > 0) {
        displayCorrelationChart(correlationData);
    } else {
        showNotification('No climate data available for correlation analysis', 'info');
    }
}

// Display correlation chart
function displayCorrelationChart(data) {
    const ctx = document.getElementById('climate-correlation-chart');
    if (!ctx) return;

    if (window.climateCorrelationChart) {
        window.climateCorrelationChart.destroy();
    }

    window.climateCorrelationChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Temperature vs HPI',
                data: data.temperature.map((temp, i) => ({
                    x: temp,
                    y: data.contamination[i]
                })),
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Climate-Contamination Correlation'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'HPI Value'
                    }
                }
            }
        }
    });
}

// Predict contamination based on weather forecast
function predictContaminationRisk() {
    if (!climateData.forecast) {
        showNotification('Weather forecast data not available', 'error');
        return;
    }

    const predictions = [];
    const forecastDays = climateData.forecast.list.filter((item, index) => index % 8 === 0).slice(0, 7);

    forecastDays.forEach(day => {
        const temp = day.main.temp;
        const rain = day.rain ? day.rain['3h'] || 0 : 0;
        const humidity = day.main.humidity;

        let riskScore = 0;
        let riskFactors = [];

        // Temperature risk
        if (temp > 35) {
            riskScore += 30;
            riskFactors.push('High temperature');
        } else if (temp > 30) {
            riskScore += 15;
        }

        // Rainfall risk
        if (rain > 20) {
            riskScore += 40;
            riskFactors.push('Heavy rainfall');
        } else if (rain > 10) {
            riskScore += 20;
            riskFactors.push('Moderate rainfall');
        }

        // Humidity risk
        if (humidity > 80) {
            riskScore += 15;
            riskFactors.push('High humidity');
        }

        const date = new Date(day.dt * 1000);
        predictions.push({
            date: date.toLocaleDateString(),
            riskScore: Math.min(riskScore, 100),
            riskLevel: riskScore > 60 ? 'High' : riskScore > 30 ? 'Moderate' : 'Low',
            factors: riskFactors
        });
    });

    displayPredictions(predictions);
}

// Display contamination predictions
function displayPredictions(predictions) {
    const container = document.getElementById('contamination-predictions');
    if (!container) return;

    container.innerHTML = `
        <h4><i class="fas fa-chart-line"></i> 7-Day Contamination Risk Forecast</h4>
        <div class="predictions-grid">
            ${predictions.map(pred => `
                <div class="prediction-card ${pred.riskLevel.toLowerCase()}-risk">
                    <div class="prediction-date">${pred.date}</div>
                    <div class="prediction-score">${pred.riskScore}%</div>
                    <div class="prediction-level">${pred.riskLevel} Risk</div>
                    ${pred.factors.length > 0 ? `
                        <div class="prediction-factors">
                            ${pred.factors.map(f => `<span class="factor-tag">${f}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClimate);
} else {
    initializeClimate();
}


// Save weather API key
function saveWeatherAPIKey() {
    const apiKey = document.getElementById('weather-api-key').value.trim();
    if (!apiKey) {
        showNotification('Please enter an API key', 'error');
        return;
    }
    
    try {
        localStorage.setItem('weather-api-key', apiKey);
        WEATHER_API_KEY = apiKey;
        showNotification('API key saved successfully! Refreshing weather data...', 'success');
        
        // Reinitialize with new API key
        setTimeout(() => {
            initializeClimate();
        }, 1000);
    } catch (e) {
        showNotification('Error saving API key', 'error');
    }
}

// Load saved API key on init
(function loadAPIKey() {
    try {
        const saved = localStorage.getItem('weather-api-key');
        if (saved) {
            WEATHER_API_KEY = saved;
            const input = document.getElementById('weather-api-key');
            if (input) {
                input.value = saved;
            }
        }
    } catch (e) {
        console.warn('Could not load saved API key');
    }
})();

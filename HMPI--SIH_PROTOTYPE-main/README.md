# PURE-Intelligence (Pollution & Utility Risk Evaluator)

A comprehensive AI-powered web application for monitoring and analyzing heavy metal pollution in water sources. Built for Smart India Hackathon with focus on climate change awareness and energy efficiency.

## 🌟 Key Features

### 🔬 Core Functionality
- **Heavy Metal Pollution Index (HPI)** - Weighted metal concentration analysis
- **Heavy Metal Evaluation Index (HEI)** - Assessment based on WHO/EPA limits
- **Contamination Degree (Cd)** - Cumulative pollution impact analysis
- **AI Disease Prediction** - ML-powered health risk assessment for 8 diseases
- **MongoDB Integration** - Persistent data storage with automatic calculations

### 🤖 AI-Powered Chatbot
- **Google Gemini Pro Integration** - Intelligent, context-aware responses
- **Dual-Mode Operation** - AI-powered + enhanced fallback responses
- **Markdown Formatting** - Rich text responses with formatting
- **Context Awareness** - Knows your application state and data

### 🌍 Climate & Energy Features
- **Weather Integration** - Real-time climate data and contamination predictions
- **Energy Tracking** - 99% energy reduction vs traditional lab testing
- **Carbon Impact** - Real-time CO₂ savings counter with milestones
- **Treatment Optimization** - Energy-efficient purification recommendations

### 🗺️ Interactive Components
- **Interactive Mapping** - Leaflet.js with color-coded pollution markers
- **Data Visualization** - Chart.js for trends and distribution analysis
- **Leaderboard System** - Rankings by pollution levels
- **Analytics Dashboard** - Comprehensive statistics and reports

### 📊 Data Management
- **CSV Import/Export** - Bulk data processing with validation
- **MongoDB Backend** - Persistent storage with automatic calculations
- **Template Download** - Standardized data entry format
- **Report Generation** - Professional PDF reports
- **Drag & Drop Upload** - User-friendly file handling

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js for interactive maps
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome for UI icons
- **Styling**: CSS Grid, Flexbox, and modern CSS features

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hmpi-monitor.git
   cd hmpi-monitor
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html
   
   # On Windows
   start index.html
   
   # On Linux
   xdg-open index.html
   ```

3. Start monitoring water quality data!

### Usage
1. **Data Entry**: Enter location coordinates and heavy metal concentrations
2. **Calculate Indices**: Use the built-in calculators for HPI, HEI, and Cd
3. **View Results**: Analyze pollution levels with color-coded status indicators
4. **Map Visualization**: View all monitoring locations on an interactive map
5. **Export Data**: Download results as CSV or generate comprehensive reports

## File Structure

```
hmpi-monitor/
├── index.html              # Main application file
├── src/
│   ├── css/
│   │   ├── styles.css       # Main stylesheet
│   │   └── components.css   # Component-specific styles
│   └── js/
│       ├── main.js          # Main application logic
│       ├── calculations.js  # Pollution index calculations
│       ├── charts.js        # Chart initialization and updates
│       ├── map.js           # Map and location functionality
│       ├── chatbot.js       # AI assistant functionality
│       └── utils.js         # Utility functions
|       |_ml-model.js        # to predict disease  
├── data/
│   └── templates/
│       └── sample_data.csv  # Sample data template
├── docs/                    # Documentation files
└── README.md               # This file
```

## Pollution Indices Explained

### Heavy Metal Pollution Index (HPI)
- **Formula**: HPI = Σ(Wi × Qi) / ΣWi
- **Scale**: <15 (Excellent), 15-30 (Good), 30-45 (Poor), >45 (Very Poor)
- **Purpose**: Overall water quality assessment with weighted metal concentrations

### Heavy Metal Evaluation Index (HEI)
- **Formula**: HEI = Σ(Ci / Si)
- **Scale**: <10 (Acceptable), 10-20 (Moderate), >20 (High Risk)
- **Purpose**: Sum of concentration ratios to permissible limits

### Contamination Degree (Cd)
- **Formula**: Similar to HEI but focuses on contamination factors
- **Scale**: <5 (Low), 5-10 (Moderate), >10 (High Contamination)
- **Purpose**: Cumulative contamination assessment

## WHO/EPA Permissible Limits

| Metal | Limit (mg/L) | Health Impact |
|-------|--------------|---------------|
| Lead (Pb) | 0.01 | Neurological damage, developmental issues |
| Mercury (Hg) | 0.006 | Brain and kidney damage |
| Cadmium (Cd) | 0.003 | Kidney damage, bone disease |
| Arsenic (As) | 0.01 | Cancer, skin lesions |
| Chromium (Cr) | 0.05 | Liver and kidney damage |
| Copper (Cu) | 2.0 | Gastrointestinal disturbance |
| Zinc (Zn) | 3.0 | Metallic taste, nausea |
| Nickel (Ni) | 0.07 | Allergic reactions, respiratory issues |

## CSV Data Format

The application accepts CSV files with the following columns:
```csv
location,latitude,longitude,date,lead,mercury,cadmium,arsenic,chromium,copper,zinc,nickel
Sample Location,18.5204,73.8567,2024-01-15,0.005,0.002,0.001,0.008,0.02,0.1,0.5,0.03
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Open an issue on GitHub
- Use the built-in chatbot assistant in the application
- Check the documentation in the `/docs` folder

## Acknowledgments

- World Health Organization (WHO) for water quality standards
- Environmental Protection Agency (EPA) for permissible limits
- OpenStreetMap for mapping data
- Chart.js and Leaflet.js communities for excellent libraries

---

**Disclaimer**: This tool is for educational and monitoring purposes. For critical water quality decisions, consult certified environmental professionals and laboratories.

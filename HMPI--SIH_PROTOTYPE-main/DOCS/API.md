# API Documentation

## JavaScript Functions Reference

### Core Calculation Functions

#### `calculateHPI(metals)`
Calculates the Heavy Metal Pollution Index using weighted metal concentrations.

**Parameters:**
- `metals` (Object): Object containing metal concentrations in mg/L

**Returns:**
- String: HPI value formatted to 2 decimal places

**Example:**
```javascript
const metals = {
    lead: 0.012,
    mercury: 0.004,
    cadmium: 0.002,
    arsenic: 0.015
};
const hpi = calculateHPI(metals); // Returns "45.67"
```

#### `calculateHEI(metals)`
Calculates the Heavy Metal Evaluation Index.

**Parameters:**
- `metals` (Object): Object containing metal concentrations in mg/L

**Returns:**
- String: HEI value formatted to 2 decimal places

#### `calculateContaminationDegree(metals)`
Calculates the Contamination Degree.

**Parameters:**
- `metals` (Object): Object containing metal concentrations in mg/L

**Returns:**
- String: Cd value formatted to 2 decimal places

### Data Management Functions

#### `processFile(file)`
Processes uploaded CSV files and adds data to the global waterQualityData array.

**Parameters:**
- `file` (File): File object from HTML input

#### `exportResults()`
Exports all monitoring data as a CSV file.

#### `generateReport()`
Opens a new window with a formatted HTML report.

### Map Functions

#### `initializeMap()`
Initializes the Leaflet map with OpenStreetMap tiles.

#### `updateMapMarkers()`
Updates map markers based on current waterQualityData.

#### `focusOnLocation(dataIndex)`
Focuses the map on a specific monitoring location.

### Chart Functions

#### `initializeCharts()`
Sets up Chart.js instances for trends and distribution charts.

#### `updateCharts()`
Updates chart data based on current monitoring data.

### Utility Functions

#### `validateFormData()`
Validates form inputs before processing.

**Returns:**
- Boolean: true if valid, false otherwise

#### `showNotification(message, type)`
Displays a notification to the user.

**Parameters:**
- `message` (String): Notification message
- `type` (String): 'success', 'error', or 'info'

#### `getWaterQualityStatus(hpi)`
Returns quality status based on HPI value.

**Parameters:**
- `hpi` (Number): HPI value

**Returns:**
- Object: `{text: String, class: String}`

## Global Variables

### `waterQualityData`
Array containing all monitoring location data.

**Structure:**
```javascript
[{
    location: String,
    latitude: Number,
    longitude: Number,
    date: String,
    metals: {
        lead: Number,
        mercury: Number,
        cadmium: Number,
        arsenic: Number,
        chromium: Number,
        copper: Number,
        zinc: Number,
        nickel: Number
    },
    indices: {
        hpi: String,
        hei: String,
        cd: String
    }
}]
```

### `permissibleLimits`
Object containing WHO/EPA limits for each metal.

### `map`
Leaflet map instance.

### `markers`
Array of Leaflet marker objects.

### `chartInstances`
Object containing Chart.js instances.

## Events

### File Upload Events
- `dragover`: Handles file drag over upload area
- `dragleave`: Handles file drag leave upload area
- `drop`: Handles file drop on upload area
- `change`: Handles file selection via input

### Map Events
- `click`: Sets coordinates when map is clicked

### Form Events
- `keypress`: Handles Enter key in chatbot input

## Constants

### Metal Weights (for HPI calculation)
```javascript
const weights = {
    lead: 4,
    mercury: 4,
    cadmium: 3,
    arsenic: 4,
    chromium: 2,
    copper: 2,
    zinc: 1,
    nickel: 2
};
```

### Health Risk Weights
```javascript
const healthRiskWeights = {
    lead: 0.8,
    mercury: 0.9,
    cadmium: 0.7,
    arsenic: 0.8,
    chromium: 0.6,
    copper: 0.4,
    zinc: 0.2,
    nickel: 0.5
};
```

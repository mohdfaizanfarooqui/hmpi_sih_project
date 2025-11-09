// API Integration Module
console.log('API Module loaded');

// API Base URL
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';

// Save data to backend
async function saveToBackend(data) {
    try {
        // Step 1: Create or get location
        const locationResponse = await fetch(`${API_BASE_URL}/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.location,
                latitude: data.latitude,
                longitude: data.longitude
            })
        });
        
        if (!locationResponse.ok) {
            throw new Error('Failed to create location');
        }
        
        const locationData = await locationResponse.json();
        const locationId = locationData._id || locationData.id;
        
        // Step 2: Create measurement
        const measurementResponse = await fetch(`${API_BASE_URL}/measurements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location_id: locationId,
                sample_date: data.date,
                lead: data.metals.lead,
                mercury: data.metals.mercury,
                cadmium: data.metals.cadmium,
                arsenic: data.metals.arsenic,
                chromium: data.metals.chromium,
                copper: data.metals.copper,
                zinc: data.metals.zinc,
                nickel: data.metals.nickel
            })
        });
        
        if (!measurementResponse.ok) {
            throw new Error('Failed to create measurement');
        }
        
        const measurementData = await measurementResponse.json();
        console.log('Data saved to MongoDB:', measurementData);
        return measurementData;
        
    } catch (error) {
        console.error('Error saving to backend:', error);
        throw error;
    }
}

// Load data from backend
async function loadFromBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/measurements`);
        
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        
        const measurements = await response.json();
        console.log('Loaded from MongoDB:', measurements.length, 'records');
        
        // Convert backend format to frontend format
        return measurements.map(m => ({
            location: m.locationId?.name || 'Unknown',
            latitude: m.locationId?.latitude || 0,
            longitude: m.locationId?.longitude || 0,
            date: m.sampleDate,
            metals: {
                lead: m.lead,
                mercury: m.mercury,
                cadmium: m.cadmium,
                arsenic: m.arsenic,
                chromium: m.chromium,
                copper: m.copper,
                zinc: m.zinc,
                nickel: m.nickel
            },
            indices: {
                hpi: m.hpi,
                hei: m.hei,
                cd: m.cd
            }
        }));
        
    } catch (error) {
        console.error('Error loading from backend:', error);
        return [];
    }
}

// Import CSV to backend
async function importCSVToBackend(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/measurements/import`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to import CSV');
        }
        
        const result = await response.json();
        console.log('CSV imported to MongoDB:', result);
        return result;
        
    } catch (error) {
        console.error('Error importing CSV:', error);
        throw error;
    }
}

// Get analytics from backend
async function getAnalytics() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/stats`);
        
        if (!response.ok) {
            throw new Error('Failed to get analytics');
        }
        
        const stats = await response.json();
        console.log('Analytics from MongoDB:', stats);
        return stats;
        
    } catch (error) {
        console.error('Error getting analytics:', error);
        return null;
    }
}

// Export data from backend
async function exportFromBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/measurements/export`);
        
        if (!response.ok) {
            throw new Error('Failed to export data');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hmpi_data_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('Data exported from database successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Failed to export from database', 'error');
    }
}

// Initialize - Load data on page load
async function initializeAPI() {
    try {
        // Check if backend is available
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        
        if (healthResponse.ok) {
            console.log('✓ Backend API connected');
            
            // Load existing data from backend
            const backendData = await loadFromBackend();
            if (backendData.length > 0) {
                waterQualityData.push(...backendData);
                updateMapMarkers();
                updateLeaderboards();
                updateLocationTable();
                console.log(`✓ Loaded ${backendData.length} records from MongoDB`);
            }
        } else {
            console.warn('⚠ Backend API not available, using local storage');
        }
    } catch (error) {
        console.warn('⚠ Backend API not available, using local storage');
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAPI);
} else {
    initializeAPI();
}

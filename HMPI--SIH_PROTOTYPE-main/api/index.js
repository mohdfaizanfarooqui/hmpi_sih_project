require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmpi';
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Models
const Location = require('../server/models/Location');
const Measurement = require('../server/models/Measurement');
const { calculateIndices } = require('../server/utils/calculations');

// Health check
app.get('/api/health', async (req, res) => {
  await connectDB();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: isConnected ? 'connected' : 'disconnected'
  });
});

// Locations endpoints
app.get('/api/locations', async (req, res) => {
  try {
    await connectDB();
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/locations', async (req, res) => {
  try {
    await connectDB();
    const { name, latitude, longitude } = req.body;
    
    if (!name || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const location = new Location({ name, latitude, longitude });
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Measurements endpoints
app.get('/api/measurements', async (req, res) => {
  try {
    await connectDB();
    const measurements = await Measurement.find()
      .populate('locationId', 'name latitude longitude')
      .sort({ sampleDate: -1 });
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/measurements', async (req, res) => {
  try {
    await connectDB();
    const { location_id, sample_date, lead, mercury, cadmium, arsenic, chromium, copper, zinc, nickel } = req.body;
    
    if (!location_id || !sample_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const metals = { lead, mercury, cadmium, arsenic, chromium, copper, zinc, nickel };
    const indices = calculateIndices(metals);

    const measurement = new Measurement({
      locationId: location_id,
      sampleDate: sample_date,
      lead, mercury, cadmium, arsenic, chromium, copper, zinc, nickel,
      hpi: indices.hpi,
      hei: indices.hei,
      cd: indices.cd,
      healthRisk: indices.healthRisk
    });

    await measurement.save();
    res.status(201).json({ id: measurement._id, ...indices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics endpoints
app.get('/api/analytics/stats', async (req, res) => {
  try {
    await connectDB();
    const totalLocations = await Location.countDocuments();
    const totalMeasurements = await Measurement.countDocuments();
    
    const stats = await Measurement.aggregate([
      {
        $group: {
          _id: null,
          avg_hpi: { $avg: '$hpi' },
          avg_hei: { $avg: '$hei' },
          avg_cd: { $avg: '$cd' },
          max_hpi: { $max: '$hpi' },
          min_hpi: { $min: '$hpi' }
        }
      }
    ]);

    res.json({
      total_locations: totalLocations,
      total_measurements: totalMeasurements,
      ...(stats[0] || {})
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

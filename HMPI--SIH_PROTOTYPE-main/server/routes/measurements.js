const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Parser } = require('json2csv');
const Measurement = require('../models/Measurement');
const Location = require('../models/Location');
const { calculateIndices } = require('../utils/calculations');

const path = require('path');
const uploadDir = path.join(__dirname, '../uploads');
const upload = multer({ dest: uploadDir });

// Get all measurements
router.get('/', async (req, res) => {
  try {
    const measurements = await Measurement.find()
      .populate('locationId', 'name latitude longitude')
      .sort({ sampleDate: -1 });
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get measurements for a location
router.get('/location/:locationId', async (req, res) => {
  try {
    const measurements = await Measurement.find({ locationId: req.params.locationId })
      .sort({ sampleDate: -1 });
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create measurement
router.post('/', async (req, res) => {
  try {
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

// Import CSV
router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const errors = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      let imported = 0;
      
      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        try {
          // Find or create location
          let location = await Location.findOne({
            name: row.location,
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude)
          });

          if (!location) {
            location = new Location({
              name: row.location,
              latitude: parseFloat(row.latitude),
              longitude: parseFloat(row.longitude)
            });
            await location.save();
          }

          const metals = {
            lead: parseFloat(row.lead) || 0,
            mercury: parseFloat(row.mercury) || 0,
            cadmium: parseFloat(row.cadmium) || 0,
            arsenic: parseFloat(row.arsenic) || 0,
            chromium: parseFloat(row.chromium) || 0,
            copper: parseFloat(row.copper) || 0,
            zinc: parseFloat(row.zinc) || 0,
            nickel: parseFloat(row.nickel) || 0
          };

          const indices = calculateIndices(metals);

          const measurement = new Measurement({
            locationId: location._id,
            sampleDate: row.date,
            ...metals,
            hpi: indices.hpi,
            hei: indices.hei,
            cd: indices.cd,
            healthRisk: indices.healthRisk
          });

          await measurement.save();
          imported++;
        } catch (err) {
          errors.push({ row: i + 1, error: err.message });
        }
      }

      fs.unlinkSync(req.file.path);
      res.json({ 
        message: 'Import completed', 
        imported,
        errors 
      });
    })
    .on('error', (err) => {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: err.message });
    });
});

// Export CSV
router.get('/export', async (req, res) => {
  try {
    const measurements = await Measurement.find()
      .populate('locationId', 'name latitude longitude')
      .sort({ sampleDate: -1 });

    const data = measurements.map(m => ({
      location: m.locationId.name,
      latitude: m.locationId.latitude,
      longitude: m.locationId.longitude,
      date: m.sampleDate,
      lead: m.lead,
      mercury: m.mercury,
      cadmium: m.cadmium,
      arsenic: m.arsenic,
      chromium: m.chromium,
      copper: m.copper,
      zinc: m.zinc,
      nickel: m.nickel,
      hpi: m.hpi,
      hei: m.hei,
      cd: m.cd,
      health_risk: m.healthRisk
    }));

    const parser = new Parser();
    const csvData = parser.parse(data);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('hmpi_data.csv');
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete measurement
router.delete('/:id', async (req, res) => {
  try {
    const measurement = await Measurement.findByIdAndDelete(req.params.id);
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    res.json({ message: 'Measurement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

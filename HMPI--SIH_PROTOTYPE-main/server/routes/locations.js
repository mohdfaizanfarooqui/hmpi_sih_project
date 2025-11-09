const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single location
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create location
router.post('/', async (req, res) => {
  try {
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

// Update location
router.put('/:id', async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { name, latitude, longitude },
      { new: true }
    );
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete location
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

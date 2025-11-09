const express = require('express');
const router = express.Router();
const Measurement = require('../models/Measurement');
const Location = require('../models/Location');

// Get pollution statistics
router.get('/stats', async (req, res) => {
  try {
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

// Get leaderboard (most polluted)
router.get('/leaderboard/polluted', async (req, res) => {
  try {
    const results = await Measurement.aggregate([
      {
        $group: {
          _id: '$locationId',
          avg_hpi: { $avg: '$hpi' },
          avg_hei: { $avg: '$hei' },
          last_sample: { $max: '$sampleDate' }
        }
      },
      { $sort: { avg_hpi: -1 } },
      { $limit: 10 }
    ]);

    const populated = await Location.populate(results, { path: '_id' });
    
    const formatted = populated.map(r => ({
      name: r._id.name,
      latitude: r._id.latitude,
      longitude: r._id.longitude,
      avg_hpi: r.avg_hpi,
      avg_hei: r.avg_hei,
      last_sample: r.last_sample
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaderboard (cleanest)
router.get('/leaderboard/clean', async (req, res) => {
  try {
    const results = await Measurement.aggregate([
      {
        $group: {
          _id: '$locationId',
          avg_hpi: { $avg: '$hpi' },
          avg_hei: { $avg: '$hei' },
          last_sample: { $max: '$sampleDate' }
        }
      },
      { $sort: { avg_hpi: 1 } },
      { $limit: 10 }
    ]);

    const populated = await Location.populate(results, { path: '_id' });
    
    const formatted = populated.map(r => ({
      name: r._id.name,
      latitude: r._id.latitude,
      longitude: r._id.longitude,
      avg_hpi: r.avg_hpi,
      avg_hei: r.avg_hei,
      last_sample: r.last_sample
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trends over time
router.get('/trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await Measurement.aggregate([
      { $match: { sampleDate: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$sampleDate' } },
          avg_hpi: { $avg: '$hpi' },
          avg_hei: { $avg: '$hei' },
          avg_cd: { $avg: '$cd' },
          sample_count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = trends.map(t => ({
      date: t._id,
      avg_hpi: t.avg_hpi,
      avg_hei: t.avg_hei,
      avg_cd: t.avg_cd,
      sample_count: t.sample_count
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get metal distribution
router.get('/metals/distribution', async (req, res) => {
  try {
    const distribution = await Measurement.aggregate([
      {
        $group: {
          _id: null,
          avg_lead: { $avg: '$lead' },
          avg_mercury: { $avg: '$mercury' },
          avg_cadmium: { $avg: '$cadmium' },
          avg_arsenic: { $avg: '$arsenic' },
          avg_chromium: { $avg: '$chromium' },
          avg_copper: { $avg: '$copper' },
          avg_zinc: { $avg: '$zinc' },
          avg_nickel: { $avg: '$nickel' },
          max_lead: { $max: '$lead' },
          max_mercury: { $max: '$mercury' },
          max_cadmium: { $max: '$cadmium' },
          max_arsenic: { $max: '$arsenic' }
        }
      }
    ]);

    res.json(distribution[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get health risk distribution
router.get('/health-risk/distribution', async (req, res) => {
  try {
    const distribution = await Measurement.aggregate([
      { $match: { healthRisk: { $ne: null } } },
      {
        $group: {
          _id: '$healthRisk',
          count: { $sum: 1 }
        }
      }
    ]);

    const formatted = distribution.map(d => ({
      health_risk: d._id,
      count: d.count
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

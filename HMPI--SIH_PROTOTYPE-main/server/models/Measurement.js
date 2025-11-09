const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  sampleDate: {
    type: Date,
    required: true
  },
  lead: { type: Number, default: 0 },
  mercury: { type: Number, default: 0 },
  cadmium: { type: Number, default: 0 },
  arsenic: { type: Number, default: 0 },
  chromium: { type: Number, default: 0 },
  copper: { type: Number, default: 0 },
  zinc: { type: Number, default: 0 },
  nickel: { type: Number, default: 0 },
  hpi: Number,
  hei: Number,
  cd: Number,
  healthRisk: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Measurement', measurementSchema);

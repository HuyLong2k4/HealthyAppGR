const mongoose = require('mongoose');

// Chỉ số sức khỏe tại thời điểm cụ thể
const HealthIndexSchema = new mongoose.Schema({  
  recordedTime:       { type: Date, required: true },
  bodyTemperature:    { type: Number, required: true },
  heartRate:          { type: Number, required: true },
  oxygenSaturation:   { type: Number, required: true },
  respiratoryRate:    { type: Number, required: true },
  sleep:              { type: Number, required: true },
  stepCount:          { type: Number, required: true },
  user:               { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('HealthIndex', HealthIndexSchema);

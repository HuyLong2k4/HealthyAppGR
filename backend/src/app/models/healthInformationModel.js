const mongoose = require('mongoose');
//  lưu trữ thông tin sức khỏe tổng quan và tương đối ổn định của người dùng.
const HealthInformationSchema = new mongoose.Schema({
  height:                 { type: Number, required: true },
  weight:                 { type: Number, required: true },
  bmi:                    { type: Number },  // optional
  currentMedicalConditions: { type: String, default: '' },
  treatingHospital:       { type: String, default: '' },
  user:                   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('HealthInformation', HealthInformationSchema);

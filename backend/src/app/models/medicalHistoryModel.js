const mongoose = require('mongoose');
// Lưu các tài liệu, hồ sơ y tế dạng ảnh (đơn thuốc, kết quả xét nghiệm). 
const MedicalHistorySchema = new mongoose.Schema({
  imageMedical: { type: String, required: true },
  timeMedical:  { type: Date },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistory', MedicalHistorySchema);

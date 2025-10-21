const mongoose = require('mongoose');
//  để ghi lại tên của các bệnh lý hoặc chẩn đoán được liên kết với một tài liệu y tế trong MedicalHistory.
const MedicalConditionSchema = new mongoose.Schema({
  name:               { type: String, required: true },
  medicalHistory:     { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalHistory', required: true }
}, { timestamps: true });

module.exports = mongoose.model('MedicalCondition', MedicalConditionSchema);

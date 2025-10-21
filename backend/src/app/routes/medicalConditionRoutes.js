const express = require('express');
const MedicalConditionController = require('../controllers/medicalConditionController');

const router = express.Router();

// [POST] /api/medical-conditions - Tạo một chẩn đoán mới
router.post('/', MedicalConditionController.createMedicalCondition);

// [GET] /api/medical-conditions/history/:historyId - Lấy tất cả chẩn đoán của một hồ sơ
router.get('/history/:historyId', MedicalConditionController.getConditionsByHistoryId);

// [PUT] /api/medical-conditions/:id - Cập nhật một chẩn đoán
router.put('/:id', MedicalConditionController.updateMedicalCondition);

// [DELETE] /api/medical-conditions/:id - Xóa một chẩn đoán
router.delete('/:id', MedicalConditionController.deleteMedicalCondition);

module.exports = router;
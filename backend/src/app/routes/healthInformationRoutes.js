const express = require('express');
const HealthInformationController = require('../controllers/healthInformationController');

const router = express.Router();

// Lấy hồ sơ sức khỏe của một user
// [GET] /api/health-information/user/:userId
router.get('/user/:userId', HealthInformationController.getHealthInformationByUserId);

// Tạo mới hồ sơ sức khỏe (dùng POST)
// [POST] /api/health-information/user/:userId
router.post('/user/:userId', HealthInformationController.createOrUpdateHealthInformation);

// Cập nhật hồ sơ sức khỏe (dùng PUT)
// [PUT] /api/health-information/user/:userId
router.put('/user/:userId', HealthInformationController.createOrUpdateHealthInformation);

// Xóa hồ sơ sức khỏe
// [DELETE] /api/health-information/user/:userId
router.delete('/user/:userId', HealthInformationController.deleteHealthInformationByUserId);

module.exports = router;
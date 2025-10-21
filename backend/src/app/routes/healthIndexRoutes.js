const express = require('express');
const HealthIndexController = require('../controllers/healthIndexController');

const router = express.Router();

// [POST] /api/health-indices - Tạo một bản ghi mới
router.post('/', HealthIndexController.createHealthIndex);

// [GET] /api/health-indices/user/:userId - Lấy lịch sử chỉ số của một user
router.get('/user/:userId', HealthIndexController.getHealthIndicesByUserId);

// [PUT] /api/health-indices/:id - Cập nhật một bản ghi
router.put('/:id', HealthIndexController.updateHealthIndex);

// [DELETE] /api/health-indices/:id - Xóa một bản ghi
router.delete('/:id', HealthIndexController.deleteHealthIndex);

module.exports = router;
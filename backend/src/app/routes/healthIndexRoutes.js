const express = require('express');
const HealthIndexController = require('../controllers/healthIndexController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// [POST] /api/health-indices - Tạo một bản ghi mới
router.post('/', authMiddleware, HealthIndexController.createHealthIndex);

// [GET] /api/health-indices/user/:userId - Lấy lịch sử chỉ số của một user
router.get('/user/:userId', authMiddleware, HealthIndexController.getHealthIndicesByUserId);

// [PUT] /api/health-indices/:id - Cập nhật một bản ghi
router.put('/:id', authMiddleware, HealthIndexController.updateHealthIndex);

// [DELETE] /api/health-indices/:id - Xóa một bản ghi
router.delete('/:id', authMiddleware, HealthIndexController.deleteHealthIndex);

module.exports = router;
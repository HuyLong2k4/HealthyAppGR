const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');

// POST /api/devices - Tạo một thiết bị mới
router.post('/', DeviceController.createDevice);

// GET /api/devices/user/:userId - Lấy tất cả thiết bị của một người dùng
router.get('/user/:userId', DeviceController.getDevicesByUser);

// GET /api/devices/:id - Lấy thông tin một thiết bị theo ID
router.get('/:id', DeviceController.getDeviceById);

// PUT /api/devices/:id - Cập nhật một thiết bị
router.put('/:id', DeviceController.updateDevice);

// DELETE /api/devices/:id - Xóa một thiết bị
router.delete('/:id', DeviceController.deleteDevice);

module.exports = router;
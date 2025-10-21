const DeviceService = require('../services/deviceService');

class DeviceController {
    static async createDevice(req, res) {
        try {
            // Trong ứng dụng thực tế, req.body.user nên được lấy từ thông tin user đã xác thực
            // Ví dụ: const deviceData = { ...req.body, user: req.user.id };
            const device = await DeviceService.createDevice(req.body);
            res.status(201).json({ message: 'Tạo thiết bị thành công', device });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getDevicesByUser(req, res) {
        try {
            // Lấy userId từ params của URL, ví dụ: /api/users/123/devices
            const { userId } = req.params;
            const devices = await DeviceService.getDevicesByUser(userId);
            res.status(200).json(devices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getDeviceById(req, res) {
        try {
            const device = await DeviceService.getDeviceById(req.params.id);
            if (!device) {
                return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
            }
            res.status(200).json(device);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateDevice(req, res) {
        try {
            const device = await DeviceService.updateDevice(req.params.id, req.body);
            if (!device) {
                return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
            }
            res.status(200).json({ message: 'Cập nhật thành công', device });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteDevice(req, res) {
        try {
            const device = await DeviceService.deleteDevice(req.params.id);
            if (!device) {
                return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
            }
            res.status(200).json({ message: 'Xóa thiết bị thành công' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = DeviceController;

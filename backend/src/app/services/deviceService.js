const Device = require('../models/deviceModel'); // Giả sử model của bạn ở đây

class DeviceService {
    /**
     * Tạo một thiết bị mới
     * @param {object} deviceData - Dữ liệu thiết bị, bao gồm serialNo, model, user
     */
    static async createDevice(deviceData) {
        // Kiểm tra xem serialNo đã tồn tại chưa để đảm bảo tính duy nhất
        const existingDevice = await Device.findOne({ serialNo: deviceData.serialNo });
        if (existingDevice) {
            throw new Error('Serial number đã tồn tại.');
        }

        const newDevice = new Device(deviceData);
        return await newDevice.save();
    }

    /**
     * Lấy tất cả thiết bị của một người dùng cụ thể
     * @param {string} userId - ID của người dùng
     */
    static async getDevicesByUser(userId) {
        return await Device.find({ user: userId });
    }

    /**
     * Lấy một thiết bị bằng ID
     * @param {string} deviceId - ID của thiết bị
     */
    static async getDeviceById(deviceId) {
        // .populate('user', 'username email') sẽ lấy thông tin của user liên quan
        // và chỉ chọn 2 trường là username và email để hiển thị.
        return await Device.findById(deviceId).populate('user', 'username email');
    }

    /**
     * Cập nhật thông tin thiết bị
     * @param {string} deviceId - ID của thiết bị cần cập nhật
     * @param {object} updateData - Dữ liệu cần cập nhật
     */
    static async updateDevice(deviceId, updateData) {
        // Không cho phép cập nhật serialNo hoặc đổi người dùng của thiết bị
        if (updateData.serialNo) delete updateData.serialNo;
        if (updateData.user) delete updateData.user;

        return await Device.findByIdAndUpdate(deviceId, updateData, { new: true });
    }

    /**
     * Xóa một thiết bị
     * @param {string} deviceId - ID của thiết bị cần xóa
     */
    static async deleteDevice(deviceId) {
        return await Device.findByIdAndDelete(deviceId);
    }
}

module.exports = DeviceService;

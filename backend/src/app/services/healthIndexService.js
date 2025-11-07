const HealthIndex = require('../models/healthIndexModel'); // Đảm bảo đường dẫn đúng

class HealthIndexService {
  /**
   * Tạo một bản ghi chỉ số sức khỏe mới
   * @param {Object} indexData - Dữ liệu chỉ số
   * @returns {Promise<Document>}
   */
  static async createHealthIndex(indexData) {
    // Validate health metrics ranges
    const validations = [
      { field: 'bodyTemperature', min: 35, max: 42, name: 'Body temperature' },
      { field: 'heartRate', min: 30, max: 220, name: 'Heart rate' },
      { field: 'oxygenSaturation', min: 0, max: 100, name: 'Oxygen saturation' },
      { field: 'respiratoryRate', min: 0, max: 60, name: 'Respiratory rate' },
      { field: 'sleep', min: 0, max: 24, name: 'Sleep hours' },
      { field: 'stepCount', min: 0, max: 100000, name: 'Step count' }
    ];

    for (const validation of validations) {
      const value = indexData[validation.field];
      if (value !== undefined && value !== null) {
        if (value < validation.min || value > validation.max) {
          throw new Error(
            `${validation.name} must be between ${validation.min} and ${validation.max}`
          );
        }
      }
    }

    // Validate recordedTime
    if (indexData.recordedTime) {
      const recordedTime = new Date(indexData.recordedTime);
      if (isNaN(recordedTime.getTime())) {
        throw new Error('Invalid recordedTime format');
      }
      if (recordedTime > new Date()) {
        throw new Error('recordedTime cannot be in the future');
      }
    }

    const newIndex = new HealthIndex(indexData);
    return await newIndex.save();
  }

  /**
   * Lấy tất cả bản ghi chỉ số sức khỏe của một người dùng
   * @param {String} userId - ID của người dùng
   * @returns {Promise<Array<Document>>}
   */
  static async getHealthIndicesByUserId(userId) {
    // Sắp xếp theo thời gian ghi nhận để xem dữ liệu mới nhất trước
    return await HealthIndex.find({ user: userId }).sort({ recordedTime: -1 });
  }

  /**
   * Cập nhật một bản ghi (ví dụ: sửa lỗi nhập liệu)
   * @param {String} indexId - ID của bản ghi
   * @param {String} userId - ID của người dùng (để kiểm tra quyền)
   * @param {Object} updates - Dữ liệu cập nhật
   * @returns {Promise<Document|null>}
   */
  static async updateHealthIndex(indexId, userId, updates) {
    const query = { _id: indexId, user: userId };
    return await HealthIndex.findOneAndUpdate(query, updates, { new: true });
  }

  /**
   * Xóa một bản ghi chỉ số sức khỏe
   * @param {String} indexId - ID của bản ghi
   * @param {String} userId - ID của người dùng (để kiểm tra quyền)
   * @returns {Promise<Document|null>}
   */
  static async deleteHealthIndex(indexId, userId) {
    const query = { _id: indexId, user: userId };
    return await HealthIndex.findOneAndDelete(query);
  }
}

module.exports = HealthIndexService;
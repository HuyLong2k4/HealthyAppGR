const HealthInformation = require('../models/healthInformationModel');

class HealthInformationService {
  /**
   * Tính chỉ số BMI từ chiều cao (cm) và cân nặng (kg)
   * @param {number} height - Chiều cao (cm)
   * @param {number} weight - Cân nặng (kg)
   * @returns {number|null}
   */
  static calculateBMI(height, weight) {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      // Làm tròn đến 2 chữ số thập phân
      return Math.round((weight / (heightInMeters * heightInMeters)) * 100) / 100;
    }
    return null;
  }

  /**
   * Tạo hoặc cập nhật hồ sơ sức khỏe cho một user
   * @param {String} userId - ID của người dùng
   * @param {Object} infoData - Dữ liệu hồ sơ
   * @returns {Promise<Document>}
   */
  static async createOrUpdateHealthInformation(userId, infoData) {
    const dataToSave = { ...infoData, user: userId };

    // Tự động tính toán và thêm BMI vào dữ liệu
    if (dataToSave.height && dataToSave.weight) {
      dataToSave.bmi = this.calculateBMI(dataToSave.height, dataToSave.weight);
    }

    // Tìm theo userId và cập nhật, nếu không có thì tạo mới (upsert: true)
    return await HealthInformation.findOneAndUpdate(
      { user: userId },
      dataToSave,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }

  /**
   * Lấy hồ sơ sức khỏe của một user
   * @param {String} userId - ID của người dùng
   * @returns {Promise<Document|null>}
   */
  static async getHealthInformationByUserId(userId) {
    return await HealthInformation.findOne({ user: userId }).populate('user', 'username email');
  }

  /**
   * Xóa hồ sơ sức khỏe của một user
   * @param {String} userId - ID của người dùng
   * @returns {Promise<Document|null>}
   */
  static async deleteHealthInformationByUserId(userId) {
    return await HealthInformation.findOneAndDelete({ user: userId });
  }
}

module.exports = HealthInformationService;
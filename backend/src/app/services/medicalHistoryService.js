const MedicalHistory = require('../models/medicalHistoryModel'); // Đảm bảo đường dẫn đúng

class MedicalHistoryService {
  /**
   * Tạo một hồ sơ y tế mới
   * @param {Object} historyData - Dữ liệu hồ sơ (imageMedical, timeMedical, user)
   * @returns {Promise<Document>}
   */
  static async createMedicalHistory(historyData) {
    const newHistory = new MedicalHistory(historyData);
    return await newHistory.save();
  }

  /**
   * Lấy tất cả hồ sơ y tế của một người dùng
   * @param {String} userId - ID của người dùng
   * @returns {Promise<Array<Document>>}
   */
  static async getMedicalHistoriesByUserId(userId) {
    // Sắp xếp theo thời gian khám bệnh để xem cái mới nhất trước
    return await MedicalHistory.find({ user: userId }).sort({ timeMedical: -1 });
  }

  /**
   * Cập nhật thông tin hồ sơ (ví dụ: ngày khám)
   * @param {String} historyId - ID của hồ sơ
   * @param {String} userId - ID của người dùng (để kiểm tra quyền)
   * @param {Object} updates - Dữ liệu cần cập nhật
   * @returns {Promise<Document|null>}
   */
  static async updateMedicalHistory(historyId, userId, updates) {
    const query = { _id: historyId, user: userId };
    return await MedicalHistory.findOneAndUpdate(query, updates, { new: true });
  }

  /**
   * Xóa một hồ sơ y tế
   * @param {String} historyId - ID của hồ sơ
   * @param {String} userId - ID của người dùng (để kiểm tra quyền)
   * @returns {Promise<Document|null>}
   */
  static async deleteMedicalHistory(historyId, userId) {
    const query = { _id: historyId, user: userId };
    // Cần xóa cả file ảnh lưu trên server nếu cần
    // (Logic xóa file sẽ được thêm vào controller hoặc service)
    return await MedicalHistory.findOneAndDelete(query);
  }
}

module.exports = MedicalHistoryService;
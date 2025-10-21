const MedicalCondition = require('../models/medicalConditionModel'); // Đảm bảo đường dẫn đúng

class MedicalConditionService {
  /**
   * Tạo một chẩn đoán mới và liên kết với một MedicalHistory
   * @param {Object} conditionData - Dữ liệu chẩn đoán (name, medicalHistory)
   * @returns {Promise<Document>}
   */
  static async createMedicalCondition(conditionData) {
    const newCondition = new MedicalCondition(conditionData);
    return await newCondition.save();
  }

  /**
   * Lấy tất cả chẩn đoán của một hồ sơ y tế cụ thể
   * @param {String} historyId - ID của MedicalHistory
   * @returns {Promise<Array<Document>>}
   */
  static async getConditionsByHistoryId(historyId) {
    return await MedicalCondition.find({ medicalHistory: historyId });
  }

  /**
   * Cập nhật tên của một chẩn đoán
   * @param {String} conditionId - ID của chẩn đoán cần cập nhật
   * @param {Object} updates - Dữ liệu cập nhật (ví dụ: { name: "..." })
   * @returns {Promise<Document|null>}
   */
  static async updateMedicalCondition(conditionId, updates) {
    return await MedicalCondition.findByIdAndUpdate(conditionId, updates, { new: true });
  }

  /**
   * Xóa một chẩn đoán
   * @param {String} conditionId - ID của chẩn đoán cần xóa
   * @returns {Promise<Document|null>}
   */
  static async deleteMedicalCondition(conditionId) {
    return await MedicalCondition.findByIdAndDelete(conditionId);
  }
}

module.exports = MedicalConditionService;
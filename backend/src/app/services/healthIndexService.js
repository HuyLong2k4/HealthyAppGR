const HealthIndex = require('../models/healthIndexModel'); // Đảm bảo đường dẫn đúng

class HealthIndexService {
  /**
   * Tạo một bản ghi chỉ số sức khỏe mới
   * @param {Object} indexData - Dữ liệu chỉ số
   * @returns {Promise<Document>}
   */
  static async createHealthIndex(indexData) {
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
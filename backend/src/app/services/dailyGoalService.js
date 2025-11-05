const mongoose = require('mongoose');
const { DailyGoal } = require('../models/dailyGoalModel');

class DailyGoalService {

  /**
   * Tạo một mục tiêu hàng ngày mới
   * @param {object} goalData - Dữ liệu (đã bao gồm user, targetDate, name...)
   * @returns {Promise<Document>}
   */
  static async createDailyGoal(goalData) {
    try {
      const newGoal = new DailyGoal(goalData);
      return await newGoal.save();
    } catch (error) {
      throw new Error(`Lỗi khi tạo mục tiêu: ${error.message}`);
    }
  }

  /**
   * Lấy tất cả mục tiêu của user trong một khoảng ngày
   * @param {string} userId 
   * @param {Date} startDate 
   * @param {Date} endDate 
   * @returns {Promise<Array<Document>>}
   */
  static async getGoalsForWeek(userId, startDate, endDate) {
    return await DailyGoal.find({
      user: userId,
      targetDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ targetDate: 1 });
  }

  /**
   * Cập nhật trạng thái (check/uncheck) của mục tiêu
   * @param {string} goalId - ID của mục tiêu
   * @param {string} userId - ID của user (để đảm bảo bảo mật)
   * @param {string} status - "OPEN" hoặc "COMPLETED"
   * @returns {Promise<Document|null>}
   */
  static async updateGoalStatus(goalId, userId, status) {
    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      return null;
    }

    return await DailyGoal.findOneAndUpdate(
      { _id: goalId, user: userId },
      { $set: { status: status } },
      { new: true }
    );
  }

  /**
   * Xóa một mục tiêu
   * @param {string} goalId 
   * @param {string} userId 
   * @returns {Promise<boolean>}
   */
  static async deleteGoal(goalId, userId) {
    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      return false;
    }

    const result = await DailyGoal.deleteOne({
      _id: goalId,
      user: userId 
    });
    
    return result.deletedCount > 0;
  }
}

module.exports = DailyGoalService;
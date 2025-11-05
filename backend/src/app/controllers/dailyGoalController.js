const DailyGoalService = require('../services/dailyGoalService');

const GoalStatus = { 
  OPEN: 'OPEN',
  COMPLETED: 'COMPLETED'
};

class DailyGoalController {

  /**
   * [POST] /api/daily-goals
   */
  static async createDailyGoal(req, res) {
    try {
      const { targetDate, name, quantity, unit, category } = req.body;
      const userId = req.user.id;

      if (!targetDate || !name || !quantity || !unit) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
      }

      const newGoal = await DailyGoalService.createDailyGoal({
        user: userId,
        targetDate,
        name,
        quantity,
        unit,
        category
      });

      res.status(201).json(newGoal);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * [GET] /api/daily-goals/week?startDate=...&endDate=...
   */
  static async getGoalsForWeek(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate và endDate là bắt buộc' });
      }

      const goals = await DailyGoalService.getGoalsForWeek(userId, startDate, endDate);

      res.status(200).json(goals);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * [PATCH] /api/daily-goals/:id/status
   */
  static async updateGoalStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      if (!status || !Object.values(GoalStatus).includes(status)) {
        return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
      }

      const updatedGoal = await DailyGoalService.updateGoalStatus(id, userId, status);

      if (!updatedGoal) {
        return res.status(404).json({ error: 'Không tìm thấy mục tiêu hoặc bạn không có quyền' });
      }
      
      res.status(200).json(updatedGoal);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * [DELETE] /api/daily-goals/:id
   */
  static async deleteGoal(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const success = await DailyGoalService.deleteGoal(id, userId);

      if (!success) {
        return res.status(404).json({ error: 'Không tìm thấy mục tiêu hoặc bạn không có quyền' });
      }

      res.status(200).json({ message: 'Xóa mục tiêu thành công' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DailyGoalController;

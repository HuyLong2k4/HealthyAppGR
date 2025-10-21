const MedicalConditionService = require('../services/medicalConditionService');

class MedicalConditionController {
  static async createMedicalCondition(req, res) {
    try {
      // Logic bảo mật nâng cao:
      // Trước khi tạo, nên kiểm tra xem `medicalHistory` (req.body.medicalHistory)
      // có thực sự thuộc về user đang đăng nhập (req.user.id) hay không.
      const condition = await MedicalConditionService.createMedicalCondition(req.body);
      res.status(201).json({ message: 'Medical condition created successfully', condition });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getConditionsByHistoryId(req, res) {
    try {
      // Tương tự, có thể kiểm tra quyền xem của user với historyId này.
      const conditions = await MedicalConditionService.getConditionsByHistoryId(req.params.historyId);
      res.status(200).json(conditions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMedicalCondition(req, res) {
    try {
      const condition = await MedicalConditionService.updateMedicalCondition(req.params.id, req.body);
      if (!condition) {
        return res.status(404).json({ message: 'Medical condition not found' });
      }
      res.status(200).json({ message: 'Medical condition updated successfully', condition });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteMedicalCondition(req, res) {
    try {
      const condition = await MedicalConditionService.deleteMedicalCondition(req.params.id);
      if (!condition) {
        return res.status(404).json({ message: 'Medical condition not found' });
      }
      res.status(200).json({ message: 'Medical condition deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MedicalConditionController;
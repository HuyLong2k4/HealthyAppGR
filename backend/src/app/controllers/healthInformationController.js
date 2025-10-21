const HealthInformationService = require('../services/healthInformationService');

class HealthInformationController {
  static async createOrUpdateHealthInformation(req, res) {
    try {
      // Trong thực tế, cần check req.user.id === req.params.userId
      const userId = req.params.userId;
      const infoData = req.body;
      const healthInfo = await HealthInformationService.createOrUpdateHealthInformation(userId, infoData);
      res.status(200).json({ message: 'Health information saved successfully', healthInfo });
    } catch (error) {
      // Bắt lỗi E11000 khi tạo trùng user (do unique: true)
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Health information for this user already exists.' });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async getHealthInformationByUserId(req, res) {
    try {
      const healthInfo = await HealthInformationService.getHealthInformationByUserId(req.params.userId);
      if (!healthInfo) {
        return res.status(404).json({ message: 'Health information not found for this user.' });
      }
      res.status(200).json(healthInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async deleteHealthInformationByUserId(req, res) {
    try {
      const healthInfo = await HealthInformationService.deleteHealthInformationByUserId(req.params.userId);
      if (!healthInfo) {
        return res.status(404).json({ message: 'Health information not found for this user.' });
      }
      res.status(200).json({ message: 'Health information deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = HealthInformationController;
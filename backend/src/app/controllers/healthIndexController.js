const HealthIndexService = require('../services/healthIndexService');

class HealthIndexController {
  static async createHealthIndex(req, res) {
    try {
      const indexData = {
        ...req.body,
        user: req.user.id
      };
      const index = await HealthIndexService.createHealthIndex(indexData);
      res.status(201).json({ message: 'Health index record created', index });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getHealthIndicesByUserId(req, res) {
    try {
      const indices = await HealthIndexService.getHealthIndicesByUserId(req.params.userId);
      res.status(200).json(indices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateHealthIndex(req, res) {
    try {
      const indexId = req.params.id;
      const userId = req.user.id;
      const updates = req.body;

      const updatedIndex = await HealthIndexService.updateHealthIndex(indexId, userId, updates);
      if (!updatedIndex) {
        return res.status(404).json({ message: 'Record not found or user not authorized' });
      }
      res.status(200).json({ message: 'Health index updated', index: updatedIndex });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteHealthIndex(req, res) {
    try {
      const indexId = req.params.id;
      const userId = req.user.id;

      const deletedIndex = await HealthIndexService.deleteHealthIndex(indexId, userId);
      if (!deletedIndex) {
        return res.status(404).json({ message: 'Record not found or user not authorized' });
      }
      res.status(200).json({ message: 'Health index deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = HealthIndexController;
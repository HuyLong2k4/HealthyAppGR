const MedicalHistoryService = require('../services/medicalHistoryService');
const fs = require('fs'); // Thư viện 'fs' để xử lý file, ví dụ xóa file

class MedicalHistoryController {
  static async createMedicalHistory(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
      }

      const historyData = {
        imageMedical: req.file.path, // Lấy đường dẫn file từ multer
        timeMedical: req.body.timeMedical,
        user: req.body.user // << THAY BẰNG req.user.id TRONG THỰC TẾ
      };

      const history = await MedicalHistoryService.createMedicalHistory(historyData);
      res.status(201).json({ message: 'Medical history created successfully', history });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getMedicalHistoriesByUserId(req, res) {
    try {
      const histories = await MedicalHistoryService.getMedicalHistoriesByUserId(req.params.userId);
      res.status(200).json(histories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMedicalHistory(req, res) {
    try {
      const historyId = req.params.id;
      const userId = req.body.user; // << THAY BẰNG req.user.id TRONG THỰC TẾ
      const updates = req.body;

      const updatedHistory = await MedicalHistoryService.updateMedicalHistory(historyId, userId, updates);
      if (!updatedHistory) {
        return res.status(404).json({ message: 'History not found or user not authorized' });
      }
      res.status(200).json({ message: 'Medical history updated', history: updatedHistory });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteMedicalHistory(req, res) {
    try {
      const historyId = req.params.id;
      const userId = req.body.user; // << THAY BẰNG req.user.id TRONG THỰC TẾ

      const deletedHistory = await MedicalHistoryService.deleteMedicalHistory(historyId, userId);

      if (!deletedHistory) {
        return res.status(404).json({ message: 'History not found or user not authorized' });
      }

      // Sau khi xóa thành công trong DB, xóa file ảnh trên server
      fs.unlink(deletedHistory.imageMedical, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
          // Không cần báo lỗi cho client, vì record DB đã xóa thành công
        }
      });

      res.status(200).json({ message: 'Medical history deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MedicalHistoryController;
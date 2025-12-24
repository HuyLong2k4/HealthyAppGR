const DoctorService = require('../services/doctorService');

// Export constants cho client sử dụng
const NameSpecialty = {
  CARDIOLOGY: 'CARDIOLOGY',
  RESPIRATORY: 'RESPIRATORY',
  GENERAL: 'GENERAL',
  NEUROLOGY: 'NEUROLOGY',
  NUTRITION: 'NUTRITION'
};

const Title = {
  BS: 'BS',
  ThS_BS: 'ThS.BS',
  TS_BS: 'TS.BS',
  PGS_TS: 'PGS.TS',
  GS_TS: 'GS.TS'
};

class DoctorController {
  /**
   * [POST] /api/doctors
   * Tạo hồ sơ bác sĩ mới
   * - Doctor tự tạo: không cần truyền "user" trong body
   * - Admin tạo giúp: truyền "user" (userId) trong body - yêu cầu role ADMIN
   */
  static async createDoctor(req, res) {
    try {
      // Nếu body có "user" thì là admin tạo giúp
      const isAdminCreating = req.body.user && req.body.user !== req.user.id;
      
      // Kiểm tra quyền admin nếu đang tạo cho người khác
      if (isAdminCreating && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Only admins can create doctor profiles for other users.'
        });
      }

      // Nếu body có "user" thì dùng nó (admin tạo giúp)
      // Nếu không có thì dùng req.user.id (doctor tự tạo)
      const userId = req.body.user || req.user.id;
      
      // Loại bỏ "user" khỏi doctorData để không lưu vào DB
      const { user, ...doctorData } = req.body;

      const doctor = await DoctorService.createDoctor(userId, doctorData);

      res.status(201).json({
        success: true,
        message: 'Doctor profile created successfully',
        data: doctor
      });
    } catch (error) {
      if (error.message === 'User already has a doctor profile') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating doctor profile',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/doctors
   * Lấy danh sách bác sĩ với filters
   */
  static async getDoctors(req, res) {
    try {
      const { specialty, title, minPrice, maxPrice } = req.query;
      const filters = { specialty, title, minPrice, maxPrice };

      const doctors = await DoctorService.getDoctors(filters);

      res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching doctors',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/doctors/:id
   * Lấy thông tin bác sĩ theo ID
   */
  static async getDoctorById(req, res) {
    try {
      const doctor = await DoctorService.getDoctorById(req.params.id);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.status(200).json({
        success: true,
        data: doctor
      });
    } catch (error) {
      if (error.message === 'Invalid doctor ID') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error fetching doctor',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/doctors/specialty/:specialty
   * Tìm bác sĩ theo chuyên khoa
   */
  static async getDoctorsBySpecialty(req, res) {
    try {
      const doctors = await DoctorService.getDoctorsBySpecialty(req.params.specialty);

      res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching doctors by specialty',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/doctors/my-profile
   * Lấy hồ sơ bác sĩ của chính mình
   */
  static async getMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const doctor = await DoctorService.getDoctorByUserId(userId);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor profile not found'
        });
      }

      res.status(200).json({
        success: true,
        data: doctor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching your profile',
        error: error.message
      });
    }
  }

  /**
   * [PUT] /api/doctors/:id
   * Cập nhật thông tin bác sĩ
   * - Doctor tự update: không truyền "user" trong body hoặc "user" === req.user.id
   * - Admin update: truyền "user" (userId) trong body - yêu cầu role ADMIN
   */
  static async updateDoctor(req, res) {
    try {
      // Nếu body có "user" và khác req.user.id thì là admin update
      const isAdminUpdate = req.body.user && req.body.user !== req.user.id;
      
      // Kiểm tra quyền admin nếu đang update cho người khác
      if (isAdminUpdate && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Only admins can update doctor profiles for other users.'
        });
      }

      const userId = isAdminUpdate ? req.body.user : req.user.id;
      
      // Loại bỏ "user" khỏi updates để không lưu vào DB
      const { user, ...updates } = req.body;

      const doctor = await DoctorService.updateDoctor(req.params.id, userId, updates);

      res.status(200).json({
        success: true,
        message: 'Doctor profile updated successfully',
        data: doctor
      });
    } catch (error) {
      if (error.message === 'Doctor not found or unauthorized' || error.message === 'Invalid doctor ID') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating doctor profile',
        error: error.message
      });
    }
  }

  /**
   * [PATCH] /api/doctors/:id/schedule
   * Cập nhật lịch làm việc
   */
  static async updateSchedule(req, res) {
    try {
      const userId = req.user.id;
      const { schedule } = req.body;

      if (!schedule || !Array.isArray(schedule)) {
        return res.status(400).json({
          success: false,
          message: 'Schedule is required and must be an array'
        });
      }

      const doctor = await DoctorService.updateSchedule(req.params.id, userId, schedule);

      res.status(200).json({
        success: true,
        message: 'Schedule updated successfully',
        data: doctor
      });
    } catch (error) {
      if (error.message.includes('Invalid') || error.message.includes('must be')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Doctor not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating schedule',
        error: error.message
      });
    }
  }

  /**
   * [DELETE] /api/doctors/:id
   * Xóa hồ sơ bác sĩ
   */
  static async deleteDoctor(req, res) {
    try {
      const userId = req.user.id;
      await DoctorService.deleteDoctor(req.params.id, userId);

      res.status(200).json({
        success: true,
        message: 'Doctor profile deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Doctor not found or unauthorized' || error.message === 'Invalid doctor ID') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error deleting doctor profile',
        error: error.message
      });
    }
  }
}

module.exports = DoctorController;

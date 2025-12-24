const AppointmentService = require('../services/appointmentService');

// Export constants cho client sử dụng
const Status = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

const NameSpecialty = {
  CARDIOLOGY: 'CARDIOLOGY',
  RESPIRATORY: 'RESPIRATORY',
  GENERAL: 'GENERAL',
  NEUROLOGY: 'NEUROLOGY',
  NUTRITION: 'NUTRITION'
};

class AppointmentController {
  /**
   * [POST] /api/appointments
   * Tạo lịch hẹn mới (patient tự đặt)
   */
  static async createAppointment(req, res) {
    try {
      const patientId = req.user.id;
      const appointment = await AppointmentService.createAppointment(patientId, req.body);

      res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: appointment
      });
    } catch (error) {
      if (error.message.includes('Invalid') || error.message.includes('format') || error.message.includes('past')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating appointment',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/appointments
   * Lấy danh sách lịch hẹn với filters
   */
  static async getAppointments(req, res) {
    try {
      const { patientId, doctorId, specialty, status, fromDate, toDate } = req.query;
      const filters = { patientId, doctorId, specialty, status, fromDate, toDate };

      const appointments = await AppointmentService.getAppointments(filters);

      res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching appointments',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/appointments/:id
   * Lấy thông tin lịch hẹn theo ID
   */
  static async getAppointmentById(req, res) {
    try {
      const appointment = await AppointmentService.getAppointmentById(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      if (error.message === 'Invalid appointment ID') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error fetching appointment',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/appointments/patient/:patientId
   * Lấy lịch hẹn của bệnh nhân
   */
  static async getAppointmentsByPatient(req, res) {
    try {
      const appointments = await AppointmentService.getAppointmentsByPatient(req.params.patientId);

      res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching patient appointments',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/appointments/doctor/:doctorId
   * Lấy lịch hẹn của bác sĩ
   */
  static async getAppointmentsByDoctor(req, res) {
    try {
      const appointments = await AppointmentService.getAppointmentsByDoctor(req.params.doctorId);

      res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching doctor appointments',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/appointments/my-appointments
   * Lấy lịch hẹn của chính mình (dành cho patient)
   */
  static async getMyAppointments(req, res) {
    try {
      const patientId = req.user.id;
      const appointments = await AppointmentService.getAppointmentsByPatient(patientId);

      res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching your appointments',
        error: error.message
      });
    }
  }

  /**
   * [PUT] /api/appointments/:id
   * Cập nhật thông tin lịch hẹn (chỉ patient)
   */
  static async updateAppointment(req, res) {
    try {
      const userId = req.user.id;
      const appointment = await AppointmentService.updateAppointment(req.params.id, userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Appointment updated successfully',
        data: appointment
      });
    } catch (error) {
      if (error.message === 'Appointment not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('Cannot update') || error.message.includes('Invalid')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating appointment',
        error: error.message
      });
    }
  }

  /**
   * [PATCH] /api/appointments/:id/status
   * Cập nhật trạng thái lịch hẹn
   */
  static async updateAppointmentStatus(req, res) {
    try {
      const { status } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      // Validate status
      const validStatuses = Object.values(Status);
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      const appointment = await AppointmentService.updateAppointmentStatus(
        req.params.id,
        status,
        userId,
        userRole
      );

      res.status(200).json({
        success: true,
        message: 'Appointment status updated successfully',
        data: appointment
      });
    } catch (error) {
      if (error.message === 'Appointment not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('Unauthorized') || error.message.includes('only') || error.message.includes('Cannot')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating appointment status',
        error: error.message
      });
    }
  }

  /**
   * [DELETE] /api/appointments/:id
   * Xóa lịch hẹn
   */
  static async deleteAppointment(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      await AppointmentService.deleteAppointment(req.params.id, userId, userRole);

      res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Appointment not found' || error.message === 'Invalid appointment ID') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('Only') || error.message.includes('Cannot delete')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error deleting appointment',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/appointments/stats
   * Lấy thống kê lịch hẹn
   */
  static async getAppointmentStats(req, res) {
    try {
      const { doctorId, patientId, fromDate, toDate } = req.query;
      const filters = { doctorId, patientId, fromDate, toDate };

      const stats = await AppointmentService.getAppointmentStats(filters);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching appointment statistics',
        error: error.message
      });
    }
  }

  /**
   * [GET] /api/appointments/enums/statuses
   * Lấy danh sách trạng thái
   */
  static getStatuses(req, res) {
    res.status(200).json({
      success: true,
      data: Object.values(Status)
    });
  }

  /**
   * [GET] /api/appointments/enums/specialties
   * Lấy danh sách chuyên khoa
   */
  static getSpecialties(req, res) {
    res.status(200).json({
      success: true,
      data: Object.values(NameSpecialty)
    });
  }
}

module.exports = AppointmentController;

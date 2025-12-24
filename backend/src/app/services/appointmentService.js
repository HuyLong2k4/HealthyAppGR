const Appointment = require('../models/appointmentModel');
const mongoose = require('mongoose');

class AppointmentService {
  /**
   * Tạo lịch hẹn mới
   * @param {String} patientId - ID của bệnh nhân
   * @param {Object} appointmentData - Dữ liệu lịch hẹn
   * @returns {Promise<Document>}
   */
  static async createAppointment(patientId, appointmentData) {
    // Validate appointmentTime format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(appointmentData.appointmentTime)) {
      throw new Error(`Invalid appointmentTime format: ${appointmentData.appointmentTime}. Use HH:MM format`);
    }

    // Validate appointmentDate không được trong quá khứ
    const appointmentDate = new Date(appointmentData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      throw new Error('Appointment date cannot be in the past');
    }

    // Kiểm tra bệnh nhân đã có lịch hẹn vào thời gian này chưa
    const existingPatientAppointment = await Appointment.findOne({
      patient: patientId,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      status: { $in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
    });

    if (existingPatientAppointment) {
      throw new Error('You already have an appointment at this time');
    }

    // Kiểm tra bác sĩ đã có lịch hẹn vào thời gian này chưa
    const existingDoctorAppointment = await Appointment.findOne({
      doctor: appointmentData.doctor,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      status: { $in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
    });

    if (existingDoctorAppointment) {
      throw new Error('This doctor is not available at this time');
    }

    const appointment = new Appointment({
      ...appointmentData,
      patient: patientId,
      status: 'PENDING'
    });

    return await appointment.save();
  }

  /**
   * Lấy tất cả lịch hẹn với filters
   * @param {Object} filters - { patientId, doctorId, specialty, status, fromDate, toDate }
   * @returns {Promise<Array<Document>>}
   */
  static async getAppointments(filters = {}) {
    const query = {};

    if (filters.patientId) {
      query.patient = filters.patientId;
    }

    if (filters.doctorId) {
      query.doctor = filters.doctorId;
    }

    if (filters.specialty) {
      query.specialty = filters.specialty;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.fromDate || filters.toDate) {
      query.appointmentDate = {};
      if (filters.fromDate) query.appointmentDate.$gte = new Date(filters.fromDate);
      if (filters.toDate) query.appointmentDate.$lte = new Date(filters.toDate);
    }

    return await Appointment.find(query)
      .populate('patient', 'username email phone imageURL')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'username email phone imageURL'
        }
      })
      .sort({ appointmentDate: 1, appointmentTime: 1 });
  }

  /**
   * Lấy lịch hẹn theo ID
   * @param {String} appointmentId - ID của lịch hẹn
   * @returns {Promise<Document|null>}
   */
  static async getAppointmentById(appointmentId) {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new Error('Invalid appointment ID');
    }

    return await Appointment.findById(appointmentId)
      .populate('patient', 'username email phone imageURL')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'username email phone imageURL'
        }
      });
  }

  /**
   * Lấy lịch hẹn của bệnh nhân
   * @param {String} patientId - ID của bệnh nhân
   * @returns {Promise<Array<Document>>}
   */
  static async getAppointmentsByPatient(patientId) {
    return await Appointment.find({ patient: patientId })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'username email phone imageURL'
        }
      })
      .sort({ appointmentDate: -1, appointmentTime: -1 }); // Mới nhất trước
  }

  /**
   * Lấy lịch hẹn của bác sĩ
   * @param {String} doctorId - ID của bác sĩ
   * @returns {Promise<Array<Document>>}
   */
  static async getAppointmentsByDoctor(doctorId) {
    return await Appointment.find({ doctor: doctorId })
      .populate('patient', 'username email phone imageURL')
      .sort({ appointmentDate: 1, appointmentTime: 1 }); // Sắp xếp tăng dần
  }

  /**
   * Cập nhật thông tin lịch hẹn
   * @param {String} appointmentId - ID của lịch hẹn
   * @param {String} userId - ID của user (để kiểm tra quyền)
   * @param {Object} updates - Dữ liệu cập nhật
   * @returns {Promise<Document|null>}
   */
  static async updateAppointment(appointmentId, userId, updates) {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new Error('Invalid appointment ID');
    }

    // Validate appointmentTime nếu có
    if (updates.appointmentTime) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(updates.appointmentTime)) {
        throw new Error(`Invalid appointmentTime format. Use HH:MM format`);
      }
    }

    // Không cho phép thay đổi patient và doctor
    delete updates.patient;
    delete updates.doctor;

    // Tìm appointment và kiểm tra quyền (chỉ patient mới update được)
    const appointment = await Appointment.findOne({ _id: appointmentId, patient: userId });
    
    if (!appointment) {
      throw new Error('Appointment not found or unauthorized');
    }

    // Không cho phép update nếu đã COMPLETED
    // CANCELLED có thể update để đặt lại (reactivate)
    if (appointment.status === 'COMPLETED') {
      throw new Error(`Cannot update completed appointment`);
    }

    // Nếu appointment đã CANCELLED và muốn reactivate, set status về PENDING
    if (appointment.status === 'CANCELLED' && !updates.status) {
      updates.status = 'PENDING';
    }

    // Nếu thay đổi ngày hoặc giờ, kiểm tra trùng lịch
    const dateChanged = updates.appointmentDate && updates.appointmentDate !== appointment.appointmentDate.toISOString();
    const timeChanged = updates.appointmentTime && updates.appointmentTime !== appointment.appointmentTime;

    if (dateChanged || timeChanged) {
      const newDate = updates.appointmentDate || appointment.appointmentDate;
      const newTime = updates.appointmentTime || appointment.appointmentTime;

      // Kiểm tra bệnh nhân đã có lịch hẹn khác vào thời gian mới chưa
      const existingPatientAppointment = await Appointment.findOne({
        _id: { $ne: appointmentId }, // Loại trừ chính appointment đang update
        patient: userId,
        appointmentDate: newDate,
        appointmentTime: newTime,
        status: { $in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
      });

      if (existingPatientAppointment) {
        throw new Error('You already have an appointment at this time');
      }

      // Kiểm tra bác sĩ đã có lịch hẹn khác vào thời gian mới chưa
      const existingDoctorAppointment = await Appointment.findOne({
        _id: { $ne: appointmentId },
        doctor: appointment.doctor,
        appointmentDate: newDate,
        appointmentTime: newTime,
        status: { $in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
      });

      if (existingDoctorAppointment) {
        throw new Error('This doctor is not available at this time');
      }
    }

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      updates,
      { new: true, runValidators: true }
    )
      .populate('patient', 'username email phone imageURL')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'username email phone imageURL'
        }
      });

    return updated;
  }

  /**
   * Cập nhật trạng thái lịch hẹn
   * @param {String} appointmentId - ID của lịch hẹn
   * @param {String} status - Trạng thái mới
   * @param {String} userId - ID của user (để kiểm tra quyền)
   * @param {String} userRole - Role của user
   * @returns {Promise<Document|null>}
   */
  static async updateAppointmentStatus(appointmentId, status, userId, userRole) {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new Error('Invalid appointment ID');
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'user');

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Kiểm tra quyền:
    // - Patient có thể CANCEL hoặc đặt lại (PENDING) nếu đã CANCELLED
    // - Doctor có thể CONFIRM, IN_PROGRESS, COMPLETE
    // - Admin có thể làm tất cả
    const isPatient = appointment.patient.toString() === userId;
    const isDoctor = appointment.doctor.user.toString() === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isPatient && !isDoctor && !isAdmin) {
      throw new Error('Unauthorized to update this appointment');
    }

    // Patient chỉ có thể CANCEL hoặc đặt lại từ CANCELLED về PENDING
    if (isPatient && status !== 'CANCELLED' && status !== 'PENDING') {
      throw new Error('Patient can only cancel or reschedule appointments');
    }

    // Patient chỉ có thể set PENDING nếu appointment đang CANCELLED
    if (isPatient && status === 'PENDING' && appointment.status !== 'CANCELLED') {
      throw new Error('Can only reschedule cancelled appointments');
    }

    // Không thể thay đổi từ COMPLETED
    if (appointment.status === 'COMPLETED') {
      throw new Error(`Cannot change status from completed`);
    }

    // Cho phép thay đổi từ CANCELLED về PENDING (đặt lại)
    if (appointment.status === 'CANCELLED' && status === 'PENDING') {
      // OK - patient đặt lại
    } else if (appointment.status === 'CANCELLED' && status !== 'PENDING') {
      // Không cho phép chuyển từ CANCELLED sang trạng thái khác (ngoại trừ PENDING)
      throw new Error(`Cannot change status from cancelled to ${status}`);
    }

    appointment.status = status;
    await appointment.save();

    return await Appointment.findById(appointmentId)
      .populate('patient', 'username email phone imageURL')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'username email phone imageURL'
        }
      });
  }

  /**
   * Xóa lịch hẹn
   * @param {String} appointmentId - ID của lịch hẹn
   * @param {String} userId - ID của user (để kiểm tra quyền)
   * @param {String} userRole - Role của user
   * @returns {Promise<Document|null>}
   */
  static async deleteAppointment(appointmentId, userId, userRole) {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new Error('Invalid appointment ID');
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Chỉ patient hoặc admin mới xóa được
    const isPatient = appointment.patient.toString() === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isPatient && !isAdmin) {
      throw new Error('Only patient or admin can delete appointments');
    }

    // Không cho phép xóa nếu đã COMPLETED
    if (appointment.status === 'COMPLETED') {
      throw new Error('Cannot delete completed appointment');
    }

    return await Appointment.findByIdAndDelete(appointmentId);
  }

  /**
   * Lấy thống kê lịch hẹn
   * @param {Object} filters - { doctorId, patientId, fromDate, toDate }
   * @returns {Promise<Object>}
   */
  static async getAppointmentStats(filters = {}) {
    const query = {};

    if (filters.doctorId) query.doctor = filters.doctorId;
    if (filters.patientId) query.patient = filters.patientId;
    
    if (filters.fromDate || filters.toDate) {
      query.appointmentDate = {};
      if (filters.fromDate) query.appointmentDate.$gte = new Date(filters.fromDate);
      if (filters.toDate) query.appointmentDate.$lte = new Date(filters.toDate);
    }

    const totalAppointments = await Appointment.countDocuments(query);

    const byStatus = await Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const bySpecialty = await Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$specialty',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return {
      totalAppointments,
      byStatus,
      bySpecialty
    };
  }
}

module.exports = AppointmentService;

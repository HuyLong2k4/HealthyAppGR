const Doctor = require('../models/doctorModel');
const mongoose = require('mongoose');

class DoctorService {
  /**
   * Tạo hồ sơ bác sĩ mới
   * @param {String} userId - ID của user (tài khoản bác sĩ)
   * @param {Object} doctorData - Thông tin bác sĩ
   * @returns {Promise<Document>}
   */
  static async createDoctor(userId, doctorData) {
    // Kiểm tra user đã có hồ sơ bác sĩ chưa
    const existingDoctor = await Doctor.findOne({ user: userId });
    if (existingDoctor) {
      throw new Error('User already has a doctor profile');
    }

    // Validate schedule nếu có
    if (doctorData.schedule && doctorData.schedule.length > 0) {
      DoctorService.validateSchedule(doctorData.schedule);
    }

    const doctor = new Doctor({
      ...doctorData,
      user: userId
    });

    return await doctor.save();
  }

  /**
   * Lấy tất cả bác sĩ với filter
   * @param {Object} filters - { specialty, title, minPrice, maxPrice }
   * @returns {Promise<Array<Document>>}
   */
  static async getDoctors(filters = {}) {
    const query = {};

    if (filters.specialty) {
      query.specialty = filters.specialty;
    }

    if (filters.title) {
      query.title = filters.title;
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }

    return await Doctor.find(query)
      .populate('user', 'username email phone imageURL')
      .sort({ createdAt: -1 });
  }

  /**
   * Lấy thông tin bác sĩ theo ID
   * @param {String} doctorId - ID của bác sĩ
   * @returns {Promise<Document|null>}
   */
  static async getDoctorById(doctorId) {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      throw new Error('Invalid doctor ID');
    }

    return await Doctor.findById(doctorId)
      .populate('user', 'username email phone imageURL');
  }

  /**
   * Lấy thông tin bác sĩ theo userId
   * @param {String} userId - ID của user
   * @returns {Promise<Document|null>}
   */
  static async getDoctorByUserId(userId) {
    return await Doctor.findOne({ user: userId })
      .populate('user', 'username email phone imageURL');
  }

  /**
   * Tìm bác sĩ theo chuyên khoa
   * @param {String} specialty - Chuyên khoa
   * @returns {Promise<Array<Document>>}
   */
  static async getDoctorsBySpecialty(specialty) {
    return await Doctor.find({ specialty })
      .populate('user', 'username email phone imageURL')
      .sort({ price: 1 }); // Sắp xếp theo giá tăng dần
  }


  /**
   * Cập nhật thông tin bác sĩ
   * @param {String} doctorId - ID của bác sĩ
   * @param {String} userId - ID của user (để kiểm tra quyền)
   * @param {Object} updates - Dữ liệu cập nhật
   * @returns {Promise<Document|null>}
   */
  static async updateDoctor(doctorId, userId, updates) {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      throw new Error('Invalid doctor ID');
    }

    // Validate schedule nếu có cập nhật
    if (updates.schedule) {
      DoctorService.validateSchedule(updates.schedule);
    }

    // Không cho phép thay đổi user
    delete updates.user;

    const doctor = await Doctor.findOneAndUpdate(
      { _id: doctorId, user: userId },
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'username email phone imageURL');

    if (!doctor) {
      throw new Error('Doctor not found or unauthorized');
    }

    return doctor;
  }

  /**
   * Cập nhật lịch làm việc của bác sĩ
   * @param {String} doctorId - ID của bác sĩ
   * @param {String} userId - ID của user (để kiểm tra quyền)
   * @param {Array} schedule - Lịch làm việc mới
   * @returns {Promise<Document|null>}
   */
  static async updateSchedule(doctorId, userId, schedule) {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      throw new Error('Invalid doctor ID');
    }

    // Validate schedule
    DoctorService.validateSchedule(schedule);

    const doctor = await Doctor.findOneAndUpdate(
      { _id: doctorId, user: userId },
      { schedule },
      { new: true, runValidators: true }
    ).populate('user', 'username email phone imageURL');

    if (!doctor) {
      throw new Error('Doctor not found or unauthorized');
    }

    return doctor;
  }

  /**
   * Xóa hồ sơ bác sĩ
   * @param {String} doctorId - ID của bác sĩ
   * @param {String} userId - ID của user (để kiểm tra quyền)
   * @returns {Promise<Document|null>}
   */
  static async deleteDoctor(doctorId, userId) {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      throw new Error('Invalid doctor ID');
    }

    const doctor = await Doctor.findOneAndDelete({
      _id: doctorId,
      user: userId
    });

    if (!doctor) {
      throw new Error('Doctor not found or unauthorized');
    }

    return doctor;
  }

  /**
   * Validate lịch làm việc
   * @param {Array} schedule - Lịch làm việc
   * @throws {Error} - Nếu lịch không hợp lệ
   */
  static validateSchedule(schedule) {
    if (!Array.isArray(schedule)) {
      throw new Error('Schedule must be an array');
    }

    for (const slot of schedule) {
      // Validate dayOfWeek
      if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
        throw new Error('dayOfWeek must be between 0 and 6');
      }

      // Validate time format (HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(slot.startTime)) {
        throw new Error(`Invalid startTime format: ${slot.startTime}. Use HH:MM format`);
      }
      if (!timeRegex.test(slot.endTime)) {
        throw new Error(`Invalid endTime format: ${slot.endTime}. Use HH:MM format`);
      }

      // Validate endTime > startTime
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        throw new Error('endTime must be after startTime');
      }

      // Validate slotDuration
      if (slot.slotDuration && (slot.slotDuration < 15 || slot.slotDuration > 120)) {
        throw new Error('slotDuration must be between 15 and 120 minutes');
      }
    }
  }

}

module.exports = DoctorService;

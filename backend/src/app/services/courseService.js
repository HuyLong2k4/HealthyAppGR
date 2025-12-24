const Course = require('../models/courseModel');

class CourseService {
  /**
   * Tạo một khóa học mới
   * @param {Object} courseData - Dữ liệu của khóa học (title, thumbnail, description, user)
   * @returns {Promise<Document>}
   */
  static async createCourse(courseData) {
    const newCourse = new Course(courseData);
    return await newCourse.save();
  }

  /**
   * Lấy tất cả khóa học, kèm thông tin cơ bản của người tạo
   * @returns {Promise<Array<Document>>}
   */
  static async getAllCourses() {
    // .populate('user', 'username imageURL') để lấy thêm thông tin của user
    // thay vì chỉ có ID, loại bỏ các trường không cần thiết như passwordHash
    return await Course.find().populate('user', 'username imageURL');
  }

  /**
   * Lấy một khóa học theo ID
   * @param {String} id - ID của khóa học
   * @returns {Promise<Document|null>}
   */
  static async getCourseById(id) {
    return await Course.findById(id).populate('user', 'username imageURL');
  }

  /**
   * Cập nhật một khóa học
   * @param {String} id - ID của khóa học
   * @param {Object} updates - Các trường cần cập nhật
   * @returns {Promise<Document|null>}
   */
  static async updateCourse(id, updates) {
    // { new: true } để kết quả trả về là document đã được cập nhật
    return await Course.findByIdAndUpdate(id, updates, { new: true });
  }

  /**
   * Xóa một khóa học
   * @param {String} id - ID của khóa học
   * @returns {Promise<Document|null>}
   */
  static async deleteCourse(id) {
    return await Course.findByIdAndDelete(id);
  }

  /**
   * Lấy tất cả khóa học của một người dùng cụ thể
   * @param {String} userId - ID của người dùng
   * @returns {Promise<Array<Document>>}
   */
  static async getCoursesByUserId(userId) {
    return await Course.find({ user: userId }).populate('user', 'username imageURL');
  }
}

module.exports = CourseService;
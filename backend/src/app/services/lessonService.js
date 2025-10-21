const Lesson = require('../models/lessonModel');

class LessonService {
  /**
   * Tạo một bài học mới
   * @param {Object} lessonData - Dữ liệu của bài học
   * @returns {Promise<Document>}
   */
  static async createLesson(lessonData) {
    const newLesson = new Lesson(lessonData);
    return await newLesson.save();
  }

  /**
   * Lấy một bài học theo ID
   * @param {String} id - ID của bài học
   * @returns {Promise<Document|null>}
   */
  static async getLessonById(id) {
    // Populate để lấy thông tin khóa học mà bài học này thuộc về
    return await Lesson.findById(id).populate('course', 'description');
  }

  /**
   * Lấy tất cả bài học của một khóa học cụ thể
   * @param {String} courseId - ID của khóa học
   * @returns {Promise<Array<Document>>}
   */
  static async getLessonsByCourseId(courseId) {
    return await Lesson.find({ course: courseId }).populate('course', 'description');
  }

  /**
   * Cập nhật một bài học
   * @param {String} id - ID của bài học
   * @param {Object} updates - Các trường cần cập nhật
   * @returns {Promise<Document|null>}
   */
  static async updateLesson(id, updates) {
    return await Lesson.findByIdAndUpdate(id, updates, { new: true });
  }

  /**
   * Xóa một bài học
   * @param {String} id - ID của bài học
   * @returns {Promise<Document|null>}
   */
  static async deleteLesson(id) {
    return await Lesson.findByIdAndDelete(id);
  }
}

module.exports = LessonService;

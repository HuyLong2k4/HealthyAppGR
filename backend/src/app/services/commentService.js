const Comment = require('../models/commentModel');

class CommentService {
  /**
   * Tạo một comment mới
   * @param {Object} commentData - Dữ liệu comment (textBody, course, user)
   * @returns {Promise<Document>}
   */
  static async createComment(commentData) {
    const newComment = new Comment(commentData);
    // Populate user để trả về thông tin người gửi ngay lập tức
    await newComment.save();
    return newComment.populate('user', 'username imageURL');
  }

  /**
   * Lấy tất cả comment của một khóa học
   * @param {String} courseId - ID của khóa học
   * @returns {Promise<Array<Document>>}
   */
  static async getCommentsByCourseId(courseId) {
    return await Comment.find({ course: courseId })
      .populate('user', 'username imageURL') // Lấy thông tin người comment
      .sort({ createdAt: -1 }); // Sắp xếp comment mới nhất lên đầu
  }

  /**
   * Cập nhật một comment
   * @param {String} commentId - ID của comment
   * @param {String} userId - ID của user đang thực hiện (để kiểm tra quyền)
   * @param {Object} updates - Nội dung cần cập nhật (ví dụ: { textBody: "..." })
   * @returns {Promise<Document|null>}
   */
  static async updateComment(commentId, userId, updates) {
    // Tìm comment khớp cả commentId và userId để đảm bảo đúng chủ sở hữu
    const query = { _id: commentId, user: userId };
    return await Comment.findOneAndUpdate(query, updates, { new: true });
  }

  /**
   * Xóa một comment
   * @param {String} commentId - ID của comment
   * @param {String} userId - ID của user đang thực hiện (để kiểm tra quyền)
   * @returns {Promise<Document|null>}
   */
  static async deleteComment(commentId, userId) {
    // Tương tự, chỉ xóa khi commentId và userId cùng khớp
    const query = { _id: commentId, user: userId };
    return await Comment.findOneAndDelete(query);
  }
}

module.exports = CommentService;
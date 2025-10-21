const CommentService = require('../services/commentService');

class CommentController {
  static async createComment(req, res) {
    try {
      // QUAN TRỌNG: Trong ứng dụng thực tế có login,
      // userId phải được lấy từ req.user.id (do middleware xác thực thêm vào),
      // không bao giờ tin tưởng vào req.body.user do client gửi lên.
      // Tạm thời cho mục đích test, chúng ta vẫn có thể dùng req.body.user.
      const commentData = {
        textBody: req.body.textBody,
        course: req.body.course,
        user: req.body.user // << THAY BẰNG req.user.id TRONG THỰC TẾ
      };
      
      const comment = await CommentService.createComment(commentData);
      res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getCommentsByCourseId(req, res) {
    try {
      const comments = await CommentService.getCommentsByCourseId(req.params.courseId);
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateComment(req, res) {
    try {
      const commentId = req.params.id;
      const userId = req.body.user; // << THAY BẰNG req.user.id TRONG THỰC TẾ
      const updates = { textBody: req.body.textBody };

      const updatedComment = await CommentService.updateComment(commentId, userId, updates);
      
      if (!updatedComment) {
        // Lỗi có thể do comment không tồn tại, hoặc user không có quyền sửa
        return res.status(404).json({ message: 'Comment not found or you do not have permission to edit it' });
      }
      
      res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteComment(req, res) {
    try {
      const commentId = req.params.id;
      const userId = req.body.user; // << THAY BẰNG req.user.id TRONG THỰC TẾ

      const deletedComment = await CommentService.deleteComment(commentId, userId);

      if (!deletedComment) {
        return res.status(404).json({ message: 'Comment not found or you do not have permission to delete it' });
      }

      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CommentController;
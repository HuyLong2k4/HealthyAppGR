const express = require('express');
const CommentController = require('../controllers/commentController');

const router = express.Router();

// [POST] /api/comments - Tạo comment mới (cần xác thực)
router.post('/', CommentController.createComment);

// [GET] /api/comments/course/:courseId - Lấy comment của 1 khóa học
router.get('/course/:courseId', CommentController.getCommentsByCourseId);

// [PUT] /api/comments/:id - Cập nhật comment (cần xác thực & đúng chủ)
router.put('/:id', CommentController.updateComment);

// [DELETE] /api/comments/:id - Xóa comment (cần xác thực & đúng chủ)
router.delete('/:id', CommentController.deleteComment);

module.exports = router;
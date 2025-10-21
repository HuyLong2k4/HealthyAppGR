const express = require('express');
const LessonController = require('../controllers/lessonController');

const router = express.Router();

// [POST] /api/lessons - Tạo bài học mới
router.post('/', LessonController.createLesson);

// [GET] /api/lessons/course/:courseId - Lấy tất cả bài học của một khóa học
router.get('/course/:courseId', LessonController.getLessonsByCourseId);

// [GET] /api/lessons/:id - Lấy bài học theo ID
router.get('/:id', LessonController.getLessonById);

// [PUT] /api/lessons/:id - Cập nhật bài học
router.put('/:id', LessonController.updateLesson);

// [DELETE] /api/lessons/:id - Xóa bài học
router.delete('/:id', LessonController.deleteLesson);

module.exports = router;

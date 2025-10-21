const express = require('express');
const CourseController = require('../controllers/courseController');
// Bây giờ bạn đã có thể import nó
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

// Áp dụng middleware vào các route cần bảo vệ
router.post('/', authMiddleware, CourseController.createCourse);
router.put('/:id', authMiddleware, CourseController.updateCourse);
router.delete('/:id', authMiddleware, CourseController.deleteCourse);

// Các route công khai
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);
router.get('/user/:userId', CourseController.getCoursesByUserId);

module.exports = router;
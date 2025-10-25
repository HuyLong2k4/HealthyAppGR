// routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware'); // (Middlewarexác thực token của bạn)

// --- ĐÂY LÀ ROUTE BẠN ĐANG THIẾU (GÂY LỖI 404) ---
// GET /api/enrollments
// Lấy tất cả khóa học đã đăng ký của user
router.get(
    '/', 
    authMiddleware, 
    EnrollmentController.getAllEnrollments
);

// POST /api/enrollments
// Đăng ký một khóa học mới
router.post(
    '/', 
    authMiddleware, 
    EnrollmentController.createEnrollment
);



module.exports = router;
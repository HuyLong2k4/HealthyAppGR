const express = require('express');
const DoctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes - không cần authentication

/**
 * [GET] /api/doctors
 * Lấy danh sách bác sĩ với filters (specialty, title, minPrice, maxPrice)
 */
router.get('/', DoctorController.getDoctors);

/**
 * [GET] /api/doctors/specialty/:specialty
 * Tìm bác sĩ theo chuyên khoa
 */
router.get('/specialty/:specialty', DoctorController.getDoctorsBySpecialty);

/**
 * [GET] /api/doctors/:id
 * Lấy thông tin bác sĩ theo ID
 */
router.get('/:id', DoctorController.getDoctorById);

// Protected routes - cần authentication

/**
 * [POST] /api/doctors
 * Tạo hồ sơ bác sĩ mới
 */
router.post('/', authMiddleware, DoctorController.createDoctor);

/**
 * [GET] /api/doctors/my-profile
 * Lấy hồ sơ bác sĩ của chính mình
 */
router.get('/my-profile', authMiddleware, DoctorController.getMyProfile);

/**
 * [PUT] /api/doctors/:id
 * Cập nhật thông tin bác sĩ
 */
router.put('/:id', authMiddleware, DoctorController.updateDoctor);

/**
 * [PATCH] /api/doctors/:id/schedule
 * Cập nhật lịch làm việc
 */
router.patch('/:id/schedule', authMiddleware, DoctorController.updateSchedule);

/**
 * [DELETE] /api/doctors/:id
 * Xóa hồ sơ bác sĩ
 */
router.delete('/:id', authMiddleware, DoctorController.deleteDoctor);

module.exports = router;

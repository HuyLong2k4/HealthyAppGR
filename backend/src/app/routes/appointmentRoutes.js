const express = require('express');
const AppointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (nếu cần)

/**
 * [GET] /api/appointments/enums/statuses
 * Lấy danh sách trạng thái
 */
router.get('/enums/statuses', AppointmentController.getStatuses);

/**
 * [GET] /api/appointments/enums/specialties
 * Lấy danh sách chuyên khoa
 */
router.get('/enums/specialties', AppointmentController.getSpecialties);

// Protected routes - cần authentication

/**
 * [GET] /api/appointments/stats
 * Lấy thống kê lịch hẹn
 * Query: ?doctorId=...&patientId=...&fromDate=...&toDate=...
 */
router.get('/stats', authMiddleware, AppointmentController.getAppointmentStats);

/**
 * [GET] /api/appointments/my-appointments
 * Lấy lịch hẹn của chính mình (patient)
 */
router.get('/my-appointments', authMiddleware, AppointmentController.getMyAppointments);

/**
 * [GET] /api/appointments/patient/:patientId
 * Lấy lịch hẹn của bệnh nhân
 */
router.get('/patient/:patientId', authMiddleware, AppointmentController.getAppointmentsByPatient);

/**
 * [GET] /api/appointments/doctor/:doctorId
 * Lấy lịch hẹn của bác sĩ
 */
router.get('/doctor/:doctorId', authMiddleware, AppointmentController.getAppointmentsByDoctor);

/**
 * [GET] /api/appointments
 * Lấy danh sách lịch hẹn với filters
 * Query: ?patientId=...&doctorId=...&specialty=...&status=...&fromDate=...&toDate=...
 */
router.get('/', authMiddleware, AppointmentController.getAppointments);

/**
 * [GET] /api/appointments/:id
 * Lấy thông tin lịch hẹn theo ID
 */
router.get('/:id', authMiddleware, AppointmentController.getAppointmentById);

/**
 * [POST] /api/appointments
 * Tạo lịch hẹn mới
 */
router.post('/', authMiddleware, AppointmentController.createAppointment);

/**
 * [PUT] /api/appointments/:id
 * Cập nhật thông tin lịch hẹn (chỉ patient)
 */
router.put('/:id', authMiddleware, AppointmentController.updateAppointment);

/**
 * [PATCH] /api/appointments/:id/status
 * Cập nhật trạng thái lịch hẹn
 */
router.patch('/:id/status', authMiddleware, AppointmentController.updateAppointmentStatus);

/**
 * [DELETE] /api/appointments/:id
 * Xóa lịch hẹn
 */
router.delete('/:id', authMiddleware, AppointmentController.deleteAppointment);

module.exports = router;

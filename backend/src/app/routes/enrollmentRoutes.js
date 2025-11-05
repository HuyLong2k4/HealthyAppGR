const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, EnrollmentController.getAllEnrollments);
router.post('/', authMiddleware, EnrollmentController.createEnrollment);

module.exports = router;
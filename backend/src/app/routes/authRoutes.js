const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController'); // Đảm bảo đường dẫn đến controller là chính xác

// @route   POST api/auth/login
// @desc    Xác thực người dùng & lấy token
// @access  Public
router.post('/login', AuthController.loginUser);

module.exports = router;

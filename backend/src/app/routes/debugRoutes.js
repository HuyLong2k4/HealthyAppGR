const express = require('express');
const DebugController = require('../controllers/debugController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Get messages grouped by user
router.get('/messages/by-user', DebugController.getMessagesByUser);

// Verify message security
router.get('/messages/verify-security', DebugController.verifyMessageSecurity);

module.exports = router;

const express = require("express");
const router = express.Router();

const NotificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get('/', authMiddleware, NotificationController.getAllNotification);

router.post('/', authMiddleware, NotificationController.createNotification);

router.delete('/:id', authMiddleware, NotificationController.deleteNotification);

module.exports = router;
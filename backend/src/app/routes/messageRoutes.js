const express = require('express');
const MessageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(authMiddleware);

// Tạo tin nhắn mới
router.post('/', MessageController.createMessage);

// Lưu cặp tin nhắn (user + AI) - endpoint chính để chat với Gemini
router.post('/chat', MessageController.saveChatPair);

// Lấy lịch sử chat
router.get('/history', MessageController.getChatHistory);

// Lấy tin nhắn gần đây
router.get('/recent', MessageController.getRecentMessages);

// Đếm số tin nhắn
router.get('/count', MessageController.countMessages);

// Tìm kiếm tin nhắn
router.get('/search', MessageController.searchMessages);

// Xóa tất cả tin nhắn
router.delete('/all', MessageController.deleteAllMessages);

module.exports = router;

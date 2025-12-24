const MessageService = require('../services/messageService');

class MessageController {
  /**
   * Tạo tin nhắn mới
   * POST /api/messages
   * Body: { role, content, sessionId (optional) }
   */
  static async createMessage(req, res) {
    try {
      const messageData = {
        user: req.user.id,
        ...req.body
      };

      const message = await MessageService.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Lưu cặp tin nhắn (user + AI)
   * POST /api/messages/chat
   * Body: { userMessage, aiResponse, metadata (optional) }
   */
  static async saveChatPair(req, res) {
    try {
      const { userMessage, aiResponse, metadata } = req.body;

      if (!userMessage || !aiResponse) {
        return res.status(400).json({ 
          message: 'userMessage and aiResponse are required' 
        });
      }

      const result = await MessageService.saveChatPair(
        req.user.id,
        userMessage,
        aiResponse,
        metadata
      );

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Lấy lịch sử chat
   * GET /api/messages/history?limit=100
   */
  static async getChatHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const messages = await MessageService.getChatHistory(req.user.id, limit);
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Lấy tin nhắn gần đây
   * GET /api/messages/recent?limit=50
   */
  static async getRecentMessages(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const messages = await MessageService.getRecentMessages(req.user.id, limit);
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Xóa tất cả tin nhắn của user
   * DELETE /api/messages/all
   */
  static async deleteAllMessages(req, res) {
    try {
      const result = await MessageService.deleteAllUserMessages(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Đếm số tin nhắn
   * GET /api/messages/count
   */
  static async countMessages(req, res) {
    try {
      const count = await MessageService.countMessages(req.user.id);
      res.status(200).json({ count });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Tìm kiếm tin nhắn
   * GET /api/messages/search?q=keyword&limit=20
   */
  static async searchMessages(req, res) {
    try {
      const { q, limit } = req.query;
      
      if (!q) {
        return res.status(400).json({ message: 'Search query (q) is required' });
      }

      const messages = await MessageService.searchMessages(
        req.user.id, 
        q, 
        parseInt(limit) || 20
      );
      
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = MessageController;

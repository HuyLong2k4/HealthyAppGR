const Message = require('../models/messageModel');
const mongoose = require('mongoose');

class MessageService {
  /**
   * Tạo tin nhắn mới (từ user hoặc AI)
   * @param {Object} messageData - { user, role, content, metadata }
   * @returns {Promise<Document>}
   */
  static async createMessage(messageData) {
    const message = new Message(messageData);
    return await message.save();
  }

  /**
   * Lưu cả cặp tin nhắn (user + AI response) cùng lúc
   * @param {String} userId - ID của user
   * @param {String} userMessage - Nội dung tin nhắn từ user
   * @param {String} aiResponse - Phản hồi từ AI
   * @param {Object} metadata - Metadata từ Gemini API (tùy chọn)
   * @returns {Promise<Object>}
   */
  static async saveChatPair(userId, userMessage, aiResponse, metadata = {}) {
    const userMsg = await Message.create({
      user: userId,
      role: 'user',
      content: userMessage
    });

    const aiMsg = await Message.create({
      user: userId,
      role: 'model',
      content: aiResponse,
      metadata
    });

    return {
      userMessage: userMsg,
      aiMessage: aiMsg
    };
  }

  /**
   * Lấy tất cả tin nhắn của user (lịch sử chat)
   * @param {String} userId - ID của user
   * @param {Number} limit - Số lượng tin nhắn (mặc định 100)
   * @returns {Promise<Array<Document>>}
   */
  static async getChatHistory(userId, limit = 100) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    return await Message.find({ user: userId })
      .sort({ createdAt: 1 }) // Sắp xếp theo thời gian tăng dần
      .limit(limit)
      .select('-__v');
  }

  /**
   * Lấy tin nhắn gần đây nhất của user (tất cả sessions)
   * @param {String} userId - ID của user
   * @param {Number} limit - Số lượng tin nhắn (mặc định 50)
   * @returns {Promise<Array<Document>>}
   */
  static async getRecentMessages(userId, limit = 50) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    return await Message.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');
  }

  /**
   * Xóa tất cả lịch sử chat của user
   * @param {String} userId - ID của user
   * @returns {Promise<Object>}
   */
  static async deleteAllUserMessages(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const result = await Message.deleteMany({ user: userId });
    
    return { 
      message: 'All messages deleted successfully',
      deletedCount: result.deletedCount 
    };
  }

  /**
   * Đếm số tin nhắn của user
   * @param {String} userId - ID của user
   * @returns {Promise<Number>}
   */
  static async countMessages(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    return await Message.countDocuments({ user: userId });
  }

  /**
   * Tìm kiếm tin nhắn theo nội dung
   * @param {String} userId - ID của user
   * @param {String} searchText - Nội dung cần tìm
   * @param {Number} limit - Số lượng kết quả (mặc định 20)
   * @returns {Promise<Array<Document>>}
   */
  static async searchMessages(userId, searchText, limit = 20) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    return await Message.find({
      user: userId,
      content: { $regex: searchText, $options: 'i' } // Case-insensitive search
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');
  }
}

module.exports = MessageService;

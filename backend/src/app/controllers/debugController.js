const MessageService = require('../services/messageService');
const Message = require('../models/messageModel');

class DebugController {
  /**
   * [ADMIN ONLY] Get all messages grouped by user
   * GET /api/debug/messages/by-user
   */
  static async getMessagesByUser(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          message: 'Forbidden: Admin access required' 
        });
      }

      const pipeline = [
        {
          $group: {
            _id: '$user',
            messageCount: { $sum: 1 },
            latestMessage: { $max: '$createdAt' },
            messages: { 
              $push: { 
                id: '$_id', 
                role: '$role', 
                content: { $substr: ['$content', 0, 100] },
                createdAt: '$createdAt' 
              } 
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $project: {
            userId: '$_id',
            messageCount: 1,
            latestMessage: 1,
            userEmail: { $arrayElemAt: ['$userInfo.email', 0] },
            username: { $arrayElemAt: ['$userInfo.username', 0] },
            messages: { $slice: ['$messages', -5] } // Last 5 messages
          }
        },
        {
          $sort: { messageCount: -1 }
        }
      ];

      const results = await Message.aggregate(pipeline);

      res.status(200).json({
        totalUsers: results.length,
        users: results
      });
    } catch (error) {
      console.error('[DebugController] Error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * [ADMIN ONLY] Verify message security
   * GET /api/debug/messages/verify-security
   */
  static async verifyMessageSecurity(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          message: 'Forbidden: Admin access required' 
        });
      }

      const issues = [];

      // Check 1: Find messages with invalid user references
      const messagesWithInvalidUser = await Message.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $match: {
            userInfo: { $size: 0 }
          }
        },
        {
          $project: {
            _id: 1,
            user: 1,
            content: { $substr: ['$content', 0, 50] },
            createdAt: 1
          }
        }
      ]);

      if (messagesWithInvalidUser.length > 0) {
        issues.push({
          type: 'ORPHANED_MESSAGES',
          severity: 'HIGH',
          count: messagesWithInvalidUser.length,
          description: 'Messages with non-existent user references',
          samples: messagesWithInvalidUser.slice(0, 5)
        });
      }

      // Check 2: Statistics
      const totalMessages = await Message.countDocuments();
      const userCount = await Message.distinct('user').then(arr => arr.length);

      const result = {
        securityStatus: issues.length === 0 ? 'SECURE' : 'ISSUES_FOUND',
        timestamp: new Date().toISOString(),
        statistics: {
          totalMessages,
          uniqueUsers: userCount,
          averageMessagesPerUser: totalMessages / userCount || 0
        },
        issues,
        recommendation: issues.length === 0 
          ? 'All messages are properly secured and associated with valid users.'
          : 'Security issues detected. Please review and fix orphaned messages.'
      };

      res.status(200).json(result);
    } catch (error) {
      console.error('[DebugController] Error:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = DebugController;

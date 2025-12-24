const Notification = require('../models/notificationModel');

class NotificationService {
    static async createNotification(notificationData) {
        const newNotification = new Notification(notificationData);
        return await newNotification.save();
    }

    static async getAllNotification() {
        return await Notification.find();
    }

    static async deleteNotification(id) {
        return await Notification.findByIdAndDelete(id);
    }
}

module.exports = NotificationService;
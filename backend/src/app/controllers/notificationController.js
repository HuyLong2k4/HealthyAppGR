const NotificationService = require("../services/notificationService");

class NotificationController {
    static async createNotification(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: "Authentication required." });
            }

            const userId = req.user.id;
            
            const notificationData = {
                type: req.body.type,
                title: req.body.title,
                payload: req.body.payload,
                user: userId
            }

            const notification = await NotificationService.createNotification(notificationData);
            res.status(201).json({ message: "Notification created success", notification})
        } catch (err) {
            res.status(500).json({  message: "Notification create fail", error: err.message });
        } 
    }

    static async getAllNotification(req, res) {
        try {
            const notification = await NotificationService.getAllNotification();
            res.status(200).json(notification);
        } catch (err) {
            res.status(500).json(err.message);
        }
    }

    static async deleteNotification(req, res) {
        try {
            const notification = await NotificationService.deleteNotification(req.params.id);
            if (notification) {
                res.status(200).json({  message: "Notification deleted success" });
            } else {
                res.status(404).json({ message: 'Notification not found' });
            }
        } catch (err) {
            res.status(500).json(err.message);
        }
    }
}

module.exports = NotificationController;
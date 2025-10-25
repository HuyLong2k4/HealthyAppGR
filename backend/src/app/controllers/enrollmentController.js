// controllers/enrollmentController.js
const mongoose = require("mongoose");
const EnrollmentService = require("../services/enrollmentService");

class EnrollmentController {
    
    // (Hàm createEnrollment của bạn đã có ở đây)
    static async createEnrollment(req, res) {
        try {
            // ... (code của bạn) ...
            const userId = (req.user && (req.user.id || req.user._id?.toString())) || null;
            if (!userId) return res.status(401).json({ error: "Authentication required." });
            
            const courseId = req.body.course || req.params.courseId;
            if (!courseId) return res.status(400).json({ error: "Missing courseId (field 'course')." });
            
            // ... (code chuẩn hoá dữ liệu của bạn) ...
            const enrollmentData = { /* ... */ };

            const enrollment = await EnrollmentService.createEnrollment({
                userId,
                courseId,
                enrollmentData,
            });

            return res.status(201).json({ message: "Khóa học đã được đăng ký", enrollment });
        } catch (error) {
            console.error("[CTRL] createEnrollment error:", error?.message);
            if (error?.code === 11000) {
                return res.status(409).json({ error: "Enrollment already exists" });
            }
            const status = error?.statusCode || 400;
            return res.status(status).json({ error: error?.message || "Bad request" });
        }
    }

    // --- BỔ SUNG: HÀM LẤY DANH SÁCH ENROLLMENT ---
    static async getAllEnrollments(req, res) {
        try {
            // Lấy user ID từ middleware (bắt buộc)
            const userId = (req.user && (req.user.id || req.user._id?.toString())) || null;
            if (!userId) {
                return res.status(401).json({ error: "Authentication required." });
            }

            // Gọi service để tìm tất cả enrollment của user này
            const enrollments = await EnrollmentService.findEnrollmentsByUserId(userId);
            
            return res.status(200).json(enrollments);

        } catch (error) {
            console.error("[CTRL] getAllEnrollments error:", error?.message);
            return res.status(500).json({ error: error?.message || "Internal server error" });
        }
    }
}

module.exports = EnrollmentController;
// services/enrollmentService.js
const Enrollment = require("../models/enrollmentModel"); // (Giả sử bạn có model này)
const mongoose = require("mongoose");

class EnrollmentService {

    // Hàm này được gọi bởi createEnrollment
    static async createEnrollment({ userId, courseId, enrollmentData }) {
        // 1. Kiểm tra xem đã đăng ký chưa
        const existing = await Enrollment.findOne({ user: userId, course: courseId });
        if (existing) {
            const error = new Error("Enrollment already exists");
            error.code = 11000; // Giả lập lỗi duplicate của MongoDB
            throw error;
        }

        // 2. Tạo mới
        const newEnrollment = new Enrollment({
            ...enrollmentData, // status, progressPct, v.v.
            user: userId,
            course: courseId,
        });

        await newEnrollment.save();
        
        // Populate lại thông tin course để trả về
        await newEnrollment.populate('course');
        return newEnrollment;
    }

    // --- BỔ SUNG: HÀM TÌM ENROLLMENT THEO USER ID ---
    static async findEnrollmentsByUserId(userId) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new Error("Invalid userId.");
        }
        
        // Tìm tất cả enrollment của user
        // .populate('course') RẤT QUAN TRỌNG:
        // Nó sẽ lấy đầy đủ thông tin khóa học (title, thumbnail, v.v.)
        // thay vì chỉ trả về courseId.
        const enrollments = await Enrollment.find({ user: userId })
            .populate('course') // Lấy thông tin chi tiết của khóa học
            .sort({ enrolledAt: -1 }); // Sắp xếp mới nhất lên đầu
            
        return enrollments;
    }
}

module.exports = EnrollmentService;
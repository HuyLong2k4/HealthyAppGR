const express = require('express');
const multer = require('multer');
const MedicalHistoryController = require('../controllers/medicalHistoryController');

const router = express.Router();

// --- Cấu hình Multer ---
// Tạo thư mục 'uploads' ở thư mục gốc của project nếu chưa có
const uploadDir = 'uploads/';
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Định nghĩa nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Lưu file vào thư mục 'uploads/'
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất: timestamp + tên file gốc
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
// -----------------------


// [POST] /api/medical-histories - Tạo hồ sơ mới (dùng multer middleware)
// 'imageMedical' là tên của field chứa file trong form-data
router.post('/', upload.single('imageMedical'), MedicalHistoryController.createMedicalHistory);

// [GET] /api/medical-histories/user/:userId - Lấy hồ sơ của một user
router.get('/user/:userId', MedicalHistoryController.getMedicalHistoriesByUserId);

// [PUT] /api/medical-histories/:id - Cập nhật hồ sơ
router.put('/:id', MedicalHistoryController.updateMedicalHistory);

// [DELETE] /api/medical-histories/:id - Xóa hồ sơ
router.delete('/:id', MedicalHistoryController.deleteMedicalHistory);


module.exports = router;
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Điều chỉnh đường dẫn tới model User của bạn

const authMiddleware = async (req, res, next) => {
    let token;

    // 1. Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Tách lấy token từ header (loại bỏ chữ 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 3. Giải mã và xác thực token
            // Sử dụng cùng một JWT_SECRET mà bạn đã dùng để tạo token lúc đăng nhập
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');
            req.user = {
                id: user._id.toString(),
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            };

            // 5. Đi tiếp tới controller
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    // Nếu không có token trong header
    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

module.exports = authMiddleware;
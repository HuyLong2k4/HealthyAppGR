const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  /**
   * Xử lý logic nghiệp vụ cho việc đăng nhập.
   * @param {string} email - Email của người dùng.
   * @param {string} password - Mật khẩu của người dùng.
   * @returns {Promise<object>} - Trả về đối tượng người dùng nếu thành công.
   * @throws {Error} - Ném ra lỗi nếu thông tin không hợp lệ.
   */
  static async login(email, password) {
    // 1. Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng.');
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không đúng.');
    }

    const payload = {
      id: user._id,
      role: user.role,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    // 3. Nếu mọi thứ đều ổn, trả về thông tin người dùng
    return {
      token,
      user: {
          id: user._id,
          username: user.username,
          email: user.email,
          imageURL: user.imageURL,
          role: user.role,
      }
    };
  }
}

module.exports = AuthService;

const AuthService = require('../services/authService');

class AuthController {
  /**
   * Xử lý request/response cho việc đăng nhập.
   * Nhiệm vụ chính là gọi AuthService và trả về kết quả cho client.
   */
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);

      // Trả về phản hồi thành công
      res.status(200).json({
        message: 'Đăng nhập thành công',
        token: token,
        user: user
      });

    } catch (error) {
      // Bắt lỗi từ tầng Service và trả về cho client
      if (error.message === 'Email hoặc mật khẩu không đúng.') {
        return res.status(400).json({ error: error.message });
      }
      
      // Xử lý các lỗi khác
      console.error('Lỗi khi đăng nhập:', error);
      res.status(500).json({ error: 'Đã có lỗi xảy ra ở máy chủ.' });
    }
  }
}

module.exports = AuthController;

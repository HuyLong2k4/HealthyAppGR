/**
 * Middleware kiểm tra quyền admin
 * Phải đặt sau authMiddleware để có req.user
 */
const adminMiddleware = (req, res, next) => {
  // Kiểm tra xem user đã được authenticate chưa
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Kiểm tra role có phải ADMIN không
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  // Nếu là ADMIN thì cho phép tiếp tục
  next();
};

module.exports = adminMiddleware;

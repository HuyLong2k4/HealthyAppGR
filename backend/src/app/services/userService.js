const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserService {

  /**
   * Tạo người dùng mới với vai trò từ userData hoặc mặc định là 'PATIENT' và băm mật khẩu.
   * @param {object} userData - Dữ liệu người dùng từ request body (ví dụ: username, email, password, role).
   */
  static async createUser(userData) {
    // Lấy các thông tin cần thiết từ userData
    const { username, email, phone, password, dob, role } = userData;

    // KIỂM TRA QUAN TRỌNG: Kiểm tra xem username hoặc email đã tồn tại chưa
    // Mongoose `unique: true` sẽ báo lỗi, nhưng kiểm tra trước sẽ cho thông báo thân thiện hơn.
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      // Ném ra một lỗi để controller có thể bắt và xử lý
      throw new Error('Username hoặc Email đã tồn tại.');
    }

    // BẢO MẬT: Băm mật khẩu người dùng trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const defaultAvatarUrl = `https://api.dicebear.com/8.x/initials/png?seed=${username}`;

    // LOGIC CHÍNH: Tạo người dùng mới
    // Nếu không có imageURL thì dùng avatar mặc định
    // Nếu không có role thì gán mặc định là 'PATIENT'
    const newUser = new User({
      ...userData,      // Sao chép các trường khác như dob, gender, role...
      passwordHash,     // Sử dụng mật khẩu đã băm
      imageURL: userData.imageURL || defaultAvatarUrl,
      role: role || 'PATIENT'   // Dùng role từ userData hoặc mặc định PATIENT
    });

    // Lưu người dùng vào cơ sở dữ liệu
    return await newUser.save();
  }

  static async getUserById(id) {
    return await User.findById(id);
  }

  static async getAllUsers() {
    return await User.find();
  }

  static async updateUser(id, updates) {
    // Cần cẩn thận ở đây để người dùng không tự cập nhật vai trò của họ
    if (updates.role) {
      delete updates.role;
    }
    // Nếu người dùng cập nhật mật khẩu, cũng cần băm nó
    if(updates.password){
        const salt = await bcrypt.genSalt(10);
        updates.passwordHash = await bcrypt.hash(updates.password, salt);
        delete updates.password; // Xóa trường password gốc
    }
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }

  static async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

}

module.exports = UserService;

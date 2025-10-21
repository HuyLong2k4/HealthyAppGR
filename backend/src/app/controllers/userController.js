const UserService = require('../services/userService');

class UserController {
  static async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ message: 'User created', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllUsers(_, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;

const LessonService = require('../services/lessonService');

class LessonController {
  static async createLesson(req, res) {
    try {
      const lesson = await LessonService.createLesson(req.body);
      res.status(201).json({ message: 'Lesson created successfully', lesson });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getLessonById(req, res) {
    try {
      const lesson = await LessonService.getLessonById(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      res.status(200).json(lesson);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLessonsByCourseId(req, res) {
    try {
      const lessons = await LessonService.getLessonsByCourseId(req.params.courseId);
      res.status(200).json(lessons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateLesson(req, res) {
    try {
      const lesson = await LessonService.updateLesson(req.params.id, req.body);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      res.status(200).json({ message: 'Lesson updated successfully', lesson });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteLesson(req, res) {
    try {
      const lesson = await LessonService.deleteLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LessonController;

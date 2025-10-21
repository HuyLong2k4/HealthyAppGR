const CourseService = require('../services/courseService');

class CourseController {
  static async createCourse(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Authentication required." });
      }

      const userId = req.user.id;

      const courseData = {
        title: req.body.title,
        thumbnail: req.body.thumbnail,
        description: req.body.description,
        user: userId,
      };

      const course = await CourseService.createCourse(courseData);
      res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllCourses(req, res) {
    try {
      const courses = await CourseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCourseById(req, res) {
    try {
      const course = await CourseService.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCourse(req, res) {
    try {
      const course = await CourseService.updateCourse(req.params.id, req.body);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCourse(req, res) {
    try {
      const course = await CourseService.deleteCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getCoursesByUserId(req, res) {
    try {
      const courses = await CourseService.getCoursesByUserId(req.params.userId);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CourseController;
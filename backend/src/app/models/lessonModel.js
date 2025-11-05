const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  thumbnailURL: { type: String },
  nameLesson:   { type: String, required: true },
  linkVid:      { type: String, required: true },
  target:       { type: String },
  course:       { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', LessonSchema);

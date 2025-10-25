const mongoose = require('mongoose');

const STATUS = ['IN_PROGRESS', 'COMPLETED'];

const LessonSchema = new mongoose.Schema({
  nameLesson:   { type: String, required: true },
  linkVid:      { type: String, required: true },
  target:       { type: String },
  status:       { type: Number, enum: STATUS, default: 'IN_PROGRESS' },
  course:       { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', LessonSchema);

const mongoose = require('mongoose');
// bài học
const CourseSchema = new mongoose.Schema({
  title:        { type: String },
  thumbnail:    { type: String },
  description:  { type: String },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);

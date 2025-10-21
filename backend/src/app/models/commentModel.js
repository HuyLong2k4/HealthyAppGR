const mongoose = require('mongoose');
// comment của từng user với course
const CommentSchema = new mongoose.Schema({
  textBody:     { type: String, required: true },
  sendingTime:  { type: Date, default: Date.now },
  course:       { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);

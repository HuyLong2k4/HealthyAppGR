const mongoose = require('mongoose');

const LessonProgressSchema = new mongoose.Schema({
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null},
  lastAccessedAt: { type: Date, default: Date.now},
}, {
  timestamps: true,
});

// (enrollment, lesson) là duy nhất — giống constraint ở DB gốc
LessonProgressSchema.index({ enrollment: 1, lesson: 1 }, { unique: true });

// Tự động set completedAt khi đánh dấu hoàn thành
LessonProgressSchema.pre('save', function (next) {
  if (this.isModified('isCompleted') && this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Optional tiện lợi: method để đánh dấu hoàn thành
LessonProgressSchema.methods.markCompleted = function () {
  this.isCompleted = true;
  if (!this.completedAt) this.completedAt = new Date();
  return this.save();
};

// Optional: cập nhật lastAccessedAt mỗi lần chạm (tuỳ bạn dùng chỗ nào)
LessonProgressSchema.methods.touch = function () {
  this.lastAccessedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('LessonProgress', LessonProgressSchema);

const mongoose = require('mongoose');

const GoalWeekSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  weekStart: {
    type: Date,
    required: true
  },

  weekEnd: {
    type: Date,
    required: true
  },

}, { timestamps: true });

GoalWeekSchema.index({ weekStart: 1, user: 1 }, { unique: true });

module.exports = {
  GoalWeek: mongoose.model('GoalWeek', GoalWeekSchema),
};

const mongoose = require('mongoose');

const GoalProgressStatus = { 
  OPEN: 'OPEN',
  COMPLETED: 'COMPLETED'
};

const GoalProgressSchema = new mongoose.Schema({
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },

  targetDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: Object.values(GoalProgressStatus),
    default: GoalProgressStatus.OPEN
  },

  actualQuantity: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

GoalProgressSchema.index({ goal: 1, targetDate: 1 }, { unique: true });

module.exports = {
  GoalProgress: mongoose.model('GoalProgress', GoalProgressSchema),
  GoalProgressStatus
};

const mongoose = require('mongoose');

const GoalStatus = { 
  OPEN: 'OPEN',
  COMPLETED: 'COMPLETED'
};

const GoalCategory = {
  HYDRATION: 'HYDRATION',
  RUNNING: 'RUNNING',
  WALKING: 'WALKING',
  CYCLING: 'CYCLING',
  SWIMMING: 'SWIMMING',
  SLEEP: 'SLEEP',
  CUSTOM: 'CUSTOM',
};

const GoalUnit = {
  CUP: 'CUP',       
  ML: 'ML',        
  KM: 'KM',
  MIN: 'MIN',    
  STEP: 'STEP',   
  TIMES: 'TIMES', 
};

const DailyGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  targetDate: {
    type: Date,
    required: true
  },

  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(GoalCategory),
    default: GoalCategory.CUSTOM
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: Object.values(GoalUnit),
    required: true
  },

  status: {
    type: String,
    enum: Object.values(GoalStatus),
    default: GoalStatus.OPEN
  },

  actualQuantity: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

DailyGoalSchema.index({ user: 1, targetDate: 1 });

module.exports = {
  DailyGoal: mongoose.model('DailyGoal', DailyGoalSchema),
  GoalCategory,
  GoalUnit
};

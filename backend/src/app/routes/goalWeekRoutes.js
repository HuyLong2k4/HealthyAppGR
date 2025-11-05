const express = require('express');
const GoalWeekController = require('../controllers/goalWeekController');

const router = express.Router();

router.post('/', GoalWeekController.createGoalWeek);

module.exports = router;

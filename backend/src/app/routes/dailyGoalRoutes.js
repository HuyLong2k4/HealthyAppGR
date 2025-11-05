const express = require('express');
const DailyGoalController = require('../controllers/dailyGoalController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, DailyGoalController.createDailyGoal);
router.get('/week', authMiddleware, DailyGoalController.getGoalsForWeek);
router.patch('/:id/status', authMiddleware, DailyGoalController.updateGoalStatus);
router.delete('/:id', authMiddleware, DailyGoalController.deleteGoal);

module.exports = router;

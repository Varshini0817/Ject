const express = require('express');
const router = express.Router();
const { getGoal, saveGoal, saveEntry, listWorkouts, getUserProfile, getUserStats } = require('../controllers/workoutController');


router.get('/goals/:username/:activity', getGoal);
router.post('/goals/:username', saveGoal);
router.post('/entries/:username', saveEntry);
router.get('/workouts/:username', listWorkouts);
router.get('/profile/:username', getUserProfile);

router.get('/stats/:username/:activity', getUserStats);

module.exports = router;

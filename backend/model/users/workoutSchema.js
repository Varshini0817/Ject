const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  activity: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  distance: { type: Number, required: true },
  steps: { type: Number, required: true }
});

const goalSchema = new Schema({
  activity: { type: String, required: true },
  duration: { type: Number, required: true },
  distance: { type: Number, required: true },
  steps: { type: Number, required: true }
});

const workoutSchema = new Schema({
  username: { type: String, required: true },
  activities: [activitySchema],
  goals: [goalSchema]
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = { Workout };

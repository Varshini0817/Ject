// seedWorkouts.js
// Usage: MONGO_URI=mongodb://localhost:27017/capstone node seedWorkouts.js
const mongoose = require('mongoose');
const { Workout } = require('../model/users/workoutSchema');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/WorkoutDB';

async function seed() {
    await mongoose.connect(MONGO_URI);

    const workouts = [
        {
            username: "John Doe",
            activities: [
                {
                    activity: 'Running',
                    date: new Date('2025-11-19T07:00:00Z'),
                    duration: 32,
                    distance: 5.2,
                    steps: 0
                },
                {
                    activity: 'Gym',
                    date: new Date('2025-11-15T18:30:00Z'),
                    duration: 65,
                    distance: 0,
                    steps: 0
                },
                {
                    activity: 'Hiking',
                    date: new Date('2025-11-21T10:00:00Z'),
                    duration: 95,
                    distance: 8.5,
                    steps: 0
                }
            ],
            goals: [
                {
                    activity: 'Running',
                    duration: 30,
                    distance: 5,
                    steps: 0
                },
                {
                    activity: 'Gym',
                    duration: 60,
                    distance: 0,
                    steps: 0
                },
                {
                    activity: 'Hiking',
                    duration: 90,
                    distance: 8,
                    steps: 0
                }
            ]
        },
        {
            username: "Jane Smith",
            activities: [
                {
                    activity: 'Cycling',
                    date: new Date('2025-11-18T17:30:00Z'),
                    duration: 45,
                    distance: 20,
                    steps: 0
                },
                {
                    activity: 'Walking',
                    date: new Date('2025-11-16T09:00:00Z'),
                    duration: 50,
                    distance: 6.5,
                    steps: 8500
                },
                {
                    activity: 'Yoga',
                    date: new Date('2025-11-13T08:00:00Z'),
                    duration: 50,
                    distance: 0,
                    steps: 0
                }
            ],
            goals: [
                {
                    activity: 'Cycling',
                    duration: 0,
                    distance: 22,
                    steps: 0
                },
                {
                    activity: 'Walking',
                    duration: 0,
                    distance: 6,
                    steps: 8000
                },
                {
                    activity: 'Yoga',
                    duration: 45,
                    distance: 0,
                    steps: 0
                }
            ]
        },
        {
            username: "Alice Johnson",
            activities: [
                {
                    activity: 'Skipping',
                    date: new Date('2025-11-20T12:00:00Z'),
                    duration: 18,
                    distance: 0,
                    steps: 1300
                },
                {
                    activity: 'Hiking',
                    date: new Date('2025-11-14T10:00:00Z'),
                    duration: 125,
                    distance: 10.5,
                    steps: 0
                },
                {
                    activity: 'Yoga',
                    date: new Date('2025-11-22T08:00:00Z'),
                    duration: 55,
                    distance: 0,
                    steps: 0
                }
            ],
            goals: [
                {
                    activity: 'Skipping',
                    duration: 15,
                    distance: 0,
                    steps: 1200
                },
                {
                    activity: 'Hiking',
                    duration: 120,
                    distance: 10,
                    steps: 0
                },
                {
                    activity: 'Yoga',
                    duration: 50,
                    distance: 0,
                    steps: 0
                }
            ]
        }
    ];

    try {
        // clear existing sample data (optional)
        await Workout.deleteMany({});
        const res = await Workout.insertMany(workouts);
        console.log(`Inserted ${res.length} workouts.`);
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();

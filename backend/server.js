require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userProfileRoutes = require('./routes/userProfileRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
console.log("Mongo URI:", process.env.mongoURI);
mongoose.connect("mongodb+srv://vedhavarshiniy111:NkwsKNXYdpVzHsq9@people.vzfrxax.mongodb.net/HealthPulse", {}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/user', userProfileRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

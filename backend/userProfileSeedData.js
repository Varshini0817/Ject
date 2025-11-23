const mongoose = require("mongoose");
const UserProfile = require("../models/users/userPersonalProfileSchema");

// const mongoURI = process.env.MONGO_URI;
const mongoURI = 'mongodb+srv://vedhavarshiniy111:NkwsKNXYdpVzHsq9@people.vzfrxax.mongodb.net/HealthPulse';

// Dummy Data
const dummyData = [
  {
    username: "John Doe",
    fullName: "John Doe",
    email:"john_doe@gmail.com",
    age: 25,
    gender: "Male",
    phone: "9876543210",
    occupation: "Software Engineer",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560037",
    address: "HSR Layout"
  },
  {
    username: "Jane Smith",
    fullName: "Jane Smith",
    email:"jane_smith@gmail.com",
    age: 30,
    gender: "Female",
    phone: "9123456780",
    occupation: "Doctor",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postalCode: "400001",
    address: "Marine Drive"
  }
];

async function resetAndInsert() {
  try {
    // Delete all existing records
    await UserProfile.deleteMany({});
    console.log("Old data deleted");

    // Insert dummy data
    await UserProfile.insertMany(dummyData);
    console.log("Inserted successfully");

  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    mongoose.connection.close();
  }
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
    resetAndInsert();
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

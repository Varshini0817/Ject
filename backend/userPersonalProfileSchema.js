const mongoose = require('mongoose');

const userPersonalProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String },
  age: { type: Number },
  gender: { type: String },   
  email: { type: String },
  phone: { type: String },
  occupation: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('UserPersonalProfile', userPersonalProfileSchema);

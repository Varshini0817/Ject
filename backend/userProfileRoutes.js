const express = require('express');
const router = express.Router();
const UserPersonalProfile = require('../models/users/userPersonalProfileSchema');

router.get('/profile/:username/', async (req, res) => {
  try {
    let username = req.params.username;
    username = decodeURIComponent(username);
    console.log("/profile/:username get username",username);
    const profile = await UserPersonalProfile.findOne({ username: username });
    console.log("Fetched profile:", profile);
    if (!profile) return res.status(404).json({ message: 'User profile not found' });
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/profiles', async (req, res) => {
  try {
    const profiles = await UserPersonalProfile.find();
    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/profile/:username', async (req, res) => {
  try {
    req.body.username = req.params.username;
    console.log("/profile/:username post username",req.body.username);
    // Optional: validate req.params.username matches req.body.username
    const newProfile = new UserPersonalProfile(req.body);
    const savedProfile = await newProfile.save();
    return res.status(201).json(savedProfile);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/profile/:username', async (req, res) => {
  try {
    let username = req.params.username;
    username = decodeURIComponent(username);
    const updatedProfile = await UserPersonalProfile.findOneAndUpdate(
      { username: username },
      req.body,
      { new: true }
    );
    if (!updatedProfile) return res.status(404).json({ message: 'User profile not found' });
    return res.json(updatedProfile);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;

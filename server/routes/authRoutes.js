const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, department });
    await newUser.save();
    res.status(201).json({ message: "User Created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // Create Token including the department
    const token = jwt.sign(
      { id: user._id, department: user.department }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.json({ token, user: { name: user.name, department: user.department } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
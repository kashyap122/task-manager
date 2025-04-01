const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");
const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, confirmPassword } =
      req.body;

    if (
      !firstname ||
      !lastname ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All feilds are required!" });
    }
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists!" });

    // const userRole = role === "admin" ? "admin" : "user"; 

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      user: "user",
    });
    await newUser.save();

    res.status(201).json({ message: "User Created Succesfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Log In
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //Find user by email
    if (!email || !password)
      return res.status(400).json({ message: "User not found!" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invaild credentials!" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ token, role: user.role });
    console.log("this is role",user.role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// In your auth router (e.g., auth.routes.js)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username _id"); // select only necessary fields
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

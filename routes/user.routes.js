const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

router.post("/signup", async (req, res) => {
  try {
    const hashedUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    const createdUser = await User.create(hashedUser);
    console.log("User created", createdUser);
    res.status(201).json({ message: "user created", createdUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating the user" });
  }
});

module.exports = router;

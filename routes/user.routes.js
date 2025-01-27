const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    const hashedUser = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };

    const createdUser = await User.create(hashedUser);
    console.log("User created", createdUser);
    res.status(201).json({ message: "user created", createdUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating the user" });
  }
});

router.post("/login", async (req, res) => {
try {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or Password" });
  }


  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    res.status(403).json({ message: "Invalid Credentials" });
  } 

    const doesPasswordsMatch = bcryptjs.compareSync( password, foundUser.password);
    if (doesPasswordsMatch) {
      return res.status(403).json({ message: "Wrong Credentials "});
    } //stopped here
      const data = { _id: foundUser._id, username: foundUser.username };

      const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "48h",
      });
    
      console.log("Here is the AuthToken", authToken);
      res.status(200).json({ message: "successful login", authToken });
    } else {
     res.status(403).json({ message: "Wrong Credentials" });
    } 
  }
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Error logging in the user"});
}
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Review = require("../models/Reviews.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middlewares/auth.middleware");


//sign up a user
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


//login a user
router.post("/login", async (req, res) => {
try {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or Password" });
  }


  const foundUser = await User.findOne({ email });
  
  if (!foundUser) {
   return res.status(403).json({ message: "Invalid Credentials" });
  } 

  const doesPasswordsMatch = bcryptjs.compareSync( password, foundUser.password);
   if (!doesPasswordsMatch) {
      return res.status(403).json({ message: "Wrong Credentials "});
    } 
      
    const data = { _id: foundUser._id, username: foundUser.username, profilePic: foundUser.profilePic };


    const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "48h",
      });

      console.log("I found user 2, ", authToken)
    
      console.log("Here is the AuthToken", authToken);
    return res.status(200).json({ message: "successful login", authToken });

  } catch (error) {
    console.error("Error logging in user:", error.message); 
    return res.status(500).json({ message: "Error logging in the user" });
  }
});

// update a user by their ID

router.put("/update", authenticateUser, async (req, res) => {
  console.log("UPDATE route hit!")
  try {

    const userId = req.payload._id;
    console.log("User ID from token:", userId)
    const { email, username, password, profilePic } = req.body;
    console.log(profilePic)

    const user = await User.findById(userId);
    console.log("User found:", user);
    if(!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) user.password = await bcryptjs.hash(password, 10);
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete a user 

router.delete("/delete", authenticateUser, async (req, res) => {
  try {
    const userId = req.payload._id;
    console.log("User ID from token:", userId);

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    console.log("User deleted:", userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user", error.message);
    res.status(500).json({ message: "Error deleting the user "})
  }
});

//verify a user
router.get("/verify", authenticateUser, async (req, res) => {
  console.log("verify route hit")
  try {
    const user = await User.findById(req.payload._id);
    if (!user) {
       return res.status(404).json({ message: "User not found" }); 
    }
    console.log(user)
    res.status(200).json({ 
      message: "Token is valid", 
      currentUser: {
         _id: user._id,
         username: user.username,
         email: user.email,
         profilePic: user.profilePic
      }
   });
} catch (error) {
   res.status(500).json({ message: "Error verifying user", error: error.message });
}
});

// Profile route
router.get("/profile/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the reviews for the user
    const reviews = await Review.find({ user: userId }).populate("user", "username");
    //gn console.log("Fetched reviews:", reviews);

    // Filter out reviews with the 'Anonymous' username
    const filteredReviews = reviews.filter(review => review.username !== 'Anonymous');
    //console.log("Filtered reviews:", filteredReviews);

    if (filteredReviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    // Return the filtered reviews to the frontend
    res.status(200).json(filteredReviews);

  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Error fetching profile data" });
  }
});

module.exports = router;

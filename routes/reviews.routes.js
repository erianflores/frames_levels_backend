const express = require("express");
const Review = require("../models/Reviews.model");
const router = express.Router();
const authenticateUser = require("../middlewares/auth.middleware");
const mongoose = require("mongoose");

//create a review
router.post("/", authenticateUser, async (req, res) => {
  try {
    console.log("Review received:", req.body);
    console.log("User submitting review:", req.payload);

    const { gameTitle, gameId, body, rating } = req.body;
    const userId = req.payload._id;
    const username = req.payload?.username || "Anonymous";

    if (!gameTitle || !body || !rating || !gameId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReview = new Review({
      user: userId,
      username,
      gameTitle,
      body,
      rating,
      gameId,
    });
    await newReview.save();

    console.log("Review successfully stored in MongoDB:", newReview);

    res
      .status(201)
      .json({ message: "Review created Successfully", review: newReview });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// to read all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ gameId: id }).select(
      "username body rating"
    );
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// read a review depending on the game title
router.get("/one-game/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("game id is : ", id);
    console.log(id);

    const reviews = await Review.find({ gameId: id });

    if (reviews.length === 0) {
      return res
        .status(200)
        .json({ message: "No reviews found for this game" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// update a review by its ID
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { body, rating } = req.body;

    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.username !== req.payload.username) {
      return res
        .status(403)
        .json({ message: "You can only edit your own reviews" });
    }

    review.body = body || review.body;
    review.rating = rating || review.rating;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//delete a review by its ID
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.username !== req.payload.username) {
      return res
        .status(403)
        .json({ message: "You can only delete your own review" });
    }
    await Review.findByIdAndDelete(id);

    res.status(200).json({ message: "Review deleted successfully " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;

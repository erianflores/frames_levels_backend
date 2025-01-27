const express = require("express");
const router = express.Router();
const fetchGames = require("../services/fetchGames");

router.get("/", async (req, res) => {
  try {
    const games = await fetchGames(req.query);

    res.json(games);
  } catch (error) {
    console.error("Error in /games route:", error.message);
    res.status(500).json({ message: "Error fetching games" });
  }
});

module.exports = router;

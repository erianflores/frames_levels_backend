const express = require("express");
const router = express.Router();
const fetchGames = require("../services/fetchGames");
const Game = require("../models/Games.model"); // Import your Game model

// Endpoint to fetch filtered games and save them to the database
router.get("/fetch-games", async (req, res) => {
  try {
    // Fetch filtered games from the external API
    const games = await fetchGames(req.query);

    // Iterate over each game fetched
    for (const gameData of games) {
      // Check if the game already exists in the database (based on unique 'id')
      const existingGame = await Game.findOne({ id: gameData.id });

      if (!existingGame) {
        // If the game doesn't exist, create and save it to the database
        const newGame = new Game(gameData);
        await newGame.save();
      }
    }

    res.json({
      message: "Filtered games fetched and stored in the database",
      games,
    });
  } catch (error) {
    console.error("Error fetching games:", error.message);
    res.status(500).json({ message: "Error fetching games" });
  }
});

// Route to fetch 10 random featured games from Mongodb
router.get("/featured", async (req, res) => {
  console.log("/featured route hit");
  try {
    const featuredGames = await Game.aggregate([{$sample: { size: 10 } }]);
    res.json(featuredGames);
  } catch (error) {
    console.error("Error fetching featured games:", error.message);
  }
});

// Route to fetch details of a single game by ID
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.id });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(game);
  } catch (error) {
    console.error("Error fetching game details:", error.message);
    res.status(500).json({ message: "Error fetching game details" });
  }
});

module.exports = router;

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
    const featuredGames = await Game.aggregate([{ $sample: { size: 10 } }]);
    res.json(featuredGames);
  } catch (error) {
    console.error("Error fetching featured games:", error.message);
  }
});

router.get("/top-games", async (req, res) => {
  console.log("Fetching top-rated games with IDs:");
  try {
    const topRatedGameIds = [481913, 50734, 3328, 5286, 12020, 5679];
    let topGames = [];

    console.log("Fetching top-rated games with IDs:", topRatedGameIds);

    for (let gameId of topRatedGameIds) {
      console.log("Fetching game with ID:", gameId);
      const game = await Game.findOne({ id: Number(gameId) });

      if (game) {
        topGames.push(game);
      } else {
        console.log(`Game with ID ${gameId} not found.`);
      }
    }

    console.log("Fetched Games:", topGames);

    if (topGames.length === 0) {
      return res.status(404).json({ message: "No top-rated games found" });
    }

    res.status(200).json(topGames);
  } catch (error) {
    console.error("Error fetching top-rated games:", error);
    res.status(500).json({ error: "Failed to fetch top-rated games" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "No search query provided" });
    }

    const games = await Game.find(
      { name: { $regex: query, $options: "i" } },
      "-id"
    );

    res.json(games);
  } catch (error) {
    console.log("Search error:", error);
    res.status(500).json({ message: "Error searching games" });
  }
});

router.get("/newest", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const games = await Game.find()
      .sort({ released: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json(games);
  } catch (error) {
    console.error("Error fetching newest games:", error.message);
    res.status(500).json({ message: "Error fetching newest games" });
  }
});

// Route to fetch details of a single game by ID
router.get("/one-game/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(500).json({ message: "Game not found" });
    }

    res.json(game);
  } catch (error) {
    console.error("Error fetching game details:", error.message);
    res.status(500).json({ message: "Error fetching game details" });
  }
});

module.exports = router;

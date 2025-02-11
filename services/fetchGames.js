const fetch = require("node-fetch");
const axios = require("axios");
const Game = require("../models/Games.model");

const API_KEY = "3056b63565b048a8806c8fe125237952";
const BASE_URL = `https://api.rawg.io/api`;

const fetchGames = async (filters) => {
  try {
    let allGames = [];
    let nextPageUrl = `${BASE_URL}/games?key=${API_KEY}`;
    if (filters) {
      const query = new URLSearchParams({
        key: API_KEY,
        ...(filters.name && { name: filters.name }),
        ...(filters.platforms && { platforms: filters.platforms }),
        ...(filters.genres && { genres: filters.genres }),
        ...(filters.released && { released: filters.released }),
        page_size: 50,
      }).toString();
      nextPageUrl = `${BASE_URL}/games?${query}`;
    }

    while (nextPageUrl) {
      console.log("Fetching URL:", nextPageUrl);
      const response = await fetch(nextPageUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allGames = [...allGames, ...data.results];
      nextPageUrl = data.next;

      if (allGames.length > 2000) {
        console.log("Reached limit of 500 games.");
        break;
      }
    }

    //Insert fetched games into the database

    for (let gameData of allGames) {
      const existingGame = await Game.findOne({ id: gameData.id });

      if (!existingGame) {
        const newGame = new Game(gameData);
        await newGame.save();
        console.log(`New game added: ${gameData.name}`);
      } else {
        console.log(`Game already exists: ${gameData.name}`);
      }
    }

    return allGames;
  } catch (error) {
    console.error("Error fetching games:", error.message);
    throw error;
  }
};

module.exports = fetchGames;

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const platformSchema = new Schema({
  platform: {
    id: { type: Number, required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
  },
  released_at: { type: String },
});

const esrbRatingSchema = new Schema({
  id: { type: Number },
  slug: { type: String },
  name: { type: String },
});

// Main Game Schema
const gameSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  slug: { type: String, required: true },
  name: { type: String, required: true },
  released: { type: Date },
  tba: { type: Boolean, default: false },
  background_image: { type: String },
  rating: { type: Number },
  rating_top: { type: Number },
  ratings: { type: Object },
  ratings_count: { type: Number },
  reviews_text_count: { type: String },
  added: { type: Number },
  added_by_status: { type: Object },
  metacritic: { type: Number },
  playtime: { type: Number },
  suggestions_count: { type: Number },
  updated: { type: Date },
  esrb_rating: esrbRatingSchema,
  platforms: [platformSchema],
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;

const { Schema, model } = require("mongoose");


const reviewsSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        body: {
          type: String,
          required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        gameTitle: {
            type: String,
            required: true,
        },
        gameId: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const Review = model ("Review", reviewsSchema);

module.exports = Review;
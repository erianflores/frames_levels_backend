const { Schema, model } = require("mongoose");


const reviewsSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        username: { 
            type: String, 
            default: "Anonymous" 
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
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Game",
        },
    },
    {
        timestamps: true,
    }
);

const Review = model ("Review", reviewsSchema);

module.exports = Review;
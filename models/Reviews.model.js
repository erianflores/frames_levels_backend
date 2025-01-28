const { Schema, model } = require("mongoose");


const reviewsSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
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
        }
    },
    {
        timestamps: true,
    }
);

const Review = model ("Review", reviewsSchema);

module.exports = Review;
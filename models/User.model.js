const { Schema, model, default: mongoose } = require("mongoose");
const Review = require("./Reviews.model");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    profilePic: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

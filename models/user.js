const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      trim: true,
      minLength: [7, "Number is too short!"],
      required: [true, "Password is required"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("user", schema);

module.exports = {
  User,
};

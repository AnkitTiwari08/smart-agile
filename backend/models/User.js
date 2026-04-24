const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"], // ✅ updated
      default: "user",         // ✅ default role
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
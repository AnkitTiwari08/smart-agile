const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    message: String,

    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
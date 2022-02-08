const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      default: "https://via.placeholder.com/468x60",
    },
    title: {
      type: String,
      require: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [{ type: String, trim: true }],
    author: { type: mongoose.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", BlogSchema);

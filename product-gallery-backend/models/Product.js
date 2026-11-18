const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    externalId: {
      type: Number,
      required: true,
      unique: true,
    },

    title: String,
    description: String,
    price: Number,
    category: String,

    imageFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    imageContentType: {
      type: String,
      default: "image/jpeg",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);

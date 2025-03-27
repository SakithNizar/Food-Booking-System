const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/.test(v);
        },
        message: "Invalid image URL format",
      },
    },

    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "FoodCategory",
        required: true,
        index: true, // Add indexing
      },
    ],
    time: [
      {
        type: Schema.Types.ObjectId,
        ref: "FoodTime",
        required: true,
        index: true, // Add indexing
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", FoodSchema);

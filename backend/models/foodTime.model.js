const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodTimeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    food: [
      {
        type: Schema.Types.ObjectId,
        ref: "Food",
        index: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure food array is always empty when creating a new category
FoodTimeSchema.pre("save", function (next) {
  if (!this.food) {
    this.food = []; // Set to empty array if undefined
  }
  next();
});

module.exports = mongoose.model("FoodTime", FoodTimeSchema);

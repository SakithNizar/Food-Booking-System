const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodCategorySchema = new Schema(
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
FoodCategorySchema.pre("save", function (next) {
  if (!this.food) {
    this.food = []; // Set to empty array if undefined
  }
  next();
});

module.exports = mongoose.model("FoodCategory", FoodCategorySchema);

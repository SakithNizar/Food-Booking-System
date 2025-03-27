const mongoose = require("mongoose");
const Food = require("../models/food.model");
const FoodCategory = require("../models/foodCategory.model");
const FoodTime = require("../models/foodTime.model");

exports.createFood = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, description, picture, category, time } = req.body;

    if (!name || !description || !category || !time) {
      return res
        .status(400)
        .json({ error: "All fields are required except picture" });
    }

    let pic =
      picture ||
      "https://www.shutterstock.com/image-photo/fried-salmon-steak-cooked-green-600nw-2489026949.jpg";

    // Create the food item inside the transaction
    const food = new Food({
      name,
      description,
      picture: pic,
      category,
      time,
    });

    await food.save({ session });

    // Update FoodCategory: Add food ID to categories
    const updatedCategories = await FoodCategory.updateMany(
      { _id: { $in: category } },
      { $push: { food: food._id } },
      { session }
    );

    if (updatedCategories.modifiedCount === 0) {
      throw new Error("No valid categories found. Rolling back changes.");
    }

    // Update FoodTime: Add food ID to time slots
    const updatedTimes = await FoodTime.updateMany(
      { _id: { $in: time } },
      { $push: { food: food._id } },
      { session }
    );

    if (updatedTimes.modifiedCount === 0) {
      throw new Error("No valid time slots found. Rolling back changes.");
    }

    // Commit transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(food);
  } catch (error) {
    // Rollback changes if any operation fails
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ error: error.message });
  }
};

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .select("-__v -createdAt -updatedAt")
      .populate("category", "name")
      .populate("time", "name");
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("category")
      .populate("time");
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFood = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(req.body);
    const { name, description, picture, category, time } = req.body;
    const { id } = req.params;

    if (!name || !description || !category || !time || !picture) {
      return res.status(400).json({ error: "All fields" });
    }

    // Find the existing food item
    const food = await Food.findById(id).session(session);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    // Update the food item
    food.name = name;
    food.description = description;
    food.picture = picture || food.picture;
    food.category = category;
    food.time = time;

    await food.save({ session });

    // Remove food ID from old categories and time if changed
    await FoodCategory.updateMany(
      { food: id },
      { $pull: { food: id } },
      { session }
    );
    await FoodTime.updateMany(
      { food: id },
      { $pull: { food: id } },
      { session }
    );

    // Add food ID to the new categories and time
    await FoodCategory.updateMany(
      { _id: { $in: category } },
      { $addToSet: { food: id } },
      { session }
    );
    await FoodTime.updateMany(
      { _id: { $in: time } },
      { $addToSet: { food: id } },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json(food);
  } catch (error) {
    // Rollback on failure
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFood = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Find the food item before deletion
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    // Delete the food item inside the transaction
    await Food.findByIdAndDelete(id, { session });

    // Remove food ID from FoodCategory
    await FoodCategory.updateMany(
      { food: id },
      { $pull: { food: id } },
      { session }
    );

    // Remove food ID from FoodTime
    await FoodTime.updateMany(
      { food: id },
      { $pull: { food: id } },
      { session }
    );

    // Commit transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    // Rollback changes if any operation fails
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ error: error.message });
  }
};

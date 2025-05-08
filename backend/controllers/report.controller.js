const Food = require("../models/food.model");
const FoodTime = require("../models/foodTime.model");
const FoodCategory = require("../models/foodCategory.model");

exports.getReportData = async (_, res) => {
  try {
    // 1. Get all foods (with populated category & time), excluding picture
    const foods = await Food.find({}, "-picture")
      .populate("category", "-__v")
      .populate("time", "-__v");

    // 2. Get all categories
    const categories = await FoodCategory.find();

    // 3. Get all time slots
    const times = await FoodTime.find();

    // Basic stats
    const statistics = {
      totalFoods: foods.length,
      totalCategories: categories.length,
      totalTimeSlots: times.length,
    };

    // Category-wise grouping (only non-empty)
    const categoriesData = categories
      .map((cat) => {
        const categoryFoods = foods.filter((f) =>
          f.category.some((c) => c._id.toString() === cat._id.toString())
        );

        if (categoryFoods.length === 0) return null;

        return {
          name: cat.name,
          description: cat.description,
          foods: categoryFoods.map((f) => ({
            name: f.name,
            description: f.description,
            price: f.price,
            picture: f.picture,
            time: f.time.map((t) => t.name),
          })),
        };
      })
      .filter(Boolean); // Remove nulls (empty categories)

    // Time slot-wise grouping (only non-empty)
    const timesData = times
      .map((slot) => {
        const timeFoods = foods.filter((f) =>
          f.time.some((t) => t._id.toString() === slot._id.toString())
        );

        if (timeFoods.length === 0) return null;

        return {
          name: slot.name,
          startTime: slot.startTime,
          endTime: slot.endTime,
          foods: timeFoods.map((f) => ({
            name: f.name,
            description: f.description,
            price: f.price,
            picture: f.picture,
            category: f.category.map((c) => c.name),
          })),
        };
      })
      .filter(Boolean); // Remove nulls (empty times)

    res.json({
      statistics,
      categories: categoriesData,
      timeSlots: timesData,
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

const FoodCategory = require("../models/foodCategory.model");
const Food = require("../models/food.model");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(req.body);

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const category = new FoodCategory({ name, description });
    console.log(category);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await FoodCategory.find()
      .select("name description food")
      .populate("food", "name picture description");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await FoodCategory.findById(req.params.id)
      .select("name description food")
      .populate("food", "name");
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name && !description) {
      return res
        .status(400)
        .json({ error: "Either Name or Description is required" });
    }

    const category = await FoodCategory.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await FoodCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Remove the category ID from all Food documents
    await Food.updateMany(
      { category: req.params.id }, // Find foods containing this category ID
      { $pull: { category: req.params.id } } // Remove category ID from the array
    );

    // Delete the category after updating Foods
    await FoodCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Category deleted successfully and removed from foods",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFoodFromCategory = async (req, res) => {
  try {
    const category = await FoodCategory.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Remove the food ID from the category
    category.food.pull(req.params.foodId);
    await category.save();

    // Remove the category ID from the food
    const food = await Food.findById(req.params.foodId);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }
    food.category.pull(req.params.categoryId);
    await food.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

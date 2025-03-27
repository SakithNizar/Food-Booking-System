const express = require("express");
const router = express.Router();
const FoodCategoryController = require("../controllers/foodCategory.controller");

// Create a new food category
router.post("/food-categories", FoodCategoryController.createCategory);

// Retrieve all food categories
router.get("/food-categories", FoodCategoryController.getAllCategories);

// Retrieve a specific food category by ID
router.get("/food-categories/:id", FoodCategoryController.getCategoryById);

// Update a specific food category by ID
router.put("/food-categories/:id", FoodCategoryController.updateCategory);

// Delete a specific food category by ID
router.delete("/food-categories/:id", FoodCategoryController.deleteCategory);

// Remove the food ID from the category
router.put(
  "/food-categories/:categoryId/remove-food/:foodId",
  FoodCategoryController.removeFoodFromCategory
);

module.exports = router;

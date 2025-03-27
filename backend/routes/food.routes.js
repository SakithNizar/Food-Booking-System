const express = require("express");
const router = express.Router();
const FoodController = require("../controllers/food.controller");

// Create a new food item
router.post("/foods", FoodController.createFood);

// Retrieve all food items
router.get("/foods", FoodController.getAllFoods);

// Retrieve a specific food item by ID
router.get("/foods/:id", FoodController.getFoodById);

// Update a specific food item by ID
router.put("/foods/:id", FoodController.updateFood);

// Delete a specific food item by ID
router.delete("/foods/:id", FoodController.deleteFood);

module.exports = router;

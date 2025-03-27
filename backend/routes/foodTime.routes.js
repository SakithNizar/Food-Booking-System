const express = require("express");
const router = express.Router();
const FoodTimeController = require("../controllers/foodTime.controller");

// Create a new food time
router.post("/food-times", FoodTimeController.createTime);

// Retrieve all food times
router.get("/food-times", FoodTimeController.getAllTimes);

// Retrieve a specific food time by ID
router.get("/food-times/:id", FoodTimeController.getTimeById);

// Update a specific food time by ID
router.put("/food-times/:id", FoodTimeController.updateTime);

// Delete a specific food time by ID
router.delete("/food-times/:id", FoodTimeController.deleteTime);

module.exports = router;

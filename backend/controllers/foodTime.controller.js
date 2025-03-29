const FoodTime = require("../models/foodTime.model");
const Food = require("../models/food.model");

exports.createTime = async (req, res) => {
  try {
    const { name, description, startTime, endTime, price } = req.body;

    if (!name || !startTime || !endTime || !price) {
      return res
        .status(400)
        .json({ error: "All fields except description are required" });
    }

    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ error: "Start time must be before end time" });
    }

    if (price <= 0) {
      return res.status(400).json({ error: "Price must be greater than 0" });
    }

    const time = new FoodTime({ name, description, startTime, endTime, price });
    await time.save();
    res.status(201).json(time);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTimes = async (req, res) => {
  try {
    const times = await FoodTime.find()
      .select("-__v -createdAt -updatedAt")
      .populate("food", "name description picture");
    res.status(200).json(times);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTimeById = async (req, res) => {
  try {
    const time = await FoodTime.findById(req.params.id).select(
      "-__v -createdAt -updatedAt"
    );
    if (!time) {
      return res.status(404).json({ error: "Time not found" });
    }
    res.status(200).json(time);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTime = async (req, res) => {
  try {
    const { name, description, startTime, endTime, price } = req.body;

    if (!name || !startTime || !endTime || !price) {
      return res
        .status(400)
        .json({ error: "All fields except description are required" });
    }

    const time = await FoodTime.findByIdAndUpdate(
      req.params.id,
      { name, description, startTime, endTime, price },
      { new: true }
    );
    if (!time) {
      return res.status(404).json({ error: "Time not found" });
    }
    res.status(200).json(time);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTime = async (req, res) => {
  try {
    console.log(req.params);
    const time = await FoodTime.findById(req.params.id);
    if (!time) {
      return res.status(404).json({ error: "Time not found" });
    }

    console.log("Time found, removing from foods");
    // Remove the time ID from all Food documents
    await Food.updateMany(
      { time: req.params.id }, // Find foods containing this time ID
      { $pull: { time: req.params.id } } // Remove time ID from the array
    );
    console.log("Time removed from foods");

    // Delete the time after updating Foods
    await FoodTime.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Time deleted successfully and removed from foods" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

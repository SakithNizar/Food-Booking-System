const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

const foodRoutes = require("./food.routes");
const foodCategoryRoutes = require("./foodCategory.routes");
const foodTimeRoutes = require("./foodTime.routes");

router.use(foodRoutes);
router.use(foodCategoryRoutes);
router.use(foodTimeRoutes);

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
});

module.exports = router;

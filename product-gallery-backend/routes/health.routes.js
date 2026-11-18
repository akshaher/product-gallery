const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("health api called", req.body);

  res.status(200).json({
    success: true,
    message: "Product Gallery API is running!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date(),
  });
});

module.exports = router;

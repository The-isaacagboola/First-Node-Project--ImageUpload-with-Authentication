const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleWare = require("../middlewares/admin.middleware");
const router = express.Router();

// Coming to this soon
router.get("/welcome", authMiddleware, adminMiddleWare, (req, res) => {
  res.json({
    message: "Welcome to the Admin Page",
  });
});

module.exports = router;

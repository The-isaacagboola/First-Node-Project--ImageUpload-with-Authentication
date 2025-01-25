const express = require("express");

const authMiddleWare = require("../middlewares/auth.middleware");

const router = express.Router();

// This is to show how to protect certain routes from being accessed by everyone
router.get("/welcome", authMiddleWare, (req, res) => {
  const { username, userId, role } = req.userInfo;

  res.json({
    message: "Welcome to the Home Page",
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

module.exports = router;

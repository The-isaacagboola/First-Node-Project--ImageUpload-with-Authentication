const express = require("express");
const {
  loginUser,
  registerUser,
  changePasswordController,
} = require("../controllers/auth.controller");
const authMiddleWare = require("../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.post("/login", loginUser);

authRouter.post("/register", registerUser);

authRouter.put("/change-password", authMiddleWare, changePasswordController);

module.exports = authRouter;

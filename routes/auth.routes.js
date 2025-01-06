const express = require("express");
const { loginUser, registerUser } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/login", loginUser);

authRouter.post("/register", registerUser);

module.exports = authRouter;

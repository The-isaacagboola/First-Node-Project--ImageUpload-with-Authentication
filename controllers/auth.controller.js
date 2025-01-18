const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register controller
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    //check if user already exists in our Db
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "This Username/Email already exists. Please try with different credentials or provide your previous password",
      });
    }

    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new User
    const newlyCreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "New user created successfully",
      });
    } else
      res
        .status(404)
        .json({ message: "Unable to register user. Please try again" });

    console.log("New User Created;", newlyCreatedUser);
  } catch (error) {
    console.error("Error registering User", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Cant register user",
    });
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const savedUser = await User.findOne({ username });

    if (!savedUser) {
      return res.status(400).json({
        success: false,
        message: "Username does not exist. Please Register",
      });
    }

    //compare provided password with hashed
    const compare = await bcrypt.compare(password, savedUser.password);

    if (!compare) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password. Please check and try again",
      });
    }

    //create user tokens --- json web tokens
    const acccessToken = jwt.sign(
      {
        userId: savedUser._id,
        username: savedUser.username,
        role: savedUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1hr" }
    );

    res.status(200).json({
      success: true,
      message: "User found successfully",
      acccessToken,
    });
  } catch (error) {
    console.error("Unable to create User", error);
    res.status(500).json({
      success: false,
      message: "Something went Wrong. Please try again",
    });
  }
};

//change password
const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.userInfo;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid passwords",
      });
    }

    //first - validate old password
    const userData = await User.findById(userId);

    const verified = await bcrypt.compare(oldPassword, userData.password);
    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect. Please try again",
      });
    }

    //hash new password
    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    userData.password = newPasswordHash;
    await userData.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Unable to change password", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { loginUser, registerUser, changePasswordController };

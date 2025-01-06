const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
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
        data: newlyCreatedUser,
      });
    } else
      res
        .status(404)
        .json({ message: "Unale to register user. Please try again" });

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

    const checkExitingUsername = await User.findOne({ username });

    if (!checkExitingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username does not exist. Please Register",
      });
    }

    //compare provided password with hashed
    const compare = await bcrypt.compare(
      password,
      checkExitingUsername.password
    );

    //create user tokens --- json web tokens
    compare
      ? res.status(200).json({
          success: true,
          message: "User found",
        })
      : res.status(400).json({
          success: false,
          message: "Wrong Password. Please check and try again",
        });
  } catch (error) {
    console.error("Unable to create User", error);
    res.status(500).json({
      success: false,
      message: "Something went Wrong. Please try again",
    });
  }
};

module.exports = { loginUser, registerUser };

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
      { expiresIn: "15m" }
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

module.exports = { loginUser, registerUser };
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzdkNTA1OWNlYWFiZmVlNmFlYTg2MmMiLCJ1c2VybmFtZSI6Ik9uZVRvU2l4Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzYyNjU5NDEsImV4cCI6MTczNjI2Njg0MX0.Dczigapn4ksEDmLt5zbGiw1Cd1EtjnaRYWTrR033TF8"

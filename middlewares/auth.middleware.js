const jwt = require("jsonwebtoken");

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("My token:::", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No access token provided. Please provide a valid access token",
    });
  }

  try {
    //decode the gotten token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded TOken::: ", decodedToken);
    req.userInfo = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Wrong access token provided",
    });
  }
};

module.exports = authMiddleWare;

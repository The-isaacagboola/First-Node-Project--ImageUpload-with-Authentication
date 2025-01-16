const adminMiddleWare = (req, res, next) => {
  const { userInfo } = req;

  if (!userInfo) {
    return res.json({
      message: "Access denied, Please provide valid credentials",
    });
  }

  if (userInfo.role !== "admin")
    return res.status(403).json({
      success: false,
      message: "Access denied, User must be an admin to access this route",
    });

  next();
};

module.exports = adminMiddleWare;

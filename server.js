require("dotenv").config();
const express = require("express");
const connectDb = require("./db/config");
const bookRoutes = require("./routes/book-routes.js");
const User = require("./models/user.model.js");
const authRouter = require("./routes/auth.routes.js");
const homeRouter = require("./routes/home.route.js");
const adminRoutes = require("./routes/admin.route.js");
const imageRouter = require("./routes/image.route.js");
const PORT = process.env.PORT || 3001;

const cors = require("cors");
const app = express();

//connect to Db
connectDb();

//Middleware - express.json()
app.use(express.json());
app.use(cors());

//routes here
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRouter);
app.use("/api/home", homeRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRouter);

//home --get all users
app.get("/", async (req, res) => {
  try {
    // const attempt = await mongoose.Types.ObjectId(userId);
    // console.log(attempt);
    const users = await User.find({});
    if (!users) return res.status(404).json({ message: "No users available" });
    res.status(200).json(users);
  } catch (error) {
    console.log("SOmething went wrong, Please try Again", error);
  }
});
app.listen(PORT, () => {
  console.log(`Server is listening on PORT : ${PORT}`);
});

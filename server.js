require("dotenv").config();
const express = require("express");
const connectDb = require("./db/config");
const bookRoutes = require("./routes/book-routes.js");
const User = require("./models/user.model.js");
const authRouter = require("./routes/auth.routes.js");
const homeRouter = require("./routes/home.route.js");
const adminRoutes = require("./routes/admin.route.js");
const PORT = process.env.PORT || 3001;
const app = express();

//connect to Db
connectDb();

//Middleware - express.json()
app.use(express.json());

//routes here
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRouter);
app.use("/api/home", homeRouter);
app.use("/api/admin", adminRoutes);

//home
app.get("/", async (req, res) => {
  console.log("Users", await User.find({}));
  res.send("Hi Welcome to my Home Page");
});
app.listen(PORT, () => {
  console.log(`Server is listening on PORT : ${PORT}`);
});

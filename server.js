require("dotenv").config();
const express = require("express");
const connectDb = require("./db/config");
const bookRoutes = require("./routes/book-routes.js");
const Book = require("./models/book.model.js");

const PORT = process.env.PORT || 3001;
const app = express();

//connect to Db
connectDb();

//Middleware - express.json()
app.use(express.json());

//routes here
app.use("/api/books", bookRoutes);

//home
app.get("/", async (req, res) => {
  console.log(await Book.find({}));
  res.send("Hi Welcome to my Home Page");
});
app.listen(PORT, () => {
  console.log(`Server is listening on PORT : ${PORT}`);
});

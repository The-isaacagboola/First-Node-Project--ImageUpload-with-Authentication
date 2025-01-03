const express = require("express");
const {
  getAllBooks,
  getSingleBook,
  AddNewBook,
  updateBook,
  deleteBook,
} = require("../controllers/book-controller");

//create express router
const router = express.Router();

// All routes related to books
router.get("/get", getAllBooks);
router.get("/:id", getSingleBook);
router.post("/add", AddNewBook);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);

module.exports = router;

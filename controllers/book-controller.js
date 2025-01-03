const Book = require("../models/book.model");

const getAllBooks = async (req, res) => {};

const getSingleBook = async (req, res) => {};

const AddNewBook = async (req, res) => {
  try {
    const newBookFormData = req.body;
    const newlyCreatedBook = await Book.create(newBookFormData);

    if (newlyCreatedBook) {
      res.status(201).json({
        success: true,
        message: "Book Created Successfully",
        data: newlyCreatedBook,
      });
      console.log("Book created successfully");
    } else
      res.status(400).json({
        message: "Error creating book",
      });
  } catch (error) {
    console.error("Error Creating New Book:", error);
  }
};

const updateBook = async (req, res) => {};

const deleteBook = async (req, res) => {};

module.exports = {
  getAllBooks,
  getSingleBook,
  AddNewBook,
  updateBook,
  deleteBook,
};

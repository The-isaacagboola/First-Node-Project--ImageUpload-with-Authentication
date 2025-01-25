const Book = require("../models/book.model");

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find({});

    if (allBooks && allBooks.length) {
      res.status(200).json({
        success: true,
        message: "List of books fetched successfully",
        data: allBooks,
      });
    } else
      res.status(404).json({
        message: "No books found",
      });
  } catch (error) {
    console.error("Error finding all books :", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOne({ _id: id });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book with ID: " + id + " not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book Found Succesfully",
      data: book,
    });
  } catch (error) {
    console.error("Error getting a single book", error),
      res.status(500).json({
        success: false,
        message:
          "Something went wrong. Try again" +
          "Book with ID: " +
          id +
          " cannot be fetched",
      });
  }
};

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
    } else
      res.status(400).json({
        message: "Error creating book",
      });
  } catch (error) {
    console.error("Error Creating New Book:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const newUpdate = req.body;

  try {
    const bookToUpdate = await Book.findByIdAndUpdate(id, newUpdate, {
      new: true,
    });

    if (!bookToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Book with specified ID does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: bookToUpdate,
    });
  } catch (error) {
    console.error("Error updating Book", error);
    res.status(400).json({
      message: "Something went wrong. Book not updated",
    });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book" + id + " does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error Occured. Unable to delete book",
    });
  }
};

module.exports = {
  getAllBooks,
  getSingleBook,
  AddNewBook,
  updateBook,
  deleteBook,
};

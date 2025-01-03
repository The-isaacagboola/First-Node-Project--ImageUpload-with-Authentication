const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mongodb");
    console.log("MongoDb connected successfully");
  } catch (error) {
    console.error("Error connecting to Database", error);
    process.exit(1);
  }
};

module.exports = connectDb;

const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb connected successfully");
  } catch (error) {
    console.error("Error connecting to Database", error);
    process.exit(1);
  }
};

module.exports = connectDb;

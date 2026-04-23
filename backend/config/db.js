// db.js - MongoDB connection setup using Mongoose
// This file handles connecting our Express server to MongoDB.
// We use Mongoose as an ODM (Object Document Mapper) which provides
// a schema-based solution for modeling our application data.

const mongoose = require("mongoose");

// connectDB is an async function because mongoose.connect returns a promise.
// We call this once when the server starts up.
const connectDB = async () => {
  try {
    // mongoose.connect takes the connection URI from our .env file.
    // It returns a connection object on success.
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected: " + conn.connection.host);
  } catch (error) {
    // If the connection fails, we log the error and exit the process.
    // There is no point running the server without a database.
    console.error("MongoDB connection error: " + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

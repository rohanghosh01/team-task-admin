const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => console.log("error connect DB", err));
};

module.exports = connectDB;

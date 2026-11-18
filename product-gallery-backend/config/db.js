const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://akshayaher9696_db_user:T7zYPL8qFab292ia@staff-leave-cluster.d0cg2qf.mongodb.net/product-gallery?retryWrites=true&w=majority",
    );

    console.log("MongoDB connected successfully");
  } catch (error) {
    // console.log(process.env.MONGO_URI);
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

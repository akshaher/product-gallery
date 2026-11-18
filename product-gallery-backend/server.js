console.log("SERVER.JS FILE EXECUTED");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("Express initialized");

const connectDB = require("./config/db");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4200",
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.originalUrl);
  next();
});

app.use("/api/health", require("./routes/health.routes"));
app.use("/api/products", require("./routes/product.routes"));

app.get("/test", (req, res) => {
  console.log("Test route called");
  res.send("Express is working!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("Starting server...");
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

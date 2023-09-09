require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

// Khai báo database
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pv6rkef.mongodb.net/TestForm?retryWrites=true&w=majority`
    );
    console.log("Connect DB Thanh Cong");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();
app.use(express.json());
app.use(cors());

// API ROUTER
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
// API SERVER
app.listen(process.env.PORT, () => {
  console.log(
    `Server dang chay tai PORT : http://localhost:${process.env.PORT}/`
  );
});

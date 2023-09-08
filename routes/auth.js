const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ROUTER POST REGISTER
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email)
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ tất cả thông tin !",
    });

  try {
    const user = await User.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản đã có sẵn" });

    const hashedPassword = await argon2.hash(password); // Mã hóa password
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "Tạo tài khoản thành công !",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi từ phía server !" });
  }
});

// ROUTER POST LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra
  if (!username || !password)
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ tất cả thông tin !",
    });

  try {
    // kiểm tra tài khoản
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });

    // tìm kiếm user
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });

    // trả về token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "Đăng Nhập Thành Công!",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi từ phía server !" });
  }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Post = require("../models/Post");

// router get all post
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi từ phía server !" });
  }
});

// router up post
router.post("/", verifyToken, async (req, res) => {
  const { status, url } = req.body;
  // simple
  if (!status)
    return res
      .status(400)
      .json({ success: false, message: "Status is required" });

  try {
    const newPost = new Post({
        status,
      url: url.startsWith("https://") ? url : `https://${url}`,
      user: req.userId,
    });

    await newPost.save();

    res.json({ success: true, message: "THANH CONG!", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi từ phía server !" });
  }
});

// router edit post
router.put("/:id", verifyToken, async (req, res) => {
    const { status, url } = req.body;
  // simple
  if (!status)
    return res
      .status(400)
      .json({ success: false, message: "Status is required" });

  try {
    let updatedPost = {
        status,
        url: url.startsWith("https://") ? url : `https://${url}`,
        user: req.userId,
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };
    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

// người dùng không có quyền cập nhật bài viết
    if (!updatedPost)
      return res
        .status(401)
        .json({
          success: false,
          message: "Không tìm thấy bài đăng hoặc người dùng không được ủy quyền !",
        });

        res.json({success: true, message: 'THANH CONG!', post: updatedPost})
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi từ phía server !" });
  }
});

// router delete post
router.delete("/:id", verifyToken, async (req, res) => {
try {
  const postDeteleCondition = { _id: req.params.id, user: req.userId };
  const deletedPost = await Post.findOneAndDelete(postDeteleCondition)

  // người dùng không được ủy quyền hoặc không tìm thấy bài đăng
if(!deletedPost)
return res.status(401).json({
  success: false,
  message: 'Không tìm thấy bài đăng hoặc người dùng không được ủy quyền !'
})

res.json({success: true, message: 'Xoa Post Thanh Cong!', post: deletedPost})
} catch (error) {
  console.log(error);
    res.status(500).json({ success: false, message: "Lỗi từ phía server !" });
}
})
module.exports = router;

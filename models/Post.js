const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  status: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("posts", PostSchema);

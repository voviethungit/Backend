const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsernameSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
  },
});

module.exports = mongoose.model("users", UsernameSchema);

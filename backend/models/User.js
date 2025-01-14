const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, require },
  email: { type: String, require },
  password: { type: String, require },
  role: { type: String, require, default: "customer" },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

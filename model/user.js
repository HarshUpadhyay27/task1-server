const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: [true, "Email already exist"],
  },
  password: {
    required: true,
    type: String,
  },
  mode: {
    type: String,
    default: "white",
  },
  color: {
    type: String,
    default: "rgb(34, 32, 32)",
  }
});

const User = new mongoose.model("User", userSchema);
module.exports = { User };
const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  file: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  size: {
    type: Number,
    require: true
  },
  type: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  intersted:{
    type: Boolean,
    default: true
  }
});

const File = mongoose.model("File", fileSchema);
module.exports = { File };

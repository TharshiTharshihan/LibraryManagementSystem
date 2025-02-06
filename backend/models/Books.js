const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, require },
  author: { type: String, require },
  year: { type: String, require },
  image: { type: String, require },
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;

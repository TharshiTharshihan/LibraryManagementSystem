const express = require("express");

const dotenv = require("dotenv");

dotenv.config();

const app = express();
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModel = require("./models/User");
const bookModel = require("./models/Books");
const db = require("./db");
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://3.91.45.203", "http://3.91.45.203:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to Library Book Management API");
});

//signup

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      userModel
        .create({ name, email, password: hash })
        .then((user) => res.json("success"))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

//login

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  userModel
    .findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign(
              { email: user.email, role: user.role },
              "jwt-secret-key",
              { expiresIn: "1d" }
            );
            res.cookie("token", token);
            return res.json({ status: "success", role: user.role });
          } else {
            return res.json("wrong password");
          }
        });
      } else {
        return res.json("no record");
      }
    })
    .catch((err) => {
      return res.json("error occurred");
    });
});

// add book
app.post("/api/books", async (req, res) => {
  const book = req.body;

  if (!book.title || !book.author || !book.image || !book.year) {
    return res.status(400).json({ message: "Fill all fields" });
  }
  const newBook = new bookModel(book);

  try {
    await newBook.save();
    res.status(201).json({ status: "success", data: newBook });
  } catch (err) {
    console.error("Error in book adding", err.message);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// get all

app.get("/api/books", async (req, res) => {
  try {
    const books = await bookModel.find({});
    res.status(201).json({ status: "success", data: books });
  } catch (err) {
    console.error("Error in book", err.message);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// Get a single product package by ID
app.get("/api/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await bookModel.findById(id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "book not found." });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// update

app.put("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const book = req.body;

  try {
    const updatedbooks = await bookModel.findByIdAndUpdate(id, book, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedbooks });
  } catch (err) {
    console.error("Error in update the book", err.message);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// delete

app.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await bookModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Error in  delete book", err.message);
    res.status(500).json({ success: false, message: " error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

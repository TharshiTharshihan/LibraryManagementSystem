const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Define a schema and model for books
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
});

const Book = mongoose.model('Book', bookSchema);

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    // Insert a test document
    return testDatabase();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Insert a test document
async function testDatabase() {
  try {
    const newBook = new Book({ title: 'Test Book', author: 'Test Author' });
    await newBook.save();
    console.log('Test document inserted');
  } catch (error) {
    console.error('Error inserting test document:', error);
  }
}

// Middleware to parse incoming requests as JSON
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('API is running'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

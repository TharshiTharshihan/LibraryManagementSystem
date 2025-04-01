import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../../config";

function EditBook() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    year: "",
    image: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook({
      ...book,
      [name]: value,
    });
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/books/${id}`)
      .then((res) => {
        const { title, author, year, image } = res.data.data;
        setBook({
          title,
          author,
          year,
          image,
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Failed to fetch book details", "error");
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${API_URL}/api/books/${id}`, { ...book })
      .then((res) => {
        Swal.fire("Updated!", "Your product has been updated.", "success");
        navigate("/books");
      })
      .catch((err) => {
        alert("Book Failed to update ");
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add a New Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={book.title}
              required
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter book title"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={book.author}
              required
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter author's name"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={book.year}
              required
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter publication year"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              value={book.image}
              required
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter book Image URL"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            Update Book
          </button>
          <button
            onClick={() => navigate("/admin#users")}
            className="bg-white text-black w-full py-2 rounded"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBook;

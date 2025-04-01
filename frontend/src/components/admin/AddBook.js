import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import API_URL from "../../config";

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/api/books`, { title, author, image, year })
      .then((res) => {
        Swal.fire(
          "Congratulations! You Have Successfully created 😊",
          "",
          "success"
        );
        navigate("/books");
      })
      .catch((err) => {
        alert("Book faily added");
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
              required
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter book title"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Author</label>
            <input
              type="text"
              name="author"
              required
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
              className="w-full p-2 border rounded"
              placeholder="Enter author's name"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Year</label>
            <input
              type="number"
              name="year"
              required
              onChange={(e) => {
                setYear(e.target.value);
              }}
              className="w-full p-2 border rounded"
              placeholder="Enter publication year"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              required
              onChange={(e) => {
                setImage(e.target.value);
              }}
              className="w-full p-2 border rounded"
              placeholder="Enter book Image URL"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBook;

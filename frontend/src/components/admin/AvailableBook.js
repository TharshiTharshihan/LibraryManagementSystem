import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../config";

function AvailableBook() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/books`)
      .then((res) => {
        setBooks(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEdit = (bookId) => {
    navigate(`/edit/${bookId}`);
  };

  const handledelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/books/${id}`)
          .then(() => {
            setBooks(books.filter((book) => book._id !== id));
            Swal.fire("Deleted!", "Your book has been deleted.", "success");
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error!", "Failed to delete the book.", "error");
          });
      } else {
        Swal.fire("Cancelled", "Your book is safe :)", "info");
      }
    });
  };

  return (
    <>
      <section className="py-12 px-4 ">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center">
          BOOK DETAILS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {books.map((book) => (
            <div
              className="bg-neutral-100 rounded-lg shadow-md overflow-hidden"
              key={book._id}
            >
              <img
                src={book.image}
                alt={book.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {book.title}
                </h3>
                <p className="text-gray-700 text-base">
                  Our most popular blend, featuring beans from a single farm in
                  Ethiopia. Notes of chocolate, berries, and citrus.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Options ➡️</span>
                  <button onClick={() => handleEdit(book._id)}>
                    <i className="bi bi-pen-fill"></i>
                  </button>
                  <br />
                  <br />
                  <button onClick={() => handledelete(book._id)}>
                    <i className="bi bi-trash3-fill  "></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <p> {books.length}</p>
    </>
  );
}

export default AvailableBook;

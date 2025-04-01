import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../config";

function UserDashboard() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/api/books`)
      .then((res) => {
        setBooks(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="bg-orange-100 min-h-screen">
        <div className="fixed bg-white text-blue-800 px-10 py-1 z-10 w-full">
          <div className="flex items-center justify-between py-2 text-5x1">
            <div className="font-bold text-blue-900 text-xl">
              Student<span className="text-orange-600">Panel</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span
                className="material-icons-outlined p-2"
                style={{ fontSize: "30px" }}
              >
                search
              </span>
              <span
                className="material-icons-outlined p-2"
                style={{ fontSize: "30px" }}
              >
                notifications
              </span>
              <div
                className="bg-center bg-cover bg-no-repeat rounded-full inline-block h-12 w-12 ml-2"
                style={{
                  backgroundImage:
                    "url(https://i.pinimg.com/564x/de/0f/3d/de0f3d06d2c6dbf29a888cf78e4c0323.jpg)",
                }}
              ></div>
            </div>
          </div>
        </div>

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
                    Our most popular blend, featuring beans from a single farm
                    in Ethiopia. Notes of chocolate, berries, and citrus.
                  </p>

                  <button className="mt-4 flex items-center justify-between">
                    <b className="bi bi-cart-fill"> Borrow </b>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default UserDashboard;

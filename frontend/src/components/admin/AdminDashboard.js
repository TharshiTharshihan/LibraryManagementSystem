import React, { useState } from "react";
import AvailableBook from "./AvailableBook";
import AddBook from "./AddBook";
const AdminDashboard = () => {
  // State to track the active section
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSubmit = (e) => {};

  // Function to render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Total Books</h3>
              <p className="text-2xl">1,200</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">New Orders</h3>
              <p className="text-2xl">500</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Revenue</h3>
              <p className="text-2xl">$45,000</p>
            </div>
          </div>
        );
      case "Books":
        return <AvailableBook />;
      case "Add Books":
        return <AddBook />;
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div className="flex h-screen bg-blue-600">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li
              className={`px-4 py-2 hover:bg-blue-500 ${
                activeSection === "dashboard" ? "bg-blue-500" : ""
              }`}
              onClick={() => setActiveSection("dashboard")}
            >
              <a href="#dashboard" className="block">
                Dashboard
              </a>
            </li>
            <li
              className={`px-4 py-2 hover:bg-blue-500 ${
                activeSection === "users" ? "bg-blue-500" : ""
              }`}
              onClick={() => setActiveSection("Books")}
            >
              <a href="#users" className="block">
                Books
              </a>
            </li>
            <li
              className={`px-4 py-2 hover:bg-blue-500 ${
                activeSection === "settings" ? "bg-blue-500" : ""
              }`}
              onClick={() => setActiveSection("Add Books")}
            >
              <a href="#settings" className="block">
                Add Books
              </a>
            </li>
            <li className="px-4 py-2 hover:bg-blue-500">
              <a href="/" className="block">
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </header>

        {/* Content Area */}
        <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

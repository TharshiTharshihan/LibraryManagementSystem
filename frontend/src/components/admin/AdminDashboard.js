import React from "react";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-blue-500">
              <a href="#dashboard" className="block">
                Dashboard
              </a>
            </li>
            <li className="px-4 py-2 hover:bg-blue-500">
              <a href="#users" className="block">
                Users
              </a>
            </li>
            <li className="px-4 py-2 hover:bg-blue-500">
              <a href="#settings" className="block">
                Settings
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
          <h1 className="text-xl font-bold">Dashboard</h1>
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </header>

        {/* Content Area */}
        <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Total Users</h3>
              <p className="text-2xl">1,234</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">New Orders</h3>
              <p className="text-2xl">567</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Revenue</h3>
              <p className="text-2xl">$45,678</p>
            </div>

            {/* Add more cards/widgets as needed */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

import "./App.css";
//import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/registration/Signup";
import Home from "./components/home/Home";
import AdminDashboard from "./components/admin/AdminDashboard";
import Login from "./components/registration/Login";
import UserDashboard from "./components/user/UserDashboard";
import AvailableBook from "./components/admin/AvailableBook";
import AddBook from "./components/admin/AddBook";
import EditBook from "./components/admin/EditBook";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/books" element={<AvailableBook />} />
        <Route path="/add" element={<AddBook />} />
        <Route path="/edit/:id" element={<EditBook />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

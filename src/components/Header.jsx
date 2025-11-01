// ================================
//  Header.jsx
//  Fixed navigation bar with brand, navigation links, and admin login/logout
//  Styled with soft purple gradient background and darker purple accents
//  Updated to navigate to /login for admin login page
// ================================

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  // 🟣 State: track mobile menu open/close (responsive design)
  const [isOpen, setIsOpen] = useState(false);

  // 🟣 State: track login status (temporary placeholder)
  // Will later be updated once we connect to backend authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🟣 useNavigate hook from React Router to handle navigation programmatically
  const navigate = useNavigate();

  // 🟣 Handles authentication button logic:
  // If logged in → logout; if not logged in → navigate to login page
  const handleAuth = () => {
    if (isLoggedIn) {
      // Later we’ll add logic to clear tokens or session here
      setIsLoggedIn(false);
    } else {
      navigate("/login"); // Navigate to admin login page
    }
  };

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50 shadow-md
        bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100
        backdrop-blur-sm
      "
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        {/* ===================== */}
        {/* 🟣 Brand Section */}
        {/* ===================== */}
        <div className="flex items-center space-x-2">
          {/* Candidate name */}
          <Link to="/" className="text-purple-800 font-bold text-lg md:text-xl">
            Thuranira Kathiai
          </Link>
          {/* Slogan (visible only on larger screens) */}
          <span className="hidden md:inline text-sm italic text-purple-700">
            Empowering Communities, Building for the Future Generation
          </span>
        </div>

        {/* ===================== */}
        {/* 🟣 Desktop Navigation Links */}
        {/* ===================== */}
        <div className="hidden md:flex space-x-6 text-purple-800 font-medium">
          {/* Home link */}
          <Link to="/" className="hover:text-purple-950 transition-colors">
            Home
          </Link>

          {/* Feedback page link */}
          <Link
            to="/feedback"
            className="hover:text-purple-950 transition-colors"
          >
            Feedback
          </Link>

          {/* 🟣 Admin login/logout button */}
          <button
            onClick={handleAuth}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-1.5 rounded-full text-sm shadow-sm transition-all"
          >
            {isLoggedIn ? "Logout" : "Admin Login"}
          </button>
        </div>

        {/* ===================== */}
        {/* 🟣 Mobile Menu Button */}
        {/* ===================== */}
        <button
          className="md:hidden text-purple-800 focus:outline-none text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </nav>

      {/* ===================== */}
      {/* 🟣 Mobile Dropdown Menu */}
      {/* ===================== */}
      {isOpen && (
        <div className="md:hidden bg-purple-50 border-t border-purple-200 py-2 text-center space-y-2">
          <Link
            to="/"
            className="block text-purple-800 hover:text-purple-950"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/feedback"
            className="block text-purple-800 hover:text-purple-950"
            onClick={() => setIsOpen(false)}
          >
            Feedback
          </Link>

          {/* Mobile Auth Button */}
          <button
            onClick={() => {
              handleAuth();
              setIsOpen(false);
            }}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-1.5 rounded-full text-sm shadow-sm transition-all"
          >
            {isLoggedIn ? "Logout" : "Admin Login"}
          </button>
        </div>
      )}
    </header>
  );
}

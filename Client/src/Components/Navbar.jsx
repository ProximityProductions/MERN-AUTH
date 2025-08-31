import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./Context/UserContext";
import axios from "axios";
import {toast} from "react-toastify";
const Navbar = () => {
  const { user, setUser, setIsLoggedIn, backendUrl } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // ✅ Correct way to navigate

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        { withCredentials: true } // ❌ this is being treated as request body, not config
      );

      setUser(null);
      setIsLoggedIn(false);
      setShowDropdown(false);

      navigate("/"); // ✅ Correct navigation
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendVerificationOTP = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 sm:px-12 py-4 bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />

      {/* Right Side */}
      {user ? (
        <div className="relative" ref={dropdownRef}>
          {/* Avatar Circle (clickable) */}
          <div
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-bold rounded-full cursor-pointer select-none"
          >
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              {!user.isVerified && (
                <button
                  onClick={sendVerificationOTP}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Verify Email
                </button>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;

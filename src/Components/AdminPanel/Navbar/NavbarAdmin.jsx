import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import { FaEnvelope, FaPhone } from 'react-icons/fa'; // Importing icons for email and phone

const NavbarAdmin = () => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleDropdown = () => {
    setIsBoxOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsBoxOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout function to redirect
  const handleLogout = () => {
    navigate("/admin-login");  // Navigate to the admin login page route
  };

  return (
    <nav className="bg-custom-blue1 text-gray-200 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="logo">
        </div>
        <div className="relative">
          <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
            <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-white mr-2">
              <span className="font-bold">S</span> {/* Placeholder for user initials */}
            </div>
            <span className="text-gray-200">Profile</span>
            <svg
              className="ml-1"
              width="10"
              height="7"
              viewBox="0 0 10 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.825 0.158203L5 3.97487L1.175 0.158203L0 1.3332L5 6.3332L10 1.3332L8.825 0.158203Z"
                fill="#545454"
              ></path>
            </svg>
          </div>

          {isBoxOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg" ref={dropdownRef}>
              <div className="border-t border-gray-200">
                <ul className="py-1">
                  <li onClick={handleLogout}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;

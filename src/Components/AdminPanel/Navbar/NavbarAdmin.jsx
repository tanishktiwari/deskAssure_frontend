import React, { useEffect, useState, useRef } from "react"; // Add useRef here
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

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
    navigate("/admin-login"); // Navigate to the admin login page route
  };

  return (
    <nav className="bg-[#FFFFFF] w-full fixed top-0 left-0 navbar">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-16">
        <div className="relative flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <div className="logo"></div>
          </div>
          {/* Icons and Profile Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Add icon */}
            {/* <button 
              className="bg-custom-gradient text-white  p-2 w-10 h-10 flex items-center justify-center rounded-md">
              <FontAwesomeIcon icon={faPlus} className="text-2xl" />
            </button> */}
            {/* Bell icon */}
            <button className="notification-button bg-custom-gradient">
              <img
                src="/bell.png" // Default white icon
                alt="Notification Bell"
                className="icon "
              />
            </button>
            {/* Settings icon */}
            {/* <button className="settings-button bg-custom-gradient">
              <img 
                src="/settings.png" // Default white icon
                alt="Settings" 
                className="settings" 
              />
            </button> */}
            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open user menu</span>
                  {/* New Profile Icon */}
                  <div className="h-9 w-9 bg-yellow-200 rounded-full flex justify-center items-center text-yellow-500 text-2xl font-mono">
                    AD
                  </div>
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Sign out
                  </a>
                </MenuItem>
                
              </MenuItems>
            </Menu>
          </div>
        </div>
        <div
          style={{
            border: "0.5px solid rgba(200, 203, 217, 1)",
            width: "1500px", // Adjust width as needed
            // margin: '0 0', // Adjust margin as needed
          }}
          className="mt-1 relative right-4"
        />
      </div>
    </nav>
  );
};

export default NavbarAdmin;

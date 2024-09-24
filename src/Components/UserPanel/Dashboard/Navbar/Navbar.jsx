import React from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ProfileIcon from './ProfileIcon'; // Import the ProfileIcon component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faCog } from '@fortawesome/free-solid-svg-icons';
import '../Navbar/Navbar.css'; // Adjust the path as needed

const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleProfileClick = () => {
    navigate('/user-login'); // Redirect to UserLoginPage
  };

  const handleSignOut = () => {
    // Add your sign-out logic here
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/user-login');
  }; 

  const userInitials = ''; // Replace with dynamic initials as needed

  return (
    <nav className="bg-custom-blue w-full fixed top-0 left-0 navbar">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-16">
        <div className="relative flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <div className="logo"></div>
          </div>

          {/* Icons and Profile Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Add icon */}
            <button 
              className="bg-green-500 text-white hover:bg-green-600 p-2 w-10 h-10 flex items-center justify-center rounded-md"
              onClick={() => navigate('/dashboard/create-ticket')} // Redirect to Create Ticket page
            >
              <FontAwesomeIcon icon={faPlus} className="text-2xl" />
            </button>

            {/* Bell icon */}
            <button className="text-white hover:bg-gray-700 p-2 rounded-full">
              <FontAwesomeIcon icon={faBell} />
            </button>

            {/* Settings icon */}
            <button className="text-white hover:bg-gray-700 p-2 rounded-full"
            onClick={() => navigate('/dashboard/Profileform')}
            >
              <FontAwesomeIcon icon={faCog} />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open user menu</span>
                  <ProfileIcon initials={userInitials} diameter={32} backgroundColor="#3498db" textColor="#fff" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleSignOut}>
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
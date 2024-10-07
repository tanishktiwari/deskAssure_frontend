import React, { useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../Navbar/Navbar.css'; // Adjust the path as needed

const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [userInitials, setUserInitials] = useState(''); // State for user initials
  const [operatorName, setOperatorName] = useState(''); // State for operator name
  const mobileNumber = localStorage.getItem('loggedInUserMobileNumber'); // Get mobile number from local storage

  useEffect(() => {
    const fetchOperatorData = async () => {
      if (mobileNumber) {
        try {
          // Fetch operator data using mobile number
          const response = await axios.get(`http://localhost:5174/operators/mobile/${mobileNumber}`);
          setOperatorName(response.data.operatorName); // Store operator name

          // Determine which API to call based on operatorName
          const names = response.data.operatorName.split(' ');
          let initialsApiUrl;

          if (names.length > 1) {
            // Both first and last name
            initialsApiUrl = `http://localhost:5174/operators/initials/${mobileNumber}`;
          } else {
            // Only first name
            initialsApiUrl = `http://localhost:5174/operators/initials-two/${mobileNumber}`;
          }

          // Fetch initials
          const initialsResponse = await axios.get(initialsApiUrl);
          setUserInitials(initialsResponse.data.initials); // Store initials in state
        } catch (error) {
          console.error('Error fetching operator data:', error);
        }
      } else {
        console.error('No mobile number found in local storage.');
      }
    };

    fetchOperatorData();
  }, [mobileNumber]);

  const handleProfileClick = () => {
    navigate('/user-login'); // Redirect to UserLoginPage
  };

  const handleSignOut = () => {
    // Add your sign-out logic here
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/user-login');
  };

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
              onClick={() => navigate('/dashboard/create-ticket')}
            >
              <FontAwesomeIcon icon={faPlus} className="text-2xl" />
            </button>

            {/* Bell icon */}
            <button className="notification-button">
                  <img 
                    src="/bell.png" // Default white icon
                    alt="Notification Bell" 
                    className="icon" 
                  />
            </button>



            {/* Settings icon */}
            <button className="settings-button" onClick={() => navigate('/dashboard/Profileform')}>
              <img 
                    src="/settings.png" // Default white icon
                    alt="Notification Bell" 
                    className="settings" 
                  />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open user menu</span>
                  {/* New Profile Icon */}
                  <div className="h-9 w-9 bg-yellow-200 rounded-full flex justify-center items-center text-yellow-500 text-2xl font-mono">
                    {userInitials || 'i'}
                  </div>
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

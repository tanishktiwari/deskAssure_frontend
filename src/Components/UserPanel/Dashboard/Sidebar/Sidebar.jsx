import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'; // For custom font

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Home'); // Default to 'Home'
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavigation = (item) => {
    setActiveItem(item);
    switch (item) {
      case 'Home':
        navigate('/dashboard/home'); // Navigate to Home page
        break;
      case 'Create Ticket':
        navigate('/dashboard/create-ticket'); // Navigate to Create Ticket page
        break;
      case 'Open':
        navigate('/dashboard/open'); // Navigate to Open page
        break;
      case 'Close':
        navigate('/dashboard/close'); // Navigate to Close page
        break;
      case 'Report':
        navigate('/dashboard/report'); // Navigate to Report page
        break;
      default:
        break;
    }
  };

  return (
    <div className="sidebar bg-custom-blue1 text-white fixed top-0 left-0 h-screen w-28"> {/* Increased width here */}
      <ul className="sidebar-menu flex flex-col mt-8 space-y-4 pt-12 items-center"> {/* Center items */}
        {/* Home Item */}
        <li
  className={`p-2 cursor-pointer flex flex-col items-center 
    ${activeItem === 'Home' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
  onClick={() => handleNavigation('Home')}
>
  <img 
    src="/dashboard.png" 
    alt="Dashboard Icon" 
    style={{ height: '1.625rem', width: '1.625rem' }} 
    className='dashboard-logo' // Updated class name
  />
  <span className="mt-1 text-sm">Dashboard</span>
</li>



        {/* Create Ticket Item */}
        <li
          className={`p-2 cursor-pointer flex flex-col items-center 
            ${activeItem === 'Create Ticket' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
          onClick={() => handleNavigation('Create Ticket')}
        >
          <img 
            src="/add.png" // Update the path as necessary
            alt="Create Ticket Icon" 
            style={{ height: '1.625rem', width: '1.625rem' }} 
            className='add-ticket-icon' // Updated class name to match CSS
          />
          
          <span className="mt-1 text-sm">Create Ticket</span>
        </li>


        {/* Open Item */}
        <li
          className={`p-2 cursor-pointer flex flex-col items-center 
            ${activeItem === 'Open' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
          onClick={() => handleNavigation('Open')}
        >
          <img 
            src="/checked_default.png" // Default image
            alt="Open Icon" 
            style={{ height: '1.625rem', width: '1.625rem' }} 
            className='open-icon' // Add class for styling
          />
          <img 
            src="/checked.png" // Image to show on hover
            alt="Open Icon Hover" 
            style={{ height: '1.625rem', width: '1.625rem' }} 
            className='open-icon-hover' // Class for hover image
          />
          <span className="mt-1 text-sm">Open</span>
</li>




        {/* Close Item */}
        <li
  className={`p-2 cursor-pointer flex flex-col items-center 
    ${activeItem === 'Close' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
  onClick={() => handleNavigation('Close')}
>
  <img 
    src="/cancel_default.png" // Default image
    alt="Close Icon" 
    style={{ height: '1.625rem', width: '1.625rem' }} 
    className='close-icon' // Class for default image styling
  />
  <img 
    src="/cancel.png" // Image to show on hover
    alt="Close Icon Hover" 
    style={{ height: '1.625rem', width: '1.625rem' }} 
    className='close-icon-hover' // Class for hover image
  />
  <span className="mt-1 text-sm">Close</span>
</li>




        {/* Report Item */}
        <li
              className={`p-2 cursor-pointer flex flex-col items-center 
                ${activeItem === 'Report' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
              onClick={() => handleNavigation('Report')}
            >
              <img 
                src="/categories.png" // Update the path as necessary
                alt="Report Icon" 
                style={{ height: '1.625rem', width: '1.625rem' }} 
                className='report-icon' // Add class for styling
              />
              <span className="mt-1 text-sm">Report</span>
          </li>


      </ul>
    </div>
  );
};

export default Sidebar;

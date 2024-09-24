import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, TicketIcon, FolderOpenIcon, FolderIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';
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
    <div className="sidebar bg-custom-blue1 text-white fixed top-0 left-0 h-screen ">
      <ul className="sidebar-menu flex flex-col mt-8 space-y-4 pt-12">
        {/* Home Item */}
        <li
          className={`p-4 cursor-pointer flex items-center 
            ${activeItem === 'Home' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
          onClick={() => handleNavigation('Home')}
        >
          <HomeIcon className="h-12 w-12" />
          <span className="ml-4">Dashboard</span>
        </li>

        {/* Create Ticket Item */}
        <li
          className={`p-4 cursor-pointer flex items-center 
            ${activeItem === 'Create Ticket' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
          onClick={() => handleNavigation('Create Ticket')}
        >
          <TicketIcon className="h-12 w-12" />
          <span className="ml-4">Create Ticket</span>
        </li>

        {/* Open Item */}
        <li
          className={`p-4 cursor-pointer flex items-center 
            ${activeItem === 'Open' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
          onClick={() => handleNavigation('Open')}
        >
          <FolderOpenIcon className="h-12 w-12" />
          <span className="ml-4">Open</span>
        </li>

        {/* Close Item */}
        <li
          className={`p-4 cursor-pointer flex items-center 
            ${activeItem === 'Close' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
          onClick={() => handleNavigation('Close')}
        >
          <FolderIcon className="h-12 w-12" />
          <span className="ml-4">Close</span>
        </li>

        {/* Report Item */}
        <li
          className={`p-4 cursor-pointer flex items-center 
            ${activeItem === 'Report' ? 'border-l-4 border-red-500 shadow-lg' : ''}`}
          onClick={() => handleNavigation('Report')}
        >
          <DocumentChartBarIcon className="h-12 w-12" />
          <span className="ml-4">Report</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

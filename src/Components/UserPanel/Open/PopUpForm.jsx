import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClipboard } from 'react-icons/fa'; // Import the clipboard icon
import "../Open/PopUpForm.css";

const PopUpForm = ({ onClose, ticketNumber }) => {
  const [copied, setCopied] = useState(false);
  const [ticketDetails, setTicketDetails] = useState({
    name: '',
    contactNumber: '',
    email: '',
    companyName: '',
    issueCategory: '',
    issueDescription: '',
    resolution: '',
    preventiveAction: '',
    warrantyCategory: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticketNumber);
    setCopied(true);

    // Reset the copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Fetch ticket details using the provided ticketNumber
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5174/ticket-details/${ticketNumber}`);
        setTicketDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load ticket details');
        setLoading(false);
      }
    };

    if (ticketNumber) {
      fetchTicketDetails();
    }
  }, [ticketNumber]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 top-10">
      <div className="custom-div bg-white shadow-lg p-8 rounded-lg w-[766px] h-[450px] overflow-y-scroll">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-600 bg-white h-12 w-12 text-2xl hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-8 text-center">Ticket Details</h2>
        <form className="space-y-6">
          {/* Ticket Number Display with Copy to Clipboard Icon */}
          <div className="ticket flex items-center justify-center mb-0 ">
            <span style={{ marginRight: '8px' }}>Your Deskassure ID is</span>
            <strong>{ticketNumber}</strong>

            {/* Copy to Clipboard Icon */}
            <button onClick={copyToClipboard} className="ml-3 text-gray-600 hover:text-gray-900">
              <FaClipboard size={12} />
            </button>

            {/* Copied Message */}
            {copied && <span className="ml-2 text-green-500 text-sm">Copied!</span>}
          </div>

          {/* Name and Contact Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                value={ticketDetails.name}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                value={ticketDetails.contactNumber}
                readOnly
              />
            </div>
          </div>

          {/* Email and Company Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                value={ticketDetails.email}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                value={ticketDetails.companyName}
                readOnly
              />
            </div>
          </div>

          {/* Issue Category as a Non-Editable Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Category</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200"
              value={ticketDetails.issueCategory}
              disabled
            >
              <option value={ticketDetails.issueCategory}>{ticketDetails.issueCategory}</option>
            </select>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200"
              rows="3"
              value={ticketDetails.issueDescription}
              readOnly
            ></textarea>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUpForm;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TicketDetailsModal = ({ isOpen, onClose, ticket }) => {
  const [engineers, setEngineers] = useState([]);
  const [resolution, setResolution] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [warrantyCategory, setWarrantyCategory] = useState('');
  const [ticketStatus, setTicketStatus] = useState('');
  const [engineerId, setEngineerId] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // State for current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchEngineers = async () => {
      if (isOpen) {
        try {
          const response = await axios.get('http://localhost:5174/engineers');
          setEngineers(response.data);
        } catch (error) {
          console.error('Error fetching engineers:', error.message);
        }
      }
    };

    fetchEngineers();
  }, [isOpen]);

  useEffect(() => {
    if (ticket) {
      setTicketId(ticket.ticketId || '');
      setResolution(ticket.resolution || '');
      setPreventiveAction(ticket.preventiveAction || '');
      setWarrantyCategory(ticket.warrantyCategory || '');
      setTicketStatus(ticket.status || '');
    } else {
      const storedTicketId = localStorage.getItem('selectedTicketId');
      if (storedTicketId) {
        const fetchTicketDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:5174/ticket-details/${storedTicketId}`);
            setTicketId(storedTicketId);
            setResolution(response.data.resolution || '');
            setPreventiveAction(response.data.preventiveAction || '');
            setWarrantyCategory(response.data.warrantyCategory || '');
            setTicketStatus(response.data.status || '');
          } catch (error) {
            console.error('Error fetching ticket details:', error.message);
          }
        };

        fetchTicketDetails();
      }
    }
  }, [ticket, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const reportData = {
        resolution,
        preventiveAction,
        warrantyCategory,
        engineerId,
      };

      const idToUse = ticket ? ticket.ticketId : ticketId;

      if (ticketStatus === 'Complete') {
        await axios.put(`http://localhost:5174/tickets/close/${idToUse}`);
        setShowSuccessPopup(true);
      } else {
        await axios.put(`http://localhost:5174/tickets/update/${idToUse}`, reportData);
      }

      onClose();
    } catch (error) {
      console.error('Error submitting report:', error.message);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl mx-2 overflow-hidden">
        <h2 className="text-lg font-bold mb-2 text-center">Ticket Details</h2>


        <div className="mb-2">
          <label className="block text-gray-700">Ticket ID:</label>
          <input
            type="text"
            value={ticketId}
            readOnly
            className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
          />
        </div>

        <div className="flex">
          <div className="w-1/2 p-2 border-r border-gray-300 overflow-y-auto max-h-96">
            <h3 className="text-md font-semibold mb-1">User Input</h3>
            <div className="mb-2">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                value={ticket?.name || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Contact Number:</label>
              <input
                type="text"
                value={ticket?.['Contact Number'] || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Email ID:</label>
              <input
                type="email"
                value={ticket?.['Email ID'] || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Company Name:</label>
              <input
                type="text"
                value={ticket?.['Company Name'] || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Issue Category:</label>
              <input
                type="text"
                value={ticket?.['Issue Category'] || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Issue Description:</label>
              <textarea
                value={ticket?.['Issue Description'] || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
          </div>

          <div className="w-1/2 p-2 overflow-y-auto max-h-96">
            <h3 className="text-md font-semibold mb-1">Admin Input</h3>
            <div className="mb-2">
        {/* Current Date and Time Display as a Read-Only Input Field */}
        <div className="mb-2">
          <label className="block text-gray-700">Current Date and Time:</label>
          <input
            type="text"
            value={currentDateTime.toLocaleString()}
            readOnly
            className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded cursor-not-allowed"
          />
        </div>
              <label className="block text-gray-700">Resolution:</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
                placeholder="Enter resolution details"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Preventive Action:</label>
              <textarea
                value={preventiveAction}
                onChange={(e) => setPreventiveAction(e.target.value)}
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
                placeholder="Enter preventive action details"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Warranty Category:</label>
              <select
                value={warrantyCategory}
                onChange={(e) => setWarrantyCategory(e.target.value)}
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              >
                <option value="">Please select</option>
                <option>Comprehensive AMC</option>
                <option>Non Comprehensive AMC</option>
                <option>In-Warranty</option>
                <option>Out-of-Warranty</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Ticket Status:</label>
              <select
                value={ticketStatus}
                onChange={(e) => setTicketStatus(e.target.value)}
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              >
                <option value="">Please select</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Complete</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Engineer Name (Required):</label>
              <select
                value={engineerId}
                onChange={(e) => setEngineerId(e.target.value)}
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              >
                <option value="">Please select</option>
                {engineers.map(engineer => (
                  <option key={engineer._id} value={engineer._id}>
                    {engineer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="text-center mt-2">
          <button onClick={handleSubmit} className="bg-blue-500 text-white font-bold py-1 px-3 rounded">
            Submit Report
          </button>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-4 text-center">Ticket Closed</h2>
              <p>The ticket has been successfully closed.</p>
              <button
                onClick={handleClosePopup}
                className="bg-blue-500 text-white font-bold py-1 px-3 rounded mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsModal;

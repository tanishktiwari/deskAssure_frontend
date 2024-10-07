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
  const [ticketDetails, setTicketDetails] = useState(null); // New state to hold ticket details

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
      setTicketDetails(ticket); // Set ticket details directly from props
    } else {
      const storedTicketId = localStorage.getItem('selectedTicketId');
      if (storedTicketId) {
        const fetchTicketDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:5174/ticket-details/${storedTicketId}`);
            setTicketDetails(response.data); // Update ticketDetails with API response

            // Populate fields with fetched ticket data
            setTicketId(response.data.ticketId);
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

  const handleSubmit = async () => {
  try {
    const reportData = {
      resolution,
      preventiveAction,
      warrantyCategory,
      engineerId,
      // Add closeDate and closeTime derived from currentDateTime
      closeDate: currentDateTime.toLocaleDateString('en-US'), // Format as MM/DD/YYYY
      closeTime: currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) // Format as hh:mm AM/PM
    };

    const idToUse = ticket ? ticket.ticketId : ticketId;

    if (ticketStatus === 'Complete') {
      // Send a request to close the ticket
      await axios.put(`http://localhost:5174/tickets/close/${idToUse}`, {
        closeDate: reportData.closeDate,
        closeTime: reportData.closeTime,
      });

      // Send WhatsApp message
      const messageData = {
        to: `+91${ticketDetails?.contactNumber}`,
        name: ticketDetails?.name,
        ticketId: idToUse,
        engineerName: engineers.find(engineer => engineer._id === engineerId)?.name || 'Engineer',
        eta: 'N/A' // Since we're closing the ticket, ETA might not be relevant
      };

      await axios.post('http://localhost:5174/send-close-whatsapp-message', messageData);
      console.log('Close WhatsApp message sent');

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl mx-2 overflow-hidden relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          &times;
        </button>

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
                value={ticketDetails?.name || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Contact Number:</label>
              <input
                type="text"
                value={ticketDetails?.contactNumber || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Email ID:</label>
              <input
                type="email"
                value={ticketDetails?.email || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Company Name:</label>
              <input
                type="text"
                value={ticketDetails?.companyName || ''}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Issue Category:</label>
              <input
                type="text"
                value={ticketDetails?.issueCategory || 'N/A'}
                readOnly
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Issue Description:</label>
              <textarea
                value={ticketDetails?.issueDescription || ''}
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
              <label className="block text-gray-700">Engineer:</label>
              <select
                value={engineerId}
                onChange={(e) => setEngineerId(e.target.value)}
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              >
                <option value="">Select Engineer</option>
                {engineers.map(engineer => (
                  <option key={engineer._id} value={engineer._id}>
                    {engineer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Ticket Status:</label>
              <select
                value={ticketStatus}
                onChange={(e) => setTicketStatus(e.target.value)}
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded"
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
            <div className="bg-white rounded-lg shadow-lg p-4 w-80 text-center">
              <h3 className="text-lg font-bold mb-2">Success</h3>
              <p>Ticket has been closed successfully!</p>
              <button
                onClick={handleClosePopup}
                className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-200 mt-2"
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios'; // Import axios

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [openTickets, setOpenTickets] = useState(0); // Initialize with zero
  const [closedTickets, setClosedTickets] = useState(0); // Initialize closed tickets count
  const [operatorName, setOperatorName] = useState(''); // State for operator name
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const mobileNumber = localStorage.getItem('loggedInUserMobileNumber');
    console.log('Mobile Number:', mobileNumber); // Debugging

    if (mobileNumber) {
      const fetchTicketsAndOperator = async () => {
        try {
          // Fetch operator name
          const operatorResponse = await axios.get(`http://localhost:5174/api/operators/name/${mobileNumber}`);
          setOperatorName(operatorResponse.data.operatorName || 'User'); // Update operator name or fallback to 'User'

          // Fetch open tickets
          const openResponse = await axios.get(`http://localhost:5174/tickets/mobile/${mobileNumber}`);
          setOpenTickets(openResponse.data.length); // Update openTickets directly

          // Fetch closed tickets
          const closedResponse = await axios.get(`http://localhost:5174/tickets/mobile/${mobileNumber}/closed`);
          setClosedTickets(closedResponse.data.length); // Update closedTickets directly

          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data.');
          setLoading(false);
        }
      };

      fetchTicketsAndOperator();
    } else {
      console.error('No mobile number found in local storage.');
      setLoading(false);
    }
  }, []);

  const handleCreateTicketClick = () => {
    navigate('/dashboard/create-ticket'); // Redirect to CreateTicket component
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center pt-0">
      {/* Welcome Message */}
      <div className="mb-8 ml-20 pl-20 pt-0 mt-0">
        <h1 className="text-2xl font-bold">Welcome {operatorName}</h1>
        <p className="mt-2 text-lg">
          Generate Service Tickets, periodic Auditable Performance Reports and get instant updates on your opened tickets with TICKET by Foxnet.
        </p>
      </div>

      {/* Ticket Status Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
        {/* Open Tickets */}
        <div className="bg-green-300 p-6 m-6 rounded-lg shadow-xl">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Open Tickets</h3>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <p className="text-3xl font-bold text-gray-900 text-center">{openTickets}</p> // Update here
          )}
        </div>

        {/* Closed Tickets */}
        <div className="bg-red-300 p-6 m-6 rounded-lg shadow-xl">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Closed Tickets</h3>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <p className="text-3xl font-bold text-gray-900 text-center">{closedTickets}</p>
          )}
        </div>

        {/* Create Ticket Button */}
        <div className="bg-blue-300 p-6 m-6 rounded-lg shadow-xl flex items-center justify-center">
          <button
            onClick={handleCreateTicketClick} // Handle button click
            className="text-black text-center font-bold text-xl py-2 px-4 rounded hover:bg-yellow-200"
          >
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

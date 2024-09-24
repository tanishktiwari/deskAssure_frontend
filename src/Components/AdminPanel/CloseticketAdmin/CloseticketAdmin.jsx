import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const CloseticketAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [etas, setEtas] = useState({}); // State to store ETAs

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Fetch closed tickets
      const response = await axios.get('http://localhost:5174/tickets/closed');
      setTickets(response.data);
      fetchEtas(response.data); // Fetch ETAs for the tickets
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEtas = async (tickets) => {
    const etasMap = {};
    for (const ticket of tickets) {
      try {
        const response = await axios.get(`http://localhost:5174/tickets/eta/${ticket.ticketNo}`);
        etasMap[ticket.ticketNo] = response.data.eta.totalHours; // Store total hours in the map
      } catch (error) {
        console.error('Error fetching ETA:', error);
        etasMap[ticket.ticketNo] = 'N/A'; // Fallback in case of error
      }
    }
    setEtas(etasMap);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenModal = async (ticket) => {
    try {
      const response = await axios.get(`http://localhost:5174/ticket-details/${ticket.ticketNo}`);
      setSelectedTicket(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setError('Failed to fetch ticket details.');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTicket(null);
    fetchTickets(); // Refresh tickets after closing modal
  };

  return (
    <div className="flex flex-col mt-20 ml-44 h-full w-[88%]">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 mt-4">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow rounded-lg">
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : error ? (
              <p className="text-center py-4 text-red-500">{error}</p>
            ) : tickets.length === 0 ? (
              <p className="text-center py-4">No closed tickets found.</p>
            ) : (
              <>
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-400 text-white">
                    <tr>
                      <th className="px-4 py-2">#</th>
                      <th className="px-4 py-2">Ticket No.</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Company Name</th>
                      <th className="px-4 py-2">Issue Category</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">ETA (Hours)</th> {/* New ETA column */}
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="whitespace-nowrap px-4 py-2 font-medium">{index + 1}</td>
                        <td className="whitespace-nowrap px-4 py-2">{ticket.ticketNo || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2">{ticket.name || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2">{ticket.companyName || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2">{ticket.issueCategory || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2">{ticket.date || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2">{etas[ticket.ticketNo] || 'N/A'}</td> {/* Display ETA */}
                        <td className="whitespace-nowrap px-4 py-2">
                          <div className="flex space-x-2">
                            <FontAwesomeIcon icon={faEye} className="cursor-pointer text-blue-600" title="View" onClick={() => handleOpenModal(ticket)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloseticketAdmin;

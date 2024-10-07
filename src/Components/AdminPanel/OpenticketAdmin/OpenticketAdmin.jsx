import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faComments, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import TicketDetailsModal from './TicketDetailsModal';
import AssignTicketModal from './AssignTicketModal';

const OpenticketAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false); // State for AssignModal

  const handleOpenAssignModal = (ticket) => {
  setSelectedTicket(ticket); // Set the selected ticket
  setAssignModalOpen(true); // Open the assign modal
};


  const handleCloseAssignModal = () => {
    setAssignModalOpen(false); // Close the assign modal
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5174/tickets/open');
      setTickets(response.data);

      // Store ticket numbers in local storage
      const ticketNumbers = response.data.map(ticket => ticket.ticketNo);
      localStorage.setItem('ticketNumbers', JSON.stringify(ticketNumbers));
      console.log('Stored ticket numbers:', ticketNumbers); // Log the ticket numbers

    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenModal = async (ticket) => {
    try {
      const response = await axios.get(`http://localhost:5174/ticket-details/${ticket.ticketNo}`);
      setSelectedTicket(response.data);
      localStorage.setItem('selectedTicketId', response.data.ticketId); // Store ticket ID
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setError('Failed to fetch ticket details.');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTicket(null);
    localStorage.removeItem('selectedTicketId'); // Clear ticket ID from local storage
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
              <p className="text-center py-4">No open tickets found.</p>
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
                        <td className="whitespace-nowrap px-4 py-2">
                          <div className="flex space-x-2">
                            <FontAwesomeIcon icon={faEye} className="cursor-pointer text-blue-600" title="View" onClick={() => handleOpenModal(ticket)} />
                            <FontAwesomeIcon icon={faComments} className="cursor-pointer text-green-600" title="Chat" />
                            <FontAwesomeIcon icon={faUserPlus} className="cursor-pointer text-yellow-600" title="Assign" onClick={() => handleOpenAssignModal(ticket)} />
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

      <TicketDetailsModal isOpen={modalOpen} onClose={handleCloseModal} ticket={selectedTicket} />
      <AssignTicketModal isOpen={assignModalOpen} onClose={handleCloseAssignModal} ticket={selectedTicket} /> {/* Include AssignTicketModal */}
    </div>
  );
};

export default OpenticketAdmin;

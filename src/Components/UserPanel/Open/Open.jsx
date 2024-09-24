import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Open = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Number of rows per page
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const mobileNumber = localStorage.getItem('loggedInUserMobileNumber');
    console.log('Mobile Number:', mobileNumber); // Debugging
    if (mobileNumber) {
      const fetchTickets = async () => {
        try {
          const response = await axios.get(`http://localhost:5174/tickets/mobile/${mobileNumber}`);
          setTickets(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching tickets:', error);
          setError('Failed to fetch tickets.');
          setLoading(false);
        }
      };

      fetchTickets();
    } else {
      console.error('No mobile number found in local storage.');
      setLoading(false);
    }
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredTickets = tickets.filter(ticket => {
    const ticketNo = ticket.ticketNo ? ticket.ticketNo.toLowerCase() : '';
    const issueCategory = ticket.issueCategory ? ticket.issueCategory.toLowerCase() : '';
    const createdDate = ticket.createdDate ? new Date(ticket.createdDate).toLocaleDateString().toLowerCase() : '';
    const eta = ticket.eta ? ticket.eta.toLowerCase() : '';
    const query = searchQuery.toLowerCase();
    return (
      ticketNo.includes(query) ||
      issueCategory.includes(query) ||
      createdDate.includes(query) ||
      eta.includes(query)
    );
  });

  // Calculate the current rows to display
  const indexOfLastTicket = currentPage * rowsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - rowsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  // Pagination handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Determine total pages
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);

  return (
    <div className="flex flex-col mt-20 ml-44 h-full w-[88%]">
      <div className="flex justify-between items-center bg-slate-200 h-20">
        <h1 className="text-2xl font-semibold text-gray-900 ml-20 pl-20">Open Ticket</h1>
        <input
          type="text"
          placeholder="Search...."
          value={searchQuery}
          onChange={handleSearch}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md w-1/6 mr-10 text-center"
        />
      </div>

      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : error ? (
              <p className="text-center py-4">{error}</p>
            ) : filteredTickets.length === 0 ? (
              <p className="text-center py-4">No tickets match your search criteria.</p>
            ) : (
              <>
                <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                  <thead className="border-b border-neutral-200 bg-gray-400 font-medium dark:border-white/10 dark:bg-body-dark">
                    <tr>
                      <th scope="col" className="px-2 py-2">#</th>
                      <th scope="col" className="px-2 py-2">Ticket no.</th>
                      <th scope="col" className="px-4 py-2">Issue Category</th>
                      <th scope="col" className="px-4 py-2">Created Date</th>
                      <th scope="col" className="px-4 py-2">ETA</th>
                      <th scope="col" className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.map((ticket, index) => (
                      <tr key={index} className="border-b border-neutral-200 bg-black/[0.02] dark:border-white/10">
                        <td className="whitespace-nowrap px-2 py-2 font-medium">{index + 1 + indexOfFirstTicket}</td>
                        <td className="whitespace-nowrap px-2 py-2">{ticket.ticketNo || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2">{ticket.issueCategory || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2">{ticket.createdDate ? new Date(ticket.createdDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2">{ticket.eta || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2">View</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                  <button
                    className="px-4 py-2 mx-1 bg-gray-300 text-black rounded"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} rounded`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="px-4 py-2 mx-1 bg-gray-300 text-black rounded"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Open;

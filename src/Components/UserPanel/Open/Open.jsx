import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopUpForm from './PopUpForm';

const Open = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [initialsMap, setInitialsMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [etaData, setEtaData] = useState({});

  const mobileNumbers = localStorage.getItem('loggedInUserMobileNumber');

  useEffect(() => {
    const mobileNumber = localStorage.getItem('loggedInUserMobileNumber');
    if (mobileNumber) {
      const fetchTickets = async () => {
        try {
          const response = await axios.get(`http://localhost:5174/tickets/mobile/${mobileNumber}`);
          setTickets(response.data);
          await fetchInitials(response.data);
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch tickets.');
          setLoading(false);
        }
      };

      fetchTickets();

      const intervalId = setInterval(() => {
        fetchEtaData(mobileNumber);
      }, 0);

      return () => clearInterval(intervalId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchEtaData = async (mobileNumber) => {
    try {
      const response = await axios.get(`http://localhost:5174/currentETA/${mobileNumber}`);
      if (response.data && Array.isArray(response.data.tickets)) {
        const etaData = response.data.tickets.reduce((acc, ticket) => {
          acc[ticket.createdDate] = ticket.timeDifference;
          return acc;
        }, {});
        
        setEtaData(etaData);
      } else {
        console.error("Tickets data is not an array or is undefined.");
      }
    } catch (error) {
      console.error("Error fetching ETA data:", error);
    }
  };

  const fetchInitials = async (tickets) => {
    const initialsPromises = tickets.map(async (ticket) => {
      try {
        const response = await axios.get(`/operators/initials-two/${ticket.mobile}`);
        return { mobile: ticket.mobile, initials: response.data.initials };
      } catch (error) {
        console.error('Error fetching initials:', error);
        return { mobile: ticket.mobile, initials: 'N/A' };
      }
    });

    const initialsArray = await Promise.all(initialsPromises);
    const initialsMap = initialsArray.reduce((acc, { mobile, initials }) => {
      acc[mobile] = initials;
      return acc;
    }, {});

    setInitialsMap(initialsMap);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredTickets = tickets.filter(ticket => {
    const ticketNo = ticket.ticketNo ? ticket.ticketNo.toLowerCase() : '';
    const issueCategory = ticket.issueCategory ? ticket.issueCategory.toLowerCase() : '';
    const createdDate = ticket.createdDate ? new Date(ticket.createdDate).toLocaleDateString().toLowerCase() : '';
    const query = searchQuery.toLowerCase();
    return (
      ticketNo.includes(query) ||
      issueCategory.includes(query) ||
      createdDate.includes(query)
    );
  });

  const totalEntries = filteredTickets.length;
  const indexOfLastTicket = currentPage * rowsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - rowsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(totalEntries / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCheckboxChange = (ticketNo) => {
    const updatedSelectedTickets = new Set(selectedTickets);
    if (updatedSelectedTickets.has(ticketNo)) {
      updatedSelectedTickets.delete(ticketNo);
    } else {
      updatedSelectedTickets.add(ticketNo);
    }
    setSelectedTickets(updatedSelectedTickets);
  };

  function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    let dateString = date.toLocaleDateString('en-GB', options);
    const [day, month, year] = dateString.split(' ');
    return `${day} ${month.slice(0, 3)} ${year}`;
  }

  const getEtaBackgroundColor = (days) => {
    if (days >= 0 && days < 2) return 'bg-green-100';
    if (days >= 2 && days < 4) return 'bg-yellow-100';
    if (days >= 4) return 'bg-red-400';
    return '';
  };

  const handleDownload = (ticketNo, type) => {
    // Implement download logic here
    console.log(`Downloading ticket ${ticketNo} as ${type}`);
  };

  return (
    <div className="flex flex-col mt-20 ml-32 h-full w-[88%]">
      <div className="flex justify-between items-center bg-white h-20">
        <div className="flex items-center mb-4">
          <span
            style={{
              fontFamily: 'Roboto',
              fontSize: '18px',
              fontWeight: '400',
              lineHeight: '28px',
              textAlign: 'left',
              color: '#343A40',
            }}
            className='mt-2'
          >
            All ({totalEntries})
          </span>
          <img
            src="/arrow.png"
            alt="Arrow"
            className="ml-0 h-8 w-8 mt-2"
          />
        </div>
        <button
          style={{
            width: '250px',
            height: '40px',
            top: '94px',
            left: '320px',
            padding: '7px 15px',
            gap: '10px',
            background: '#17C247',
            boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.1)',
            position: 'absolute',
          }} className='mt-7 rounded-2xl text-white text-lg'
        >
          CREATE NEW TICKET +
        </button>
        <div className='flex flex-row gap-3 mr-3'>
          <img
            src="/search.png"
            alt="Search Icon"
            className='h-7 w-7'
            onClick={handleSearch}
          />
          <img src="/setting.png" alt="setting_icon" className='h-7 w-7'/>
          <img src="/filter.png" alt="filter_icon" className='h-7 w-7'/>
        </div>
      </div>

      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : error ? (
              <p className="text-center py-4">{error}</p>
            ) : totalEntries === 0 ? (
              <p className="text-center py-4">No tickets match your search criteria.</p>
            ) : (
              <>
                <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                  <thead className="border-b border-neutral-200 bg-white font-medium dark:border-white/10 dark:bg-body-dark">
                    <tr>
                      <th scope="col" className="px-2 py-2">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              const allTicketNos = new Set(currentTickets.map(ticket => ticket.ticketNo));
                              setSelectedTickets(allTicketNos);
                            } else {
                              setSelectedTickets(new Set());
                            }
                          }}
                        />
                      </th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">Ticket No.</th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">Date</th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">Time</th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">Category</th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">Issue Description</th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">ETA</th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">Preview</th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">Chat</th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">Download</th>
                      <th scope="col" className="px-4 py-2 font-roboto text-[#343A40] text-[14px] font-[700] leading-[22px] text-left">Track</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.map((ticket) => {
                      const eta = etaData[ticket.createdDate] || { days: 0 };
                      const etaBackgroundColor = getEtaBackgroundColor(eta.days);
                      return (
                        <tr key={ticket.ticketNo} className="border-b border-neutral-200 bg-white transition duration-300 ease-in-out hover:bg-neutral-100">
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900">
                            <input
                              type="checkbox"
                              checked={selectedTickets.has(ticket.ticketNo)}
                              onChange={() => handleCheckboxChange(ticket.ticketNo)}
                            />
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900 text-center">{ticket.ticketNo}</td>
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900 text-center">{formatDate(new Date(ticket.createdDate))}</td>
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900 text-center">{ticket.time}</td>
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900 text-center">{ticket.issueCategory}</td>
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900 text-center">{ticket.issueDescription}</td>
                          <td className={`whitespace-nowrap px-2 py-2 font-medium text-neutral-900 text-center ${etaBackgroundColor}`}>
                            {`${eta.days} days`}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900">
                            <div className='flex justify-center cursor-pointer'>
                              <img
                                src="/preview.png"
                                alt="Preview"
                                className="cursor-pointer h-6 w-6"
                                onClick={() => {
                                  console.log("Clicked ticket ID:", ticket.ticketNo);
                                  setSelectedTicketId(ticket.ticketNo);
                                  setIsModalOpen(true);
                                }}
                              />
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900">
                            <div className='flex justify-center'>
                              <img src="/chat.png" alt="chat" className='h-7 w-7' />
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900">
                            <div className="flex justify-center items-center gap-2">
                              <img
                                src="/excel.png"
                                alt="Excel"
                                className="h-6 w-6 cursor-pointer"
                                onClick={() => handleDownload(ticket.ticketNo, 'excel')}
                              />
                              <img
                                src="/pdf.png"
                                alt="PDF"
                                className="h-6 w-6 cursor-pointer"
                                onClick={() => handleDownload(ticket.ticketNo, 'pdf')}
                              />
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-900">
                            <div className='flex justify-center'>
                              <img src="/track.png" alt="" className='h-7 w-7' />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {isModalOpen && <PopUpForm ticketId={selectedTicketId} onClose={() => setIsModalOpen(false)} ticketNumber={selectedTicketId} />}
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span>
                      Showing {currentPage} of {totalPages} pages
                    </span>
                  </div>
                  <div className="flex items-center ml-20 gap-3">
                    <div className='bg-[#DFDFDF] w-[30px] h-[30px] flex items-center justify-center'>
                      <img
                        src="/left.png"
                        alt="Left Arrow"
                        className="cursor-pointer h-[30px]"
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                      />
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`w-[30px] h-[30px] rounded-l-[2px] cursor-pointer ${currentPage === index + 1 ? 'bg-[#DC3545] text-white' : 'bg-[#DFDFDF]'}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <div className='bg-[#DFDFDF] w-[30px] h-[30px] flex items-center justify-center'>
                      <img
                        src="/right.png"
                        alt="Right Arrow"
                        className="cursor-pointer h-[30px]"
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                      />
                    </div>
                  </div>
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

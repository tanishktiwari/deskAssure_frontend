import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx'; // Import the xlsx library

const Close = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [etas, setEtas] = useState({});

  useEffect(() => {
    const mobileNumber = localStorage.getItem('loggedInUserMobileNumber');
    if (mobileNumber) {
      const fetchTickets = async () => {
        try {
          const response = await axios.get(`http://localhost:5174/tickets/mobile/${mobileNumber}/closed`);
          setTickets(response.data);
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch tickets.');
          setLoading(false);
        }
      };

      fetchTickets();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchETAs = async () => {
      const mobileNumber = localStorage.getItem('loggedInUserMobileNumber');
      if (mobileNumber) {
        try {
          const response = await axios.get(`http://localhost:5174/tickets/eta/mobile/${mobileNumber}`);
          const etaResults = {};
          response.data.etas.forEach(eta => {
            etaResults[eta.ticketNo] = eta.eta;
          });
          setEtas(etaResults);
        } catch (error) {
          setError('Failed to fetch ETAs.');
        }
      }
    };

    fetchETAs();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add invoice title
    doc.setFontSize(16);
    doc.text('Purchase Invoice', 105, 20, null, null, 'center');

    // Add invoice number and date
    doc.setFontSize(12);
    doc.text(`Invoice No # A00030`, 14, 30);
    doc.text(`Invoice Date: Sep 12, 2024`, 150, 30);

    // Billed By section
    doc.text('Billed By', 14, 40);
    doc.setFontSize(10);
    doc.text('Cadabra Secure (India)', 14, 45);
    doc.text('3RD FLOOR, PLOT NO. 94, NEAR RADISSON BLU, SECTOR 13', 14, 50);
    doc.text('DWARKA, DELHI 110078, Delhi, India', 14, 55);
    doc.text('GSTIN: 07AAJCC9495R1ZH', 14, 60);
    doc.text('PAN: AAJCC9495R', 14, 65);

    // Billed To section
    doc.setFontSize(12);
    doc.text('Billed To', 14, 75);
    doc.setFontSize(10);
    doc.text('Jyoti Co Trading', 14, 80);
    doc.text('B17 F103 Shalimar Bagh EX2 Sahibabad, Ghaziabad', 14, 85);
    doc.text('Uttar Pradesh, India', 14, 90);
    doc.text('GSTIN: 09GIAPS0139A1ZK', 14, 95);
    doc.text('PAN: GIAPS0139A', 14, 100);

    // Add item table header
    doc.setFontSize(12);
    doc.text('Item', 14, 110);
    doc.text('GST Rate', 70, 110);
    doc.text('Quantity', 100, 110);
    doc.text('Rate', 130, 110);
    doc.text('Amount', 160, 110);
    doc.text('IGST', 190, 110);
    doc.text('Total', 220, 110);

    // Add item details (example)
    doc.setFontSize(10);
    doc.text('Camera', 14, 120);
    doc.text('18%', 70, 120);
    doc.text('1', 100, 120);
    doc.text('₹1,568.00', 130, 120);
    doc.text('₹1,568.00', 160, 120);
    doc.text('₹282.24', 190, 120);
    doc.text('₹1,850.24', 220, 120);

    // Add total in words
    doc.text('Total (in words): ONE THOUSAND EIGHT HUNDRED FIFTY RUPEES AND TWENTY FOUR PAISE ONLY', 14, 140);

    // Add bank details
    doc.setFontSize(12);
    doc.text('Bank Details', 14, 160);
    doc.setFontSize(10);
    doc.text('Account Name: CADABRA SECURE PRIVATE LIMITED', 14, 165);
    doc.text('Account Number: 166483685001', 14, 170);
    doc.text('IFSC: HSBC0110002', 14, 175);
    doc.text('SWIFT Code: HSBCINBB', 14, 180);
    doc.text('Bank: HSBC Bank', 14, 185);

    // Save the PDF
    doc.save('closed_tickets.pdf');
  };

  const downloadExcel = () => {
    const worksheetData = tickets.map(ticket => ({
      'Ticket no.': ticket.ticketNo || 'N/A',
      'Issue Category': ticket.issueCategory || 'N/A',
      'Created Date': ticket.createdDate ? new Date(ticket.createdDate).toLocaleDateString() : 'N/A',
      'ETA': etas[ticket.ticketNo] !== undefined ? `${etas[ticket.ticketNo]} hours` : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Closed Tickets');

    // Export Excel file
    XLSX.writeFile(workbook, 'closed_tickets.xlsx');
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

  const indexOfLastTicket = currentPage * rowsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - rowsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);

  return (
    <div className="flex flex-col mt-20 ml-44 h-full w-[88%]">
      <div className="flex justify-between items-center bg-slate-200 h-20">
        <h1 className="text-2xl font-semibold text-gray-900 ml-20 pl-20">Closed Tickets</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search...."
            value={searchQuery}
            onChange={handleSearch}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md w-2/6 mr-10 text-center"
          />
          <button
            onClick={generatePDF}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
            Download PDF
          </button>
          <button
            onClick={downloadExcel}  // New button to download Excel sheet
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md ml-2">
            Download Excel
          </button>
        </div>
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
                        <td className="whitespace-nowrap px-4 py-2">
                          {etas[ticket.ticketNo] !== undefined ? 
                            `${etas[ticket.ticketNo]} hours` : 
                            'N/A'}
                        </td>
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

export default Close;

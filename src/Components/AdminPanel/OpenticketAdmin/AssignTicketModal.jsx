import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignTicketModal = ({ isOpen, onClose, ticket }) => {
  const [assignedUser, setAssignedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [ticketMobile, setTicketMobile] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5174/engineers/names-and-mobile');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchMobileNumber = async () => {
      if (ticket) {
        try {
          const response = await axios.get(`http://localhost:5174/ticket-details/${ticket.ticketNo}`);
          console.log(`Mobile number for ticket ${ticket.ticketNo}:`, response.data.contactNumber);
          setTicketMobile(response.data.contactNumber);
        } catch (error) {
          console.error('Error fetching mobile number:', error);
        }
      }
    };

    if (isOpen) {
      fetchUsers();
      fetchMobileNumber();
    }
  }, [isOpen, ticket]);

  const handleAssignChange = (e) => {
    setAssignedUser(e.target.value);
  };

 const handleAssignSubmit = async () => {
  if (!assignedUser) {
    alert('Please select an engineer to assign the ticket.');
    return;
  }

  const selectedUser = users.find(user => user.name === assignedUser);
  
  if (!selectedUser) {
    console.error('Selected user not found.');
    return;
  }

  // Prepend +91 to the ticket's mobile number for sending the message
  const mobileToSendMessage = `+91${ticketMobile}`;

  const messageData = {
    to: mobileToSendMessage, // Send to the ticket's mobile number with +91
    name: ticket.name, // Use ticket.name instead of assignedUser
    ticketId: ticket.ticketNo,
    engineerName: selectedUser.name, // Use selectedUser's name
    engineerMobile: `+91${selectedUser.mobile}`, // Include engineer's mobile with +91
    username: ticket.username, // Keep the username in case it's needed
  };

  // Log the number to which the message is being sent
  console.log(`Sending message to: ${mobileToSendMessage}`);

  try {
    const response = await axios.post('http://localhost:5174/send-inprogress-whatsapp-message', messageData);
    console.log(`Ticket ${ticket.ticketNo} assigned to ${assignedUser}`);
    console.log(`Engineer Name: ${selectedUser.name}, Mobile: +91${selectedUser.mobile}`);
    console.log('In-progress WhatsApp message sent:', response.data);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message);
  }

  onClose();
};






  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-1/2">
        <h2 className="text-lg font-semibold">Assign Ticket</h2>
        {ticket && (
          <div className="mb-4">
            <p><strong>Ticket No:</strong> {ticket.ticketNo}</p>
            <p><strong>Name:</strong> {ticket.name}</p>
            <p><strong>Company:</strong> {ticket.companyName}</p>
            <p><strong>Issue:</strong> {ticket.issueCategory}</p>
            <p><strong>Mobile Number:</strong> {ticketMobile}</p>
          </div>
        )}
        
        <table className="min-w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Mobile Number</th>
              <th className="px-4 py-2">Assign</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.mobile}</td>
                  <td className="px-4 py-2">
                    <input
                      type="radio"
                      name="assignUser"
                      value={user.name}
                      checked={assignedUser === user.name}
                      onChange={handleAssignChange}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-2">Loading users...</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAssignSubmit}>
            Assign
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded ml-2" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTicketModal;

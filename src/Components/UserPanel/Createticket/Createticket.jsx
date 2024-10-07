import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Createticket/CreateTicket.css"; // Custom styles

const CreateTicket = () => {
  const [issueCategories, setIssueCategories] = useState([]);
  const [initials, setInitials] = useState('');
  const [companyNames, setCompanyNames] = useState([]);
  const [operatorData, setOperatorData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    issueCategory: '',
    companyName: '',
    image: null,
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  });
  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const fetchIssueCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5174/issue-categories');
        setIssueCategories(response.data);
      } catch (error) {
        console.error('Error fetching issue categories:', error);
      }
    };

    const fetchCompanyNames = async () => {
      try {
        const response = await axios.get('http://localhost:5174/companies');
        setCompanyNames(response.data);
      } catch (error) {
        console.error('Error fetching company names:', error);
      }
    };

    fetchIssueCategories();
    fetchCompanyNames();
  }, []);
  useEffect(() => {
  const timer = setInterval(() => {
    setDateTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const generateTicketNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const latestTicketNumber = localStorage.getItem('latestTicketNumber') || '000';
      const newTicketNumber = String(parseInt(latestTicketNumber) + 1).padStart(3, '0');
      localStorage.setItem('latestTicketNumber', newTicketNumber);
      return `FS${year}${month}${day}${newTicketNumber}`;
    };

    setTicketNumber(generateTicketNumber());
  }, []);

  useEffect(() => {
    let timerInterval;
    if (showSuccessPopup) {
      timerInterval = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            clearInterval(timerInterval);
            navigate('/dashboard/home');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [showSuccessPopup, navigate]);

  useEffect(() => {
  const mobileNumber = localStorage.getItem('loggedInUserMobileNumber');
  if (mobileNumber) {
    const fetchOperatorData = async () => {
      try {
        const response = await axios.get(`http://localhost:5174/operators/mobile/${mobileNumber}`);
        setOperatorData(response.data);
        
        if (response.data) {
          setFormData(prevState => ({
            ...prevState,
            name: response.data.operatorName,
            number: response.data.contactNumber || mobileNumber,
            email: response.data.email,
            companyName: response.data.companyName || '',
          }));

          // Determine which API to call based on operatorName
          const names = response.data.operatorName.split(' ');
          let initialsApiUrl;

          if (names.length > 1) {
            // Both first and last name
            initialsApiUrl = `http://localhost:5174/operators/initials/${mobileNumber}`;
          } else {
            // Only first name
            initialsApiUrl = `http://localhost:5174/operators/initials-two/${mobileNumber}`;
          }

          // Fetch initials
          const initialsResponse = await axios.get(initialsApiUrl);
          setInitials(initialsResponse.data.initials); // Store initials in state
        }
      } catch (error) {
        console.error('Error fetching operator data:', error);
      }
    };

    fetchOperatorData();
  } else {
    console.error('No mobile number found in local storage.');
  }
}, []);


  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prevErrors => ({
        ...prevErrors,
        image: 'Image size must be less than 5MB.',
      }));
      setFormData(prevState => ({ ...prevState, image: null })); // Clear the file input
    } else {
      setErrors(prevErrors => ({ ...prevErrors, image: '' })); // Clear any previous error
      setFormData(prevState => ({ ...prevState, image: file }));
    }
  }
};
const formatDateTime = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  // Get hours, minutes, and seconds
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  // Return date and time in one line
  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`; // Format: DD Month YYYY, HH:MM:SS
};


  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }
    if (!formData.number) {
      newErrors.number = 'Number is required.';
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    }
    if (!formData.issueCategory) {
      newErrors.issueCategory = 'Issue Category is required.';
      isValid = false;
    }
    if (!formData.companyName) {
      newErrors.companyName = 'Company Name is required.';
      isValid = false;
    }
    // if (!formData.image) {
    //   newErrors.image = 'Image upload is required.';
    //   isValid = false;
    // }
    if (!formData.date) {
      newErrors.date = 'Date is required.';
      isValid = false;
    }
    if (!formData.time) {
      newErrors.time = 'Time is required.';
      isValid = false;
    }
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
    newErrors.image = 'Image size must be less than 5MB.';
    isValid = false;
  }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  if (validateForm()) {
    const ticketData = new FormData();
    ticketData.append('name', formData.name);
    ticketData.append('contactNumber', formData.number);
    ticketData.append('email', formData.email);

    // Find the ObjectId for the selected issue category
    const selectedCategory = issueCategories.find(category => category.name === formData.issueCategory);
    if (selectedCategory) {
      ticketData.append('issueCategory', selectedCategory._id); // Use ObjectId here
    } else {
      console.error('Selected issue category not found');
      return;
    }

    ticketData.append('companyName', formData.companyName);
    ticketData.append('description', formData.description);
    ticketData.append('date', formData.date);
    ticketData.append('time', formData.time);
    ticketData.append('ticketNumber', ticketNumber);
    if (formData.image) {
      ticketData.append('image', formData.image);
    }

    try {
      const response = await axios.post('http://localhost:5174/submit-ticket', ticketData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Ticket submitted successfully:', response.data);

      // Prepare data for sending email
      const emailResponse = await axios.post('http://localhost:5174/send-email', {
        recipientEmail: formData.email,
        ticketId: ticketNumber,
        issueCategory: formData.issueCategory,
        issueDescription: formData.description,
        firstName: formData.name
      });

      console.log('Email sent successfully:', emailResponse.data.message);

      const { name, number } = formData;
      const ticketId = ticketNumber;
      const formattedNumber = `+91${number}`;

      // Send WhatsApp message
      await sendWhatsAppMessage(formattedNumber, name, ticketId);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error submitting ticket or sending email:', error.response ? error.response.data : error.message);
    }
  }
};


  const sendWhatsAppMessage = async (to, name, ticketId) => {
    try {
      await axios.post('http://localhost:5174/send-whatsapp-message', { to, name, ticketId });
      console.log('WhatsApp message sent successfully');
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message);
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    setTimer(10);
  };

  const handleCancel = () => {
    navigate('/home'); // Redirect to home
  };

  return (
<div className="min-h-screen bg-gray-200 py-6 flex flex-col justify-center sm:py-12 font-sans w-full ml-7 h-full">
  <div className="relative py-3 sm:max-w-xl sm:mx-auto">
    <div className="flex items-center justify-center min-h-screen w-[750px] -ml-[55px]">
      <div className="relative px-4 py-10 bg-gray-100 shadow rounded-3xl sm:p-10 w-[900px] h-1/2"> 
      {/* Updated class */}
         {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="absolute top-0 right-6 text-gray-700 hover:text-red-600 focus:outline-none"
            aria-label="Cancel"
          >
            <span className="text-5xl">&times;</span> {/* "X" icon */}
          </button>
        <div className="max-w-md mx-6 -ml--16 ml-[17%]">
          <div className="flex items-center space-x-5  ">
            <div className="h-6464 w-6464 bg-yellow-200 rounded-full flex justify-center items-center text-yellow-500 text-4xl font-mono">
              {initials || 'i'}
            </div>
            <h2 className="leading-relaxed whitespace-nowrap block pl-0.5 font-bold text-3xl text-gray-700">Create Ticket</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="py-8 text-base leading-6 space-y-2 text-gray-900 sm:text-sm sm:leading-7">
              <div className="flex flex-col hidden">
                <label className="leading-loose">Ticket Number</label>
                <input
                  type="text"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-black bg-customGray"
                  value={ticketNumber}
                  readOnly
                />
              </div>
              <form onSubmit={handleSubmit}>
  <div className="flex flex-col pt-0 h-[80px] mb-8">
    <label className="leading-loose text-fontcolor mb-1818 text-xs">Name</label>
    <input
      type="text"
      id="name"
      value={formData.name}
      onChange={handleInputChange}
      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full h-[80px] sm:text-sm border-gray-300 focus:outline-none text-black bg-customGray"
      required
      readOnly
    />
    {errors.name && <span className="text-red-500">{errors.name}</span>}
  </div>

  <div className="flex flex-col pt-0 h-[80px] mb-8">
    <label className="leading-loose text-fontcolor mb-1818 text-xs">Contact Number</label>
    <input
      type="text"
      id="number"
      value={formData.number}
      onChange={handleInputChange}
      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full h-[80px] sm:text-sm border-gray-300 rounded-md focus:outline-none text-black bg-customGray"
      required
      readOnly
    />
    {errors.number && <span className="text-red-500">{errors.number}</span>}
  </div>

  <div className="flex flex-col pt-0 h-[80px] mb-8">
    <label className="leading-loose text-fontcolor mb-1818 text-xs">Email</label>
    <input
      type="email"
      id="email"
      value={formData.email}
      onChange={handleInputChange}
      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full h-[80px] sm:text-sm border-gray-300 rounded-md focus:outline-none text-black bg-customGray"
      required
      readOnly
    />
    {errors.email && <span className="text-red-500">{errors.email}</span>}
  </div>

  <div className="flex flex-col pt-0 h-[80px] mb-8">
    <label className="leading-loose text-fontcolor mb-1818 text-xs">Company Name</label>
    <input
      type="text"
      id="companyName"
      value={formData.companyName}
      onChange={handleInputChange}
      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full h-[80px] sm:text-sm border-gray-300 rounded-md focus:outline-none text-black bg-customGray"
      required
      readOnly
    />
    {errors.companyName && <span className="text-red-500">{errors.companyName}</span>}
  </div>

  <div className="flex flex-col pt-0 h-[90px] mb-8">
    <label className="leading-loose text-fontcolor mb-1818 text-xs">Select Issue Category</label>
    <select
      id="issueCategory"
      value={formData.issueCategory}
      onChange={handleInputChange}
      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full h-[90px] sm:text-sm border-gray-300 rounded-md focus:outline-none text-black bg-customGray mb-1818 text-xs"
      required
    >
      <option value="">Select an issue</option>
      {issueCategories.map(category => (
        <option key={category._id} value={category.name}>{category.name}</option>
      ))}
    </select>
    {errors.issueCategory && <span className="text-red-500">{errors.issueCategory}</span>}
  </div>

  <div className="flex flex-col pt-0 h-[80px] mb-8">
    <label className="leading-loose text-fontcolor text-xs">Upload Image</label>
    <div className="flex flex-row-reverse">
      <div className="bg-white text-[#333] flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-1 border border-gray-300 rounded-md my-4 mx-auto w-full sm:text-sm h-[50px]">
        <div className="px-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32">
            <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
            <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
          </svg>
          <p className="text-sm ml-2">Upload Attachment</p>
        </div>
        <label htmlFor="uploadImage" className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-2 py-1 rounded-md cursor-pointer ml-auto w-max">Upload</label>
        <input type="file" id='uploadImage' accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>
      {errors.image && <span className="text-red-500">{errors.image}</span>}
    </div>
  </div>

  <div className="flex flex-col pt-0  mb-4">
    <label className="leading-loose text-fontcolor mb-1818 text-xs">Description</label>
    <textarea
      id="description"
      value={formData.description}
      onChange={handleInputChange}
      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full h-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-black bg-customGray"
      rows="4"
    />
  </div>

  <div className="flex flex-col hidden">
    <label className="leading-loose">Date</label>
    <input
      type="date"
      id="date"
      value={formData.date}
      onChange={handleInputChange}
      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 text-base"
      required
    />
    {errors.date && <span className="text-red-500">{errors.date}</span>}
  </div>

  <div className="flex flex-col hidden">
    <label className="leading-loose">Time</label>
    <input
      type="time"
      id="time"
      value={formData.time}
      onChange={handleInputChange}
      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 text-base"
      required
    />
    {errors.time && <span className="text-red-500">{errors.time}</span>}
  </div>

  <div className='calendar-icon'>
    {formatDateTime(dateTime)}
  </div>

  <div className="ticket-icon">
    <span style={{ marginRight: '8px' }} className='text-center'>Your Deskassure ID is</span>
    <strong>{ticketNumber}</strong>
  </div>

  <div className="pt-4 mt-6 flex items-center space-x-36">
    <button
      type="submit"
      className="bg-buttoncolor flex justify-center items-center w-[172px] text-white px-4 py-3 rounded-md focus:outline-none text-[18px] hover:bg-blue-900 ml-36"
    >
      Create
    </button>

  </div>
</form>


              {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded shadow-md">
                    <h3 className="text-lg font-semibold">Success!</h3>
                    <p>Your ticket has been submitted successfully.</p>
                    <p>Redirecting to home in {timer} seconds...</p>
                    <button onClick={closePopup} className="mt-2 text-blue-500">Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default CreateTicket;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Createticket/CreateTicket.css";
import axios from 'axios';

const CreateTicket = () => {
  const [issueCategories, setIssueCategories] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const [operatorData, setOperatorData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    number: '', // Mobile number will be dynamically set
    email: '',
    issueCategory: '',
    companyName: '',
    image: null,
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });
  const [errors, setErrors] = useState({
    name: '',
    number: '',
    email: '',
    issueCategory: '',
    companyName: '',
    image: '',
    date: '',
    time: ''
  });
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [timer, setTimer] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
            navigate('/home');
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
              number: response.data.contactNumber || mobileNumber, // Use fetched or default value
              email: response.data.email,
              companyName: response.data.companyName
            }));
          }
        } catch (error) {
          console.error('Error fetching operator data:', error);
        }
      };

      fetchOperatorData();
    } else {
      console.error('No mobile number found in local storage.');
    }
  }, []); // This useEffect runs once when the component mounts

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleImageChange = (event) => {
    setFormData(prevState => ({ ...prevState, image: event.target.files[0] }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      name: '',
      number: '',
      email: '',
      issueCategory: '',
      companyName: '',
      image: '',
      date: '',
      time: ''
    };

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
    if (!formData.image) {
      newErrors.image = 'Image upload is required.';
      isValid = false;
    }
    if (!formData.date) {
      newErrors.date = 'Date is required.';
      isValid = false;
    }
    if (!formData.time) {
      newErrors.time = 'Time is required.';
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
      ticketData.append('issueCategory', formData.issueCategory);
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
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Ticket submitted successfully:', response.data);
        setShowSuccessPopup(true);
      } catch (error) {
        console.error('Error submitting ticket:', error.response ? error.response.data : error.message);
      }
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    setTimer(10);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8 pt-5">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="p-6 rounded shadow-lg bg-gray-800 text-white text-center py-3 mb-6">
            <h2 className="text-lg font-bold mb-4">Ticket Submitted Successfully</h2>
            <p className="text-lg mb-4">Redirecting in {timer} seconds...</p>
            <button
              onClick={closePopup}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Ticket Header */}
      <div className="w-full bg-gray-800 text-white text-center py-2 mb-6">
        <h1 className="text-lg font-bold">Create Ticket</h1>
      </div>

      {/* Instructions */}
      <p className="text-gray-700 text-center text-lg mb-6 font-bold">
        Answer the questions to generate ticket.
      </p>

      {/* Ticket Number Input */}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="ticketNumber">
            Ticket Number
          </label>
          <input
            type="text"
            id="ticketNumber"
            className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center"
            value={ticketNumber}
            readOnly
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="flex flex-wrap -mx-3 mb-1">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="name">
              What's your name?
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`block w-full bg-gray-200 border ${errors.name ? 'border-red-500' : 'border-gray-200'} text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center`}
            />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="number">
              Contact Number
            </label>
            <input
              type="text"
              id="number"
              value={formData.number}
              onChange={handleInputChange}
              className={`block w-full bg-gray-200 border ${errors.number ? 'border-red-500' : 'border-gray-200'} text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center`}
            />
            {errors.number && <p className="text-red-500 text-xs italic">{errors.number}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-wrap -mx-3 mb-1">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`block w-full bg-gray-200 border ${errors.email ? 'border-red-500' : 'border-gray-200'} text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center`}
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
          </div>
        </div>

        {/* Issue Category */}
        <div className="flex flex-wrap -mx-3 mb-1">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="issueCategory">
              Issue Category
            </label>
            <select
              id="issueCategory"
              className={`block w-full bg-gray-200 border ${errors.issueCategory ? 'border-red-500' : 'border-gray-200'} text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center`}
              value={formData.issueCategory}
              onChange={handleInputChange}
            >
              <option value="">Select Issue Category</option>
              {issueCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.issueCategory && <p className="text-red-500 text-xs italic">{errors.issueCategory}</p>}
          </div>
        </div>

        {/* Company Name */}
        <div className="flex flex-wrap -mx-3 mb-1">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="companyName">
              Company Name
            </label>
            <select
              id="companyName"
              className={`block w-full bg-gray-200 border ${errors.companyName ? 'border-red-500' : 'border-gray-200'} text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center`}
              value={formData.companyName}
              onChange={handleInputChange}
            >
              <option value="">Select Company Name</option>
              {companyNames.map((company) => (
                <option key={company._id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
            {errors.companyName && <p className="text-red-500 text-xs italic">{errors.companyName}</p>}
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-wrap -mx-3 mb-1">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="image">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className={`block w-full bg-gray-200 border ${errors.image ? 'border-red-500' : 'border-gray-200'} text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 `}
            />
            {errors.image && <p className="text-red-500 text-xs italic">{errors.image}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`block w-full bg-gray-200 border ${errors.description ? 'border-red-500' : 'border-gray-200'} text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center`}
            />
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`block w-full bg-gray-200 border ${errors.date ? 'border-red-500' : 'border-gray-200'} text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center`}
            />
            {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="time">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={handleInputChange}
              className={`block w-full bg-gray-200 border ${errors.time ? 'border-red-500' : 'border-gray-200'} text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center`}
            />
            {errors.time && <p className="text-red-500 text-xs italic">{errors.time}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;

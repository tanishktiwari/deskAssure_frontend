import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLoginPage.css';
import axios from 'axios';

// Function to generate a random 4-digit OTP from 1 to 9
const generateOtp = () => {
  let otp = '';
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 9) + 1; // Random number from 1 to 9
  }
  console.log('Generated OTP:', otp);
  return otp;
};

const UserLoginPage = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(''); // OTP will be managed dynamically
  const [enteredOtp, setEnteredOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (event) => {
    event.preventDefault();
    try {
      if (!mobileNumber) {
        setErrorMessage('Please enter your mobile number.');
        return;
      }

      const newOtp = generateOtp(); // Generate new OTP
      setOtp(newOtp); // Set the generated OTP

      console.log('Sending OTP to:', mobileNumber); // Debugging
      const response = await axios.post('http://localhost:5174/send-otp', { mobile_no: mobileNumber, otp: newOtp });

      if (response.status === 200) {
        setIsOtpSent(true);
        setSuccessMessage('OTP sent successfully.');
        setErrorMessage('');
      } else {
        // Handle specific backend error responses
        setErrorMessage(response.data || 'Failed to send OTP. Please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Check if error message is from backend
        setErrorMessage(error.response.data);
      } else {
        // General error handling
        setErrorMessage('Failed to send OTP. Please try again.');
      }
      setSuccessMessage('');
    }
  };

  const handleOtpChange = (event) => {
    setEnteredOtp(event.target.value);
  };

  const handleSubmitOtp = async (event) => {
  event.preventDefault();
  if (enteredOtp === otp) {
    // Store the mobile number in local storage
    localStorage.setItem('loggedInUserMobileNumber', mobileNumber);
    navigate('/dashboard'); // Redirect to the Dashboard
    setSuccessMessage('Login successful!');
    setErrorMessage('');
  } else {
    setErrorMessage('Invalid OTP. Please try again.');
    setSuccessMessage('');
  }
};


  const handleAdminLogin = () => {
    navigate('/admin-login'); // Navigate to the AdminLoginPage
  };

  return (
    <div className="user-login-page">
      <div className="centered-container">
        <div className="form-container">
          <div className="relative h-screen bg-gray-50 overflow-hidden">
            {/* Blob Animation */}
            <div className="absolute top-20 left-2 w-[500px] h-[500px] bg-[#D1208A80] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="hidden xl:block absolute bottom-10 left-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-10 right-52 w-[500px] h-[500px] bg-[#CAEEF580] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 pt-2">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                  className="mx-auto w-auto"
                  src="https://deskassure.com/img/logo.png"
                  alt="Your Company"
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Sign in to your account
                </h2>
                {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
              </div>

              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-2xl">
                <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10 relative z-10">
                  <form className="space-y-6" onSubmit={isOtpSent ? handleSubmitOtp : handleSendOtp}>
                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-pretty font-semibold tracking-tight text-black text-xl pb-2 text-center"
                      >
                        Contact Number
                      </label>
                      <div className="mt-1 relative z-20">
                        <input
                          id="mobile"
                          name="mobile"
                          type="text"
                          placeholder='Please enter your registered mobile number'
                          autoComplete="off"
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="block w-full appearance-none rounded-md border border-gray-800 px-3 py-2 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-center"
                          style={{ backgroundColor: 'inherit' }}
                        />
                      </div>
                    </div>

                    {isOtpSent && (
                      <div>
                        <label
                          htmlFor="OTP"
                          className="block text-pretty font-semibold tracking-tight text-black"
                        >
                          OTP
                        </label>
                        <div className="mt-1 relative z-20">
                          <input
                            id="otp"
                            name="otp"
                            type="number"
                            value={enteredOtp}
                            placeholder='Please enter your one-time password'
                            autoComplete="off"
                            required
                            onChange={handleOtpChange}
                            className="block w-full appearance-none rounded-md border border-gray-800 px-3 py-2 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-center"
                            style={{ backgroundColor: 'inherit' }}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {isOtpSent ? 'Submit OTP' : 'Send OTP'}
                      </button>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={handleAdminLogin}
                        className="flex w-full justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Admin Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage; 
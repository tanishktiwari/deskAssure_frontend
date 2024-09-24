import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminPanel = () => {
  const [email, setEmail] = useState(''); // Pre-fill email
  const [otp, setOtp] = useState('1234'); // Pre-set OTP, will be used later
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP has been sent
  const [enteredOtp, setEnteredOtp] = useState(''); // State to track entered OTP by user
  const navigate = useNavigate(); // Initialize navigate

  // Function to handle OTP sending
  const handleSendOtp = (event) => {
    event.preventDefault();
    if (email) {
      setOtpSent(true); // Set OTP sent status to true to show the OTP field
    }
  };

  // Function to handle Admin login
  const handleAdminLogin = (event) => {
    event.preventDefault();
    if (enteredOtp === otp) {
      // Proceed with login
      navigate('/dashboardadmin'); // Redirect to the admin dashboard
    } else {
      alert('Incorrect OTP');
    }
  };

  return (
    <div className="user-login-page">
      <div className="centered-container">
        <div className="form-container">
          <div className="relative h-screen bg-gray-50 overflow-hidden">
            <div
              className="absolute top-20 left-2 w-[500px] h-[500px] bg-[#D1208A80] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob"
            ></div>
            <div
              className="absolute top-20 right-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-2000"
            ></div>
            <div
              className="hidden xl:block absolute bottom-10 left-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-4000"
            ></div>
            <div
              className="absolute bottom-10 right-52 w-[500px] h-[500px] bg-[#CAEEF580] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-4000"
            ></div>
            <div className="relative z-10 flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 pt-2">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                  className="mx-auto w-auto"
                  src="https://deskassure.com/img/logo.png"
                  alt="Your Company"
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Admin Login
                </h2>
              </div>

              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-2xl">
                <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10 relative z-10">
                  <form className="space-y-6" onSubmit={otpSent ? handleAdminLogin : handleSendOtp}>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-pretty font-semibold tracking-tight text-black text-xl pb-2 text-center"
                      >
                        Email Address
                      </label>
                      <div className="mt-1 relative z-20">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Please enter your email address"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="block w-full appearance-none rounded-md border border-gray-800 px-3 py-2 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-center"
                          style={{ backgroundColor: 'inherit' }} // Inherit background from parent
                        />
                      </div>
                    </div>

                    {/* Conditional OTP input field, only show if OTP is sent */}
                    {otpSent && (
                      <div>
                        <label
                          htmlFor="otp"
                          className="block text-pretty font-semibold tracking-tight text-black text-xl pb-2 text-center"
                        >
                          Enter OTP
                        </label>
                        <div className="mt-1 relative z-20">
                          <input
                            id="otp"
                            name="otp"
                            type="text"
                            placeholder="Enter OTP"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            required
                            className="block w-full appearance-none rounded-md border border-gray-800 px-3 py-2 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-center"
                            style={{ backgroundColor: 'inherit' }} // Inherit background from parent
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {otpSent ? 'Login' : 'Send OTP'}
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

export default AdminPanel;

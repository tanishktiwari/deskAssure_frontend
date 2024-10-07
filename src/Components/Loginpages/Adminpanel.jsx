import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Adminpanel.css'; // Import the CSS file

const Adminpanel = () => {
  const [email, setEmail] = useState(''); // Pre-fill email
  const [otp, setOtp] = useState('1234'); // Pre-set OTP
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP has been sent
  const [enteredOtp, setEnteredOtp] = useState(''); // State to track entered OTP by user
  const navigate = useNavigate(); // Initialize navigate

  // Function to handle OTP sending
  const handleSendOtp = (event) => {
    event.preventDefault();
    if (email === 'admin@gmail.com') {
      setOtpSent(true); // Set OTP sent status to true to show the OTP field
    } else {
      alert('Invalid email. Please use admin@gmail.com');
    }
  };

  // Function to handle Admin login
  const handleAdminLogin = (event) => {
    event.preventDefault();
    if (email === 'admin@gmail.com' && enteredOtp === otp) {
      navigate('/dashboardadmin'); // Redirect to the admin dashboard
    } else {
      alert('Incorrect email or OTP');
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="w-full md:w-[55%] flex items-center justify-center mt-5 px-4">
        <div className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-2">
            <img src="https://deskassure.com/img/logo.png" alt="login_text" className='mb-2 h-28 w-auto' />
            <img src="./login_subtext.png" alt="login_subtext" className='mb-2 ml-4 h-4 w-auto' />
            <h1 className="text-3d">
              {['A', 'd', 'm', 'i', 'n', ' ',' ', 'L', 'o', 'g', 'i', 'n'].map((letter, index) => (
                <span key={index}>{letter}</span>
              ))}
            </h1>
          </div>
          <form onSubmit={otpSent ? handleAdminLogin : handleSendOtp}>
            <div className="mb-4 mt-10">
              <div className="relative mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 text-black bg-[#F0EDFFCC] rounded-lg"
                  required
                />
              </div>
              {otpSent && (
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="OTP"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full p-3 text-black bg-[#F0EDFFCC] rounded-lg"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center mt-6 mb-3">
              <button type="submit" className="w-36 bg-custom-gradient text-white font-poppins font-light py-3 rounded-xl shadow-md text-sm mb-4">
                {otpSent ? 'Submit OTP' : 'Request OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-[45%] relative bg-gradient-to-r from-[#9181F4] to-[#5038ED] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="./login_image.png" 
            alt="Login" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div
          className="w-[60%] h-[60%] absolute rounded-3xl"
          style={{
            top: '25%',
            left: '55%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <img 
            src="./right_panel_2.png" 
            alt="Login" 
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>

        <img 
          src="./tab.png" 
          alt="Tab Image" 
          className="w-[400px] h-[320px] object-cover absolute"
          style={{
            top: '30.5%',
            left: '55%',
            transform: 'translateX(-50%)',
            zIndex: 20,
          }} 
        />

        <div
          className="absolute z-20"
          style={{
            top: '35%',
            left: '30%',
            color: 'white',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '32px',
            textAlign: 'left',
            maxWidth: '180px',
          }}
        >
          <p>Now have full visibility on your Service tickets</p>
        </div>
      </div>
    </div>
  );
};

export default Adminpanel;

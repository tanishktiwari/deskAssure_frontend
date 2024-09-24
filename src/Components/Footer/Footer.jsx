import React from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa'; // Importing icons for email and phone

const Footer = () => {
  return (
    <div className="bg-custom-blue1 text-gray-400 py-6 px-4 md:px-8 font-quicksand mt-[60%]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center">
          <FaEnvelope className="mr-2 ml-44" /> 
          <span>Connect@deskassure.com</span>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <FaPhone className="mr-2" /> 
          <span>+91 9094894948</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-600 pt-4">
        <div className="flex flex-wrap justify-center md:justify-start space-x-4 mb-4 md:mb-0 ml-44">
          <a href="#" className="hover:text-white transition duration-200">Terms of Service</a>
          <a href="#" className="hover:text-white transition duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-white transition duration-200">Security Policy</a>
          <a href="#" className="hover:text-white transition duration-200">Contact Us</a>
        </div>
        <div className="text-center md:text-right">
          <span className="text-sm md:text-base">© 2023, Desk Assure India. All Rights Reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

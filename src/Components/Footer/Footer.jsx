import React, { useState } from 'react';
import './Footer.css'; // Ensure you have this import if you're using a separate CSS file

const Footer = () => {
  const [hovered, setHovered] = useState(false); // State to track hover

  return (
    <footer className="bg-gray-900 text-gray-400 p-10">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between">
        
        {/* Left Side */}
        <div className="flex-1 mb-8 lg:mb-0 ml-32">
          {/* DeskAssure Logo */}
          <div 
            className="mb-24 relative" 
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
          >
            {hovered ? (
              // Second Image
              <img 
                src="/TICKT (2000 x 400 px) (3) (1).png" 
                alt="Second Logo" 
                className="h-13 w-auto transition-opacity duration-300" 
              />
            ) : (
              // First Image
              <img 
                src="/image.png" 
                alt="DeskAssure Logo" 
                className="h-10 w-auto transition-opacity duration-300" 
              />
            )}
          </div>

          {/* Description */}
          <p className="description-text mb-4">
            The first free end-to-end analytics service for the site, designed to work with enterprises of various levels and business segments.
          </p>
          <a href="#more-about-us" className="more-about-us">
            More about us
          </a>

          {/* Social Media Icons */}
          <div className="mt-20 flex space-x-10">
            <div className="flex flex-col space-y-4">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <img src="/linkedin.png" alt="LinkedIn" className="h-10 w-10" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/instagram.png" alt="Instagram" className="h-10 w-10" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="/facebook-logo.png" alt="Facebook" className="h-10 w-10" />
              </a>
            </div>
            <div className="flex flex-col space-y-4">
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                <img src="/youtube.png" alt="YouTube" className="h-10 w-10" />
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                <img src="/telegram.png" alt="Telegram" className="h-10 w-10" />
              </a>
            </div>
          </div>

        </div>

        {/* Right Side */}
        <div className="flex-1">
          {/* Horizontal Navigation Links */}
          <div className="flex justify-end space-x-8 mb-4">
            <a href="#about" className="footer-link">About</a>
            <a href="#testimonials" className="footer-link">Testimonials</a>
            <a href="#pricing" className="footer-link">Pricing</a>
            <a href="#contacts" className="footer-link">Contacts</a>
          </div>

          {/* Contact and Location Information */}
          <div className="mt-44 ml-[33%]">
            {/* Contact Us */}
            <h4 className="contact-title mb-3 text-white">Contact Us</h4>
            <p>+1 (999) 888-77-66</p>
            <p>hello@deskassure.com</p>

            {/* Location */}
            <div className="mt-8">
              <h4 className="contact-title mb-3 text-white">Location</h4>
              <div className="flex space-x-8">
                <p>New Delhi</p>
                <p>Dhaka</p>
                <p>Dubai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 flex justify-between items-center pt-4 ml-32">
        <p className="copyright-text">© 2021 — DeskAssure. All Rights Reserved.</p>
        <a href="#" className="text-sm">Languages</a>
      </div>
    </footer>
  );
};

export default Footer;

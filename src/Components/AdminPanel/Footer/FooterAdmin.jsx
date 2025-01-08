import React, { useState } from "react";
 // Ensure you have this import if you're using a separate CSS file

const FooterAdmin = () => {
  const [hovered, setHovered] = useState(false); // State to track hover

  return (
    <footer className="bg-gray-900 text-gray-400 p-4  w-full font-poppins">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between">
        {/* Left Side */}
        <div className="flex-1 mb-8 lg:mb-0 ml-32 pt-4">
          {/* DeskAssure Logo */}
          <div
            className="mb-10 relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {hovered ? (
              // Second Image
              <img
                src="/TICKT (2000 x 400 px) (3) (1).png"
                alt="Second Logo"
                className="h-11 w-auto transition-opacity duration-300"
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
          <p className="description-text mb-4 font-poppins">
            The first free end-to-end analytics service for the site, designed
            to work with enterprises of various levels and business segments.
          </p>

          {/* Social Media Icons */}
          <div className="mt-10 flex space-x-5 mb-4">
            <a href="" target="_blank" rel="noopener noreferrer">
              <img src="/linkedin.png" alt="LinkedIn" className="h-10 w-10" />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer">
              <img src="/instagram.png" alt="Instagram" className="h-10 w-10" />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer">
              <img
                src="/facebook-logo.png"
                alt="Facebook"
                className="h-10 w-10"
              />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer">
              <img src="/youtube.png" alt="YouTube" className="h-10 w-10" />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer">
              <img src="/telegram.png" alt="Telegram" className="h-10 w-10" />
            </a>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 mr-20 pt-4">
          {/* Horizontal Navigation Links */}
          <div className="flex justify-end space-x-8 mb-4 font-poppins">
            <a href="#about" className="footer-link">
              About
            </a>
            <a href="#testimonials" className="footer-link">
              Testimonials
            </a>
            <a href="#pricing" className="footer-link">
              Pricing
            </a>
            <a href="#contacts" className="footer-link">
              Contacts
            </a>
          </div>

          {/* Contact and Location Information */}
          <div className="mt-6 ml-[33%] flex flex-col mb-4 font-poppins">
            {/* Contact Us */}
            <h4 className="contact-title mb-3 text-white">
              <strong className="font-poppins">Contact Us</strong>
            </h4>
            <p className="font-poppins">+91 90948 94948</p>
            <p className="font-poppins">care@deskassure.com</p>

            {/* Location */}
            <div className="mt-8">
              <h4 className="contact-title mb-3 text-white">
                <strong>Location</strong>
              </h4>
              <div className="flex space-x-8">
                <p>New Delhi</p>
                <p>Bangalore</p>
                <p>Pune</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      {/* Uncomment if needed
      <div className="mt-0 flex justify-end items-center pt-0 ml-32">
        <p className="copyright-text mr-48">
          © 2021 — DeskAssure. All Rights Reserved.
        </p>
      </div>
      */}
    </footer>
  );
};

export default FooterAdmin;

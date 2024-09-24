// Footer.js
import React from "react";
import "../Footer/FooterAdmin.css"; // Ensure to create this CSS file

const FooterAdmin = () => {
  return (
    <div className="footer-container">
      <div className="footer-row">
        <div className="footer-col">
          <div className="contact-info">
            <div className="contact-icon mail-icon"></div>
            Connect@deskassure.com
          </div>
        </div>
        <div className="footer-col footer-col-right">
          <div className="contact-info">
            <div className="contact-icon call-icon"></div>
            1800-108-1302
          </div>
        </div>
      </div>
      <div className="footer-row footer-links-row">
        <div className="footer-links">
          <a href="#" className="footer-link">
            Terms of Service
          </a>
          <a href="#" className="footer-link">
            Privacy Policy
          </a>
          <a href="#" className="footer-link">
            Security Policy
          </a>
          <a href="#" className="footer-link">
            Contact Us
          </a>
        </div>
        <div className="footer-col footer-col-right footer-copyright">
          © 2023, Desk Assure India. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default FooterAdmin;

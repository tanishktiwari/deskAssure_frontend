import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SidebarAdmin = () => {
  const [activeItem, setActiveItem] = useState("Home"); // Default to 'Home'
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavigation = (item) => {
    setActiveItem(item);
    switch (item) {
      case "Home":
        navigate("/dashboardadmin"); // Navigate to Admin Dashboard
        break;
      case "Open":
        navigate("/openticketadmin"); // Navigate to Open page
        break;
      case "Close":
        navigate("/closeticketadmin"); // Navigate to Close page
        break;
      case "Report":
        // navigate("/dashboard/report"); // Navigate to Report page
        break;
      case "Operator":
        navigate("/operator"); // Navigate to Operator page
        break;
      case "Company":
        navigate("/company"); // Navigate to Company page (update path as needed)
        break;
      case "Engineer":
        navigate("/engineer"); // Navigate to Engineer page (update path as needed)
        break;
      case "Issue category":
        navigate("/issue-category"); // Navigate to Issue category page (update path as needed)
        break;
      default:
        break;
    }
  };

  return (
    <div className="sidebar bg-custom-blue1 text-white fixed top-1 left-0 h-screen w-28">
      <ul className="sidebar-menu flex flex-col mt-8 space-y-0 pt-12 items-center">
        <li
          className={`p-1 cursor-pointer flex flex-col items-center 
    ${activeItem === "Home" ? "border-l-4 border-red-500 shadow-lg" : ""}`}
          onClick={() => handleNavigation("Home")}
        >
          <img
            src="/dashboard.png"
            alt="Dashboard Icon"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="dashboard-logo"
          />
          <span className="mt-1 text-sm">Dashboard</span>
        </li>
        <li
          className={`p-1 cursor-pointer flex flex-col items-center 
            ${activeItem === "Open" ? "border-l-4 border-red-500 shadow-lg" : ""}`}
          onClick={() => handleNavigation("Open")}
        >
          <img
            src="/checked_default.png"
            alt="Open Icon"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="open-icon"
          />
          <img
            src="/checked.png"
            alt="Open Icon Hover"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="open-icon-hover"
          />
          <span className="mt-1 text-sm">Open</span>
        </li>
        <li
          className={`p-1 cursor-pointer flex flex-col items-center 
    ${activeItem === "Close" ? "border-l-4 border-red-500 shadow-lg" : ""}`}
          onClick={() => handleNavigation("Close")}
        >
          <img
            src="/cancel_default.png"
            alt="Close Icon"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="close-icon"
          />
          <img
            src="/cancel.png"
            alt="Close Icon Hover"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="close-icon-hover"
          />
          <span className="mt-1 text-sm">Close</span>
        </li>
        <li
          className={`p-1 cursor-pointer flex flex-col items-center 
    ${activeItem === "Company" ? "border-l-4 border-red-500 shadow-lg" : ""}`}
          onClick={() => handleNavigation("Company")}
        >
          <img
            src="/building.png"
            alt="Company Icon"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="company-icon"
          />
          <span className="mt-1 text-sm">Company</span>
        </li>
        <li
          className={`p-1 cursor-pointer flex flex-col items-center 
    ${activeItem === "Operator" ? "border-l-4 border-red-500 shadow-lg" : ""}`}
          onClick={() => handleNavigation("Operator")}
        >
          <img
            src="/help-operator.png"
            alt="Operator Icon"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="operator-icon"
          />
          <span className="mt-1 text-sm">Operator</span>
        </li>
        <li
          className={`p-1 cursor-pointer flex flex-col items-center 
    ${activeItem === "Engineer" ? "border-l-4 border-red-500 shadow-lg" : ""}`}
          onClick={() => handleNavigation("Engineer")}
        >
          <img
            src="/help-operator.png"
            alt="Engineer Icon"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="engineer-icon"
          />
          <span className="mt-1 text-sm">Engineer</span>
        </li>
        <li
          className={`p-1 cursor-pointer flex flex-col items-center 
    ${activeItem === "Issue category" ? "border-l-4 border-red-500 shadow-lg" : ""}`}
          onClick={() => handleNavigation("Issue category")}
        >
          <img
            src="/help-operator.png"
            alt="Issue category Icon"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="issue-icon"
          />
          <span className="mt-1 text-sm">Issue category</span>
        </li>
        <li
          className={`p-1 cursor-pointer flex flex-col items-center 
                ${activeItem === "Report" ? "border-l-4 border-red-500 shadow-lg" : ""}`}
          onClick={() => handleNavigation("Report")}
        >
          <img
            src="/categories.png"
            alt="Report Icon"
            style={{ height: "1.625rem", width: "1.625rem" }}
            className="report-icon"
          />
          <span className="mt-1 text-sm">Report</span>
        </li>
      </ul>
    </div>
  );
};

export default SidebarAdmin;

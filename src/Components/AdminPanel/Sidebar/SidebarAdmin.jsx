import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  const [activeItem, setActiveItem] = useState("Home"); // Default to 'Home'
  const navigate = useNavigate(); // Initialize useNavigate
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showMaintenancePopup, setShowMaintenancePopup] = useState(false);
  const [showTriggerPopup, setShowTriggerPopup] = useState(false); // State for Trigger popup
  const [selectedOption, setSelectedOption] = useState(""); // Tracks selected option
  const popupRef = useRef(null); // Create a reference for the pop-up container

  // Function to handle "Maintenance" item click
  const handleMaintenanceClick = () => {
    setShowMaintenancePopup(true); // Show the pop-up/form to select option
  };

  // Function to handle "Trigger" item click
  const handleTriggerClick = () => {
    setShowTriggerPopup(true); // Show the pop-up/form to select option
  };

  // Function to handle option selection from the pop-up
const handleOptionSelect = (option) => {
  setSelectedOption(option);
  setShowMaintenancePopup(false); // Close the maintenance pop-up after selection
  setShowTriggerPopup(false); // Close the trigger pop-up after selection

  // Navigate based on selected option
  if (option === "PPM") {
    navigate("/dashboardadmin/ppm"); // Navigate to PPM form
  } else if (option === "Health Check") {
    navigate("/dashboardadmin/healthcheck"); // Navigate to Health Check form
  } else if (option === "periodic-report") {
    navigate("/dashboardadmin/periodicreport"); // Navigate to Periodic Report
  } else if (option === "Contact Matrix") {
    navigate("/dashboardadmin/contact-matrix"); // Navigate to Contact Matrix
  }
  else if (option === "promptmanager") {
    navigate("/dashboardadmin/promptmanager"); // Navigate to Contact Matrix
  }
};

  // Function to handle navigation for sidebar items
  const handleNavigation = (item) => {
    setActiveItem(item);
    switch (item) {
      case "Home":
        navigate("/dashboardadmin"); // Navigate to Admin Dashboard
        break;
      case "Open":
        navigate("/dashboardadmin/openticketadmin"); // Navigate to Open page
        break;
      case "Close":
        navigate("/dashboardadmin/closeticketadmin"); // Navigate to Close page
        break;
      case "Report":
        navigate("/dashboardadmin/reports-admin"); // Navigate to Report page
        break;
      case "Operator":
        navigate("/dashboardadmin/operator"); // Navigate to Operator page
        break;
      case "Company":
        navigate("/dashboardadmin/company"); // Navigate to Company page
        break;
      case "Engineer":
        navigate("/dashboardadmin/engineer"); // Navigate to Engineer page
        break;
      case "periodic-report":
        navigate("/dashboardadmin/periodicreport"); // Navigate to Engineer page
        break;
      case "Issue category":
        navigate("/dashboardadmin/issue-category"); // Navigate to Issue category page
        break;
      default:
        break;
    }
  };

  const iconSize = "1.82rem";
  const labelSize = "text-sm";

  // Handle clicking outside the pop-up to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowMaintenancePopup(false); // Close pop-up if click is outside
        setShowTriggerPopup(false); // Close trigger pop-up if click is outside
      }
    };

    // Add event listener for mouse click
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`sidebar bg-[#F1F2F7] text-[#273236] fixed top-0 left-0 h-screen 
                  transition-all duration-300 ${isCollapsed ? "w-20" : "w-60"}
                  flex flex-col items-center`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Logo Section */}
      <div className="logo-container mt-3 mb-0 ml-0">
        <Link to="/dashboard/home">
          <img
            src={
              isCollapsed
                ? "/logo.png"
                : "../../../../../public/logo_black_full.png"
            }
            alt="Logo"
            className="logo mb-0"
            style={{
              height: "40px",
              width: isCollapsed ? "40px" : "90%",
            }}
          />
        </Link>
      </div>

      {/* Separator */}
      <div
        style={{
          border: "0.5px solid rgba(200, 203, 217, 1)",
          width: "100%",
          margin: "1rem 0",
        }}
      />

      {/* Icons and Labels Section */}
      <div className="sidebar-items flex flex-col items-center pt-2 space-y-6">
        <ul
          className={`flex flex-col items-start ${isCollapsed ? "space-y-5" : "space-y-6"}`}
        >
          {/* Home Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("Home")}
          >
            <img
              src="/dashboard.png"
              alt="Dashboard Icon"
              style={{ height: iconSize, width: iconSize }}
              className="dashboard-logo"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-5 mt-1 text-xl`}>Dashboard</span>
            )}
          </li>

          {/* Open Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("Open")}
          >
            <img
              src="/open.png"
              alt="Open Icon"
              style={{ height: iconSize, width: iconSize }}
              className="open-icon"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>Open</span>
            )}
          </li>

          {/* Close Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("Close")}
          >
            <img
              src="/closed.png"
              alt="Close Icon"
              style={{ height: iconSize, width: iconSize }}
              className="close-icon"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>Close</span>
            )}
          </li>

          {/* Company Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("Company")}
          >
            <img
              src="/company.png"
              alt="Company Icon"
              style={{ height: iconSize, width: iconSize }}
              className="company-icon"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>Company</span>
            )}
          </li>

          {/* Operator Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("Operator")}
          >
            <img
              src="/operator.png"
              alt="Operator Icon"
              style={{ height: iconSize, width: iconSize }}
              className="report-icon"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>Operator</span>
            )}
          </li>

          {/* Engineer Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("Engineer")}
          >
            <img
              src="/engineer.png"
              alt="Engineer Icon"
              className="engineer-icon h-10 w-auto relative right-1"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-3 font-poppins mt-1 text-xl`}>Engineer</span>
            )}
          </li>

          {/* Issue Category Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("Issue category")}
          >
            <img
              src="/categories.png"
              alt="Issue Category Icon"
              className="engineer-icon h-10 w-auto relative right-1"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-3 font-poppins mt-1 text-xl`}>Issue Category</span>
            )}
          </li>

          {/* Report Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("Report")}
          >
            <img
              src="/reports.png"
              alt="Report Icon"
              style={{ height: iconSize, width: iconSize }}
              className="report-icon"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>Report</span>
            )}
          </li>

          {/* Maintenance Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={handleMaintenanceClick} // Trigger pop-up
          >
            <img
              src="/maintenance.png"
              alt="Maintenance Icon"
              style={{ height: iconSize, width: iconSize }}
              className="maintance"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>Maintenance</span>
            )}
          </li>

          {/* Trigger Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={handleTriggerClick} // Trigger pop-up
          >
            <img
              src="/thunder.png"
              alt="Trigger Icon"
              style={{ height: iconSize, width: iconSize }}
              className="maintance"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>Trigger</span>
            )}
          </li>
        </ul>
      </div>

      {/* Maintenance Pop-up */}
      {showMaintenancePopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white rounded-2xl shadow-lg w-1/4 h-48 shadow-slate-400 "
            ref={popupRef} // Add ref to the pop-up container
          >
            {/* Header */}
            <div className="bg-gray-800 text-white flex items-center justify-center p-2 rounded-t-2xl relative">
              <img src="/logo.png" alt="" className="h-8 w-auto" />
              <span className="ml-5 font-poppins text-xl ">Maintenance</span>
            </div>

            {/* Buttons */}
            <div className="p-4 justify-center ml-2">
              <button
                className="w-[98%] py-2 text-gray-700 font-semibold border border-gray-300 rounded-md hover:bg-gray-100 mb-4 shadow-extra-sm shadow-slate-300"
                onClick={() => handleOptionSelect("PPM")}
              >
                PPM
              </button>
              <button
                className="w-[98%] py-2 text-gray-700 font-semibold border border-gray-300 rounded-md hover:bg-gray-100 shadow-extra-sm  shadow-slate-300"
                onClick={() => handleOptionSelect("Health Check")}
              >
                Health Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Pop-up */}
      {showTriggerPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white rounded-2xl shadow-lg w-1/4 h-60 shadow-slate-400 "
            ref={popupRef} // Add ref to the pop-up container
          >
            {/* Header */}
            <div className="bg-gray-800 text-white flex items-center justify-center p-2 rounded-t-2xl relative">
              <img src="/logo.png" alt="" className="h-8 w-auto" />
              <span className="ml-5 font-poppins text-xl ">Trigger</span>
            </div>

            {/* Buttons */}
            <div className="p-4 justify-center ml-2">
              <button
                className="w-[98%] py-2 text-gray-700 font-semibold border border-gray-300 rounded-md hover:bg-gray-100 mb-4 shadow-extra-sm shadow-slate-300"
                onClick={() => handleOptionSelect("periodic-report")}
              >
                Periodic Reports
              </button>
              <button
                className="w-[98%] py-2 text-gray-700 font-semibold border border-gray-300 rounded-md hover:bg-gray-100 shadow-extra-sm  shadow-slate-300 mb-4"
                onClick={() => handleOptionSelect("Contact Matrix")}
              >
                Contact Matrix
              </button>
              <button
                className="w-[98%] py-2 text-gray-700 font-semibold border border-gray-300 rounded-md hover:bg-gray-100 shadow-extra-sm  shadow-slate-300"
                onClick={() => handleOptionSelect("promptmanager")}
              >
                Prompt Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarAdmin;

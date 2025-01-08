import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"; // For custom font
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isPpmActive, setIsPpmActive] = useState(false);
  const [showMaintenancePopup, setShowMaintenancePopup] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const storedState = localStorage.getItem("isSidebarCollapsed");

    // Log the retrieved value from localStorage
    console.log("Retrieved isSidebarCollapsed from localStorage:", storedState);

    return storedState ? JSON.parse(storedState) : true;
  });

  // Function to handle "Maintenance" item click
  const handleMaintenanceClick = () => {
    setShowMaintenancePopup(true); // Show the pop-up/form to select option
  };

  // Function to handle option selection from the pop-up
  const handleOptionSelect = (option) => {
    setShowMaintenancePopup(false); // Close the pop-up after selection

    // Navigate based on selected option
    if (option === "PPM") {
      navigate("/dashboard/ppm-status"); // Navigate to PPM form
    } else if (option === "Health Check") {
      navigate("/dashboard/monthly-healthcheck"); // Navigate to Health Check form
    }
  };

  const handleNavigation = (item) => {
    setActiveItem(item);
    if (item === "PPM") {
      setIsPpmActive((prev) => !prev);
    } else {
      setIsPpmActive(false);
      switch (item) {
        case "Home":
          navigate("/dashboard/home");
          break;
        case "Create Ticket":
          navigate("/dashboard/create-ticket");
          break;
        case "Open":
          navigate("/dashboard/open");
          break;
        case "Close":
          navigate("/dashboard/close");
          break;
        case "Report":
          navigate("/dashboard/report");
          break;
        case "PPM Status":
          navigate("/dashboard/ppm-status");
          break;
        case "Health Check":
          navigate("/dashboard/monthly-healthcheck");
          break;
        case "Inventory Info":
          navigate("/dashboard/spare-inventory");
          break;
        default:
          break;
      }
    }
  };

  const iconSize = isPpmActive ? "2.0rem" : "1.82rem";
  const labelSize = isPpmActive ? "text-lg" : "text-sm";

  // Update localStorage whenever `isCollapsed` changes
  useEffect(() => {
    console.log("Saving isSidebarCollapsed to localStorage:", isCollapsed);
    localStorage.setItem("isSidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Close the pop-up if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowMaintenancePopup(false); // Close the pop-up if clicked outside
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`sidebar bg-[#F1F2F7] text-[#273236] fixed top-0 left-0 h-screen 
                  transition-all duration-200 ${isCollapsed ? "w-20" : "w-60"}
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
          width: "100%", // Adjust width as needed
          margin: "1rem 0", // Adjust margin as needed
        }}
      />

      {/* Icons and Labels Section */}
      <div className="sidebar-items flex flex-col items-center pt-2 space-y-6">
        <ul
          className={`flex flex-col items-start ${
            isPpmActive ? "space-y-4" : "space-y-5"
          }`}
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
              <span className={`${labelSize} ml-5 mt-1 text-xl font-poppins`}>
                Dashboard
              </span>
            )}
          </li>

          {/* Create Ticket Item */}
          <li
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("Create Ticket")}
          >
            <img
              src="/create_ticket.png"
              alt="Create Ticket Icon"
              style={{ height: iconSize, width: iconSize }}
              className="add-ticket-icon"
            />
            {!isCollapsed && (
              <span className={`${labelSize} ml-5 mt-1 text-xl font-poppins`}>
                Create Ticket
              </span>
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
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>
                Open
              </span>
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
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>
                Close
              </span>
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
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>
                Report
              </span>
            )}
          </li>

          {/* PPM / Maintenance Item */}
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
              <span className={`${labelSize} ml-5 mt-1 font-poppins text-xl`}>
                Maintenance
              </span>
            )}
          </li>
        </ul>

        {/* Maintenance Pop-up */}
        {showMaintenancePopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div
              className="bg-white rounded-2xl shadow-lg w-1/4"
              ref={popupRef} // Add ref to the pop-up container
            >
              {/* Header */}
              <div className="bg-gray-800 text-white flex items-center justify-center p-4 rounded-t-2xl relative">
                <img src="/logo.png" alt="" className="h-12 w-12" />
              </div>

              {/* Buttons */}
              <div className="p-4">
                <button
                  className="w-full py-2 text-gray-700 font-semibold border border-gray-300 rounded-md hover:bg-gray-100 mb-2"
                  onClick={() => handleOptionSelect("PPM")}
                >
                  PPM
                </button>
                <button
                  className="w-full py-2 text-gray-700 font-semibold border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => handleOptionSelect("Health Check")}
                >
                  Health Check
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Line and Version Info Section */}
      <div
        style={{
          borderTop: "0.5px solid rgba(200, 203, 217, 1)",
          width: "100%",
          marginTop: "auto",
        }}
      />
      <div
        className="sidebar-version-info p-4 text-center text-sm text-gray-600"
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {isCollapsed ? (
          <p>V 1.0.0</p> // Display shortened version when collapsed
        ) : (
          <>
            <p>Version 1.0.0</p>
            <p>© 2024 DeskAssure</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useEffect, useState, useRef } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../Navbar/Navbar.css"; // Adjust the path as needed
import AddEmailsPage from "./AddEmailsPage"; // Adjust the import

const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [userInitials, setUserInitials] = useState(""); // State for user initials
  const [isAddEmailsModalOpen, setAddEmailsModalOpen] = useState(false); // Remove the duplicate declaration
  const [operatorName, setOperatorName] = useState(""); // State for operator name
  const mobileNumber = localStorage.getItem("loggedInUserMobileNumber"); // Get mobile number from local storage
  const cardRef = useRef(null); // Create a reference for the modal
  const [isEmailCopied, setIsEmailCopied] = useState(false); // State for email copied
  const [isPhoneCopied, setIsPhoneCopied] = useState(false); // State for phone copied
  const [tooltipVisible, setTooltipVisible] = useState({
    createTicket: false,
    profile: false,
    accountmanager: false,
    notification: false,
  });
  const handleTooltipVisibility = (button) => {
    setTooltipVisible((prev) => ({
      ...prev,
      [button]: true,
    }));
  };

  const handleTooltipHide = (button) => {
    setTooltipVisible((prev) => ({
      ...prev,
      [button]: false,
    }));
  };
  // Clipboard copy function
  const copyToClipboard = (text, type) => {
    // Check if navigator.clipboard is available (modern browsers)
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied successfully");

          // Set the copied state based on the type (email or phone)
          if (type === "email") {
            setIsEmailCopied(true);
            setTimeout(() => setIsEmailCopied(false), 2000); // Reset after 2 seconds
          } else if (type === "phone") {
            setIsPhoneCopied(true);
            setTimeout(() => setIsPhoneCopied(false), 2000); // Reset after 2 seconds
          }
        })
        .catch((err) => {
          // Handle any errors when using the Clipboard API
          console.error("Failed to copy text using Clipboard API", err);
          alert("Failed to copy text to clipboard");
        });
    } else {
      // Fallback to execCommand if Clipboard API is not available (older browsers)
      const textArea = document.createElement("textarea");
      textArea.value = text; // Set the value to the text we want to copy
      document.body.appendChild(textArea); // Append the textarea to the body
      textArea.select(); // Select the text inside the textarea
      textArea.setSelectionRange(0, 99999); // For mobile devices, select the entire text

      try {
        const successful = document.execCommand("copy"); // Attempt to copy the text
        if (successful) {
          console.log("Text copied successfully using execCommand");
          // Set the copied state based on the type (email or phone)
          if (type === "email") {
            setIsEmailCopied(true);
            setTimeout(() => setIsEmailCopied(false), 2000); // Reset after 2 seconds
          } else if (type === "phone") {
            setIsPhoneCopied(true);
            setTimeout(() => setIsPhoneCopied(false), 2000); // Reset after 2 seconds
          }
        } else {
          console.error("Failed to copy text using execCommand");
          alert("Failed to copy text");
        }
      } catch (err) {
        console.error("Error copying text:", err);
        alert("Error copying text");
      } finally {
        document.body.removeChild(textArea); // Clean up by removing the textarea
      }
    }
  };

  //To close manager pop-up
  useEffect(() => {
    // Function to handle clicks outside the modal
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsCardVisible(false); // Close the modal if click is outside
      }
    };

    // Add event listener on component mount
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array ensures it runs once when the component mounts

  useEffect(() => {
    const fetchOperatorData = async () => {
      if (mobileNumber) {
        try {
          // Fetch operator data using mobile number
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/operators/mobile/${mobileNumber}`
          );
          setOperatorName(response.data.operatorName); // Store operator name

          // Determine which API to call based on operatorName
          const names = response.data.operatorName.split(" ");
          let initialsApiUrl;

          if (names.length > 1) {
            // Both first and last name
            initialsApiUrl = `${
              import.meta.env.VITE_API_URL
            }/operators/initials/${mobileNumber}`;
          } else {
            // Only first name
            initialsApiUrl = `${
              import.meta.env.VITE_API_URL
            }/operators/initials-two/${mobileNumber}`;
          }

          // Fetch initials
          const initialsResponse = await axios.get(initialsApiUrl);
          setUserInitials(initialsResponse.data.initials); // Store initials in state
        } catch (error) {
          console.error("Error fetching operator data:", error);
        }
      } else {
        console.error("No mobile number found in local storage.");
      }
    };

    fetchOperatorData();
  }, [mobileNumber]);

  const handleProfileClick = () => {
    navigate("/user-login"); // Redirect to UserLoginPage
  };
  const handleClose = () => {
    console.log("Modal is closing");
    setAddEmailsModalOpen(false);
  };

  const handleSignOut = () => {
    // Add your sign-out logic here
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/");
  };

  const [isCardVisible, setIsCardVisible] = useState(false);

  // Toggle the visibility of the card
  const toggleCardVisibility = () => {
    setIsCardVisible((prev) => !prev);
  };
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  // Add useEffect to handle clicks outside of notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the notification dropdown is open and the click is outside
      if (
        isNotificationOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]); // Depend on isNotificationOpen to ensure the latest state is used
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!mobileNumber) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/notifications/${mobileNumber}`
        );

        const formattedNotifications = response.data.map(
          (notification, index) => ({
            id: notification._id || index,
            message: notification.message,
            time: new Date(notification.createdAt).toLocaleString(),
            status: notification.status || "unread",
            details: notification,
          })
        );

        setNotifications(formattedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [mobileNumber]);

  // Mark single notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/read/${mobileNumber}`,
        {
          notificationId,
        }
      );

      setNotifications(
        notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, status: "read" } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/read/${mobileNumber}`
      );

      setNotifications(
        notifications.map((notif) => ({
          ...notif,
          status: "read",
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Function to toggle notifications
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notifications/${mobileNumber}`
      );

      setNotifications([]);
      setIsNotificationOpen(false);
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  // // Function to clear all notifications
  // const clearAllNotifications = () => {
  //   setNotifications([]);
  // };

  return (
    <nav className="bg-[#FFFFFF] w-full fixed top-0 left-0 navbar">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-16">
        <div className="relative flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <div className="logo"></div>
          </div>

          {/* Icons and Profile Dropdown */}
        
          <div className="flex items-center space-x-4 ">
            <div className="relative inline-block">
              {/* Profile Menu Button */}
              <button
                onClick={toggleCardVisibility}
                className="flex items-center gap-2 bg-custom-gradient text-white font-semibold py-2 px-1 rounded-full shadow-lg transition duration-200 ease-in-out hover:bg-gradient-to-bl hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 h-12 w-auto relative"
                onMouseEnter={() => handleTooltipVisibility("accountManager")}
                onMouseLeave={() => handleTooltipHide("accountManager")}
              >
                <img
                  src="/admin_image.jpeg" // replace with the actual profile image path
                  alt="Profile"
                  className="w-12 h-12 rounded-full relative right-2 bg-white "
                />
                <div className="mr-2 mt-1 mb-1 flex flex-col text-left mr-4">
                  <span className="text-left font-poppins text-[15px]">
                    Meet Pulkit
                  </span>
                  <span className="text-[12px] font-normal opacity-80 text-left -mt-1 font-poppins ">
                    Your Account Manager
                  </span>
                </div>
              </button>
              {tooltipVisible.accountManager && (
                <div className="custom-tooltip visible">Account Manager</div>
              )}

              {/* Dropdown Menu */}
              {isCardVisible && (
                <div
                  ref={cardRef}
                  className="absolute left-0 mt-2 bg-black text-white rounded-lg p-4 shadow-lg w-80"
                >
                  {/* Close Button */}
                  <button
                    onClick={toggleCardVisibility}
                    className="absolute top-1 right-2 text-gray-400 hover:text-white"
                  >
                    &times;
                  </button>
                  <p className="text-sm mt-2 font-poppins">
                    Hi, I am Pulkit, Your Account Manager
                  </p>
                  <p className="text-xs mt-2 font-poppins">
                    Talk to me on how to get the best out of Foxnet Services
                  </p>
                  <p className="text-xs mt-1 opacity-80 font-poppins">
                    I've helped 20+ businesses streamline over 5+ countries in
                    the last 45 days.
                  </p>
                  {/* Contact Information */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 font-poppins">
                      <img src="/email_2.png" alt="" className="h-4 w-4" />
                      <span className="text-[13px]">
                        pulkit.verma@foxnetglobal.com
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            "pulkit.verma@foxnetglobal.com",
                            "email"
                          )
                        }
                        className="ml-0 text-gray-400 hover:text-white"
                      >
                        <img
                          src={isEmailCopied ? "/copy_green.png" : "/copy.png"} // Conditionally change the image
                          alt="Copy Icon"
                          className="h-3 w-3 mb-1"
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2 font-poppins">
                      <img src="/phone-call.png" alt="" className="h-4 w-4" />
                      <span className="text-sm">+91 9560005265</span>
                      <button
                        onClick={() =>
                          copyToClipboard("+91 9560005265", "phone")
                        }
                        className="ml-0 text-gray-400 hover:text-white"
                      >
                        <img
                          src={isPhoneCopied ? "/copy_green.png" : "/copy.png"} // Conditionally change the image
                          alt=""
                          className="h-3 w-3 mb-1"
                        />
                      </button>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-0 ml-0">
                    <div className="flex-1">
                      <button
                        onClick={() =>
                          (window.location.href = "tel:+919560005265")
                        }
                        className="w-16 bg-red-600 text-white py-1 px-1 rounded-md hover:bg-red-700 font-poppins text-[10px] h-7 pt-2 pb-3"
                      >
                        Call Now
                      </button>
                    </div>
                    <div className="flex-1 -ml-24">
                      <a
                        href="https://wa.me/919560005265?text=Welcome%20to%20Foxnet%2C%20how%20I%20can%20help%20you%20today%21%21"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="w-[45%] bg-green-600 text-white py-1 px-1 rounded-md hover:bg-green-700 font-poppins text-[10px] h-7 pt-2 pb-3 pl-2">
                          <div className="flex">
                            <img
                              src="/whatsapp.png"
                              alt=""
                              className="h-3 w-3 mt-[1.5%]"
                            />
                            <span className="ml-1 -pt-1">WhatsApp</span>
                          </div>
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add icon with tooltip */}
            <button
              className="bg-custom-gradient text-white p-2 w-8 h-8 flex items-center justify-center rounded-md relative create-ticket-button"
              onClick={() => navigate("/dashboard/create-ticket")}
              onMouseEnter={() => handleTooltipVisibility("createTicket")}
              onMouseLeave={() => handleTooltipHide("createTicket")}
            >
              <FontAwesomeIcon icon={faPlus} className="text-2xl" />
            </button>
            {tooltipVisible.createTicket && (
              <div className="custom-tooltip visible">Create Ticket</div>
            )}

            {/* Bell icon */}
            {/* Bell icon */}
            <div className="relative" ref={notificationRef}>
              <button
                className="notification-button bg-custom-gradient relative"
                onClick={toggleNotifications}
                onMouseEnter={() => handleTooltipVisibility("notification")}
                onMouseLeave={() => handleTooltipHide("notification")}
              >
                <img src="/bell.png" alt="Notification Bell" className="icon" />
                {notifications.filter((n) => n.status === "unread").length >
                  0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.filter((n) => n.status === "unread").length}
                  </span>
                )}
              </button>
              {tooltipVisible.notification && (
                <div className="custom-tooltip visible">Notification</div>
              )}

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-black text-white rounded-lg shadow-lg border border-gray-300 z-50"
                  style={{
                    maxHeight: "300px",
                    overscrollBehavior: "contain",
                  }}
                >
                  <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-black rounded-t-lg">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Notifications
                      </h3>
                    </div>
                    <div className="flex space-x-3">
                      {notifications.some((n) => n.status === "unread") && (
                        <button
                          className="text-sm text-white hover:text-gray-300 border border-white rounded-md px-2 py-1 transition-all duration-200"
                          onClick={markAllNotificationsAsRead}
                        >
                          Mark All Read
                        </button>
                      )}
                      <button
                        className="text-sm text-white hover:text-gray-300 border border-white rounded-md px-2 py-1 transition-all duration-200"
                        onClick={clearAllNotifications}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    <div
                      className="max-h-64 overflow-y-auto scrollbar-hide bg-black rounded-b-lg"
                      style={{
                        overflowY: "scroll",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-700 transition-all duration-200 border-b border-gray-500 flex justify-between items-center
              ${notification.status === "unread" ? "bg-gray-800" : ""}`}
                        >
                          <div>
                            <p className="text-sm text-white font-medium">
                              {notification.message}
                            </p>
                            {notification.status === "unread" && (
                              <span className="text-xs text-indigo-400 font-semibold ml-2">
                                New
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {notification.status === "unread" && (
                              <button
                                onClick={() =>
                                  markNotificationAsRead(notification.id)
                                }
                                className="text-sm text-white hover:text-gray-300 font-medium transition-all duration-200 border border-white rounded-md px-2 py-1 mr-2"
                              >
                                Read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <MenuButton
                  onMouseEnter={() => handleTooltipVisibility("profile")}
                  onMouseLeave={() => handleTooltipHide("profile")}
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 bg-yellow-200 rounded-full flex justify-center items-center text-yellow-500 text-2xl font-poppins">
                    {userInitials}
                  </div>
                </MenuButton>
                {tooltipVisible.profile && (
                  <div className="custom-tooltip visible">Profile</div>
                )}
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-poppins"
                    onClick={() => navigate("/dashboard/Profileform")}
                  >
                    Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-poppins"
                    onClick={() => setAddEmailsModalOpen(true)} // Open the modal
                  >
                    Emails
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-poppins"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>

            {/* Add Emails Modal */}
            {isAddEmailsModalOpen && (
              <AddEmailsPage
                onClose={() => setAddEmailsModalOpen(false)} // Change onRequestClose to onClose
                mobileNumber={mobileNumber} // Pass the mobile number here
              />
            )}
          </div>
          
        </div>
      </div>
      <div
        style={{
          border: "0.5px solid rgba(200, 203, 217, 1)",
          width: "100vw", // Use 100% instead of 100vw
        }}
        className="mt-1"
      />
    </nav>
  );
};

export default Navbar;

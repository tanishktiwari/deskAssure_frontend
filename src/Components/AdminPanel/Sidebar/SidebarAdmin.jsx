import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarAdmin = () => {
  const location = useLocation();

  return (
    <div className="bg-custom-blue1 text-gray-300 w-64 h-full shadow-lg">
      <div className="p-4">
        <ul>
          <li className="flex items-center mb-4">
            <img src="" alt="" className="w-8 h-8 mr-2" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${location.pathname === "/" ? "bg-gray-700" : ""}`}>
            <Link to="/">
              <img
                src="https://cdn-icons-png.flaticon.com/128/846/846449.png"
                className="w-6 h-6 mr-2"
                alt="Dashboard"
              />
              <span className="sidebar_text">Dashboard</span>
            </Link>
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${location.pathname === "/open" ? "bg-gray-700" : ""}`}>
            <Link to="/openticketadmin">
              <img
                src="https://cdn-icons-png.flaticon.com/128/1234/1234036.png"
                className="w-6 h-6 mr-2"
                alt="Open"
              />
              <span className="sidebar_text">Open</span>
            </Link>
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${location.pathname === "/close" ? "bg-gray-700" : ""}`}>
            <Link to="/closeticketadmin">
              <img
                src="https://cdn-icons-png.flaticon.com/128/17663/17663136.png"
                className="w-6 h-6 mr-2"
                alt="Closed"
              />
              <span className="sidebar_text">Close</span>
            </Link>
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${location.pathname === "/company" ? "bg-gray-700" : ""}`}>
            <Link to="/company">
              <img
                src="https://cdn-icons-png.flaticon.com/128/993/993891.png"
                className="w-6 h-6 mr-2"
                alt="Company"
              />
              <span className="sidebar_text">Company</span>
            </Link>
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${location.pathname === "/operator" ? "bg-gray-700" : ""}`}>
            <Link to="/operator">
              <img
                src="https://cdn-icons-png.flaticon.com/128/1839/1839274.png"
                className="w-6 h-6 mr-2"
                alt="Operator"
              />
              <span className="sidebar_text">Operator</span>
            </Link>
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${location.pathname === "/engineers" ? "bg-gray-700" : ""}`}>
            <Link to="/engineers">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3220/3220202.png"
                className="w-6 h-6 mr-2"
                alt="Engineer"
              />
              <span className="sidebar_text">Engineer</span>
            </Link>
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${location.pathname === "/issue-category-details" ? "bg-gray-700" : ""}`}>
            <Link to="/issue-category-details">
              <img
                src="https://cdn-icons-png.flaticon.com/128/4013/4013399.png"
                className="w-6 h-6 mr-2"
                alt="Category"
              />
              <span className="sidebar_text">Category</span>
            </Link>
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${location.pathname === "/report" ? "bg-gray-700" : ""}`}>
            <Link to="/report">
              <img
                src="https://cdn-icons-png.flaticon.com/128/17514/17514983.png"
                className="w-6 h-6 mr-2"
                alt="Report"
              />
              <span className="sidebar_text">Report</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarAdmin;

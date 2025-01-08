import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import "../IssueCategory/IssueCategoryDetails.css";

const IssueCategoryDetails = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [issueCategory, setIssueCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [showSearchBox, setShowSearchBox] = useState(false); // State for showing search box
  const itemsPerPage = 10;

  // Fetch all issue categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/issue-categories`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching issue categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddClick = () => {
    setShowPopup(true);
    setEditingCategoryId(null);
    setIssueCategory("");
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditingCategoryId(null);
    setIssueCategory("");
  };

  const handleInputChange = (e) => {
    setIssueCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleSearchIconClick = () => {
    setShowSearchBox(!showSearchBox);
  };

  const handleSubmit = async () => {
    if (!issueCategory) {
      alert("Issue Category is required");
      return;
    }

    try {
      const method = editingCategoryId ? "PUT" : "POST";
      const url = editingCategoryId
        ? `${import.meta.env.VITE_API_URL}/issue-categories/${editingCategoryId}`
        : `${import.meta.env.VITE_API_URL}/issue-categories`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: issueCategory }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (editingCategoryId) {
        setCategories(categories.map((category) =>
          category._id === editingCategoryId ? result : category
        ));
      } else {
        setCategories([...categories, result]);
      }

      setShowPopup(false);
      setIssueCategory("");
    } catch (error) {
      console.error("Error adding or updating issue category:", error);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategoryId(category._id);
    setIssueCategory(category.name);
    setShowPopup(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/issue-categories/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setCategories(categories.filter((category) => category._id !== id));
      } catch (error) {
        console.error("Error deleting issue category:", error);
      }
    }
  };

  // Search functionality
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalEntries = filteredCategories.length; // Define totalEntries here
  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-4 ml-[12%] mt-14">
      {/* Statistics section */}
      <div className="flex justify-between items-center bg-white p-6 shadow-md rounded-md mb-6">
        <div className="flex items-center">
          <img
            src="/Group_10.png"
            alt="Operator Icon"
            className="mr-4 h-16 w-16"
          />
          <div className="flex flex-col items-start">
            <div className="text-4xl font-semibold text-green-600">
              {totalEntries}
            </div>
            <div className="text-gray-500">Total Issue Categories</div>
          </div>
        </div>
        <div className="flex items-center">
          <img
            src="/Group_11.png"
            alt="Company Icon"
            className="mr-4 h-16 w-16"
          />
          <div className="flex flex-col items-start">
            <div className="text-4xl font-semibold text-gray-800">
              {totalEntries}
            </div>
            <div className="text-gray-500">Companies</div>
            {/* <div className="text-sm text-red-500">↓ 1% this month</div> */}
          </div>
        </div>
        <div className="flex items-center">
          <img
            src="/Group_12.png"
            alt="Ticket Icon"
            className="mr-4 h-16 w-16"
          />
          <div className="flex flex-col items-start">
            <div className="text-4xl font-semibold text-green-600">189</div>
            <div className="text-gray-500">Active Tickets</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 shadow-md rounded-md">
        {/* Header and Search */}
        <div className="bg-white p-6 shadow-md rounded-md mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Company Details</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSearchBox(!showSearchBox)}
                className="relative"
              >
                <img src="/search.png" alt="Search" className="w-6 h-6" />
              </button>
              {showSearchBox && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border rounded-md py-2 px-4"
                />
              )}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleAddClick}
              >
                ADD Category
              </button>
            </div>
          </div>

          {showPopup && (
            <div className="popup-overlay-issue">
              <div className="popup-container-issue">
                <div className="popup-header-issue">
                  <h3>{editingCategoryId ? "Edit Issue Category" : "Create Issue Category"}</h3>
                </div>
                <div className="popup-body-issue">
                  <label htmlFor="issue-category">
                    Issue Category<span className="required-star">*</span>
                  </label>
                  <input
                    id="issue-category"
                    type="text"
                    placeholder="Enter your category issue"
                    value={issueCategory}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="popup-footer-issue">
                  <button className="cancel-button" onClick={handleClosePopup}>
                    Cancel
                  </button>
                  <button className="submit-button" onClick={handleSubmit}>
                    {editingCategoryId ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 p-4 text-left">Issue - Category Name</th>
              <th className="border-b-2 p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((category) => (
              <tr key={category._id}>
                <td className="border-b p-4">{category.name}</td>
                <td className="border-b p-4">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div>
          Showing data {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="px-4 py-2 border rounded-md"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          <button
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: "#5932EA" }}
          >
            {currentPage}
          </button>

          <button
            className="px-4 py-2 border rounded-md"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCategoryDetails;

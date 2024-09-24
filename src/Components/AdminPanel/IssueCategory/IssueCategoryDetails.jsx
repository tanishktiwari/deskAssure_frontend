import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa"; // Import icons
import "../IssueCategory/IssueCategoryDetails.css"; // Ensure this file exists for styling

const IssueCategoryDetails = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [issueCategory, setIssueCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const itemsPerPage = 10;

  // Fetch all issue categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/issue-categories");
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

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1); // Reset to the first page on clear
  };

  const handleSubmit = async () => {
    if (!issueCategory) {
      alert("Issue Category is required");
      return;
    }

    try {
      const method = editingCategoryId ? "PUT" : "POST";
      const url = editingCategoryId
        ? `http://localhost:3000/issue-categories/${editingCategoryId}`
        : "http://localhost:3000/issue-categories";

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
        const response = await fetch(`http://localhost:3000/issue-categories/${id}`, {
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

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <div className="issue-category-container">
      <div className="header-container-issue">
        <h2>Issue Category Details</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input-box"
          />
          <button className="add-button" onClick={handleAddClick}>
            ADD Issue Category
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
                {editingCategoryId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="details-table-issue">
        <thead>
          <tr>
            <th>Option</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.map((category) => (
            <React.Fragment key={category._id}>
              <tr>
                <td>{category.name}</td>
                <td>
                  <button className="action-button" onClick={() => handleEditClick(category)}>
                    <FaEdit />
                  </button>
                  <button className="action-button" onClick={() => handleDeleteClick(category._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
              <tr className="row-divider"></tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span className="showing-text">
          Showing {paginatedCategories.length} of {filteredCategories.length} entries
        </span>
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`pagination-button ${index + 1 === currentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCategoryDetails;

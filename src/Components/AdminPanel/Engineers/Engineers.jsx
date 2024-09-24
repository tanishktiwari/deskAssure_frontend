import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../Engineers/Engineers.css";

const Engineers = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [engineerData, setEngineerData] = useState({
    name: "",
    title: "",
    email: "",
    mobile: "",
    contractType: "",
    managerName: "",
  });
  const [engineers, setEngineers] = useState([]);
  const [editingEngineerId, setEditingEngineerId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [errors, setErrors] = useState({
    name: "",
    title: "",
    email: "",
    mobile: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEngineers = async () => {
    try {
      const response = await fetch("http://localhost:3000/engineers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEngineers(data);
    } catch (error) {
      console.error("Error fetching engineers:", error);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  const handleAddClick = () => {
    setShowPopup(true);
    setEditingEngineerId(null);
    setEngineerData({
      name: "",
      title: "",
      email: "",
      mobile: "",
      contractType: "",
      managerName: "",
    });
    setErrors({ name: "", title: "", email: "", mobile: "" });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditingEngineerId(null);
    setEngineerData({
      name: "",
      title: "",
      email: "",
      mobile: "",
      contractType: "",
      managerName: "",
    });
    setErrors({ name: "", title: "", email: "", mobile: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEngineerData({ ...engineerData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = { name: "", title: "", email: "", mobile: "" };

    if (!engineerData.name) {
      newErrors.name = "Engineer Name is required";
      isValid = false;
    }

    if (!engineerData.title) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!engineerData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!engineerData.mobile) {
      newErrors.mobile = "Mobile is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const { name, title, email, mobile, contractType, managerName } =
      engineerData;

    try {
      const method = editingEngineerId ? "PUT" : "POST";
      const url = editingEngineerId
        ? `http://localhost:3000/engineers/${editingEngineerId}`
        : "http://localhost:3000/engineers";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          title,
          email,
          mobile,
          contractType,
          managerName,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchEngineers();
      setShowPopup(false);
      setEngineerData({
        name: "",
        title: "",
        email: "",
        mobile: "",
        contractType: "",
        managerName: "",
      });
    } catch (error) {
      console.error("Error adding or updating engineer:", error);
    }
  };

  const handleEditClick = (engineer) => {
    setEditingEngineerId(engineer._id);
    setEngineerData({
      name: engineer.name,
      title: engineer.title,
      email: engineer.email,
      mobile: engineer.mobile,
      contractType: engineer.contractType,
      managerName: engineer.managerName,
    });
    setShowPopup(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this engineer?")) {
      try {
        const response = await fetch(`http://localhost:3000/engineers/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        fetchEngineers();
      } catch (error) {
        console.error("Error deleting engineer:", error);
      }
    }
  };

  // Filter engineers based on search term
  const filteredEngineers = engineers.filter((engineer) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      (engineer.title && engineer.title.toLowerCase().includes(searchValue)) ||
      (engineer.name && engineer.name.toLowerCase().includes(searchValue)) ||
      (engineer.email && engineer.email.toLowerCase().includes(searchValue)) ||
      (engineer.mobile &&
        engineer.mobile.toLowerCase().includes(searchValue)) ||
      (engineer.contractType &&
        engineer.contractType.toLowerCase().includes(searchValue)) ||
      (engineer.managerName &&
        engineer.managerName.toLowerCase().includes(searchValue))
    );
  });

  const paginatedEngineers = filteredEngineers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);

  return (
    <div className="engineer-container">
      <div className="header-container">
        <h2>Engineer Details</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-box"
          />
          <button className="add-button" onClick={handleAddClick}>
            ADD Engineer
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay-engineers">
          <div className="popup-container-engineers">
            <div className="popup-header-engineers">
              <h3>{editingEngineerId ? "Edit Engineer" : "Create Engineer"}</h3>
            </div>
            <div className="popup-body-engineers">
              <div className="title-name">
                <label htmlFor="title">
                  Title<span className="required-star">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter title"
                  value={engineerData.title}
                  onChange={handleInputChange}
                />
                {errors.title && (
                  <p className="error-message">{errors.title}</p>
                )}

                <label htmlFor="name">
                  Engineer Name<span className="required-star">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter engineer name"
                  value={engineerData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
              <div className="title-name">
                <label htmlFor="email">
                  Email<span className="required-star">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={engineerData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}

                <label htmlFor="mobile">
                  Mobile<span className="required-star">*</span>
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="text"
                  placeholder="Enter mobile number"
                  value={engineerData.mobile}
                  onChange={handleInputChange}
                />
                {errors.mobile && (
                  <p className="error-message">{errors.mobile}</p>
                )}
              </div>
              <div className="title-name">
                <label htmlFor="contractType">Contract Type</label>
                <input
                  id="contractType"
                  name="contractType"
                  type="text"
                  placeholder="Enter contract type"
                  value={engineerData.contractType}
                  onChange={handleInputChange}
                />

                <label htmlFor="managerName">Manager Name</label>
                <input
                  id="managerName"
                  name="managerName"
                  type="text"
                  placeholder="Enter manager name"
                  value={engineerData.managerName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="popup-footer-engineers">
              <button className="cancel-button" onClick={handleClosePopup}>
                Cancel
              </button>
              <button className="submit-button" onClick={handleSubmit}>
                {editingEngineerId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="details-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Engineer Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Contract Type</th>
            <th>Manager Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEngineers.map((engineer) => (
            <React.Fragment key={engineer._id}>
              <tr>
                <td>{engineer.title}</td>
                <td>{engineer.name}</td>
                <td>{engineer.email}</td>
                <td>{engineer.mobile}</td>
                <td>{engineer.contractType}</td>
                <td>{engineer.managerName}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleEditClick(engineer)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleDeleteClick(engineer._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
              <tr className="row-divider"></tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="table-footer-engineers">
        <span className="showing-text">
          Showing {paginatedEngineers.length} of {filteredEngineers.length}{" "}
          entries
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
              className={`pagination-button ${
                index + 1 === currentPage ? "active" : ""
              }`}
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

export default Engineers;

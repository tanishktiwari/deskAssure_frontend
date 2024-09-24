import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import "../Operator/Operator.css";

const Operator = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [operatorName, setOperatorName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [contractType, setContractType] = useState("");
  const [managerName, setManagerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [operators, setOperators] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editingOperatorId, setEditingOperatorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Fetch all operators and companies on component mount
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await fetch("http://localhost:5174/operators");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOperators(data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:5174/companies");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchOperators();
    fetchCompanies();
  }, []);

  const handleAddClick = () => {
    setShowPopup(true);
    setEditingOperatorId(null);
    setOperatorName("");
    setEmail("");
    setMobile("");
    setContractType("");
    setManagerName("");
    setCompanyName(""); // Reset companyName for new entry
    setTitle("");
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditingOperatorId(null);
    setOperatorName("");
    setEmail("");
    setMobile("");
    setContractType("");
    setManagerName("");
    setCompanyName(""); // Reset companyName
    setTitle("");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "operator-name":
        setOperatorName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "contract-type":
        setContractType(value);
        break;
      case "manager-name":
        setManagerName(value);
        break;
      case "company-name":
        setCompanyName(value);
        break;
      case "title-box":
        setTitle(value);
        break;
      default:
        break;
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSubmit = async () => {
    if (!operatorName || !email || !companyName || !title) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const method = editingOperatorId ? "PUT" : "POST";
      const url = editingOperatorId
        ? `http://localhost:5174/operators/${editingOperatorId}`
        : "http://localhost:5174/operators";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operatorName,
          email,
          companyName,
          mobile,
          contractType,
          managerName,
          title,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (editingOperatorId) {
        setOperators(
          operators.map((operator) =>
            operator._id === editingOperatorId ? result : operator
          )
        );
      } else {
        setOperators([...operators, result]);
      }

      setShowPopup(false);
      setOperatorName("");
      setEmail("");
      setMobile("");
      setContractType("");
      setManagerName("");
      setCompanyName("");
      setTitle("");
    } catch (error) {
      console.error("Error adding or updating operator:", error);
    }
  };

  const handleEditClick = (operator) => {
    setEditingOperatorId(operator._id);
    setOperatorName(operator.operatorName);
    setEmail(operator.email);
    setMobile(operator.mobile);
    setContractType(operator.contractType);
    setManagerName(operator.managerName);
    setCompanyName(operator.companyName); // Set the companyName
    setTitle(operator.title);
    setShowPopup(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this operator?")) {
      try {
        const response = await fetch(`http://localhost:5174/operators/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setOperators(operators.filter((operator) => operator._id !== id));
      } catch (error) {
        console.error("Error deleting operator:", error);
      }
    }
  };

  // Search functionality across multiple fields
  const filteredOperators = operators.filter((operator) => {
    const search = searchTerm.toLowerCase();
    return (
      operator.title.toLowerCase().includes(search) ||
      operator.operatorName.toLowerCase().includes(search) ||
      operator.email.toLowerCase().includes(search) ||
      operator.companyName.toLowerCase().includes(search) ||
      operator.mobile.toLowerCase().includes(search) ||
      operator.contractType.toLowerCase().includes(search) ||
      operator.managerName.toLowerCase().includes(search)
    );
  });

  // Pagination logic
  const paginatedOperators = filteredOperators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOperators.length / itemsPerPage);

  return (
    <div className="operator-container">
      <div className="header-container">
        <h2>Ticket Owner Details</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-box"
          />
          <button className="add-button" onClick={handleAddClick}>
            ADD TICKET OWNER
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay-operator">
          <div className="popup-container-operator">
            <div className="popup-header-operator">
              <h3>
                {editingOperatorId
                  ? "Edit Ticket Owner"
                  : "Create Ticket Owner"}
              </h3>
            </div>
            <div className="popup-body-operator">
              <div className="operator-title-name">
                <label htmlFor="title-box">Title</label>
                <input
                  id="title-box"
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={handleInputChange}
                />
                <label htmlFor="operator-name">
                  Operator Name<span className="required-star">*</span>
                </label>
                <input
                  id="operator-name"
                  type="text"
                  placeholder="Enter operator name"
                  value={operatorName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="operator-title-name">
                <label htmlFor="email">
                  Email<span className="required-star">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleInputChange}
                />
                <label htmlFor="mobile">Mobile</label>
                <input
                  id="mobile"
                  type="text"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="operator-title-name">
                <label htmlFor="contract-type">Contract Type</label>
                <input
                  id="contract-type"
                  type="text"
                  placeholder="Enter contract type"
                  value={contractType}
                  onChange={handleInputChange}
                />
                <label htmlFor="manager-name">Manager Name</label>
                <input
                  id="manager-name"
                  type="text"
                  placeholder="Enter manager name"
                  value={managerName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="operator-title-name">
                <label htmlFor="company-name">
                  Company Name<span className="required-star">*</span>
                </label>
                <select
                  id="company-name"
                  value={companyName}
                  onChange={handleInputChange}
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="popup-footer-operator">
              <button className="cancel-button" onClick={handleClosePopup}>
                Cancel
              </button>
              <button className="submit-button" onClick={handleSubmit}>
                {editingOperatorId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="details-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Operator Name</th>
            <th>Email</th>
            <th>Company Name</th>
            <th>Mobile</th>
            <th>Contract Type</th>
            <th>Manager Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOperators.map((operator) => (
            <React.Fragment key={operator._id}>
              <tr>
                <td>{operator.title}</td>
                <td>{operator.operatorName}</td>
                <td>{operator.email}</td>
                <td>{operator.companyName}</td>
                <td>{operator.mobile}</td>
                <td>{operator.contractType}</td>
                <td>{operator.managerName}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleEditClick(operator)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleDeleteClick(operator._id)}
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

      <div className="table-footer">
        <span className="showing-text">
          Showing {paginatedOperators.length} of {filteredOperators.length}{" "}
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

export default Operator;

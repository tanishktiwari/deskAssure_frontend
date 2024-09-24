import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../Company/Company.css";

const Company = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "",
    gst: "",
    website: "",
    address: "",
    logo: "",
  });
  const [companies, setCompanies] = useState([]);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [errors, setErrors] = useState({
    name: "",
    gst: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3000/companies");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddClick = () => {
    setShowPopup(true);
    setEditingCompanyId(null);
    setCompanyData({ name: "", gst: "", website: "", address: "", logo: "" });
    setErrors({ name: "", gst: "" });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditingCompanyId(null);
    setCompanyData({ name: "", gst: "", website: "", address: "", logo: "" });
    setErrors({ name: "", gst: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = { name: "", gst: "" };

    if (!companyData.name) {
      newErrors.name = "Company Name is required";
      isValid = false;
    }

    if (!companyData.gst) {
      newErrors.gst = "Company GST is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const { name, gst, website, address, logo } = companyData;

    try {
      const method = editingCompanyId ? "PUT" : "POST";
      const url = editingCompanyId
        ? `http://localhost:3000/companies/${editingCompanyId}`
        : "http://localhost:3000/companies";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, gst, website, address, logo }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchCompanies();
      setShowPopup(false);
      setCompanyData({ name: "", gst: "", website: "", address: "", logo: "" });
    } catch (error) {
      console.error("Error adding or updating company:", error);
    }
  };

  const handleEditClick = (company) => {
    setEditingCompanyId(company._id);
    setCompanyData({
      name: company.name,
      gst: company.gst,
      website: company.website,
      address: company.address,
      logo: company.logo,
    });
    setShowPopup(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        const response = await fetch(`http://localhost:3000/companies/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        fetchCompanies();
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      company.name.toLowerCase().includes(searchValue) ||
      company.gst.toLowerCase().includes(searchValue) ||
      company.website.toLowerCase().includes(searchValue) ||
      company.address.toLowerCase().includes(searchValue)
    );
  });

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  return (
    <div className="company-container">
      <div className="header-container">
        <h2>Company Details</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-box"
          />
          <button className="add-button" onClick={handleAddClick}>
            ADD Company
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay-company">
          <div className="popup-container-company">
            <div className="popup-header-company">
              <h3>{editingCompanyId ? "Edit Company" : "Create Company"}</h3>
            </div>
            <div className="popup-body-company">
              <div className="title-name-company">
                <label htmlFor="name">
                  Company Name<span className="required-star">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter company name"
                  value={companyData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="error-message">{errors.name}</p>
                )}

                <label htmlFor="gst">
                  Company GST<span className="required-star">*</span>
                </label>
                <input
                  id="gst"
                  name="gst"
                  type="text"
                  placeholder="Enter company GST"
                  value={companyData.gst}
                  onChange={handleInputChange}
                />
                {errors.gst && <p className="error-message">{errors.gst}</p>}
              </div>
              <div className="title-name-company">
                <label htmlFor="website">
                  Website<span className="required-star">*</span>
                </label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  placeholder="Enter company website"
                  value={companyData.website}
                  onChange={handleInputChange}
                />
                  <label htmlFor="address">Company Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter company address"
                  value={companyData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="title-name-company">
                <label htmlFor="logo">Company Logo</label>
                <input
                  id="logo"
                  name="logo"
                  type="text"
                  placeholder="Enter company logo URL"
                  value={companyData.logo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="popup-footer-company">
              <button className="cancel-button" onClick={handleClosePopup}>
                Cancel
              </button>
              <button className="submit-button" onClick={handleSubmit}>
                {editingCompanyId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="details-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>GST</th>
            <th>Website</th>
            <th>Address</th>
            <th>Logo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCompanies.map((company) => (
            <React.Fragment key={company._id}>
              <tr>
                <td>{company.name}</td>
                <td>{company.gst}</td>
                <td>{company.website}</td>
                <td>{company.address}</td>
                <td>
                  {company.logo && (
                    <img
                      src={company.logo}
                      alt="Company Logo"
                      className="company-logo"
                    />
                  )}
                </td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleEditClick(company)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleDeleteClick(company._id)}
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

      <div className="table-footer-company">
        <span className="showing-text">
          Showing {paginatedCompanies.length} of {filteredCompanies.length}{" "}
          entries
        </span>
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Company;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileForm = () => {
  const [operatorData, setOperatorData] = useState({
    title: '',
    operatorName: '',
    email: '',
    companyName: '',
    mobile: '',
    contractType: '',
    managerName: '',
  });

  useEffect(() => {
    const mobileNumber = localStorage.getItem('loggedInUserMobileNumber');
    console.log('Mobile Number:', mobileNumber); // Debugging
    if (mobileNumber) {
      const fetchOperatorData = async () => {
        try {
          const response = await axios.get(`http://localhost:5174/operators/details/${mobileNumber}`);
          console.log('API Response:', response.data); // Debugging
          setOperatorData(response.data);
        } catch (error) {
          console.error('Error fetching operator data:', error);
        }
      };

      fetchOperatorData();
    } else {
      console.error('No mobile number found in local storage.');
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setOperatorData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileNumber = localStorage.getItem('loggedInUserMobileNumber');
    console.log('Submitting update for:', mobileNumber, operatorData); // Debugging
    try {
      const response = await axios.put(`http://localhost:5174/operators/update/${mobileNumber}`, operatorData);
      alert('Operator details updated successfully!');
    } catch (error) {
      console.error('Error updating operator details:', error.response ? error.response.data : error.message);
      alert('Failed to update operator details.'); // Notify user about the error
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8 pt-5">
      <div className="w-full bg-gray-800 text-white text-center py-2 mb-6">
        <h1 className="text-lg font-bold">Profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="flex flex-wrap -mx-3 mb-1 pb-5">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={operatorData.title}
              onChange={handleChange}
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center"
              placeholder='Title'
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="operatorName">
              Name
            </label>
            <input
              type="text"
              id="operatorName"
              value={operatorData.operatorName}
              onChange={handleChange}
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center"
              placeholder='Name'
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-wrap -mx-3 mb-1 pb-5">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={operatorData.email}
              onChange={handleChange}
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center"
              placeholder='abc@email.com'
            />
          </div>
        </div>

        {/* Company Name */}
        <div className="flex flex-wrap -mx-3 mb-1 pb-5">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="companyName">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={operatorData.companyName}
              onChange={handleChange}
              readOnly
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center"
              placeholder='Company Name'
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="flex flex-wrap -mx-3 mb-1 pb-5">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="mobile">
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              value={operatorData.mobile}
              onChange={handleChange}
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center"
              placeholder='Mobile Number'
            />
          </div>
        </div>

        {/* Contract Type */}
        <div className="flex flex-wrap -mx-3 mb-1 pb-5">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="contractType">
              Contract Type
            </label>
            <input
              type="text"
              id="contractType"
              value={operatorData.contractType}
              onChange={handleChange}
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center"
              placeholder='Contract Type'
            />
          </div>
        </div>

        {/* Manager Name */}
        <div className="flex flex-wrap -mx-3 mb-1 pb-5">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center" htmlFor="managerName">
              Manager Name
            </label>
            <input
              type="text"
              id="managerName"
              value={operatorData.managerName}
              onChange={handleChange}
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center"
              placeholder='Manager Name'
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;

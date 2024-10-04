// components/SearchByPan.js
import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const SearchByPan = () => {
  const [pan, setPan] = useState(""); // To store the entered PAN number
  const [orgData, setOrgData] = useState(null); // To store the organization data fetched from the server
  const [loading, setLoading] = useState(false); // To show a loading indicator
  const [error, setError] = useState(""); // To store error messages

  const handleSearch = async () => {
    if (pan.trim() === "") {
      setError("Please enter a valid PAN number.");
      setOrgData(null);
      return;
    }

    setLoading(true);
    setError("");
    setOrgData(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/org/${pan}`);
      setOrgData(response.data.orgSaved); // Store the organization data
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No data found for the given PAN number.");
      } else {
        setError("An error occurred while fetching the organization details.");
      }
      setLoading(false);
    }
  };

  return (
    <>   
    <div className="container mx-auto my-6 p-4 mt-14">
      <h1 className="text-3xl font-bold text-center mb-6">Search Organization by PAN</h1>
      <div className="max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Enter PAN Number"
          value={pan}
          onChange={(e) => setPan(e.target.value)}
          className="p-3 border rounded w-full mb-4"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white p-3 rounded-md"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {/* Show error message */}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        {/* Show organization data if available */}
        {orgData && (
          <div className="mt-6 bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold mb-4">Organization Details</h2>
            <p><strong>Name:</strong> {orgData[0]?.name}</p>
            <p><strong>PAN:</strong> {orgData[0]?.pan}</p>
            <p><strong>Type of Assessee:</strong> {orgData[0]?.typeOfAssessee}</p>
            <p><strong>Phone No:</strong> {orgData[0]?.PhoneNo}</p>
            <p><strong>Email:</strong> {orgData[0]?.EmailId}</p>
            <p><strong>Date of Incorporation:</strong> {new Date(orgData[0]?.dateOfIncorporation).toLocaleDateString()}</p>
            <p><strong>GSTIN:</strong> {orgData[0]?.gstDetails?.gstin || "N/A"}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default SearchByPan;

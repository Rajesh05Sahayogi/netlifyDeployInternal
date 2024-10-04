import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SalesPersonDashboard = () => {
  const [leads, setLeads] = useState([]); // State to store leads
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [status, setStatus] = useState({}); // State to store selected status for each lead
  const [disabledStatus, setDisabledStatus] = useState({}); // State to store disabled status for each lead
  const [noResponseReasons, setNoResponseReasons] = useState({}); // State to store reasons for no response
  const [showSubmitButton, setShowSubmitButton] = useState({}); // State to control submit button visibility

  // Function to fetch leads
  const leadsInfo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/contact/assigned-work`, { withCredentials: true });
      setLeads(response.data.assignedWork || []); // Store the leads in the state
      setLoading(false); // Stop loading
    } catch (err) {
      setError('Failed to fetch leads');
      setLoading(false);
    }
  };

  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Check user role and department
    if (user?.role !== "User" && user?.department !== "Sales") {
      navigate("/");
    }
  }, [user]);

  // Function to handle status change and enable the response box
  const handleStatusChange = (leadId, newStatus) => {
    console.log("Lead ID: ", leadId);
    console.log("Selected Status:", newStatus);

    // Update status for the lead
    setStatus((prevStatus) => ({
      ...prevStatus,
      [leadId]: newStatus
    }));

    // Show the submit button when any status is selected
    setShowSubmitButton((prevShow) => ({
      ...prevShow,
      [leadId]: true // Show submit button for this lead
    }));

    // If "no response" is selected, enable the response box
    if (newStatus === 'no_response') {
      setNoResponseReasons((prevReasons) => ({
        ...prevReasons,
        [leadId]: '' // Initialize an empty reason for this lead
      }));
    } else {
      // Hide the reason input if not "no response"
      setNoResponseReasons((prevReasons) => ({
        ...prevReasons,
        [leadId]: undefined
      }));
    }
  };

  // Handle reason input change
  const handleReasonChange = (leadId, reason) => {
    setNoResponseReasons((prevReasons) => ({
      ...prevReasons,
      [leadId]: reason
    }));
  };

  // Function to submit the status and reason
  const handleSubmitStatus = async (leadId) => {
    const newStatus = status[leadId];
    const reason = noResponseReasons[leadId];
    console.log("current Status",newStatus)
    console.log("current Lead id",leadId)
    
    if(newStatus=="no_response")
    {
      console.log("inside noReson",newStatus)
    try {
      const payload = { reason: newStatus };
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/contact/no-response-or-follow-up/${leadId}`, payload, {
        withCredentials: true
      });

      console.log("lead response", response);

      // Disable the dropdown, textarea, and submit button after submission
      setDisabledStatus((prevDisabled) => ({
        ...prevDisabled,
        [leadId]: true
      }));
      setShowSubmitButton((prevShow) => ({
        ...prevShow,
        [leadId]: false // Hide submit button after submission
      }));

      // Call leadsInfo again to refresh the lead data
      leadsInfo(); // Fetch updated leads after status submission

    } catch (err) {
      console.error(`Failed to update status for lead ${leadId}`, err);
    }
  }
  if(newStatus=="approved")
  {
    console.log("lead id at approved",leadId)
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/contact/done/${leadId}`,{},
      {
        withCredentials: true
      });

      console.log("APPROVE response", response);

      // Disable the dropdown, textarea, and submit button after submission
      setDisabledStatus((prevDisabled) => ({
        ...prevDisabled,
        [leadId]: true
      }));
      setShowSubmitButton((prevShow) => ({
        ...prevShow,
        [leadId]: false // Hide submit button after submission
      }));

      // Call leadsInfo again to refresh the lead data
      leadsInfo(); // Fetch updated leads after status submission

    } catch (err) {
      console.error(`Failed to update status for lead ${leadId}`, err);
    } 
  }
  };

  // Call leadsInfo function on component mount
  useEffect(() => {
    leadsInfo(); // Fetch the leads when the component is mounted
  }, []); // Empty dependency array ensures this runs only once when the component is first rendered

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='px-10 py-10'>
      <h1>Sales Person Dashboard</h1>

      {leads.length > 0 ? (
        leads.map((lead) => (
          <div key={lead._id} className="lead-card" style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
            <div className='flex flex-wrap gap-5'>
              <p>Id: {lead._id}</p>
              <p>Name: {lead.name}</p>
              <p>Business Name: {lead.businessName}</p>
              <p>Email: {lead.email}</p>
              <p>Phone: {lead.phoneNo}</p>
              <p>Description: {lead.description}</p>
            </div>

            <div className='my-4 flex justify-between'>
              <div>
                <p>Status: {lead.status}</p>
                <p>Last Contacted: {new Date(lead.lastContactedAt).toLocaleString()}</p>
                <p>Follow-Up Attempts: {lead.followUpAttempts}</p>

                {/* Scrollable Dropdown for Status */}
                <div>
                  <select
                    value={status[lead._id] || lead.status} // Show the current status
                    onChange={(e) => handleStatusChange(lead._id, e.target.value)} // Handle the status change and send the lead ID
                    disabled={disabledStatus[lead._id] || false} // Disable dropdown if status is submitted
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    <option value="pending">Pending</option>
                    <option value="no_response">No Response</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Display input for reason if "no response" is selected */}
                {status[lead._id] === 'no_response' && (
                  <div className="mt-2">
                    <textarea
                      placeholder="Enter reason for no response"
                      value={noResponseReasons[lead._id] || ''}
                      onChange={(e) => handleReasonChange(lead._id, e.target.value)}
                      className="w-full border border-gray-300 rounded p-2"
                      disabled={disabledStatus[lead._id] || false} // Disable textarea after submission
                    />
                  </div>
                )}

                {/* Submit Button */}
                {showSubmitButton[lead._id] && (
                  <button
                    onClick={() => handleSubmitStatus(lead._id)} // Submit the status and reason
                    style={{ backgroundColor: 'blue', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}
                    disabled={disabledStatus[lead._id] || false} // Disable submit button after submission
                  >
                    Submit Response
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No leads assigned.</p>
      )}
    </div>
  );
};

export default SalesPersonDashboard;

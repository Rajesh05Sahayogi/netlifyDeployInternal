 import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../App.css';
 
const SalesAdmin = () => {
  // const user = useSelector(state => state?.user?.user)
  // const navigate = useNavigate()


  // useEffect(()=>{
  //     if(user?.role !== "Admin" && user?.department !== "Sales"){
  //         navigate("/")
  //     }
  // },[user])

  
  const [contactInfo, setContactInfo] = useState([]); // Store contact details as an array
  const [salesPerInfo, setSalesPerInfo] = useState([]); // Store sales-related info
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedSalesperson, setSelectedSalesperson] = useState({}); // Store selected salesperson for each contact
  const [assignedLeads, setAssignedLeads] = useState({}); // Track assigned leads by contactId
 
  const fetchContactInfo = async (signal) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/contact/details`,{ withCredentials: true });
      console.log(response.data.contacts)
      setContactInfo(response.data.contacts || []); // Ensure it's an array
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled', err.message);
      } else {
        setError('Failed to fetch contact details');
        console.error(err);
      }
    }
  };
 
  const fetchSalesInfo = async (signal) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/OS/getAllApproved`, { signal });
      const filteredSalesData = response.data.user.filter(
        (user) => user.department === 'Sales' && user.role!="Admin"
      );
      setSalesPerInfo(filteredSalesData || []); // Ensure it's an array
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled', err.message);
      } else {
        setError('Failed to fetch sales info');
        console.error(err);
      }
    }
  };
 
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      await Promise.all([fetchContactInfo(controller.signal), fetchSalesInfo(controller.signal)]);
      setLoading(false); // Only stop loading once both requests are done
    };
 
    fetchData();
 
    return () => controller.abort(); // Cleanup if the component unmounts
  }, []);
 
  // Handle change in dropdown for each contact
  const handleSalespersonChange = (contactId, salespersonId) => {
    setSelectedSalesperson((prevSelectedSalesperson) => ({
      ...prevSelectedSalesperson,
      [contactId]: salespersonId, // Ensure the salesperson is stored for the correct contact
    }));
  };
 
  // Function to assign lead to a salesperson
  const assignLead = async (contactId) => {
    const salespersonId = selectedSalesperson[contactId];
    if (salespersonId) {
      try {
        // Logic to assign lead to the salesperson
        console.log(`Assigning lead of contact ${contactId} to salesperson ${salespersonId}`);
        const response = await axios.put(`http://localhost:5004/api/contact/assign/${contactId}`, {
          assignId: salespersonId},{
          withCredentials: true 
        }
        );
        console.log("Response Status",response)
        if (response.status === 200) {
          // Show pop-up success confirmation
          alert(`Lead assigned successfully to salesperson with ID: ${salespersonId}`);
 
          // Mark the contact as assigned and disable future assignments
          setAssignedLeads((prevAssignedLeads) => ({
            ...prevAssignedLeads,
            [contactId]: true,
          }));
        } else {
          alert('Failed to assign the lead. Please try again.');
        }
      } catch (err) {
        console.error('Error assigning lead:', err);
        alert('An error occurred while assigning the lead.');
      }
    } else {
      alert('Please select a salesperson first!');
    }
  };
 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
 
  return (
    <div className='p-10'>
      <h1>SaleshAmdin</h1>
 
      <h2>Contact Info</h2>
      {contactInfo.length > 0 ? (
        contactInfo.map((contact, index) => (
          <div
            key={index}
            className={`contact-row ${assignedLeads[contact._id] ? 'assigned' : ''}`} // Add 'assigned' class if lead is assigned
          >
            <div className="contact-details">
              <p>ID: {contact._id}</p>
              <p>Contact Name: {contact.name}</p>
              <p>Business Name: {contact.businessName}</p>
              <p>Email: {contact.email}</p>
              <p>Phone No: {contact.phoneNo}</p>
              <p>No of People want:{contact.userSize}</p>
              <div>
              <p>account:true</p>
              {
                (contact.crm)&&<p>crm:true</p>
              }
              {
                (contact.payroll)&&<p>crm:true</p>
              }
              {
                (contact.ecom)&&<p>crm:true</p>
              }
              
              </div>
            </div>
 
            <div className="contact-actions">
              {/* Dropdown to select a salesperson */}
              <select
                value={selectedSalesperson[contact._id] || ''} // Use contact._id for consistency
                onChange={(e) => handleSalespersonChange(contact._id, e.target.value)}
                disabled={assignedLeads[contact._id]} // Disable dropdown if lead is already assigned
              >
                <option value="">Select Salesperson</option>
                {salesPerInfo.map((salesperson) => (
                  <option key={salesperson._id} value={salesperson._id}>
                    {salesperson.name}
                  </option>
                ))}
              </select>
 
              {/* Button to assign lead */}
              <button
                className="assign-button"
                onClick={() => assignLead(contact._id)}
                disabled={assignedLeads[contact._id]} // Disable button if lead is already assigned
              >
                {assignedLeads[contact._id] ? 'Assigned' : 'Assign Lead'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No contact data available</p>
      )}
    </div>
  );
};
 
export default SalesAdmin;
 
 
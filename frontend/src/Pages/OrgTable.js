// components/OrgTable.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import {Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const OrgTable = () => {


  const user = useSelector(state => state?.user?.user)
  const navigate = useNavigate()


  useEffect(()=>{
      if(user?.role !== "SuperAdmin"){
          navigate("/")
      }
  },[user])


  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/org`); // Replace with your API endpoint
        setOrgs(response.data.orgs);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch organizations");
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>  
    <div className="container mx-auto my-6 px-4">
      <h1 className="text-xl font-bold mb-6 text-center">All Organizations</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Type of Assessee</th>
              <th className="py-3 px-6 text-left">PAN</th>
              <th className="py-3 px-6 text-left">Phone No</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">GSTIN</th>
              <th className="py-3 px-6 text-left">Date of Incorporation</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orgs.map((org) => (
              <tr key={org._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">
                    <Link to={`/OrgDashboard/superAdmin/org/${org.name}`}>{org.name}</Link>
                  </td>
                <td className="py-3 px-6 text-left">{org.typeOfAssessee}</td>
                <td className="py-3 px-6 text-left">{org.pan}</td>
                <td className="py-3 px-6 text-left">{org.PhoneNo}</td>
                <td className="py-3 px-6 text-left">{org.EmailId}</td>
                <td className="py-3 px-6 text-left">{org.gstDetails?.gstin || "N/A"}</td>
                <td className="py-3 px-6 text-left">{new Date(org.dateOfIncorporation).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default OrgTable;

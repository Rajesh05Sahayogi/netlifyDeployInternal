import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useSelector } from "react-redux";

const OnboardingTeam = () => {

  const user = useSelector(state => state?.user?.user)
  const navigate = useNavigate()


  useEffect(() => {
    if (user && (user.role !== "SuperAdmin" && (user.role !== "User" || user.department !== "OnBoard"))) {
      navigate("/");
    }
  }, [user, navigate]);
  


  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all approved users
  const getAllApprovedUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/contact/successful-leads-onBoard`,
        {
          withCredentials: true,
        }
      );
      setApprovedUsers(response.data.leads);
      setLoading(false);
    } catch (err) {
      setError("No data Fonud");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllApprovedUser();
  }, []);

  // Navigate to the CreateOrg page with the organization ID
  const handleCreateOrganization = (orgId) => {
    navigate(`/createOrg/${orgId}`);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="mt-20 flex flex-col items-center justify-center">
          {user?.role !== "SuperAdmin" ? (
            <h1 className="text-4xl text-black mb-4">Onboarding Team</h1>
          ) : (
            <h1 className="text-4xl text-black mb-4">Org For Creation</h1>
          )}



          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="w-full sm:w-2/3">
              {approvedUsers?.length > 0 ? (
                approvedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-blue-100 p-4 rounded-lg mb-4 shadow-lg flex flex-col md:flex-row relative"
                  >
                    <div className="flex justify-between gap-6">
                      <div className="flex flex-col gap-2">
                        <div>
                          <p className="text-lg font-semibold">
                            Name: {user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Email: {user.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Business Name: {user.businessName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Phone: {user.phoneNo}
                          </p>
                          <p className="text-sm text-gray-500">
                            Description: {user.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {user.status}
                          </p>
                        </div>
                        <div className="bg-blue-400 rounded-sm shadow-xl p-2">
                          <div className="flex justify-center">
                            <h2>Selected Module</h2>
                          </div>
                          <div>
                            <p>Account: true</p>
                            {user.ecom && <p>ecom: true</p>}
                            {user.payroll && <p>payroll: true</p>}
                            {user.crm && <p>crm: true</p>}
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-4 right-4">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          onClick={() => handleCreateOrganization(user._id)} // Pass orgId to the handler
                        >
                          Create Organization
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No approved users found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OnboardingTeam;

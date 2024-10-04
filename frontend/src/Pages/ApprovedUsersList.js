import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';

const ApprovedUsersList = () => {
  const [users, setUsers] = useState([]); // Ensure users is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'SuperAdmin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/OS/getAllApproved`);
        setUsers(response.data?.user || []); // Fallback to an empty array if response.data.user is undefined
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (users.length === 0) return <div>No approved users found</div>;

  return (
    <>
    <div className=" mx-auto my-3 px-4 mt-20">
      <h1 className="text-4xl font-bold mb-8 text-center">All OS Internal ApprovedUsersList</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Department</th>
              <th className="py-3 px-6 text-left">DOB</th>
              <th className="py-3 px-6 text-left">Date of Joining</th>
              <th className="py-3 px-6 text-left">Education</th>
              {/* <th className="py-3 px-6 text-left">Bank Details</th> */}
              <th className="py-3 px-6 text-left">View Details</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {user.name || 'N/A'}
                </td>
                <td className="py-3 px-6 text-left">{user.role || 'N/A'}</td>
                <td className="py-3 px-6 text-left">{user.email || 'N/A'}</td>
                <td className="py-3 px-6 text-left">{user.phoneNumber || 'N/A'}</td>
                <td className="py-3 px-6 text-left">{user.department || 'N/A'}</td>
                <td className="py-3 px-6 text-left">
                  {user.DOB ? new Date(user.DOB).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-3 px-6 text-left">
                  {user.DateOfJoining ? new Date(user.DateOfJoining).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-3 px-6 text-left">
                  {user.educationQualification
                    ? `${user.educationQualification.highestDegree}, ${user.educationQualification.university}, ${user.educationQualification.year}`
                    : 'N/A'}
                </td>
                {/* <td className="py-3 px-6 text-left">
                  {user.bankAccountDetails
                    ? `Bank: ${user.bankAccountDetails.bankName}, A/C: ${user.bankAccountDetails.accountNumber}, IFSC: ${user.bankAccountDetails.IFSC}`
                    : 'N/A'}
                </td> */}
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => navigate(`*`)}
                    className="text-blue-500 hover:underline"
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default ApprovedUsersList;

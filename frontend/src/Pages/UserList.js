import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserList = () => {
  const [users, setUsers] = useState([]);
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
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/OS/getAll`);
        if (response.data.user.length > 0) {
          setUsers(response.data.user);
        } else {
          setError('No users found');
        }
        setLoading(false);
      } catch (err) {
        setError('No data Found');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='h-96 w-full flex items-center justify-center text-2xl'>{error}</div>;

  return (
    <div className="mx-auto my-3 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">All OS Internal Users</h1>

      {users.length === 0 ? (
        <div className="text-center text-xl">No users available</div>
      ) : (
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
                <th className="py-3 px-6 text-left">Bank Details</th>
                <th className="py-3 px-6 text-left">View Details</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
                  <td className="py-3 px-6 text-left">{user.role}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.phoneNumber}</td>
                  <td className="py-3 px-6 text-left">{user.department}</td>
                  <td className="py-3 px-6 text-left">{new Date(user.DOB).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-left">{new Date(user.DateOfJoining).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-left">
                    {`${user.educationQualification.highestDegree}, ${user.educationQualification.university}, ${user.educationQualification.year}`}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {`Bank: ${user.bankAccountDetails.bankName}, A/C: ${user.bankAccountDetails.accountNumber}, IFSC: ${user.bankAccountDetails.IFSC}`}
                  </td>
                  <td className="py-3 px-6 text-nowrap text-left">
                    <button
                      onClick={() => navigate(`/user/${user._id}`)}
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
      )}
    </div>
  );
};

export default UserList;

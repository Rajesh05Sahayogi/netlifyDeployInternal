import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const OrgApprovalPage = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState(''); // State for handling errors

    // Fetch organizations from the API
    const fetchOrganizations = async () => {
        try {
            setLoading(true); // Start loading
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/org/get-unapproved`, {
                withCredentials: true
            });
            if (response.data.Org && response.data.Org.length > 0) {
                setOrganizations(response.data.Org);  // Map response to Org array
            } else {
                setResponseMessage('No organizations found.');
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
            setError('Failed to load organizations.');
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Approve organization
    const handleApprove = async (orgId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/org/approveOrgById`, 
                { id: orgId }, // Send orgId in the request body
                { withCredentials: true }
            );
            setResponseMessage(response.data.message);
            fetchOrganizations(); // Refresh the list after approving
        } catch (error) {
            console.error('Error approving organization:', error);
            setError('Failed to approve organization.');
        }
    };

    // Reject organization
    const handleReject = async (orgId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/contact/reject/${orgId}`, {}, {
                withCredentials: true
            });
            setResponseMessage(response.data.message);
            fetchOrganizations();  // Refresh the list after rejecting
        } catch (error) {
            console.error('Error rejecting organization:', error);
            setError('Failed to reject organization.');
        }
    };

    if (loading) {
        return <p>Loading organizations...</p>;
    }

    return (
        <>
            <div className="mt-20 container mx-auto p-8">
                <h1 className="text-2xl font-bold mb-4">Organization for Approval</h1>
                {/* Response message */}
                {responseMessage && <p className="text-center text-green-500 mt-4">{responseMessage}</p>}

                {/* Organization table or no data message */}
                {organizations.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 p-2 text-left">Organization Name</th>
                                <th className="border border-gray-300 p-2 text-left">Email</th>
                                <th className="border border-gray-300 p-2 text-left">Phone No</th>
                                <th className="border border-gray-300 p-2 text-left">PAN</th>
                                <th className="border border-gray-300 p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {organizations.map((org) => (
                                <tr key={org._id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2">{org.name}</td>
                                    <td className="border border-gray-300 p-2">{org.EmailId}</td>
                                    <td className="border border-gray-300 p-2">{org.PhoneNo}</td>
                                    <td className="border border-gray-300 p-2">{org.pan}</td>
                                    <td className="border border-gray-300 p-2 flex gap-2">
                                        <button
                                            onClick={() => handleApprove(org._id)}
                                            className="bg-green-500 text-white p-1 rounded"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(org._id)}
                                            className="bg-red-500 text-white p-1 rounded"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center mt-4 text-gray-500">No organizations found.</p>
                )}
            </div>
        </>
    );
};

export default OrgApprovalPage;

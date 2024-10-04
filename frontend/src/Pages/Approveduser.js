import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Approveduser = () => {
    const { id } = useParams(); // Get the user ID from the URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState("");

    const userdATA = useSelector((state) => state?.user?.user);
    const navigate = useNavigate();

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/OS/getUser/${id}`); // Replace with your API endpoint
            setUser(response.data.user);
            setLoading(false);
        } catch (err) {
            setError('Error fetching user details');
            setLoading(false);
        }
    };

    // Fetch user details based on ID
    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    // Redirect if the user is not a SuperAdmin
    useEffect(() => {
        if (userdATA?.role !== 'SuperAdmin') {
            navigate('/');
        }
    }, [userdATA, navigate]);

    // Handle Approve User Action
    const handleApprove = async () => {
        setActionLoading(true); // Set loading state while the action is being processed
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/OS/approve/${id}`,
                { withCredentials: true }
            );
            setActionMessage("User has been approved successfully.");
            fetchUserDetails(); // Refresh the user details after approval
        } catch (err) {
            setActionMessage("Failed to approve the user.");
        } finally {
            setActionLoading(false);
        }
    };

    // Handle Reject User Action
    const handleReject = async () => {
        setActionLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/OS/reject/${id}`);
            setActionMessage("User has been rejected.");
        } catch (err) {
            setActionMessage("Failed to reject the user.");
        }
        setActionLoading(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto my-3 px-4 mt-24">
            <div className="relative bg-white shadow-md rounded-lg px-5">
                {/* Approve/Reject Buttons in Upper Right */}
                <div className="absolute top-4 right-4 flex space-x-4">
                    {!user.isApproved ? (
                        <>
                            <button
                                onClick={handleApprove}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md"
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Processing..." : "Approve"}
                            </button>

                            <button
                                onClick={handleReject}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md"
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Processing..." : "Reject"}
                            </button>
                        </>
                    ) : (
                        <div className="text-green-600 font-bold">Approved</div>
                    )}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-center">User Details</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Information */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phoneNumber}</p>
                        <p><strong>Department:</strong> {user.department}</p>
                    </div>

                    {/* Date Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Date Details</h3>
                        <p><strong>Date of Birth:</strong> {new Date(user.DOB).toLocaleDateString()}</p>
                        <p><strong>Date of Joining:</strong> {new Date(user.DateOfJoining).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {/* Education Details */}
                    <div>
                        <h3 className="font-semibold mb-2">Education</h3>
                        <p>{`${user.educationQualification.highestDegree}, ${user.educationQualification.university}, Year: ${user.educationQualification.year}`}</p>
                    </div>

                    {/* Bank Details */}
                    <div>
                        <h3 className="font-semibold mb-2">Bank Details</h3>
                        <p><strong>Bank:</strong> {user.bankAccountDetails.bankName}</p>
                        <p><strong>Account Number:</strong> {user.bankAccountDetails.accountNumber}</p>
                        <p><strong>IFSC:</strong> {user.bankAccountDetails.IFSC}</p>
                    </div>
                </div>

                {/* Family Details */}
                <div className="mt-1">
                    <h3 className="font-semibold mb-2">Family Details</h3>
                    {user.familyDetails.map((familyMember, index) => (
                        <p key={index} className="mb-1">{`${familyMember.name} (Relation: ${familyMember.relationship}, Age: ${familyMember.age}, Mobile: ${familyMember.mobile})`}</p>
                    ))}
                </div>

                {/* Proof Information */}
                <div className="mt-3">
                    <h3 className="font-semibold mb-2">Proof</h3>
                    <p><strong>PAN:</strong> {user.proof.pan}</p>
                    <p><strong>Aadhar:</strong> {user.proof.adharCard}</p>
                </div>

                {/* Action Message */}
                {actionMessage && (
                    <div className="mt-6 text-center text-lg font-semibold text-blue-600">
                        {actionMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Approveduser;

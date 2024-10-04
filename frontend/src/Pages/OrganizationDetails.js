import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

const OrganizationDetails = () => {
    const { orgName } = useParams(); // Extract the organization name from the URL
    const [OrgTeam, setOrgTeam] = useState([]); // State for organization team
    const [OrgDetails, setOrgDetails] = useState(null); // State for organization details
    const [activeTab, setActiveTab] = useState('details'); // State to manage active tab
    const [loading, setLoading] = useState(true); // State to manage loading
    const [error, setError] = useState(''); // State to handle errors

    const getCurrentOrg = async () => {
        try {
            const encodedOrgName = encodeURIComponent(orgName);

            // Fetch organization and team data
            const resTeam = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/orgEntity/${encodedOrgName}`);
            const resOrg = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/org/getOrg/${encodedOrgName}`);

            const curOrgs = resOrg.data.org;

            setOrgTeam(resTeam.data.users);

            if (!curOrgs) {
                setError('No data found for the organization.');
            } else {
                setOrgDetails(curOrgs);
               
            }

            setLoading(false);
        } catch (err) {
            console.error("Error fetching organization details:", err.response ? err.response.data : err.message);
            setError('Error fetching organization details.');
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentOrg();
    }, [orgName]);

    if (loading) {
        return <p>Loading organization and team details...</p>; // Display a loading message
    }

    return (
        <> 
        <h2 className="mt-24 text-2xl font-semibold my-4">Organization: {orgName}</h2>
        <div className='flex justify-around text-white '>
            <button
                className={`p-2 rounded-xl ${activeTab === 'details' ? 'bg-green-600' : 'bg-gray-400'}`}
                onClick={() => setActiveTab('details')}
            >
                Organization Details
            </button>
            <button
                className={`p-2 rounded-xl ${activeTab === 'team' ? 'bg-green-600' : 'bg-gray-400'}`}
                onClick={() => setActiveTab('team')}
            >
                Organization Team
            </button>
            <button
                className={`p-2 rounded-xl ${activeTab === 'subscribe' ? 'bg-green-600' : 'bg-gray-400'}`}
                onClick={() => setActiveTab('subscribe')}
            >
                Subscribe Module
            </button>
        </div>

        <div className="container mx-auto px-4 mt-4">

            {/* Organization Details Tab */}
            {activeTab === 'details' && (
                <>
                    {OrgDetails ? (
                        <div>
                             {error && <p className="text-red-500 text-center">{error}</p>}
                            <h3 className="text-xl font-semibold mb-2">Organization Details</h3>
                            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                                <tbody>
                                    <tr>
                                        <th className="border border-gray-300 p-2">Name</th>
                                        <td className="border border-gray-300 p-2">{OrgDetails.name}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-300 p-2">PAN</th>
                                        <td className="border border-gray-300 p-2">{OrgDetails.pan}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-300 p-2">Type of Assessee</th>
                                        <td className="border border-gray-300 p-2">{OrgDetails.typeOfAssessee}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-300 p-2">Email</th>
                                        <td className="border border-gray-300 p-2">{OrgDetails.EmailId || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-300 p-2">Phone No</th>
                                        <td className="border border-gray-300 p-2">{OrgDetails.PhoneNo || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-300 p-2">Date of Incorporation</th>
                                        <td className="border border-gray-300 p-2">{OrgDetails.dateOfIncorporation}</td>
                                    </tr>
                                    {/* GST Details */}
                                    {OrgDetails.gstDetails ? (
                                        <>
                                            <tr>
                                                <th className="border border-gray-300 p-2">GSTIN</th>
                                                <td className="border border-gray-300 p-2">{OrgDetails.gstDetails.gstin}</td>
                                            </tr>
                                            <tr>
                                                <th className="border border-gray-300 p-2">Trade Name</th>
                                                <td className="border border-gray-300 p-2">{OrgDetails.gstDetails.tradeName}</td>
                                            </tr>
                                            <tr>
                                                <th className="border border-gray-300 p-2">Principal Place of Address</th>
                                                <td className="border border-gray-300 p-2">
                                                    {OrgDetails.gstDetails.principalPlaceOfAddress?.addr ? (
                                                        <>
                                                            {OrgDetails.gstDetails.principalPlaceOfAddress.addr.bnm}, {OrgDetails.gstDetails.principalPlaceOfAddress.addr.st}, {OrgDetails.gstDetails.principalPlaceOfAddress.addr.loc}, {OrgDetails.gstDetails.principalPlaceOfAddress.addr.bno}, {OrgDetails.gstDetails.principalPlaceOfAddress.addr.dst}
                                                        </>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="border border-gray-300 p-2 text-center">No GST details found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center">No organization details found.</p>
                    )}
                </>
            )}

            {/* Organization Team Tab */}
            {activeTab === 'team' && (
                <div className="my-4">
                    <h3 className="text-xl font-semibold mb-2 text-center">Organization Team</h3>
                    {Array.isArray(OrgTeam) && OrgTeam.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-left">Name</th>
                                        <th className="border border-gray-300 p-2 text-left">Role</th>
                                        <th className="border border-gray-300 p-2 text-left">Email</th>
                                        <th className="border border-gray-300 p-2 text-left">Profession Type</th>
                                        <th className="border border-gray-300 p-2 text-left">Is Active</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {OrgTeam.map((currUser, index) => (
                                        <tr key={index} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 p-2">{currUser.name}</td>
                                            <td className="border border-gray-300 p-2">{currUser.role}</td>
                                            <td className="border border-gray-300 p-2">{currUser.email}</td>
                                            <td className="border border-gray-300 p-2">{currUser.professionType}</td>
                                            <td className="border border-gray-300 p-2">{currUser.isActive ? 'Yes' : 'No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center">No team members found.</p>
                    )}
                </div>
            )}

            {/* Subscribe Module Tab */}
            {activeTab === 'subscribe' && (
                <div className="my-4">
                    <h3 className="text-xl font-semibold mb-2 text-center">Subscribe Module</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">Organization</th>
                                    <th className="border border-gray-300 p-2 text-left">Accounts</th>
                                    <th className="border border-gray-300 p-2 text-left">CRM</th>
                                    <th className="border border-gray-300 p-2 text-left">Ecommerce</th>
                                    <th className="border border-gray-300 p-2 text-left">Payroll</th>
                                </tr>
                            </thead>
                            <tbody>
                                {OrgTeam && OrgTeam.length > 0 ? (
                                    <tr className="hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{OrgTeam[0].orgEntity}</td>
                                        <td className="border border-gray-300 p-2">{OrgTeam[0].accounts ? 'Yes' : 'No'}</td>
                                        <td className="border border-gray-300 p-2">{OrgTeam[0].crm ? 'Yes' : 'No'}</td>
                                        <td className="border border-gray-300 p-2">{OrgTeam[0].ecom ? 'Yes' : 'No'}</td>
                                        <td className="border border-gray-300 p-2">{OrgTeam[0].payroll ? 'Yes' : 'No'}</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="border border-gray-300 p-2 text-center">No subscription data found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default OrganizationDetails;

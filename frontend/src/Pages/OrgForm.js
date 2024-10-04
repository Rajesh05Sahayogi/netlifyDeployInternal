import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header';

const OrgForm = () => {

    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()


    useEffect(() => {
        if (user?.role !== "SuperAdmin") {
            navigate("/")
        }
    }, [user])


    const [formData, setFormData] = useState({
        name: '',
        typeOfAssessee: '',
        pan: '',
        PhoneNo: '',
        EmailId: '',
        dateOfIncorporation: '',
        gstin: '',
        gst: false,
        cin: '',
        tan: '',
        udhyam: '',
        esic: '',
        epfo: '',
        llpin: '',
    });

    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGstChange = () => {
        setFormData({ ...formData, gst: !formData.gst });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/org/create`, formData);
            setResponseMessage(response.data.message);
        } catch (error) {
            setResponseMessage(`Error: ${error.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>   
        <div className="mt-20 min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-xl font-semibold text-gray-900 text-center">Organization Registration</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div className='flex justify-between'>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="typeOfAssessee" className="block text-sm font-medium text-gray-700">
                                    Type of Assessee
                                </label>
                                <select
                                    id="typeOfAssessee"
                                    name="typeOfAssessee"
                                    required
                                    value={formData.typeOfAssessee}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Private Limited Company">Private Limited Company</option>
                                    <option value="Public Limited Company">Public Limited Company</option>
                                    <option value="LLP">LLP</option>
                                </select>
                            </div>
                        </div>


                        <div className='flex justify-between'>
                        <div>
                            <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                                PAN
                            </label>
                            <input
                                id="pan"
                                name="pan"
                                type="text"
                                required
                                value={formData.pan}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="PhoneNo" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                id="PhoneNo"
                                name="PhoneNo"
                                type="text"
                                required
                                value={formData.PhoneNo}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        </div>

                        <div>
                            <label htmlFor="EmailId" className="block text-sm font-medium text-gray-700">
                                Email ID
                            </label>
                            <input
                                id="EmailId"
                                name="EmailId"
                                type="email"
                                required
                                value={formData.EmailId}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="dateOfIncorporation" className="block text-sm font-medium text-gray-700">
                                Date of Incorporation
                            </label>
                            <input
                                id="dateOfIncorporation"
                                name="dateOfIncorporation"
                                type="date"
                                required
                                value={formData.dateOfIncorporation}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="gst"
                                name="gst"
                                type="checkbox"
                                checked={formData.gst}
                                onChange={handleGstChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="gst" className="ml-2 block text-sm text-gray-900">
                                GST Registered?
                            </label>
                        </div>

                        {formData.gst && (
                            <>
                                <div>
                                    <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">
                                        GSTIN
                                    </label>
                                    <input
                                        id="gstin"
                                        name="gstin"
                                        type="text"
                                        value={formData.gstin}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="cin" className="block text-sm font-medium text-gray-700">
                                CIN (For Companies)
                            </label>
                            <input
                                id="cin"
                                name="cin"
                                type="text"
                                value={formData.cin}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>

                        {responseMessage && (
                            <p className="mt-4 text-center text-green-500">
                                {responseMessage}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default OrgForm;

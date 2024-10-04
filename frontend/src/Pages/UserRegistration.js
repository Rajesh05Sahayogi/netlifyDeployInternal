import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const UserRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',
        department: '',
        DOB: '',
        DateOfJoining: '',
        proof: { pan: '', adharCard: '' },
        permanentAddress: { houseNumber: '', street: '', locality: '', city: '', state: '', postalCode: '', country: 'India' },
        isPresentAddressSameAsPermanent: false,
        presentAddress: { houseNumber: '', street: '', locality: '', city: '', state: '', postalCode: '', country: 'India' },
        familyDetails: [{ name: '', age: '', relationship: '', mobile: '' }],
        localFamilyDetails: { relativeName: '', relativeMobile: '', relationship: '' },
        educationQualification: { highestDegree: '', university: '', year: '' },
        bankAccountDetails: { bankName: '', accountNumber: '', IFSC: '' },
        managementTeamAttribute: [],
        salesTeamAttribute: [],
        financeTeamAttribute: [],
        outreachTeamAttribute: [],
        dataMigrationTeamAttribute: [],
        learningAndDevelopmentTeamAttribute: [],
        hrTeamAttribute: [],
        itTeamAttribute: [],
        supportTeamAttribute: []
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Check if the field is part of the 'proof' object (PAN and Aadhaar)
        if (name === "pan" || name === "adharCard") {
            setFormData((prev) => ({
                ...prev,
                proof: { ...prev.proof, [name]: value } // Update the nested 'proof' object
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddressChange = (e, type, field) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [type]: { ...prev[type], [field]: value },
        }));
    };

    const handleFamilyChange = (e, index, field) => {
        const { value } = e.target;
        const newFamily = [...formData.familyDetails];
        newFamily[index][field] = value;
        setFormData((prev) => ({ ...prev, familyDetails: newFamily }));
    };

    const addFamilyMember = () => {
        setFormData((prev) => ({
            ...prev,
            familyDetails: [...prev.familyDetails, { name: '', age: '', relationship: '', mobile: '' }],
        }));
    };

    const removeFamilyMember = (index) => {
        const newFamily = formData.familyDetails.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, familyDetails: newFamily }));
    };

    const handleCheckboxChange = (e) => {
        const { checked } = e.target;
        if (checked) {
            setFormData((prev) => ({
                ...prev,
                isPresentAddressSameAsPermanent: true,
                presentAddress: { ...prev.permanentAddress },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                isPresentAddressSameAsPermanent: false,
                presentAddress: {
                    houseNumber: '',
                    street: '',
                    locality: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'India',
                },
            }));
        }
    };


    const handleTeamAttributeChange = (e, attributeName) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [attributeName]: Array.isArray(prev[attributeName])
                ? (checked
                    ? [...prev[attributeName], value]
                    : prev[attributeName].filter((item) => item !== value))
                : (checked ? [value] : [])
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("formdata", formData);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/OS/create`, formData);
            setResponseMessage(response.data.message);
            navigate("/superAdmin");
        } catch (error) {
            setResponseMessage(error.response ? error.response.data.message : 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const teamOptions = {
        Management: ['CEO', 'CTO', 'CFO', 'Director', 'Independent Director'],
        Sales: ['Manager', 'Asst. Manager', 'Associate', 'Trainee'],
        Finance: ['Manager', 'Asst. Manager', 'Associate', 'Trainee'],
        Outreach: ['Manager', 'Asst. Manager', 'Associate', 'Trainee'],
        Migration: ['Tally', 'Busy', 'Marg', 'ERP'],
        'Learning and Development': ['Researcher', 'Research Assistant'],
        HR: ['Researcher', 'Research Assistant'],
        IT: ['Backend', 'API', 'Frontend', 'UI/UX', 'Application', 'Server'],
        Support: ['Manager', 'Asst. Manager', 'Associate', 'Trainee'],
        OnBoard: ['Manager', 'Asst. Manager', 'Associate', 'Trainee']
    };


    return (
        <>
            <div className="mt-20  mx-auto p-8 w-full flex flex-col items-center border">
                <h2 className="text-2xl font-bold mb-6">User Registration Form</h2>
                <form onSubmit={handleSubmit} className="space-y-3 w-full px-10 bg-neutral-100 py-2">
                    {/* General Information */}
                    <div className="flex gap-2 flex-wrap">
                        {/* Name */}
                        <div>
                            <label htmlFor="name">Name<span className="text-red-500">*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-1 w-full" required />
                        </div>

                        {/* Father's Name */}
                        <div>
                            <label htmlFor="fatherName">Father's Name<span className="text-red-500">*</span></label>
                            <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="border p-1 w-full" required />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email">Email<span className="text-red-500">*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-1 w-full" required />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phoneNumber">Phone Number<span className="text-red-500">*</span></label>
                            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="border p-1 w-full" required />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="border p-1 w-full" required />
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role">Role <span className="text-red-500">*</span></label>
                            <select name="role" value={formData.role} onChange={handleChange} className="border p-1 w-full" required>
                                <option value="">Select Role</option>
                                <option value="SuperAdmin">SuperAdmin</option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>
                        </div>

                        {/* Department */}
                        <div>
                            <label htmlFor="department">Department <span className="text-red-500">*</span></label>
                            <select name="department" value={formData.department} onChange={handleChange} className="border p-1 w-full" required>
                                <option value="">Select Department</option>
                                <option value="Management">Management</option>
                                <option value="Sales">Sales</option>
                                <option value="Finance">Finance</option>
                                <option value="OnBoard">OnBoard</option> {/* Corrected typo */}
                                <option value="Support">Support</option>
                                <option value="Migration">Migration</option>
                                <option value="Learning and Development">Learning and Development</option>
                                <option value="HR">HR</option>
                                <option value="IT">IT</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label htmlFor="dob">Date of Birth <span className="text-red-500">*</span></label>
                            <input type="date" name="DOB" value={formData.DOB} onChange={handleChange} className="border p-1 w-full" required />
                        </div>

                        {/* Date of Joining */}
                        <div>
                            <label htmlFor="dateOfJoining">Date of Joining<span className="text-red-500">*</span></label>
                            <input type="date" name="DateOfJoining" value={formData.DateOfJoining} onChange={handleChange} className="border p-1 w-full" required />
                        </div>

                        {/* PAN */}
                        <div>
                            <label htmlFor="pan">PAN No: <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="pan"
                                value={formData.proof.pan}
                                onChange={handleChange}
                                className="border p-1 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="adharCard">Aadhaar Card <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="adharCard"
                                value={formData.proof.adharCard}
                                onChange={handleChange}
                                className="border p-1 w-full"
                                required
                            />
                        </div>

                    </div>

                    {/* Address Information */}
                    <div>
                        <h3 className="text-xl">Permanent Address<span className="text-red-500">*</span> </h3>
                        <div className="space-y-2">
                            <div className='flex gap-2'>
                                <input type="text" name="houseNumber" value={formData.permanentAddress.houseNumber} onChange={(e) => handleAddressChange(e, 'permanentAddress', 'houseNumber')} placeholder="House Number" className="border p-1 w-full" />
                                <input type="text" name="street" value={formData.permanentAddress.street} onChange={(e) => handleAddressChange(e, 'permanentAddress', 'street')} placeholder="Street" className="border p-1 w-full" />
                            </div>

                            <div className='flex gap-2'>
                                <input type="text" name="locality" value={formData.permanentAddress.locality} onChange={(e) => handleAddressChange(e, 'permanentAddress', 'locality')} placeholder="Locality" className="border p-1 w-full" />
                                <input type="text" name="city" value={formData.permanentAddress.city} onChange={(e) => handleAddressChange(e, 'permanentAddress', 'city')} placeholder="City" className="border p-1 w-full" />
                                <input type="text" name="state" value={formData.permanentAddress.state} onChange={(e) => handleAddressChange(e, 'permanentAddress', 'state')} placeholder="State" className="border p-1 w-full" />
                                <input type="text" name="postalCode" value={formData.permanentAddress.postalCode} onChange={(e) => handleAddressChange(e, 'permanentAddress', 'postalCode')} placeholder="Postal Code" className="border p-1 w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Present Address */}
                    <div>
                        <label className="flex items-center">
                            <input type="checkbox" checked={formData.isPresentAddressSameAsPermanent} onChange={handleCheckboxChange} className="mr-2" />
                            Present Address is the same as Permanent Address
                        </label>
                    </div>
                    {!formData.isPresentAddressSameAsPermanent && (
                        <div>
                            <h3 className="text-xl">Present Address</h3>
                            <div className="space-y-2">
                                <div className='flex gap-2'>
                                    <input type="text" name="houseNumber" value={formData.presentAddress.houseNumber} onChange={(e) => handleAddressChange(e, 'presentAddress', 'houseNumber')} placeholder="House Number" className="border p-1 w-full" />
                                    <input type="text" name="street" value={formData.presentAddress.street} onChange={(e) => handleAddressChange(e, 'presentAddress', 'street')} placeholder="Street" className="border p-1 w-full" />
                                </div>
                                <div className='flex gap-2'>
                                    <input type="text" name="locality" value={formData.presentAddress.locality} onChange={(e) => handleAddressChange(e, 'presentAddress', 'locality')} placeholder="Locality" className="border p-1 w-full" />
                                    <input type="text" name="city" value={formData.presentAddress.city} onChange={(e) => handleAddressChange(e, 'presentAddress', 'city')} placeholder="City" className="border p-1 w-full" />
                                    <input type="text" name="state" value={formData.presentAddress.state} onChange={(e) => handleAddressChange(e, 'presentAddress', 'state')} placeholder="State" className="border p-1 w-full" />
                                    <input type="text" name="postalCode" value={formData.presentAddress.postalCode} onChange={(e) => handleAddressChange(e, 'presentAddress', 'postalCode')} placeholder="Postal Code" className="border p-1 w-full" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Family Details */}
                    <div>
                        <h3 className="text-xl">Family Details<span className="text-red-500">*</span> </h3>
                        {formData.familyDetails.map((member, index) => (
                            <div key={index} className="space-y-2 flex gap-2">
                                <input type="text" name="name" value={member.name} onChange={(e) => handleFamilyChange(e, index, 'name')} placeholder="Name" className="border p-1 w-full" />
                                <input type="text" name="age" value={member.age} onChange={(e) => handleFamilyChange(e, index, 'age')} placeholder="Age" className="border p-1 w-full" />
                                <input type="text" name="relationship" value={member.relationship} onChange={(e) => handleFamilyChange(e, index, 'relationship')} placeholder="Relationship" className="border p-1 w-full" />
                                <input type="text" name="mobile" value={member.mobile} onChange={(e) => handleFamilyChange(e, index, 'mobile')} placeholder="Mobile" className="border p-1 w-full" />
                                {index > 0 && <button type="button" onClick={() => removeFamilyMember(index)} className="bg-red-500 text-white p-1 rounded text-xs">Remove</button>}
                            </div>
                        ))}
                        <button type="button" onClick={addFamilyMember} className="bg-green-500 text-white p-2 rounded mt-2 text-xs">Add Family Member</button>
                    </div>

                    {/* Local Family Details */}
                    <div>
                        <h3 className="text-xl">Local Family Details<span className="text-red-500">*</span> </h3>
                        <div className='flex gap-2'>
                            <input type="text" name="relativeName" value={formData.localFamilyDetails.relativeName} onChange={(e) => handleAddressChange(e, 'localFamilyDetails', 'relativeName')} placeholder="Relative Name" className="border p-1 w-full" />
                            <input type="text" name="relativeMobile" value={formData.localFamilyDetails.relativeMobile} onChange={(e) => handleAddressChange(e, 'localFamilyDetails', 'relativeMobile')} placeholder="Relative Mobile" className="border p-1 w-full" />
                            <input type="text" name="relationship" value={formData.localFamilyDetails.relationship} onChange={(e) => handleAddressChange(e, 'localFamilyDetails', 'relationship')} placeholder="Relationship" className="border p-1 w-full" />
                        </div>
                    </div>

                    {/* Educational Qualifications */}
                    <div>
                        <h3 className="text-xl">Educational Qualifications<span className="text-red-500">*</span> </h3>
                        <div className='flex gap-2'>
                            <input type="text" name="highestDegree" value={formData.educationQualification.highestDegree} onChange={(e) => handleAddressChange(e, 'educationQualification', 'highestDegree')} placeholder="Highest Degree" className="border p-1 w-full" />
                            <input type="text" name="university" value={formData.educationQualification.university} onChange={(e) => handleAddressChange(e, 'educationQualification', 'university')} placeholder="University" className="border p-1 w-full" />
                            <input type="number" name="year" value={formData.educationQualification.year} onChange={(e) => handleAddressChange(e, 'educationQualification', 'year')} placeholder="Year of Passing" className="border p-1 w-full" />
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div>
                        <h3 className="text-xl">Bank Details<span className="text-red-500">*</span> </h3>
                        <div className='flex gap-2'>
                            <input type="text" name="bankName" value={formData.bankAccountDetails.bankName} onChange={(e) => handleAddressChange(e, 'bankAccountDetails', 'bankName')} placeholder="Bank Name" className="border p-1 w-full" />
                            <input type="text" name="IFSC" value={formData.bankAccountDetails.IFSC} onChange={(e) => handleAddressChange(e, 'bankAccountDetails', 'IFSC')} placeholder="IFSC" className="border p-1 w-full" />
                            <input type="text" name="accountNumber" value={formData.bankAccountDetails.accountNumber} onChange={(e) => handleAddressChange(e, 'bankAccountDetails', 'accountNumber')} placeholder="Account Number" className="border p-1 w-full" />
                        </div>
                    </div>


                      {/* Department-based Team Attributes */}
                      {formData.department && formData.role === 'User' && teamOptions[formData.department] && (
                        <div>
                            <h3 className="text-xl">Team Attributes for {formData.department}</h3>
                            {teamOptions[formData.department].map((option) => (
                                <label key={option} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        onChange={(e) =>
                                            handleTeamAttributeChange(e, `${formData.department.replace(/\s/g, '')}TeamAttribute`)
                                        }
                                        checked={formData[`${formData.department.replace(/\s/g, '')}TeamAttribute`]?.includes(option)}
                                        className="mr-2"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    )}



                    <button type="submit" className="bg-blue-500 text-white p-1 rounded mt-4" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    {responseMessage && <p className="text-center mt-4">{responseMessage}</p>}
                </form>
            </div>
        </>
    );
};

export default UserRegistration;

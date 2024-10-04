import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const CreateOrg = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();

  // State to store organization details
  const [orgDetails, setOrgDetails] = useState({
    name: '',
    EmailId: '',
    PhoneNo: '',
    dateOfIncorporation: '',
    pan: '',
    typeOfAssessee: '',
    gst: false,
    gstDetails: {
      tradeName: '',
      gstin: '',
      principalPlaceOfAddress: {
        bnm: '',
        st: '',
        loc: '',
        bno: '',
        dst: '',
        lt: '',
        locality: '',
        pncd: '',
        landMark: '',
        stcd: '',
        geocodelvl: '',
        flno: '',
        lg: ''
      },
      additionalPlaceOfAddress: [],
      jurisdictionDetails: {
        center: '',
        state: '',
      },
    },
    registrationNumbers: {
      cin: '',
      llpin: '',
      tan: '',
      udhyam: '',
      esic: '',
      epfo: '',
    },
  });

  // New states to manage checkbox for CIN and LLPIN
  const [showCin, setShowCin] = useState(false);
  const [showLlpin, setShowLlpin] = useState(false);

  // State for loading, submission, and form status
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [gstError, setGstError] = useState(null);
  const [gstNumber, setGstNumber] = useState('');
  const [gstSubmitted, setGstSubmitted] = useState(false);

  // Fetch organization details based on orgId
  const findOrg = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/contact/getContactUsById/${orgId}`, {
        withCredentials: true,
      });
      setOrgDetails((prevDetails) => ({
        ...prevDetails,
        name: response.data.contact.businessName,
        EmailId: response.data.contact.email,
        PhoneNo: response.data.contact.phoneNo,
        dateOfIncorporation: '',
        pan: '',
        typeOfAssessee: '',
      }));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch organization details');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgId) {
      findOrg();
    }
  }, [orgId]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle GST checkbox toggle
  const handleGstCheckbox = () => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      gst: !prevDetails.gst,
    }));
  };

  // Handle GST input change
  const handleGstInputChange = (e) => {
    setGstNumber(e.target.value);
  };

  // Handle GST data fetch
  const handleGstDetailFetch = async (e) => {
    e.preventDefault();
    try {
      setGstError(null);
      setLoading(true);  // Start loading for GST fetch
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/gst/gst-details`, {
        "gstin": gstNumber,
      });

      const gstData = response.data.userExist[0];
      const principalAddress = gstData.pradr.addr || {};
      const additionalAddress = gstData.adadr || [];

      setOrgDetails((prevDetails) => ({
        ...prevDetails,
        name: gstData.lgnm || prevDetails.name,
        dateOfIncorporation: gstData.rgdt || prevDetails.dateOfIncorporation,
        typeOfAssessee: gstData.ctb || prevDetails.typeOfAssessee,
        gstDetails: {
          tradeName: gstData.tradeNam || prevDetails.gstDetails.tradeName,
          gstin: gstData.gstin || gstNumber,
          principalPlaceOfAddress: {
            bnm: principalAddress.bnm || '',
            st: principalAddress.st || '',
            loc: principalAddress.loc || '',
            bno: principalAddress.bno || '',
            dst: principalAddress.dst || '',
            lt: principalAddress.lt || '',
            locality: principalAddress.locality || '',
            pncd: principalAddress.pncd || '',
            landMark: principalAddress.landMark || '',
            stcd: principalAddress.stcd || '',
            geocodelvl: principalAddress.geocodelvl || '',
            flno: principalAddress.flno || '',
            lg: principalAddress.lg || '',
          },
          additionalPlaceOfAddress: additionalAddress.map((addr) => ({
            bnm: addr.bnm || '',
            st: addr.st || '',
            loc: addr.loc || '',
            bno: addr.bno || '',
            dst: addr.dst || '',
            lt: addr.lt || '',
            locality: addr.locality || '',
            pncd: addr.pncd || '',
            landMark: addr.landMark || '',
            stcd: addr.stcd || '',
            geocodelvl: addr.geocodelvl || '',
            flno: addr.flno || '',
            lg: addr.lg || '',
          })),
          jurisdictionDetails: {
            center: gstData.ctj || prevDetails.gstDetails.jurisdictionDetails.center,
            state: gstData.stj || prevDetails.gstDetails.jurisdictionDetails.state,
          },
        },
      }));
      setGstSubmitted(true);
      setLoading(false);  // Stop loading after GST fetch
      alert('GST details fetched successfully!');
    } catch (err) {
      setGstError('Failed to fetch GST details. Please check the GST number.');
      setLoading(false);  // Stop loading even if an error occurs
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSubmitting(true);  // Start submitting state
      const payload = {
        "name": orgDetails.name,
        "typeOfAssessee": orgDetails.typeOfAssessee,
        "pan": orgDetails.pan,
        "PhoneNo": orgDetails.PhoneNo,
        "EmailId": orgDetails.EmailId,
        "dateOfIncorporation": orgDetails.dateOfIncorporation,
        "gstin": orgDetails.gstDetails.gstin,
        "gst": orgDetails.gst,
        "cin": orgDetails.registrationNumbers.cin || ""
      };
      
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/org/create`, payload, {
        withCredentials: true,
      });
      
      setSubmitting(false);  // Stop submitting after success
      setIsSubmitted(true);  // Set isSubmitted to true
      alert('Organization submitted successfully!');
      await axios.put(`${process.env.REACT_APP_BASE_URL}/api/approve/${orgId}`,{},{withCredentials: true,})
      navigate("/OnBoard")
    } catch (err) {
      setSubmitting(false); 
      if (err.response && err.response.status === 404) {
        setError('Organization  already exists.');
      } else {
        setError('An error occurred during submission. Please try again.');
      }
    }
  };

  return (
    <>  
     <div className="mt-20 p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Organization</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Business Name:</label>
            <input
              type="text"
              name="name"
              value={orgDetails.name}
              onChange={handleInputChange}
              className="border p-2 w-full rounded-md"
              placeholder="Business Name"
              disabled={isSubmitted || submitting}
            />
          </div>

          <div>
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              name="EmailId"
              value={orgDetails.EmailId}
              onChange={handleInputChange}
              className="border p-2 w-full rounded-md"
              placeholder="Email"
              disabled={isSubmitted || submitting}
            />
          </div>

          <div>
            <label className="block font-semibold">Phone:</label>
            <input
              type="text"
              name="PhoneNo"
              value={orgDetails.PhoneNo}
              onChange={handleInputChange}
              className="border p-2 w-full rounded-md"
              placeholder="Phone"
              disabled={isSubmitted || submitting}
            />
          </div>

          <div>
            <label className="block font-semibold">Date of Incorporation:</label>
            <input
              type="text"
              name="dateOfIncorporation"
              value={orgDetails.dateOfIncorporation}
              onChange={handleInputChange}
              className="border p-2 w-full rounded-md"
              placeholder="Date of Incorporation"
              disabled={isSubmitted || submitting}
            />
          </div>

          <div>
            <label className="block font-semibold">PAN No:</label>
            <input
              type="text"
              name="pan"
              value={orgDetails.pan}
              onChange={handleInputChange}
              className="border p-2 w-full rounded-md"
              placeholder="PAN Number"
              disabled={isSubmitted || submitting}
            />
          </div>

          <div>
            <label className="block font-semibold">Type of Assessee:</label>
            <input
              type="text"
              name="typeOfAssessee"
              value={orgDetails.typeOfAssessee}
              onChange={handleInputChange}
              className="border p-2 w-full rounded-md"
              placeholder="Type of Assessee"
              disabled={isSubmitted || submitting}
            />
          </div>

          {/* GST Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="gstCheckbox"
              onChange={handleGstCheckbox}
              checked={orgDetails.gst}
              disabled={isSubmitted || submitting}
            />
            <label htmlFor="gstCheckbox" className="font-semibold">
              Do you have a GST Number?
            </label>
          </div>

          {/* GST Number Input */}
          {orgDetails.gst && (
            <div>
              <label className="block font-semibold">GST Number:</label>
              <input
                type="text"
                value={gstNumber}
                onChange={handleGstInputChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter your GST Number"
                required
                disabled={isSubmitted || submitting}
              />
            </div>
          )}

          {/* Button to fetch GST details */}
          {orgDetails.gst && !gstSubmitted && (
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleGstDetailFetch}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md ${!gstNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!gstNumber || isSubmitted || loading}
              >
                {loading ? 'Fetching GST...' : 'Get GST Details'}
              </button>
            </div>
          )}

          {/* GST-related Fields (Visible after GST fetch) */}
          {gstSubmitted && (
            <>
              <div>
                <label className="block font-semibold">Trade Name:</label>
                <input
                  type="text"
                  name="tradeName"
                  value={orgDetails.gstDetails.tradeName}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded-md"
                  placeholder="Trade Name"
                  disabled={isSubmitted || submitting}
                />
              </div>

              <div>
                <label className="block font-semibold">Principal Place of Address:</label>
                {Object.keys(orgDetails.gstDetails.principalPlaceOfAddress).map((field, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`principalPlaceOfAddress_${field}`}
                    value={orgDetails.gstDetails.principalPlaceOfAddress[field]}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded-md"
                    placeholder={`Principal Place of Address - ${field}`}
                    disabled={isSubmitted || submitting}
                  />
                ))}
              </div>

              <div>
                <label className="block font-semibold">Jurisdiction Details (Center and State):</label>
                <input
                  type="text"
                  name="jurisdictionDetails"
                  value={`Center: ${orgDetails.gstDetails.jurisdictionDetails.center}, State: ${orgDetails.gstDetails.jurisdictionDetails.state}`}
                  className="border p-2 w-full rounded-md"
                  disabled
                />
              </div>

              <div>
                <label className="block font-semibold">Additional Place of Address:</label>
                {orgDetails.gstDetails.additionalPlaceOfAddress.length > 0 ? (
                  orgDetails.gstDetails.additionalPlaceOfAddress.map((addr, index) => (
                    <div key={index}>
                      {Object.keys(addr).map((field, idx) => (
                        <input
                          key={idx}
                          type="text"
                          name={`additionalPlaceOfAddress_${index}_${field}`}
                          value={addr[field]}
                          onChange={handleInputChange}
                          className="border p-2 w-full rounded-md"
                          placeholder={`Additional Address - ${field}`}
                          disabled={isSubmitted || submitting}
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  <p>No additional place of address found</p>
                )}
              </div>
            </>
          )}

          {/* Conditional CIN or LLPIN checkboxes and input fields */}
          {orgDetails.typeOfAssessee === 'Private Limited Company' || orgDetails.typeOfAssessee === 'Public Limited Company' ? (
            <div>
              <label className="block font-semibold">Do you want to add CIN?</label>
              <input
                type="checkbox"
                checked={showCin}
                onChange={() => setShowCin(!showCin)}
                disabled={isSubmitted || submitting}
              />
              {showCin && (
                <div>
                  <label className="block font-semibold">CIN:</label>
                  <input
                    type="text"
                    name="cin"
                    value={orgDetails.registrationNumbers.cin}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded-md"
                    placeholder="CIN"
                    disabled={isSubmitted || submitting}
                  />
                </div>
              )}
            </div>
          ) : null}

          {orgDetails.name.endsWith('LLP') && (
            <div>
              <label className="block font-semibold">Do you want to add LLPIN?</label>
              <input
                type="checkbox"
                checked={showLlpin}
                onChange={() => setShowLlpin(!showLlpin)}
                disabled={isSubmitted || submitting}
              />
              {showLlpin && (
                <div>
                  <label className="block font-semibold">LLPIN:</label>
                  <input
                    type="text"
                    name="llpin"
                    value={orgDetails.registrationNumbers.llpin}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded-md"
                    placeholder="LLPIN"
                    disabled={isSubmitted || submitting}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSubmit}
              className={`bg-green-500 text-white px-4 py-2 rounded-md ${isSubmitted || submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitted || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Organization'}
            </button>
          </div>
        </form>
      )}
    </div>
    </>

  );
};

export default CreateOrg;

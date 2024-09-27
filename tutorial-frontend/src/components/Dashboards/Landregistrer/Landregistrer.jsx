import React, { useState, useEffect, useRef } from 'react';
import './landregistrer.css'; // Import the CSS file for styling
import SignaturePad from 'react-signature-canvas';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CertificateOfOwnership } from '../../PDFs/Certificate of ownership/Certificate';
import { AnalyticalSlip } from '../../PDFs/Analyticslip/analyticslip.jsx';
import { API_URL } from '../../../utils/constants.js';
import axios from 'axios';
// import { notarialdeed } from '../../PDFs/NotarialDeed/notarialdeed';
import { MdEmail } from 'react-icons/md';

function Dashboard() {
  // State to manage the sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  //To fetch file sent by another user form another dashboard
  const [pdfFiles, setPdfFiles] = useState([]); // Define pdfFiles state

  //Form to establish land title
  //Form to establish new land title
  const [formData, setFormData] = useState({
    landId: '',
    nature: '',
    size: '',
    location: '',
    area: '', // Added
    coordinates: { latitude: '', longitude: '' },
    fullName: '',
    email: '', // Added
    cniid: '', // Added
    profession: '',
    address: '',
    dob: '',
    pob: '',
    fatherName: '',
    motherName: '',
    deliveryDate: ''
  });

  const updateField = (e) => {
    const { name, value } = e.target;
    
    if (name === 'latitude' || name === 'longitude') {
      setFormData({
        ...formData,
        coordinates: {
          ...formData.coordinates,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    try{
      const data = {
        land_id : formData.landId,
        owner_name : formData.fullName,
        owner_email : formData.email,
        land_location : formData.location,
        national_id : formData.cniid,
        land_size : formData.size,
        surface_area : formData.area,
        coordinates : formData.coordinates,
        nature : formData.nature,
        profession : formData.profession,
        address : formData.address,
        dob : formData.dob,
        pob : formData.pob,
        father_name : formData.fatherName,
        mother_name : formData.motherName,
        delivery_date : formData.deliveryDate,
      };
      const response = await axios.post(
        'http://localhost:8000/api/landtitles',
        data
      );
      if (response.status === 201){
        alert('New land title information recorded');
        setFormData({
          landId: '',
          nature: '',
          size: '',
          location: '',
          area: '', // Reset added field
          coordinates: { latitude: '', longitude: '' },
          fullName: '',
          email: '', // Reset added field
          cniid: '', // Reset added field
          profession: '',
          address: '',
          dob: '',
          pob: '',
          fatherName: '',
          motherName: '',
          deliveryDate: '',
        });
      } else{
        // Use optional chaining and fallback
        alert('Error: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      // Use optional chaining to prevent TypeError
      console.log(error.response?.data || error);
      alert('There was an error processing your request');
    }
  };


  useEffect(() => {
    const fetchPdfFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/pdfs/'); // Adjust your API endpoint as necessary
        setPdfFiles(response.data);
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      }
    };

    fetchPdfFiles();
  }, []);

  // State to manage which content section is active
  const [activeSection, setActiveSection] = useState('home');

  const [signature, setSignature] = useState('');
  const signatureRef = useRef(null);

  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL(); // Save as image data
      console.log('Signature saved:', signatureData);
      setSignature(signatureData); // Update the signature state
    }
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear(); // Clear the canvas
      setSignature(''); // Reset the signature state
    }
  };
  

  const [landData, setLandData] = useState({
    owner_name: "",
    land_location: "",
    land_size: ""
  });
  // State to manage transfer requests
  const [requests, setRequests] = useState([]);
  const [landId, setLandId] = useState("2222");

  // State to manage selected document for PDF generation
  const [selectedDocument, setSelectedDocument] = useState(<CertificateOfOwnership data={[{
    Owner_name: "",
    Location: "",
    Size: ""
  }]} />);

  const [fileName, setFileName] = useState("certificate-of-ownership.pdf");
  const [landTitle, setLandTitle] = useState(null);

  useEffect(() => {
    console.log("Signature changed, setting the selected document");
    setSelectedDocument(
      <CertificateOfOwnership data={[{
        Owner_name: landData.owner_name,  // Use 'data' here instead of 'request'
        Location: landData.land_location,
        Size: landData.land_size,
      }]} signature={signature} />
    )
  }, [signature]);

  useEffect(() => {
    if (landTitle) {
      console.log(`landtitle changed to `, landTitle);
      setSelectedDocument(
        <CertificateOfOwnership data={[{
          Owner_name: landTitle.owner_name,  // Use 'data' here instead of 'request'
          Location: landTitle.land_location,
          Size: landTitle.land_size,
        }]} signature={signature} />
      );
    }
  }, [landTitle]);

  //Fetch Land Info for certificate of ownership
  const fetchLandData = async (land_id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/landtitles/${land_id}`);  // Ensure the correct endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();  // Ensure `data` contains owner_name, land_location, and land_size fields

      // Assuming `data` is an object with owner_name, land_location, and land_size
      setSelectedDocument(
        <CertificateOfOwnership data={[{
          Owner_name: landData.owner_name,  // Use 'data' here instead of 'request'
          Location: landData.land_location,
          Size: landData.land_size,
        }]} signature={signature} />
      );
    } catch (error) {
      console.error('Error fetching land data:', error);
    }
  };
  // Fetch transfer ownership requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/transfer-ownership'); // Ensure the correct endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Assuming `data` is an array; otherwise, adjust if the structure is different
        setRequests(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRequests();
  }, []);  // Runs only once when the component mounts
  // Empty dependency array ensures it only runs once on component mount

  // Function to toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to show content based on sidebar selection
  const showContent = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeSection === 'home' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('home')}>
              <i className="fa fa-home"></i> Home
            </a>
          </li>
          <li className={activeSection === 'transferofownershiprequest' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('transferofownershiprequest')}>
              <i className="fa fa-user"></i> Transfer of ownerships request
            </a>
          </li>
          <li className={activeSection === 'messages' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('messages')}>
              <i className="fa fa-envelope"></i> Messages
            </a>
          </li>
          <li className={activeSection === 'notifications' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('notifications')}>
              <i className="fa fa-bell"></i> Notifications
            </a>
          </li>
          <li className={activeSection === 'profile' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('profile')}>
              <i className="fa fa-user-circle"></i> Profile
            </a>
          </li>
          <li className={activeSection === 'land-title' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('land-title')}>
              <i className="fa fa-cog"></i> Establish Land Title
            </a>
          </li>
          <li className={activeSection === 'generate-pdfs' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('generate-pdfs')}>
              <i className="fa fa-file-pdf"></i> Generate PDFs
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`} id="main-content">
        {/* Header Section */}
        <div className={`header ${isCollapsed ? 'collapsed' : ''}`} id="header">
          <button className={`toggle-btn ${isCollapsed ? 'collapsed' : ''}`} onClick={toggleSidebar}>
            &#9776;
          </button>
          <b>Land register</b>
        </div>

        {/* Content Sections */}
        <div className={`content ${activeSection === 'home' ? 'active' : ''}`} id="home">
          <h2>Home</h2>
          <p>This is the home section content.</p>
        </div>

        <div className={`content ${activeSection === 'transferofownershiprequest' ? 'active' : ''}`} id="transferofownershiprequest">
          <div>
            <h2>Transfer of Ownership Requests</h2>
            <table>
              <thead>
                <tr>
                  <th>Land ID</th>
                  <th>Owner's Name</th>
                  <th>Owner's Email</th>
                  <th>Present Land Size</th>
                  <th>Location of Land</th>
                  <th>National ID</th>
                  <th>Buyer's Name</th>
                  <th>Buyer's Email</th>
                  <th>Buyer's Address</th>
                  <th>Land Size to Sell</th>
                  <th>Selling Type</th>
                  <th>Date of Request</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request, index) => (
                    <tr key={index}>
                      <td>{request.land_id}</td>
                      <td>{request.owner_name}</td>
                      <td>{request.owner_email}</td>
                      <td>{request.present_land_size}</td>
                      <td>{request.location_of_land}</td>
                      <td>{request.national_id}</td>
                      <td>{request.buyer_name}</td>
                      <td>{request.buyer_email}</td>
                      <td>{request.buyer_address}</td>
                      <td>{request.land_size_to_sell}</td>
                      <td>{request.selling_type}</td>
                      <td>{request.date_of_request}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12">No requests available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`content ${activeSection === 'messages' ? 'active' : ''}`} id="messages">
        <h2>Messages</h2>
        <ul>
            {pdfFiles.length > 0 ? (
                pdfFiles.map((pdf) => (
                    <li key={pdf.id}>
                        <a 
                            href={`http://localhost:8000${pdf.file}/`} // Adjusted to the correct URL for the PDF
                            target="_blank" 
                            rel="noopener noreferrer" 
                            download // This attribute enables downloading
                        >
                            {pdf.file.split('/').pop()}  {/* Displaying the file name */}
                        </a>
                        <p>Uploaded At: {new Date(pdf.uploaded_at).toLocaleString()}</p>
                        <p>Destination Dashboard: {pdf.destination_dashboard}</p>
                    </li>
                ))
            ) : (
                <li>No PDF files found.</li>
            )}
        </ul>

        </div>

        <div className={`content ${activeSection === 'notifications' ? 'active' : ''}`} id="notifications">
          <h2>Notifications</h2>
          <div className="notification-item">New message received.</div>
          <div className="notification-item">User registered successfully.</div>
        </div>

        <div className={`content ${activeSection === 'profile' ? 'active' : ''}`} id="profile">
          <h2>Profile</h2>
          <form>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" defaultValue="JohnDoe" /><br /><br />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" defaultValue="john@example.com" /><br /><br />
            <button className="btn btn-edit">Save Changes</button>
          </form>
        </div>

        <div className={`content ${activeSection === 'land-title' ? 'active' : ''}`} id="land-title">
          <h2>Establish new Land title</h2>
          <form onSubmit={submitTransfer}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <label htmlFor="landId">Land Id:</label>
                  <input type="text" name="landId" id="landId" value={formData.landId} onChange={updateField} required /><br />

                  <label htmlFor="nature">Nature of the Property:</label>
                  <input type="text" name="nature" id="nature" value={formData.nature} onChange={updateField} required /><br />

                  <label htmlFor="size">Land Size:</label>
                  <input type="text" name="size" id="size" value={formData.size} onChange={updateField} required /><br />

                  <label htmlFor="location">Land Location:</label>
                  <input type="text" name="location" id="location" value={formData.location} onChange={updateField} required /><br />

                  <label htmlFor="area">Surface Area:</label>
                  <input type="text" name="area" id="area" value={formData.area} onChange={updateField} required /><br />

                  <label htmlFor="coordinates">Coordinates:</label>
                  <input type="text" name="coordinates" id="coordinates" value={formData.coordinates} onChange={updateField} /><br />

                  <label htmlFor="fullName">New Owner's Full Name:</label>
                  <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={updateField} required/><br />

                  <label htmlFor="email">New Owner's Email:</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={updateField} required /><br />

                  <label htmlFor="cniid">National Id Number:</label>
                  <input type="text" name="cniid" id="cniid" value={formData.cniid} onChange={updateField} required/><br />

                  <label htmlFor="profession">Profession:</label>
                  <input type="text" name="profession" id="profession" value={formData.profession} onChange={updateField} required/><br />

                  <label htmlFor="address">Address:</label>
                  <input type="text" name="address" id="address" value={formData.address} onChange={updateField} required /><br />

                  <label htmlFor="dob">Date Of Birth:</label>
                  <input type="date" name="dob" id="dob" value={formData.dob} onChange={updateField} required /><br />

                  <label htmlFor="pob">Place Of Birth:</label>
                  <input type="text" name="pob" id="pob" value={formData.pob} onChange={updateField} required /><br />

                  <label htmlFor="fatherName">Father's Name:</label>
                  <input type="text" name="fatherName" id="fatherName" value={formData.fatherName} onChange={updateField} required/><br />

                  <label htmlFor="motherName">Mother's Name:</label>
                  <input type="text" name="motherName" id="motherName" value={formData.motherName} onChange={updateField} required /><br />

                  <label htmlFor="deliveryDate">Delivery Date:</label>
                  <input type="date" name="deliveryDate" id="deliveryDate" value={formData.deliveryDate} onChange={updateField} required /><br />
                  <button type="submit">Create new land title</button>
                </div>
              </form>
          </div>

        <div className={`content ${activeSection === 'generate-pdfs' ? 'active' : ''}`} id="generate-pdfs">
          <h2>Generate PDFs</h2>
          <div className="pdf-form">
            <label htmlFor="pdf-type">Select PDF Type:</label>
            <select id="pdf-type" onChange={(e) => {
              let value = e.target.value;
              switch (value) {
                case "certificate":
                  setSelectedDocument(<CertificateOfOwnership data={[
                    Owner_name = landData.owner_name,
                    Location = landData.land_location,
                    Size = landData.land_size,
                  ]} signature={signature} />);
                  setFileName("certificate-of-ownership.pdf");
                  break;
                case "analytical-slip":
                  setSelectedDocument(<AnalyticalSlip data={[]} signature={signature} />);
                  setFileName("analytical-slip.pdf");
                  break;
                // Handle other PDF types
              }
            }}>
              <option value="certificate">Certificate of Ownership</option>
              <option value="analytical-slip">Analytical Slip</option>
              <option value="notarial-deed">Notarial Deed</option>
              <option value="financial-report">Financial Report</option>
              <option value="inventory-list">Inventory List</option>
            </select>

            <label htmlFor="land-id">Land ID:</label>
            <input type="text" id="land-id" placeholder="Enter Land ID" value={landId} onChange={(e) => setLandId(e.target.value)} />

            <label htmlFor="owner-name">Owner's Name:</label>
            <input type="text" id="owner-name" placeholder="Enter Owner's Name" />

            <label htmlFor="pdf-details">Additional Details:</label>
            <input type="text" id="pdf-details" placeholder="Enter Details" />

            <label htmlFor="signature">Signature:</label>
            <SignatureCanvas ref={signatureRef} penColor="black" canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }} />
            <button type="button" onClick={saveSignature}>Save Signature</button>
            <button type="button" onClick={clearSignature}>Clear Signature</button>

            <button className='btn'
              onClick={() => {
                axios.get(`${API_URL}/api/landtitles/${landId}`)
                  .then((response) => {
                    console.log('Data gotten from the server');
                    console.log(response.data);

                    setLandTitle(response.data);
                  })
                  .catch((error) => {
                    console.log(`Error getting land title`);
                    console.log(error);
                  })
              }}
            >Get data</button>

            <button className="btn btn-add">
              <PDFDownloadLink
                document={selectedDocument}
                fileName={fileName}
              >
                {({ loading }) =>
                  loading ? 'Preparing document...' : 'Generate PDF'
                }
              </PDFDownloadLink>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

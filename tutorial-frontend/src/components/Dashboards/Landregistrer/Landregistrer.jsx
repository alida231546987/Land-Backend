import React, { useState, useEffect, useRef } from 'react';
import './landregistrer.css'; // Import the CSS file for styling
import SignatureCanvas from 'react-signature-canvas';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CertificateOfOwnership } from '../../PDFs/Certificate of ownership/Certificate';
// import { analyticalslip } from '../../PDFs/Analyticslip/analyticslip';
// import { notarialdeed } from '../../PDFs/NotarialDeed/notarialdeed';

function Dashboard() {
  // State to manage the sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State to manage which content section is active
  const [activeSection, setActiveSection] = useState('home');

  const [signature, setSignature] = useState('');
  const signatureRef = useRef(null);

  const clearSignature = () => {
    signatureRef.current.clear();
    setSignature('');
  };

  const saveSignature = () => {
    setSignature(signatureRef.current.toDataURL());

    console.log(`The signature URL ${signatureRef.current.toDataURL()}`);
  };

  useEffect(() => {
    console.log("Signature changed, setting the selected document");
    setSelectedDocument(
      <CertificateOfOwnership data={[{
        Owner_name: "Alida",
        Location: "Mfou",
        Size: 90000
      }]} signature={signature} />
    )
  }, [signature]);

  // State to manage transfer requests
  const [requests, setRequests] = useState([]);

  // State to manage selected document for PDF generation
  const [selectedDocument, setSelectedDocument] = useState(<CertificateOfOwnership data={[{
    Owner_name: "Alida",
    Location: "Mfou",
    Size: 90000
  }]} />);

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
          <li className={activeSection === 'settings' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('settings')}>
              <i className="fa fa-cog"></i> Settings
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
          <p>This is the messages section content.</p>
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

        <div className={`content ${activeSection === 'settings' ? 'active' : ''}`} id="settings">
          <h2>Settings</h2>
          <p>This is the settings section content.</p>
        </div>

        <div className={`content ${activeSection === 'generate-pdfs' ? 'active' : ''}`} id="generate-pdfs">
          <h2>Generate PDFs</h2>
          <div className="pdf-form">
            <label htmlFor="pdf-type">Select PDF Type:</label>
            <select id="pdf-type" onChange={(e) => {
              let value = e.target.value;
              switch (value) {
                case "certificate":
                  setSelectedDocument(<CertificateOfOwnership data={[]} signature={signature} />);
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
            <input type="text" id="land-id" placeholder="Enter Land ID" />

            <label htmlFor="owner-name">Owner's Name:</label>
            <input type="text" id="owner-name" placeholder="Enter Owner's Name" />

            <label htmlFor="pdf-details">Additional Details:</label>
            <input type="text" id="pdf-details" placeholder="Enter Details" />

            <label htmlFor="signature">Signature:</label>
            <SignatureCanvas ref={signatureRef} penColor="black" canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }} />
            <button type="button" onClick={saveSignature}>Save Signature</button>
            <button type="button" onClick={clearSignature}>Clear Signature</button>

            <button className="btn btn-add">
              <PDFDownloadLink
                document={selectedDocument}
                fileName="certificate-of-ownership.pdf"
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

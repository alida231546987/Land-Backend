// ./components/Dashboard.jsx
import React, { useState, useRef, useEffect } from 'react';
import './notary.css'; // Ensure this CSS file exists and is correctly linked
import SignatureCanvas from 'react-signature-canvas';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { API_URL } from '../../../utils/constants.js';
import axios from 'axios';
import { NotarialDeed } from './../../PDFs/NotarialDeed/notarialdeed.jsx';

function Dashboard() {
  // Sidebar State
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [users, setUsers] = useState([]); // Users state
  const [files, setFiles] = useState([]); // Files state
  const [destinationDashboard, setDestinationDashboard] = useState(''); // Define state for destinationDashboard
  const [handleUplaod, setHandleUpload] = useState(''); // Define state for destinationDashboard
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Selected user ID

  const [file, setFile] = useState(null);

  // getting list of users from the backend
  useEffect(() => {
    axios.get(`${API_URL}/api/users`)
    .then((response) => setUser(response.data))
    .catch((error) => {
      console.log("Error getting users from DB");
    })
  }, []);

  function FileUpload() {
    const [destinationDashboard, setDestinationDashboard] = useState('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination_dashboard', destinationDashboard);

    const response = await fetch('http://localhost:8000/api/pdfs/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    console.log("Request completed")
    console.log(data)
    alert("File sent successfully");
  };

  const fetchFiles = async () => {
    axios.get(`${API_URL}/api/pdfs`)
    .then((response) => setFiles(response.data))
    .catch((error) => {
      console.log("Error getting files from DB");
    })
  }

  const showContent = (section) => {
    setActiveSection(section);
    if (section === 'files') {
      fetchFiles(); // Fetch files when "Files" section is active
    }
  };

  // Signature State
  const [signature, setSignature] = useState('');
  const signatureRef = useRef(null);

  // Form Data State
  const [formData, setFormData] = useState({
    notaryId: '',
    notaryName: '',
    sellerName: '',
    landSize: '',
    landLocation: '',
    buyerName: '',
    landPrice: '',
    presentDate: '',
  });

  // Notary ID for Fetching Data
  const [notaryId, setNotaryId] = useState('');

  // PDF Data State
  const [pdfData, setPdfData] = useState(null);
  const [fileName, setFileName] = useState("notarial_deed.pdf");

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Show Content Based on Selection
  const showContents = (section) => {
    setActiveSection(section);
  };

  // Handle Form Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Save Signature from Canvas
  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      console.log('Signature saved:', signatureData);
      setSignature(signatureData);
    }
  };

  // Clear Signature Canvas
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignature('');
    }
  };

  // Submit New Notarial Deed
  const submitDeed = async (e) => {
    e.preventDefault();
    try {
      const data = {
        notaryId: formData.notaryId,
        notaryName: formData.notaryName,
        sellerName: formData.sellerName,
        landSize: formData.landSize,
        landLocation: formData.landLocation,
        buyerName: formData.buyerName,
        landPrice: formData.landPrice,
        presentDate: formData.presentDate,
      };
      const response = await axios.post(
        `${API_URL}/api/notarialdeed`,
        data
      );
      if (response.status === 201) {
        alert('New notarial deed created');
        setFormData({
          notaryId: '',
          notaryName: '',
          sellerName: '',
          landSize: '',
          landLocation: '',
          buyerName: '',
          landPrice: '',
          presentDate: '',
        });
      } else {
        alert('Error: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.log(error.response?.data || error);
      alert('There was an error processing your request');
    }
  };

  // Fetch Notarial Deed Data for PDF Generation
  const handleFetchData = async () => {
    if (!notaryId) {
      alert('Please enter a Notarial Deed ID.');
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/notarialdeed/${notaryId}`);
      console.log('Data fetched from the server:', response.data);
      setPdfData(response.data);
      setFileName(`notarial_deed_${notaryId}.pdf`);
    } catch (error) {
      console.log('Error fetching Notarial Deed:', error);
      alert('Error fetching Notarial Deed data.');
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeSection === 'home' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('home')}>
              <i className="fa fa-home"></i> Home
            </a>
          </li>
          <li className={activeSection === 'users' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('users')}>
              <i className="fa fa-user"></i> Users
            </a>
          </li>
          <li className={activeSection === 'messages' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('messages')}>
              <i className="fa fa-envelope"></i> Messages
            </a>
          </li>
          <li className={activeSection === 'notifications' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('notifications')}>
              <i className="fa fa-bell"></i> Notifications
            </a>
          </li>
          <li className={activeSection === 'profile' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('profile')}>
              <i className="fa fa-user-circle"></i> Profile
            </a>
          </li>
          <li className={activeSection === 'generate-pdf' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('generate-pdf')}>
              <i className="fa fa-cog"></i> Generate Pdf
            </a>
          </li>
          <li className={activeSection === 'notarial-deed' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('notarial-deed')}>
              <i className="fa fa-file-pdf"></i> Notarial Deed
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`} id="main-content">
        {/* Header */}
        <div className={`header ${isCollapsed ? 'collapsed' : ''}`} id="header">
          <button className={`toggle-btn ${isCollapsed ? 'collapsed' : ''}`} onClick={toggleSidebar}>
            &#9776;
          </button>
          <b>Notary</b>
        </div>

        {/* Home Section */}
        <div className={`content ${activeSection === 'home' ? 'active' : ''}`} id="home">
          <h2>Home</h2>
          <p>This is the home section content.</p>
        </div>

        {/* Users Section */}
        <div className={`content ${activeSection === 'users' ? 'active' : ''}`} id="users">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Admin</td>
                <td>
                  <button className="btn btn-edit">Edit</button>
                  <button className="btn btn-delete">Delete</button>
                </td>
              </tr>
              {/* Add more user rows as needed */}
            </tbody>
          </table>
        </div>

        {/* Messages Section */}
        {activeSection === 'messages' && (
          <div className="content active" id="messages">
            <input type="file" onChange={handleFileChange} />
            <input
              type="text"
              placeholder="Destination Dashboard"
              value={destinationDashboard}
              onChange={(e) => setDestinationDashboard(e.target.value)}
            />

            <div>
              <label htmlFor="user-select">User</label>
              <select
                id="user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">---</option>
                {users && Array.isArray(users) && users.map((u) => (
                  <option value={u.id} key={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
            <button onClick={handleUpload}>Upload PDF</button>
          </div>
        )};

        {/* Notifications Section */}
        <div className={`content ${activeSection === 'notifications' ? 'active' : ''}`} id="notifications">
          <h2>Notifications</h2>
          <div className="notification-item">New message received.</div>
          <div className="notification-item">User registered successfully.</div>
          {/* Add more notifications as needed */}
        </div>

        {/* Profile Section */}
        <div className={`content ${activeSection === 'profile' ? 'active' : ''}`} id="profile">
          <h2>Profile</h2>
          <form>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" defaultValue="JohnDoe" /><br /><br />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" defaultValue="john@example.com" /><br /><br />
            <button type="button" className="btn btn-edit">Save Changes</button>
          </form>
        </div>

        {/* Generate PDF Section */}
        <div className={`content ${activeSection === 'generate-pdf' ? 'active' : ''}`} id="generate-pdf">
          <h2>Generate PDF</h2>
          <p>Generate Notarial Deed</p>
          <div className="pdf-form">
            {/* PDF Type Selection */}
            <label htmlFor="pdf-type">Select PDF Type:</label>
            <select id="pdf-type" onChange={(e) => {
              const value = e.target.value;
              if (value === "notarial-deed" && pdfData) {
                setFileName(`notarial_deed_${pdfData.notaryId}.pdf`);
              } else {
                setFileName("notarial_deed.pdf");
              }
            }}>
              <option value="">-- Select PDF Type --</option>
              <option value="notarial-deed">Notarial Deed</option>
              {/* Add other options as needed */}
            </select>

            {/* Notarial Deed ID Input */}
            <label htmlFor="notaryid">Notarial Deed ID:</label>
            <input
              type="text"
              id="notaryid"
              placeholder="Enter Notarial Deed ID"
              value={notaryId}
              onChange={(e) => setNotaryId(e.target.value)}
            />

            {/* Signature Canvas */}
            <label htmlFor="signature">Signature:</label>
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
            />
            <button type="button" onClick={saveSignature}>Save Signature</button>
            <button type="button" onClick={clearSignature}>Clear Signature</button>

            {/* Get Data Button */}
            <button type="button" className='btn' onClick={handleFetchData}>
              Get Data
            </button>

            {/* Generate PDF Button */}
            <button className="btn btn-add">
              {pdfData ? (
                <PDFDownloadLink
                  document={<NotarialDeed data={pdfData} signature={signature} />}
                  fileName={fileName}
                >
                  {({ loading }) =>
                    loading ? 'Preparing document...' : 'Generate PDF'
                  }
                </PDFDownloadLink>
              ) : (
                'No data to generate PDF'
              )}
            </button>
          </div>
        </div>

        {/* Notarial Deed Creation Section */}
        <div className={`content ${activeSection === 'notarial-deed' ? 'active' : ''}`} id="notarial-deed">
          <h2>Notarial Deed</h2>
          <form onSubmit={submitDeed}>
            <div>
              <label>Notarial Deed Identification Number:</label>
              <input
                type="text"
                name="notaryId"
                value={formData.notaryId}
                onChange={handleChange}
                placeholder="Enter Notarial Identification Number"
                required
              />
            </div>
            <div>
              <label>Notary's Name:</label>
              <input
                type="text"
                name="notaryName"
                value={formData.notaryName}
                onChange={handleChange}
                placeholder="Enter Notary's Name"
                required
              />
            </div>
            <div>
              <label>Seller's Name:</label>
              <input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                placeholder="Enter Seller's Name"
                required
              />
            </div>
            <div>
              <label>Land Size:</label>
              <input
                type="text"
                name="landSize"
                value={formData.landSize}
                onChange={handleChange}
                placeholder="Enter Land Size"
                required
              />
            </div>
            <div>
              <label>Land Location:</label>
              <input
                type="text"
                name="landLocation"
                value={formData.landLocation}
                onChange={handleChange}
                placeholder="Enter Land Location"
                required
              />
            </div>
            <div>
              <label>Buyer's Name:</label>
              <input
                type="text"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                placeholder="Enter Buyer's Name"
                required
              />
            </div>
            <div>
              <label>Land Price:</label>
              <input
                type="text"
                name="landPrice"
                value={formData.landPrice}
                onChange={handleChange}
                placeholder="Enter Land Price"
                required
              />
            </div>
            <div>
              <label>Present Date:</label>
              <input
                type="date"
                name="presentDate"
                value={formData.presentDate}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Create New Deed</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

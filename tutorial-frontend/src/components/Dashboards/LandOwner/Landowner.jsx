import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios';
import SignatureCanvas from "react-signature-canvas";
import { saveAs } from 'file-saver'; // Importing file-saver
import './landowner.css'; // Importing the CSS file for styling
import { API_URL } from '../../../utils/constants';

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recipient, setRecipient] = useState(''); // Selected recipient
  const [users, setUsers] = useState([]); // Users state
  const [transferDetails, setTransferDetails] = useState({
    landId: '',
    presentLandSize: '',
    ownerName: '',
    ownerEmail: '',
    landLocation: '',
    nationalId: '',
    buyerName: '',
    buyerEmail: '',
    buyerAddress: '',
    landSizeToSell: '',
    sellingType: '',
  });
  const [activeSection, setActiveSection] = useState('home');
  const [name, setName] = useState(''); // Name for the signature input
  const sigCanvas = useRef({}); // Ref for signature pad
  const [files, setFiles] = useState([]); // Files state
  const [destinationDashboard, setDestinationDashboard] = useState(''); // State for destinationDashboard
  const [user, setUser] = useState(null); // Selected user

  const [file, setFile] = useState(null); // Selected file

  // Fetching list of users from the backend
  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component
    axios.get(`${API_URL}/api/users`)
      .then((response) => {
        if (isMounted) setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error getting users from DB:", error);
        alert("Failed to fetch users. Please try again later.");
      });

    return () => { isMounted = false; };
  }, []);

  // Fetching files when "Files" section is active
  useEffect(() => {
    if (activeSection === 'files') {
      fetchFiles();
    }
  }, [activeSection]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination_dashboard', destinationDashboard);
    formData.append('user_id', user); // Assuming you want to send the user ID

    try {
      const response = await axios.post(`${API_URL}/api/pdfs/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Request completed", response.data);
      alert("File sent successfully");
      // Optionally reset the form
      setFile(null);
      setDestinationDashboard('');
      setUser(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("There was an error uploading the file. Please try again.");
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pdfs`);
      setFiles(response.data);
    } catch (error) {
      console.error("Error getting files from DB:", error);
      alert("Failed to fetch files. Please try again later.");
    }
  }

  const showContent = (section) => {
    setActiveSection(section);
  };

  const clearSignature = () => sigCanvas.current.clear();

  const saveSignature = () => {
    if (!name.trim()) {
      alert('Please enter your name before saving the signature.');
      return;
    }

    try {
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      const blob = dataURLToBlob(dataUrl);
      const signatureFileName = `${name.trim()}_signature.png`;

      saveAs(blob, signatureFileName);
      console.log(`Signature saved for ${name}:`, dataUrl);
      alert("Signature saved successfully.");
      // Optionally clear the canvas and name
      clearSignature();
      setName('');
    } catch (error) {
      console.error("Error saving signature:", error);
      alert("There was an error saving your signature. Please try again.");
    }
  };

  const dataURLToBlob = (dataUrl) => {
    try {
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const buffer = new ArrayBuffer(byteString.length);
      const data = new Uint8Array(buffer);

      for (let i = 0; i < byteString.length; i++) {
        data[i] = byteString.charCodeAt(i);
      }

      return new Blob([buffer], { type: mimeString });
    } catch (error) {
      console.error("Error converting data URL to Blob:", error);
      throw error;
    }
  };

  const updateField = (e) => {
    setTransferDetails({
      ...transferDetails,
      [e.target.name]: e.target.value,
    });
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    try {
      const data = {
        land_id: transferDetails.landId,
        present_land_size: transferDetails.presentLandSize,
        owner_name: transferDetails.ownerName,
        owner_email: transferDetails.ownerEmail,
        land_location: transferDetails.landLocation,
        national_id: transferDetails.nationalId,
        buyer_name: transferDetails.buyerName,
        buyer_email: transferDetails.buyerEmail,
        buyer_address: transferDetails.buyerAddress,
        land_size_to_sell: transferDetails.landSizeToSell,
        selling_type: transferDetails.sellingType,
      };
      const response = await axios.post(
        `${API_URL}/api/transfer-ownership`,
        data
      );
      if (response.status === 201) {
        alert('Request taken into consideration');
        setTransferDetails({
          landId: '',
          presentLandSize: '',
          ownerName: '',
          ownerEmail: '',
          landLocation: '',
          nationalId: '',
          buyerName: '',
          buyerEmail: '',
          buyerAddress: '',
          landSizeToSell: '',
          sellingType: '',
        });
      } else {
        alert('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error("Transfer submission error:", error.response ? error.response.data : error.message);
      alert('There was an error processing your request.');
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeSection === 'transferofownership' ? 'active' : ''}>
            <a href="#!" onClick={() => showContent('transferofownership')}>
              <i className="fa fa-home"></i> Request Ownership Transfer
            </a>
          </li>
          <li className={activeSection === 'signature' ? 'active' : ''}>
            <a href="#!" onClick={() => showContent('signature')}>
              <i className="fa fa-signature"></i> Sign Here
            </a>
          </li>
          <li className={activeSection === 'messages' ? 'active' : ''}>
            <a href="#!" onClick={() => showContent('messages')}>
              <i className="fa fa-envelope"></i> Messages
            </a>
          </li>
          <li className={activeSection === 'files' ? 'active' : ''}>
            <a href="#!" onClick={() => showContent('files')}>
              <i className="fa fa-file"></i> Sent Files
            </a>
          </li>
          <li className={activeSection === 'notifications' ? 'active' : ''}>
            <a href="#!" onClick={() => showContent('notifications')}>
              <i className="fa fa-bell"></i> Notifications
            </a>
          </li>
          <li className={activeSection === 'settings' ? 'active' : ''}>
            <a href="#!" onClick={() => showContent('settings')}>
              <i className="fa fa-cog"></i> Settings
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`} id="main-content">
        {/* Header */}
        <div className={`header ${isCollapsed ? 'collapsed' : ''}`} id="header">
          <button className={`toggle-btn ${isCollapsed ? 'collapsed' : ''}`} onClick={toggleSidebar}>
            &#9776;
          </button>
          <b>Land Owner</b>
        </div>

        {/* Transfer of Ownership Section */}
        {activeSection === 'transferofownership' && (
          <div className="content active" id="transferofownership">
            <h2>Request for Ownership of Land Transfer</h2>
            <form onSubmit={submitTransfer}>
              {/* Land ID */}
              <label htmlFor="landId">Land ID:</label>
              <input
                type="text"
                name="landId"
                id="landId"
                value={transferDetails.landId}
                onChange={updateField}
                required
                aria-required="true"
              />

              {/* Present Land Size */}
              <label htmlFor="presentLandSize">Present Land Size (sqm):</label>
              <input
                type="number"
                name="presentLandSize"
                id="presentLandSize"
                value={transferDetails.presentLandSize}
                onChange={updateField}
                required
                aria-required="true"
                min="0"
              />

              {/* Owner's Name */}
              <label htmlFor="ownerName">Owner's Name:</label>
              <input
                type="text"
                name="ownerName"
                id="ownerName"
                value={transferDetails.ownerName}
                onChange={updateField}
                required
                aria-required="true"
              />

              {/* Owner's Email */}
              <label htmlFor="ownerEmail">Owner's Email:</label>
              <input
                type="email"
                name="ownerEmail"
                id="ownerEmail"
                value={transferDetails.ownerEmail}
                onChange={updateField}
                required
                aria-required="true"
              />

              {/* Land Location */}
              <label htmlFor="landLocation">Land Location:</label>
              <input
                type="text"
                name="landLocation"
                id="landLocation"
                value={transferDetails.landLocation}
                onChange={updateField}
                required
                aria-required="true"
              />

              {/* National ID */}
              <label htmlFor="nationalId">National ID:</label>
              <input
                type="text"
                name="nationalId"
                id="nationalId"
                value={transferDetails.nationalId}
                onChange={updateField}
                required
                aria-required="true"
              />

              {/* Buyer's Name */}
              <label htmlFor="buyerName">Buyer's Name:</label>
              <input
                type="text"
                name="buyerName"
                id="buyerName"
                value={transferDetails.buyerName}
                onChange={updateField}
                required
                aria-required="true"
              />

              {/* Buyer's Email */}
              <label htmlFor="buyerEmail">Buyer's Email:</label>
              <input
                type="email"
                name="buyerEmail"
                id="buyerEmail"
                value={transferDetails.buyerEmail}
                onChange={updateField}
                required
                aria-required="true"
              />

              {/* Buyer's Address */}
              <label htmlFor="buyerAddress">Buyer's Address:</label>
              <input
                type="text"
                name="buyerAddress"
                id="buyerAddress"
                value={transferDetails.buyerAddress}
                onChange={updateField}
                required
                aria-required="true"
              />

              {/* Land Size to Sell */}
              <label htmlFor="landSizeToSell">Land Size to Sell (sqm):</label>
              <input
                type="number"
                name="landSizeToSell"
                id="landSizeToSell"
                value={transferDetails.landSizeToSell}
                onChange={updateField}
                required
                aria-required="true"
                min="0"
              />

              {/* Selling Type */}
              <label htmlFor="sellingType">Selling Type:</label>
              <select
                name="sellingType"
                id="sellingType"
                value={transferDetails.sellingType}
                onChange={updateField}
                required
                aria-required="true"
              >
                <option value="">--Select Selling Type--</option>
                <option value="total">Total</option>
                <option value="diminution">Diminution</option>
              </select>

              <button type="submit">Submit Transfer</button>
            </form>
          </div>
        )}

        {/* Signature Section */}
        {activeSection === 'signature' && (
          <div className="content active" id="signature">
            <h2>Signature</h2>
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
            />
            <div className="signature-buttons">
              <button onClick={clearSignature}>Clear</button>
              <button onClick={saveSignature}>Save Signature</button>
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Name for signature"
            />
          </div>
        )}

        {/* Messages Section */}
        {activeSection === 'messages' && (
          <div className="content active" id="messages">
            <h2>Messages</h2>
            <form>
              <div className="form-group">
                <label htmlFor="fileUpload">Upload File:</label>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="destinationDashboard">Destination Dashboard:</label>
                <input
                  type="text"
                  id="destinationDashboard"
                  placeholder="Enter destination dashboard"
                  value={destinationDashboard}
                  onChange={(e) => setDestinationDashboard(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="userSelect">User:</label>
                <select
                  id="userSelect"
                  value={user || ''}
                  onChange={(e) => setUser(e.target.value)}
                >
                  <option value="">---</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={handleUpload}>
                Upload PDF
              </button>
            </form>
          </div>
        )}

        {/* Files Section */}
        {activeSection === 'files' && (
          <div className="content active" id="files">
            <h2>Sent Files</h2>
            {files.length === 0 ? (
              <p>No files sent yet.</p>
            ) : (
              <ul>
                {files.map((fileItem) => (
                  <li key={fileItem.id}>
                    <a href={`${API_URL}/${fileItem.file_path}`} target="_blank" rel="noopener noreferrer">
                      {fileItem.file_name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="content active" id="notifications">
            <h2>Notifications</h2>
            {/* Notifications content */}
            <p>You have no new notifications.</p>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="content active" id="settings">
            <h2>Settings</h2>
            {/* Settings content */}
            <p>Settings functionality coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

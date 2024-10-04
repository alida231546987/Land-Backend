import SignatureCanvas from 'react-signature-canvas';
import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver'; // Import file-saver for saving files locally
import './landbuyer.css'; // Import the CSS file for styling
import axios from 'axios';
import { API_URL } from '../../../utils/constants';


function Dashboard() {
  // State to manage the sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [dashboard, setDashboard] = useState("");

  const [user, setUser] = useState([]); // Users state
  const [files, setFiles] = useState([]); // Files state
  const [destinationDashboard, setDestinationDashboard] = useState(''); // Define state for destinationDashboard
  const [handleUplaod, setHandleUpload] = useState(''); // Define state for destinationDashboard
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

  // State to manage which content section is active
  const [activeSection, setActiveSection] = useState('home');

  // State to manage signature pad
  const sigCanvas = useRef({});

  // State to manage the name entered by the user
  const [name, setName] = useState('');

  // Function to toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to show content based on sidebar selection
  const showContents = (section) => {
    setActiveSection(section);
  };

  // Function to clear the signature pad
  const clearSignature = () => sigCanvas.current.clear();

  // Function to save the signature
  const saveSignature = () => {
    if (!name) {
      alert('Please enter your name before saving the signature.');
      return;
    }

    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    const blob = dataURLToBlob(dataUrl);

    // Combine name and signature for file name
    const signatureFileName = `${name}_signature.png`;

    // Save the signature image with the person's name
    saveAs(blob, signatureFileName);
    console.log(`Signature saved for ${name}:`, dataUrl);
  };

  // Helper function to convert Data URL to Blob
  const dataURLToBlob = (dataUrl) => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const data = new Uint8Array(buffer);

    for (let i = 0; i < byteString.length; i++) {
      data[i] = byteString.charCodeAt(i);
    }

    return new Blob([buffer], { type: mimeString });
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeSection === 'signature' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('signature')}>
              <i className="fa fa-home"></i> Sign here
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
          <li className={activeSection === 'complaint' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('complaint')}>
              <i className="fa fa-user-circle"></i> Complaint
            </a>
          </li>
          <li className={activeSection === 'settings' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('settings')}>
              <i className="fa fa-cog"></i> Settings
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
          <b>Land Buyer</b>
        </div>

        {/* Signature Section */}
        <div className={`content ${activeSection === 'signature' ? 'active' : ''}`} id="signature">
          <h2>Sign here</h2>
          <div className="signature-pad">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
            />
            <button className="btn btn-clear" onClick={clearSignature}>Clear</button>
            <button className="btn btn-save" onClick={saveSignature}>Save</button>
          </div>

          {/* Input field for the name */}
          <div className="name-input">
            <label htmlFor="name">Enter your name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
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
              <label htmlFor="">User</label>
              <select value={user} onChange={(e) => setUser(e.target.value)}>
                <option value={null}>---</option>
                {
                  user && Array.isArray(user) && user.map((u, index) => (
                    <option value={u.id} key={index}>{u.username}</option>
                  ))
                }
              </select>
            </div>
            <button onClick={handleUpload}>Upload PDF</button>
          </div>
        )};

        <div className={`content ${activeSection === 'notifications' ? 'active' : ''}`} id="notifications">
          <h2>Notifications</h2>
          <div className="notification-item">New message received.</div>
          <div className="notification-item">User registered successfully.</div>
        </div>

        <div className={`content ${activeSection === 'complaint' ? 'active' : ''}`} id="complaint">
          <h2>Send a complaint</h2>
          <form>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" placeholder="" /><br /><br />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="Enter your email" /><br /><br />

            <button className="button">
              <a href="mailto:nkwetchoulamagorachellealida@gmail.com">Send Email</a>
            </button>
          </form>
        </div>

        <div className={`content ${activeSection === 'settings' ? 'active' : ''}`} id="settings">
          <h2>Settings</h2>
          <p>This is the settings section content.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

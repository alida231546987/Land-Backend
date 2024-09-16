import SignatureCanvas from 'react-signature-canvas';
import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver'; // Import file-saver for saving files locally
import './landbuyer.css'; // Import the CSS file for styling

function Dashboard() {
  // State to manage the sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State to manage which content section is active
  const [activeSection, setActiveSection] = useState('home');

   // Messages section 1
   const [messages, setMessages] = useState([]);  // To store messages
   const [newMessage, setNewMessage] = useState("");  // To type a new message
   const [file, setFile] = useState(null);  // To store the selected file
 

  // State to manage signature pad
  const sigCanvas = useRef({});

  // State to manage the name entered by the user
  const [name, setName] = useState('');

  // Function to toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to show content based on sidebar selection
  const showContent = (section) => {
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
            <a href="#" onClick={() => showContent('signature')}>
              <i className="fa fa-home"></i> Sign here
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
          <li className={activeSection === 'complaint' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('complaint')}>
              <i className="fa fa-user-circle"></i> Complaint
            </a>
          </li>
          <li className={activeSection === 'settings' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('settings')}>
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

        <div className={`content ${activeSection === 'messages' ? 'active' : ''}`} id="messages">
        <h2>Messages</h2>

          {/* Display messages */}
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className="message-item">
                <p>{msg.text}</p>
                {msg.fileUrl && (
                  <a href={msg.fileUrl} download>
                    Download File
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Form for sending new message */}
          <form onSubmit={handleSendMessage}>
            <label htmlFor="newMessage">Message:</label>
            <input
              type="text"
              id="newMessage"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
            />
            
            <label htmlFor="fileUpload">Attach a file (optional):</label>
            <input type="file" id="fileUpload" onChange={(e) => setFile(e.target.files[0])} />
            
            <button type="submit">Send Message</button>
          </form>
        </div>



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

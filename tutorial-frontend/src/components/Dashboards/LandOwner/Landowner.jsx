import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios';
import SignatureCanvas from "react-signature-canvas";
import { saveAs } from 'file-saver'; // Importing file-saver
import './landowner.css'; // Importing the CSS file for styling

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recipient, setRecipient] = useState(''); // Selected recipient
  const [users, setUsers] = useState([]); // Users state
  const [messages, setMessages] = useState([]); // Messages state
  const [message, setMessage] = useState(''); // Single message state
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
    sellingType: 'total',
  });
  const [activeSection, setActiveSection] = useState('home');
  const [name, setName] = useState(''); // Name for the signature input
  const sigCanvas = useRef({}); // Ref for signature pad
  const [files, setFiles] = useState([]); // Files state

  useEffect(() => {
    if (recipient) {
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${recipient}/`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.message, sender: data.sender },
        ]);
      };

      return () => {
        ws.close();
      };
    }
  }, [recipient]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:8000/api/users/');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const sendMessage = () => {
    if (message.trim() && recipient) {
      const socket = new WebSocket(`ws://localhost:8000/ws/chat/${recipient}/`);
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            message: message,
            recipient: recipient,
          })
        );
        setMessage('');
        socket.close();
      };
    }
  };

  const sendFile = async (file) => {
    if (recipient) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('recipient', recipient); // Add recipient information

      const response = await fetch('/api/send-file/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert('File sent successfully!');
        fetchFiles(); // Refresh file list
      } else {
        alert('Error sending file');
      }
    } else {
      alert('Please select a recipient first.');
    }
  };

  const fetchFiles = async () => {
    if (recipient) {
      const response = await axios.get(`http://localhost:8000/api/files/?recipient=${recipient}`);
      setFiles(response.data);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const showContent = (section) => {
    setActiveSection(section);
    if (section === 'files') {
      fetchFiles(); // Fetch files when "Files" section is active
    }
  };

  const clearSignature = () => sigCanvas.current.clear();

  const saveSignature = () => {
    if (!name) {
      alert('Please enter your name before saving the signature.');
      return;
    }

    const dataUrl = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL('image/png');
    const blob = dataURLToBlob(dataUrl);
    const signatureFileName = `${name}_signature.png`;

    saveAs(blob, signatureFileName);
    console.log(`Signature saved for ${name}:`, dataUrl);
  };

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
        'http://localhost:8000/api/transfer-ownership',
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
          sellingType: 'total',
        });
      } else {
        alert('Error: ' + response.data.message);
      }
    } catch (error) {
      console.log(error.response.data)
      alert('There was an error processing your request');
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeSection === 'transferofownership' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('transferofownership')}>
              <i className="fa fa-home"></i> Request ownership transfer
            </a>
          </li>
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
          <li className={activeSection === 'files' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('files')}>
              <i className="fa fa-file"></i> Files
            </a>
          </li>
          <li className={activeSection === 'notifications' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('notifications')}>
              <i className="fa fa-bell"></i> Notifications
            </a>
          </li>
          <li className={activeSection === 'settings' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('settings')}>
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
            <h2>Request for ownership of land to be transferred</h2>
            <form onSubmit={submitTransfer}>
              {/* Form fields */}
                <label htmlFor="landId">Land ID:</label>
                <input type="text" name="landId" id="landId" value={transferDetails.landId} onChange={updateField} required />

                <label htmlFor="presentLandSize">Present Land Size (sqm):</label>
                <input type="text" name="presentLandSize" id="presentLandSize" value={transferDetails.presentLandSize} onChange={updateField} required />

                <label htmlFor="ownerName">Owner's Name:</label>
                <input type="text" name="ownerName" id="ownerName" value={transferDetails.ownerName} onChange={updateField} required />

                <label htmlFor="ownerEmail">Owner's Email:</label>
                <input type="email" name="ownerEmail" id="ownerEmail" value={transferDetails.ownerEmail} onChange={updateField} required />

                <label htmlFor="landLocation">Land Location:</label>
                <input type="text" name="landLocation" id="landLocation" value={transferDetails.landLocation} onChange={updateField} required />

                <label htmlFor="nationalId">National ID:</label>
                <input type="text" name="nationalId" id="nationalId" value={transferDetails.nationalId} onChange={updateField} required />

                <label htmlFor="buyerName">Buyer's Name:</label>
                <input type="text" name="buyerName" id="buyerName" value={transferDetails.buyerName} onChange={updateField} required />

                <label htmlFor="buyerEmail">Buyer's Email:</label>
                <input type="email" name="buyerEmail" id="buyerEmail" value={transferDetails.buyerEmail} onChange={updateField} required />

                <label htmlFor="buyerAddress">Buyer's Address:</label>
                <input type="text" name="buyerAddress" id="buyerAddress" value={transferDetails.buyerAddress} onChange={updateField} required />

                <label htmlFor="landSizeToSell">Land Size to Sell (sqm):</label>
                <input type="text" name="landSizeToSell" id="landSizeToSell" value={transferDetails.landSizeToSell} onChange={updateField} required />

                <label htmlFor="sellingType">Selling Type:</label>
                <select name="sellingType" id="sellingType" value={transferDetails.sellingType} onChange={updateField}>
                  <option value="total">Total</option>
                  <option value="partial">Partial</option>
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
            <button onClick={clearSignature}>Clear</button>
            <button onClick={saveSignature}>Save Signature</button>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {/* Messages Section */}
        {activeSection === 'messages' && (
          <div className="content active" id="messages">
            <h2>Messages</h2>
            <div>
              <select onChange={(e) => setRecipient(e.target.value)} value={recipient}>
                <option value="">Select recipient</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here"
              />
              <button onClick={sendMessage}>Send</button>
            </div>
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.sender}: </strong>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files Section */}
        {activeSection === 'files' && (
          <div className="content active" id="files">
            <h2>Uploaded Files</h2>
            <div>
              <select onChange={(e) => setRecipient(e.target.value)} value={recipient}>
                <option value="">Select recipient</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    sendFile(e.target.files[0]);
                  }
                }}
              />
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    <a href={`http://localhost:8000${file.file_url}`} download>
                      {file.file_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="content active" id="notifications">
            <h2>Notifications</h2>
            {/* Notifications content */}
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="content active" id="settings">
            <h2>Settings</h2>
            {/* Settings content */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

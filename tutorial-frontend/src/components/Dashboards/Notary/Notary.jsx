import React, { useState } from 'react';
import './notary.css'; // Import the CSS file for styling

function Dashboard() {
  // State to manage the sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State to manage which content section is active
  const [activeSection, setActiveSection] = useState('home');

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
          <li className={activeSection === 'users' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('users')}>
              <i className="fa fa-user"></i> Users
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
          <b>Notary</b>
        </div>

        {/* Content Sections */}
        <div className={`content ${activeSection === 'home' ? 'active' : ''}`} id="home">
          <h2>Home</h2>
          <p>This is the home section content.</p>
        </div>

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
            </tbody>
          </table>
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
            <select id="pdf-type">
              <option value="notarial-deed">Notarial Deed</option>
            </select>
            <label htmlFor="pdf-name">Notary's Name:</label>
            <input type="text" id="pdf-name" placeholder="Enter Name" />
            <label htmlFor="pdf-id">Land ID:</label>
            <input type="text" id="pdf-id" placeholder="Enter ID" />
            <label htmlFor="pdf-name">Buyers Name:</label>
            <input type="text" id="pdf-name" placeholder="Enter Name" />
            <label htmlFor="pdf-name">Sellers name:</label>
            <input type="text" id="pdf-name" placeholder="Enter Name" />
            <label htmlFor="pdf-name">Date:</label>
            <input type="date" id="date" placeholder="Enter the date of today" />
            <button className="btn btn-add">Generate PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

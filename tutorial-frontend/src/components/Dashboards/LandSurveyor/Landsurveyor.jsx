import React, { useState, useEffect } from 'react';
import './landsurveyor.css';
import axios from 'axios';
import geolib from 'geolib';
import { getDistance, getAreaOfPolygon } from 'geolib';
import { API_URL } from '../../../utils/constants.js';

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [rows, setRows] = useState([]);
  const [surfaceArea, setSurfaceArea] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [files, setFiles] = useState([]); // Files state
  const [destinationDashboard, setDestinationDashboard] = useState(''); // Define state for destinationDashboard
  const [handleUplaod, setHandleUpload] = useState(''); // Define state for destinationDashboard
  const [users, setUser] = useState(null);
  const [user, setUsers] = useState(null);

  const [file, setFile] = useState(null);

  // Set minimal change threshold to 1 centimeter (0.01 meters)
  const minimalChangeThreshold = 0.01; // 1 centimeter

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

   // getting list of users from the backend
   useEffect(() => {
    axios.get(`${API_URL}/api/users`)
    .then((response) => setUsers(response.data))
    .catch((error) => {
      console.log("Error getting users from DB");
    })
  }, []);

  //Files sharing aadn received
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
    if (section === 'filesreceived') {
      fetchFiles(); // Fetch files when "Files" section is active
    }
  };

  //const showContent = (section) => {
    //setActiveSection(section);
  //};

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    console.log("Adding row to the locations table.");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoordinate = { latitude, longitude };
          console.log('New coordinate:', newCoordinate);

          // Check if the new coordinate is different from the last one
          const lastCoordinate = rows[rows.length - 1];
          if (!lastCoordinate) {
            setRows([...rows, newCoordinate]);
          } else {
            const distance = getDistance(
              { latitude: lastCoordinate.latitude, longitude: lastCoordinate.longitude },
              { latitude: newCoordinate.latitude, longitude: newCoordinate.longitude }
            );
            console.log(`Distance from last coordinate: ${distance} meters`);
            if (distance >= minimalChangeThreshold) {
              setRows([...rows, newCoordinate]);
            } else {
              console.log('Movement less than minimal change threshold, not adding coordinate.');
            }
          }
        },
        (error) => {
          alert('Error fetching location: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by your browser.');
    }
  };

  const calculateAndSendSurfaceArea = async () => {
    console.log('Calculate Surface Area button clicked');
    if (rows.length < 3) {
      alert('You need at least three coordinates to calculate surface area.');
      return;
    }

    const coordinates = rows.map(row => ({
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
    }));

    const area = getAreaOfPolygon(coordinates);
    console.log('Calculated area:', area);
    setSurfaceArea(area);

    const landId = document.getElementById('landid').value;

    try {
      const response = await axios.patch(`http://localhost:8000/api/landtitles/${landId}/update_coordinates`, {
        surface_area: area,
        coordinates: coordinates
      });

      if (response.status === 200) {
        alert('Land title successfully updated.');
      }
    } catch (error) {
      console.error('Error updating land title:', error);
      alert('Failed to update land title.');
    }
  };

  const startRecording = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoordinate = { latitude, longitude };
          console.log('New coordinate:', newCoordinate);

          const lastCoordinate = rows[rows.length - 1];
          if (!lastCoordinate) {
            setRows([...rows, newCoordinate]);
          } else {
            const distance = getDistance(
              { latitude: lastCoordinate.latitude, longitude: lastCoordinate.longitude },
              { latitude: newCoordinate.latitude, longitude: newCoordinate.longitude }
            );
            console.log(`Distance from last coordinate: ${distance} meters`);
            if (distance >= minimalChangeThreshold) {
              setRows(prevRows => [...prevRows, newCoordinate]);
            } else {
              console.log('Movement less than minimal change threshold, not adding coordinate.');
            }
          }
        },
        (error) => {
          console.error("Error while recording location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0,
          distanceFilter: 0, // Try to get updates for any movement
        }
      );
      setWatchId(id);
      setIsRecording(true);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const stopRecording = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="dashboard">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeSection === 'RecordCoordinates' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('RecordCoordinates')}>
              <i className="fa fa-RecordCoordinates"></i> Record Co-ordinates
            </a>
          </li>
          <li className={activeSection === 'sendfiles' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('sendfiles')}>
              <i className="fa fa-home"></i> Send Files
            </a>
          </li>
        </ul>
      </div>

      <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`} id="main-content">
        <div className={`header ${isCollapsed ? 'collapsed' : ''}`} id="header">
          <button className={`toggle-btn ${isCollapsed ? 'collapsed' : ''}`} onClick={toggleSidebar}>
            &#9776;
          </button>
          <b>Land Surveyor</b>
        </div>

        <div className={`content ${activeSection === 'RecordCoordinates' ? 'active' : ''}`} id="RecordCoordinates">
          <h2>Record Coordinates</h2>
          <div className="pdf-form">
            <label htmlFor="landid">Land ID:</label>
            <input type="text" id="landid" placeholder="Enter Land Title ID" />
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" placeholder="Enter Land Location" />
            <label htmlFor="image-upload">Upload Technical:</label>
            <input type="file" id="image-upload" accept="image/*" />
            <label htmlFor="pdf-upload">Upload Technical File in PDF Format:</label>
            <input type="file" id="pdf-upload" accept="application/pdf" />

            <table>
              <thead>
                <tr>
                  <th>Latitudes</th>
                  <th>Longitudes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter Latitude"
                        value={row.latitude}
                        onChange={(e) => handleInputChange(index, 'latitude', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter Longitude"
                        value={row.longitude}
                        onChange={(e) => handleInputChange(index, 'longitude', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="btn btn-start" onClick={startRecording} disabled={isRecording}>Start Recording</button>
            <button className="btn btn-stop" onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
            <button className="btn btn-add" onClick={addRow}>Add Current Position</button>
            <button className="btn btn-calculate" onClick={calculateAndSendSurfaceArea}>Calculate Surface Area</button>

            <div className="surface-area">
              <h3>Calculated Surface Area: {surfaceArea.toFixed(2)} square meters</h3>
            </div>
          </div>
        </div>


        <div className={`content ${activeSection === 'sendfiles' ? 'active' : ''}`} id="sendfiles">
        <div className="content active" id="sendfiles">
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
                      {users && users.length > 0 ? (
                      users.map((u, index) => <option value={u.id} key={index}>{u.username}</option>)
                  ) : (
                      <option value={null}>No users available</option>
                  )}
                  </select>
              </div>
            <button onClick={handleUpload}>Upload PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect, useRef } from 'react';
import './landsurveyor.css';
import axios from 'axios'; // Import axios
import geolib from 'geolib';
import { getDistance, getAreaOfPolygon } from 'geolib';


function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [rows, setRows] = useState([]);
  const [surfaceArea, setSurfaceArea] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const [location, setLocation] = useState(null);
  const prevLocationRef = useRef(null); 


  // useEffect(() => {
  //   let watchId;

  //   // Function to get the user's location
  //   const getLocation = () => {
  //     if (navigator.geolocation) {
  //       watchId = navigator.geolocation.watchPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //           const newLocation = { latitude, longitude };

  //           // Retrieve previous location from the useRef
  //           const prevLocation = prevLocationRef.current;

  //           if (prevLocation && latitude === prevLocation.latitude && longitude === prevLocation.longitude) {
  //             console.log(`Location didn't change`);
  //           } else {
  //             console.log(`Location changed`);
  //             console.log(`Old location`, location);
  //             console.log('New location', {latitude, longitude});
  //           }

  //           setLocation({...newLocation});
  //           prevLocationRef.current = newLocation;
  //         },
  //         (err) => {
  //           console.log(`Error in the useEffect`);
  //           console.error(err);
  //         },
  //         {
  //           enableHighAccuracy: false, // High accuracy mode for better precision
  //           timeout: 5000, // Maximum wait time for a location response
  //           maximumAge: 0 // No cache, always request new location
  //         }
  //       );
  //     } else {
  //       setError('Geolocation is not supported by this browser.');
  //     }
  //   };

  //   // Get location every second
  //   const intervalId = setInterval(() => {
  //     getLocation();
  //   }, 1000); // 1 second interval

  //   // Cleanup: clear the interval and stop watching position when component unmounts
  //   return () => {
  //     clearInterval(intervalId);
  //     if (watchId) {
  //       navigator.geolocation.clearWatch(watchId);
  //     }
  //   };
  // }, []);

  // Set minimal change threshold to 0 for very small movements
  const minimalChangeThreshold = 0; // Allow recording of any positional change

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const showContent = (section) => {
    setActiveSection(section);
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    console.log("Adding row to the locations table.")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoordinate = { latitude, longitude };

          // Check if the new coordinate is different from the last one
          const lastCoordinate = rows[rows.length - 1];
          try {
            if (!lastCoordinate || getDistance(lastCoordinate, newCoordinate) > minimalChangeThreshold) {
              setRows([...rows, newCoordinate]);
            }
          } catch (error) {
            console.error(error);

            console.log(`Adding row manually`)
            const lastCoordinate = rows[rows.length - 1];

            const newCoordinate = { latitude: lastCoordinate.latitude - 0.002, longitude: lastCoordinate.longitude - 0.0002 };
            setRows([...rows, newCoordinate]);
          }
        },
        (error) => {
          console.error(error);
          console.log(`Adding row manually`)
          const lastCoordinate = rows[rows.length - 1];

          const newCoordinate = { latitude: lastCoordinate.latitude - 0.002, longitude: lastCoordinate.longitude - 0.0002 };
          setRows([...rows, newCoordinate]);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000, // Reduce timeout to get more frequent updates
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
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

    // Get the land ID from input
    const landId = document.getElementById('landid').value;

    try {
      const response = await axios.post('http://localhost:8000/api/update_land_title/', {
        land_id: landId,
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

          // Check if the new coordinate is different from the last one
          const lastCoordinate = rows[rows.length - 1];
          if (isRecording && (!lastCoordinate || getDistance(lastCoordinate, newCoordinate) > minimalChangeThreshold)) {
            setRows([...rows, newCoordinate]);
          }
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000, // Reduce timeout to get more frequent updates
          maximumAge: 0,
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

  console.log('Surface Area State:', surfaceArea);

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
            {/* Form Inputs */}
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

            <button className="btn btn-start" onClick={startRecording}>Start Recording</button>
            <button className="btn btn-stop" onClick={stopRecording}>Stop Recording</button>
            <button className="btn btn-add" onClick={addRow}>Add New Row</button>
            <button className="btn btn-calculate" onClick={calculateAndSendSurfaceArea}>Calculate Surface Area</button>

            <div className="surface-area">
              <h3>Calculated Surface Area: {surfaceArea.toFixed(2)} square meters</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

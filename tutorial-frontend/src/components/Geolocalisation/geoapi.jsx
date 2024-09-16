import React, { useState, useEffect } from 'react';

const GeolocationTracker = () => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const geoOptions = {
        enableHighAccuracy: true, // Ensures high GPS accuracy
        maximumAge: 1000, // Prevents caching of coordinates
        timeout: 10000, // Maximum wait time for a response
      };

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          // Update state with new position
          setPosition({
            latitude: latitude,
            longitude: longitude,
          });

          console.log('Accuracy:', accuracy, 'meters');
        },
        (error) => {
          setError(error.message);
        },
        geoOptions
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  return (
    <div>
      <h2>Geolocation Tracker</h2>
      {error && <p>Error: {error}</p>}
      {!error && position.latitude && (
        <div>
          <p>Latitude: {position.latitude}</p>
          <p>Longitude: {position.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default Geolocation

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as turf from '@turf/turf';

// Fix icon issue with Leaflet (default marker images won't load without this fix)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const WorldMap = () => {
  const [points, setPoints] = useState([
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.08],
    [51.505, -0.07]
  ]);

  const handlePointChange = (index, type, value) => {
    const newPoints = [...points];
    newPoints[index][type] = parseFloat(value);
    setPoints(newPoints);
  };

  // Ensure the polygon is closed by repeating the first point at the end
  const closedPoints = points.length > 0 ? [...points, points[0]] : [];

  const area = turf.area(turf.polygon([closedPoints.map(p => [p[1], p[0]])])).toFixed(2); // Area in square meters

  return (
    <div>
      <h1>Locate your land Position on the Map</h1>

      <div>
        {points.map((point, index) => (
          <div key={index}>
            <label>Latitude {index + 1}: </label>
            <input
              type="number"
              value={point[0]}
              onChange={(e) => handlePointChange(index, 0, e.target.value)}
              placeholder="Enter latitude"
            />
            <label>Longitude {index + 1}: </label>
            <input
              type="number"
              value={point[1]}
              onChange={(e) => handlePointChange(index, 1, e.target.value)}
              placeholder="Enter longitude"
            />
          </div>
        ))}
      </div>

      <MapContainer center={points.length > 0 ? [points[0][0], points[0][1]] : [0, 0]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {points.map((point, index) => (
          <Marker key={index} position={[point[0], point[1]]}></Marker>
        ))}
        {points.length > 2 && (
          <Polygon
            positions={closedPoints.map(p => [p[0], p[1]])}
            color="blue"
            weight={2}
            fillOpacity={0.2}
          />
        )}
      </MapContainer>

      {points.length > 2 && (
        <div>
          <h2>Area: {area} square meters</h2>
        </div>
      )}
    </div>
  );
};

export default WorldMap;

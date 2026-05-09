import { useState } from 'react';

const StationMap = ({ stations = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  const filteredStations = stations.filter(station =>
    station.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.id?.toString().includes(searchQuery)
  );

  const getStationColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational':
      case 'online':
      case 'active':
        return '#4ECDC4';
      case 'closed':
      case 'offline':
      case 'inactive':
        return '#FF6B6B';
      case 'under_maintenance':
      case 'maintenance':
        return '#FFB74D';
      default:
        return '#9CA3AF';
    }
  };

  const generateStationMarkers = () => {
    if (!stations || stations.length === 0) {
      return (
        <g className="station-markers">
          <text x="200" y="150" textAnchor="middle" fontSize="14" fill="#9CA3AF">
            No stations available
          </text>
        </g>
      );
    }

    // Calculate bounds for positioning stations on the map
    const validStations = stations.filter(s => s.latitude && s.longitude);

    if (validStations.length === 0) {
      // If no stations have coordinates, use grid layout
      return (
        <g className="station-markers">
          {stations.slice(0, 8).map((station, index) => {
            const baseX = 120 + (index % 4) * 60;
            const baseY = 120 + Math.floor(index / 4) * 60;
            const x = baseX + (Math.random() - 0.5) * 40;
            const y = baseY + (Math.random() - 0.5) * 40;
            const color = getStationColor(station.status);
            const isSelected = selectedStation?.id === station.id;

            return (
              <g key={station.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 10 : 6}
                  fill={color}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedStation(station)}
                />
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.5"
                  />
                )}
              </g>
            );
          })}
        </g>
      );
    }

    // Use actual coordinates for positioning
    const lats = validStations.map(s => parseFloat(s.latitude));
    const lngs = validStations.map(s => parseFloat(s.longitude));
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Map bounds (with padding)
    const mapPadding = 30;
    const mapWidth = 400 - 2 * mapPadding;
    const mapHeight = 300 - 2 * mapPadding;

    return (
      <g className="station-markers">
        {validStations.map((station) => {
          // Convert lat/lng to map coordinates
          const latRange = maxLat - minLat || 0.01; // Avoid division by zero
          const lngRange = maxLng - minLng || 0.01;

          const x = mapPadding + ((parseFloat(station.longitude) - minLng) / lngRange) * mapWidth;
          const y = mapPadding + ((maxLat - parseFloat(station.latitude)) / latRange) * mapHeight;

          const color = getStationColor(station.status);
          const isSelected = selectedStation?.id === station.id;

          return (
            <g key={station.id}>
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 10 : 6}
                fill={color}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedStation(station)}
              />
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r="14"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.5"
                />
              )}
              {/* Station label */}
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                fontSize="8"
                fill="#333"
                fontWeight="bold"
              >
                {station.name?.substring(0, 10)}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="station-map-container">
      <div className="map-header">
        <div className="map-title">
          <h3>Station Locations Overview</h3>
          <span className="station-count">
            {stations.length} station{stations.length !== 1 ? 's' : ''} total
          </span>
        </div>
        <div className="map-search">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search Station ID or Address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="map-content">
        <div className="map-illustration">
          <svg viewBox="0 0 400 300" className="map-svg">
            {/* Map background */}
            <rect width="400" height="300" fill="#4ECDC4" rx="8"/>

            {/* Map base */}
            <path d="M50 250 L350 250 L350 100 L300 80 L250 90 L200 70 L150 85 L100 75 L50 90 Z"
                  fill="#F7F7F7" stroke="#E0E0E0" strokeWidth="2"/>

            {/* Roads */}
            <path d="M50 200 L350 180" stroke="#FFB74D" strokeWidth="4" strokeLinecap="round"/>
            <path d="M100 100 L300 250" stroke="#FFB74D" strokeWidth="3" strokeLinecap="round"/>
            <path d="M150 80 L250 200" stroke="#FFB74D" strokeWidth="2" strokeLinecap="round"/>

            {/* Station markers */}
            {generateStationMarkers()}

            {/* Location pin */}
            <g transform="translate(180, 130)">
              <path d="M20 10 C20 4.5 15.5 0 10 0 C4.5 0 0 4.5 0 10 C0 17.5 10 30 10 30 S20 17.5 20 10 Z"
                    fill="white" stroke="#333" strokeWidth="2"/>
              <circle cx="10" cy="10" r="4" fill="#FF6B6B"/>
            </g>

            {/* Station info popup */}
            {selectedStation && (
              <g transform="translate(220, 120)">
                <rect x="0" y="0" width="160" height="90" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="1"/>
                <text x="10" y="20" fontSize="12" fontWeight="bold" fill="#333">
                  {selectedStation.name || 'Unknown Station'}
                </text>
                <text x="10" y="35" fontSize="10" fill="#666">
                  Status: {selectedStation.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
                </text>
                <text x="10" y="50" fontSize="10" fill="#666">
                  Address: {selectedStation.address?.substring(0, 20) || 'N/A'}
                </text>
                <text x="10" y="65" fontSize="10" fill="#666">
                  Connectors: {selectedStation.connectors?.length || 0}
                </text>
                <text x="10" y="80" fontSize="10" fill="#666">
                  Coordinates: {selectedStation.latitude ? `${parseFloat(selectedStation.latitude).toFixed(3)}, ${parseFloat(selectedStation.longitude).toFixed(3)}` : 'N/A'}
                </text>
              </g>
            )}

            {/* Map Legend */}
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="120" height="80" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="1" opacity="0.9"/>
              <text x="10" y="15" fontSize="10" fontWeight="bold" fill="#333">Station Status</text>

              <circle cx="15" cy="25" r="4" fill="#4ECDC4"/>
              <text x="25" y="29" fontSize="8" fill="#333">Operational</text>

              <circle cx="15" cy="40" r="4" fill="#FF6B6B"/>
              <text x="25" y="44" fontSize="8" fill="#333">Closed</text>

              <circle cx="15" cy="55" r="4" fill="#FFB74D"/>
              <text x="25" y="59" fontSize="8" fill="#333">Maintenance</text>

              <circle cx="15" cy="70" r="4" fill="#9CA3AF"/>
              <text x="25" y="74" fontSize="8" fill="#333">Unknown</text>
            </g>

            {/* Sun illustration */}
            <g transform="translate(320, 40)">
              <circle cx="20" cy="20" r="15" fill="#FFD93D"/>
              <g stroke="#FFD93D" strokeWidth="2" strokeLinecap="round">
                <line x1="20" y1="0" x2="20" y2="5"/>
                <line x1="20" y1="35" x2="20" y2="40"/>
                <line x1="0" y1="20" x2="5" y2="20"/>
                <line x1="35" y1="20" x2="40" y2="20"/>
                <line x1="7" y1="7" x2="10" y2="10"/>
                <line x1="30" y1="30" x2="33" y2="33"/>
                <line x1="33" y1="7" x2="30" y2="10"/>
                <line x1="10" y1="30" x2="7" y2="33"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StationMap;

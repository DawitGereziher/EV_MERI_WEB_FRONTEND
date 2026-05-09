import { useState, useEffect } from 'react';

const StationViewModal = ({ station, onClose }) => {
  const [stationDetails, setStationDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (station) {
      fetchStationDetails();
    }
  }, [station]);

  const fetchStationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/stations/${station.id}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStationDetails(data);
      } else {
        setStationDetails(station);
      }
    } catch (error) {
      console.error('Error fetching station details:', error);
      setStationDetails(station);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational':
        return '#10b981';
      case 'closed':
        return '#ef4444';
      case 'in use':
        return '#3b82f6';
      case 'under_maintenance':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational':
        return 'Online';
      case 'closed':
        return 'Offline';
      case 'in use':
        return 'In Use';
      case 'under_maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  if (!station) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content station-view-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Station Details</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <svg className="animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <p>Loading station details...</p>
            </div>
          ) : (
            <div className="station-details-content">
              <div className="station-header-info">
                <div className="station-basic-info">
                  <h3>{stationDetails?.name || station.name}</h3>
                  <p className="station-id">Station ID: #{(stationDetails?.id || station.id).slice(-5)}</p>
                  <p className="station-address">{stationDetails?.address || station.address}</p>
                  <p className="station-location">{stationDetails?.city || station.city}, {stationDetails?.state || station.state}</p>
                </div>
                <div className="station-status-info">
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getStatusColor(stationDetails?.status || station.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {getStatusLabel(stationDetails?.status || station.status)}
                  </span>
                </div>
              </div>

              <div className="station-details-grid">
                <div className="detail-section">
                  <h4>Basic Information</h4>
                  <div className="detail-items">
                    <div className="detail-item">
                      <span className="label">Description:</span>
                      <span className="value">{stationDetails?.description || station.description || 'No description available'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Opening Hours:</span>
                      <span className="value">{stationDetails?.opening_hours || station.opening_hours || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Public Access:</span>
                      <span className="value">{(stationDetails?.is_public || station.is_public) ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Connectors</h4>
                  <div className="detail-items">
                    <div className="detail-item">
                      <span className="label">Total Connectors:</span>
                      <span className="value">{stationDetails?.total_connectors || station.total_connectors || 0}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Available:</span>
                      <span className="value">{stationDetails?.available_connectors || station.available_connectors || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Amenities</h4>
                  <div className="amenities-list">
                    {(stationDetails?.has_restroom || station.has_restroom) && (
                      <span className="amenity-tag">Restroom</span>
                    )}
                    {(stationDetails?.has_wifi || station.has_wifi) && (
                      <span className="amenity-tag">WiFi</span>
                    )}
                    {(stationDetails?.has_restaurant || station.has_restaurant) && (
                      <span className="amenity-tag">Restaurant</span>
                    )}
                    {(stationDetails?.has_shopping || station.has_shopping) && (
                      <span className="amenity-tag">Shopping</span>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Statistics</h4>
                  <div className="detail-items">
                    <div className="detail-item">
                      <span className="label">Total Sessions:</span>
                      <span className="value">{stationDetails?.total_sessions || station.total_sessions || 0}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Total Energy:</span>
                      <span className="value">{stationDetails?.total_energy || station.total_energy || 0} kWh</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Rating:</span>
                      <span className="value">{stationDetails?.rating || station.rating || 'N/A'} ⭐</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationViewModal;

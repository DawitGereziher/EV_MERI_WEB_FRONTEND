import { useState } from 'react';
import EditStationModal from './EditStationModal';
import AddConnectorModal from './AddConnectorModal';

const StationCard = ({ station, onUpdate, onDelete, onAddConnector }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddConnectorModal, setShowAddConnectorModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'green';
      case 'under_maintenance': return 'yellow';
      case 'closed': return 'red';
      case 'coming_soon': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'closed':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
          </svg>
        );
      case 'under_maintenance':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'coming_soon':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        );
    }
  };

  const handleStatusChange = async (newStatus) => {
    await onUpdate(station.id, { status: newStatus });
    setShowDropdown(false);
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Never';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      <div className="station-card">
        <div className="station-card-header">
          <div className="station-info">
            <h3 className="station-name">{station.name}</h3>
            <p className="station-location">{station.city ? `${station.city}, ${station.state || ''}` : station.address}</p>
          </div>
          <div className="station-actions">
            <div className="status-dropdown">
              <button
                className={`status-btn ${getStatusColor(station.status)}`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="status-icon">{getStatusIcon(station.status)}</span>
                <span className="status-text">{station.status}</span>
                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              {showDropdown && (
                <div className="status-dropdown-menu">
                  <button onClick={() => handleStatusChange('operational')}>
                    <span className="status-icon green">{getStatusIcon('operational')}</span>
                    Operational
                  </button>
                  <button onClick={() => handleStatusChange('closed')}>
                    <span className="status-icon red">{getStatusIcon('closed')}</span>
                    Closed
                  </button>
                  <button onClick={() => handleStatusChange('under_maintenance')}>
                    <span className="status-icon yellow">{getStatusIcon('under_maintenance')}</span>
                    Under Maintenance
                  </button>
                  <button onClick={() => handleStatusChange('coming_soon')}>
                    <span className="status-icon blue">{getStatusIcon('coming_soon')}</span>
                    Coming Soon
                  </button>
                </div>
              )}
            </div>
            <button
              className="action-btn"
              onClick={() => setShowAddConnectorModal(true)}
              title="Add Connector"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
            <button
              className="action-btn"
              onClick={() => setShowEditModal(true)}
              title="Edit Station"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
            <button
              className="action-btn delete"
              onClick={() => onDelete(station.id)}
              title="Delete Station"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="station-card-body">
          <div className="station-details">
            <div className="detail-item">
              <span className="detail-label">Address</span>
              <span className="detail-value">{station.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Connectors</span>
              <span className="detail-value">{station.available_connectors || 0}/{station.total_connectors || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Rating</span>
              <span className="detail-value">⭐ {station.rating || 0}/5</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value">{station.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="station-metrics">
            <div className="metric-item">
              <div className="metric-value">{station.total_sessions || 0}</div>
              <div className="metric-label">Sessions</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{station.total_energy || 0}kWh</div>
              <div className="metric-label">Energy</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">${station.total_revenue || 0}</div>
              <div className="metric-label">Revenue</div>
            </div>
          </div>

          <div className="station-footer">
            <div className="last-seen">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              Last seen: {formatLastSeen(station.last_seen)}
            </div>
            {station.current_session && (
              <div className="current-session">
                <div className="session-indicator"></div>
                Active session
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditStationModal
          station={station}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}

      {showAddConnectorModal && (
        <AddConnectorModal
          station={station}
          onClose={() => setShowAddConnectorModal(false)}
          onAdd={onAddConnector}
        />
      )}
    </>
  );
};

export default StationCard;

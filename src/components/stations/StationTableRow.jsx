import { useState, useEffect, useRef } from 'react';
import StationViewModal from './StationViewModal';
import StationEditModal from './StationEditModal';
import ConnectorListModal from './ConnectorListModal';
import QRCodeModal from './QRCodeModal';

const StationTableRow = ({ station, onUpdate, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConnectorListModal, setShowConnectorListModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational':
        return '●';
      case 'closed':
        return '●';
      case 'in use':
        return '●';
      case 'under_maintenance':
        return '⚠';
      default:
        return '●';
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
        return 'Fault';
      default:
        return status;
    }
  };

  const formatConnectors = (station) => {
    const available = station.available_connectors || 0;
    const total = station.total_connectors || 0;

    if (total === 0) {
      return 'No connectors';
    }

    return `${available}/${total} available`;
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Never';

    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMs = now - lastSeenDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };



  const handleDeleteStation = async (stationId) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await onDelete(stationId);
        console.log('Station deleted successfully');
      } catch (error) {
        console.error('Failed to delete station:', error);
        alert('Failed to delete station. Please try again.');
      }
    }
  };

  return (
    <>
      <tr className="station-row">
        <td className="station-id">#{station.id.slice(-5)}</td>
        <td className="station-name">{station.name}</td>
        <td className="station-location">{station.city || station.address}</td>
        <td className="station-status">
          <span
            className="status-indicator"
            style={{ color: getStatusColor(station.status) }}
          >
            {getStatusIcon(station.status)} {getStatusLabel(station.status)}
          </span>
          {station.status?.toLowerCase() !== 'operational' && (
            <div className="last-seen">
              {formatLastSeen(station.last_seen)}
            </div>
          )}
        </td>
        <td className="station-connectors">
          {formatConnectors(station)}
        </td>
        <td className="station-actions">
          <div className="actions-container">
            <button
              className="action-btn view-btn"
              title="View Details"
              onClick={() => setShowViewModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </button>

            <button
              className="action-btn edit-btn"
              title="Edit Station"
              onClick={() => setShowEditModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>

            <button
              className="action-btn qr-btn"
              title="QR Codes"
              onClick={() => setShowQRCodeModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM18 13h-2v2h2v-2zM18 15h-2v2h2v-2zM16 13h-2v2h2v-2zM16 15h-2v2h2v-2zM18 17h-2v2h2v-2zM20 15h-2v2h2v-2zM20 17h-2v2h2v-2zM22 17h-2v2h2v-2z"/>
              </svg>
            </button>

            <div className="actions-dropdown" ref={dropdownRef}>
              <button
                className="action-btn more-btn"
                onClick={() => setShowActions(!showActions)}
                title="More Actions"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>

              {showActions && (
                <div className="dropdown-menu">
                  <button onClick={() => {
                    setShowConnectorListModal(true);
                    setShowActions(false);
                  }}>
                    Manage Connectors
                  </button>
                  <button onClick={() => {
                    setShowQRCodeModal(true);
                    setShowActions(false);
                  }}>
                    QR Codes
                  </button>
                  <button onClick={() => {
                    handleDeleteStation(station.id);
                    setShowActions(false);
                  }}>
                    Delete Station
                  </button>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>

      {showViewModal && (
        <StationViewModal
          station={station}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showEditModal && (
        <StationEditModal
          station={station}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}



      {showConnectorListModal && (
        <ConnectorListModal
          station={station}
          onClose={() => setShowConnectorListModal(false)}
          onUpdate={onUpdate}
        />
      )}

      {showQRCodeModal && (
        <QRCodeModal
          station={station}
          onClose={() => setShowQRCodeModal(false)}
        />
      )}
    </>
  );
};

export default StationTableRow;

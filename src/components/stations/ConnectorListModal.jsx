import { useState, useEffect } from 'react';
import EditConnectorModal from './EditConnectorModal';
import AddConnectorModal from './AddConnectorModal';

const ConnectorListModal = ({ station, onClose, onUpdate }) => {
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (station) {
      fetchConnectors();
    }
  }, [station]);

  const fetchConnectors = async () => {
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
        setConnectors(data.connectors || []);
      } else {
        throw new Error('Failed to fetch station data');
      }
    } catch (error) {
      console.error('Error fetching connectors:', error);
      setError('Failed to load connectors');
    } finally {
      setLoading(false);
    }
  };

  const handleEditConnector = (connector) => {
    setSelectedConnector(connector);
    setShowEditModal(true);
  };

  const handleConnectorUpdate = async () => {
    // Refresh the connector list from the server
    await fetchConnectors();
    // Note: we do NOT call onUpdate() here because that would trigger
    // a PATCH /api/stations/undefined/ — the connector add/edit already
    // talked directly to the API, so we just need to refresh the view.
  };

  const handleAddConnector = () => {
    setShowAddModal(true);
  };

  const handleDeleteConnector = async (connectorId) => {
    if (!window.confirm('Are you sure you want to delete this connector?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/stations/${station.id}/connectors/${connectorId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await handleConnectorUpdate();
      } else {
        throw new Error('Failed to delete connector');
      }
    } catch (error) {
      console.error('Error deleting connector:', error);
      alert('Failed to delete connector. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return '#10b981';
      case 'occupied':
        return '#3b82f6';
      case 'out_of_order':
        return '#ef4444';
      case 'maintenance':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getConnectorTypeLabel = (type) => {
    const types = {
      'type1': 'Type 1 (J1772)',
      'type2': 'Type 2 (Mennekes)',
      'ccs1': 'CCS Combo 1',
      'ccs2': 'CCS Combo 2',
      'chademo': 'CHAdeMO',
      'tesla': 'Tesla',
      'other': 'Other'
    };
    return types[type] || type;
  };

  if (!station) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content connector-list-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Connectors</h2>
          <p className="modal-subtitle">{station.name} - {connectors.length} connector{connectors.length !== 1 ? 's' : ''}</p>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="connector-list-header">
            <div className="header-content">
              <div>
                <h3>Connector Management</h3>
                <p>Manage existing connectors for this station</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleAddConnector}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px', marginRight: '8px' }}>
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Add Connector
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <svg className="animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <p>Loading connectors...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button className="btn btn-secondary" onClick={fetchConnectors}>
                Retry
              </button>
            </div>
          ) : connectors.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="currentColor" className="empty-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3>No Connectors</h3>
              <p>This station doesn't have any connectors yet. Add your first connector to get started.</p>
              <button
                className="btn btn-primary"
                onClick={handleAddConnector}
              >
                Add First Connector
              </button>
            </div>
          ) : (
            <div className="connector-grid">
              {connectors.map((connector) => (
                <div key={connector.id} className="connector-card">
                  <div className="connector-header">
                    <div className="connector-type">
                      {getConnectorTypeLabel(connector.connector_type)}
                    </div>
                    <div
                      className="connector-status"
                      style={{
                        backgroundColor: getStatusColor(connector.status || 'available'),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {(connector.status || 'available').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>

                  <div className="connector-details">
                    <div className="detail-row">
                      <span className="detail-label">Power:</span>
                      <span className="detail-value">{connector.power_kw || 'N/A'} kW</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Available:</span>
                      <span className={`detail-value ${connector.is_available !== false ? 'available' : 'unavailable'}`}>
                        {connector.is_available !== false ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">#{connector.id?.toString().slice(-5) || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="connector-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEditConnector(connector)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteConnector(connector.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEditModal && selectedConnector && (
        <EditConnectorModal
          connector={selectedConnector}
          station={station}
          onClose={() => {
            setShowEditModal(false);
            setSelectedConnector(null);
          }}
          onUpdate={handleConnectorUpdate}
        />
      )}

      {showAddModal && (
        <AddConnectorModal
          station={station}
          onClose={() => setShowAddModal(false)}
          onAdd={handleConnectorUpdate}
        />
      )}
    </div>
  );
};

export default ConnectorListModal;

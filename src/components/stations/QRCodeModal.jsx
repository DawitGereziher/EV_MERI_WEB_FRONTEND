import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeModal = ({ station, onClose }) => {
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [fallbackQRCodes, setFallbackQRCodes] = useState({});

  useEffect(() => {
    fetchQRCodes();
  }, [station.id]);

  const fetchQRCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/stations/${station.id}/qr-codes/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('QR Codes API Response:', data);
        const connectorsData = data.connectors || [];
        setConnectors(connectorsData);

        // Generate fallback QR codes for connectors without QR code URLs but with payment URLs
        connectorsData.forEach(connector => {
          if (!connector.qr_code_url && connector.qr_payment_url) {
            generateFallbackQR(connector);
          }
        });
      } else {
        console.error('Failed to fetch QR codes:', response.status, response.statusText);
        setError('Failed to fetch QR codes');
      }
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      setError('Error loading QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQR = async (connectorId) => {
    setRegeneratingId(connectorId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/connectors/${connectorId}/qr-code/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchQRCodes();
      } else {
        setError('Failed to regenerate QR code');
      }
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      setError('Error regenerating QR code');
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDownloadQR = async (connectorId, connectorName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/connectors/${connectorId}/qr-code/download/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `qr_code_${station.name}_${connectorName}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download QR code');
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setError('Error downloading QR code');
    }
  };

  const generateFallbackQR = async (connector) => {
    try {
      if (connector.qr_payment_url) {
        const qrDataURL = await QRCode.toDataURL(connector.qr_payment_url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setFallbackQRCodes(prev => ({
          ...prev,
          [connector.connector_id]: qrDataURL
        }));
      }
    } catch (error) {
      console.error('Error generating fallback QR code:', error);
    }
  };

  const handleImageError = (connectorId) => {
    setImageErrors(prev => ({
      ...prev,
      [connectorId]: true
    }));
    // Generate fallback QR code
    const connector = connectors.find(c => c.connector_id === connectorId);
    if (connector) {
      generateFallbackQR(connector);
    }
  };

  const copyToClipboard = (text, buttonElement) => {
    navigator.clipboard.writeText(text).then(() => {
      // Add visual feedback
      if (buttonElement) {
        buttonElement.classList.add('copied');
        buttonElement.textContent = 'Copied!';
        setTimeout(() => {
          buttonElement.classList.remove('copied');
          buttonElement.textContent = 'Copy';
        }, 2000);
      }
    }).catch(() => {
      alert('Failed to copy URL');
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return '#10b981';
      case 'occupied':
        return '#f59e0b';
      case 'out_of_order':
        return '#ef4444';
      case 'maintenance':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>QR Codes - {station.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading QR codes...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button onClick={fetchQRCodes} className="retry-btn">Retry</button>
            </div>
          ) : connectors.length === 0 ? (
            <div className="empty-state">
              <p>No connectors found for this station.</p>
            </div>
          ) : (
            <div className="qr-codes-grid">
              {connectors.map((connector) => (
                <div key={connector.connector_id} className="qr-code-card">
                  <div className="connector-info">
                    <h3>{connector.connector_type_display}</h3>
                    <div className="connector-details">
                      <span className="power">{connector.power_kw} kW</span>
                      <span className="price">ETB {connector.price_per_kwh}/kWh</span>
                      <span
                        className={`status status-${connector.status?.toLowerCase()}`}
                        style={{ color: getStatusColor(connector.status) }}
                      >
                        {connector.status_display}
                      </span>
                    </div>
                    <div className="availability">
                      {connector.available_quantity}/{connector.quantity} available
                    </div>
                  </div>

                  <div className="qr-code-section">
                    {connector.qr_code_url && !imageErrors[connector.connector_id] ? (
                      <div className="qr-image-container">
                        <img
                          src={`https://mengedmate-backend.onrender.com${connector.qr_code_url}`}
                          alt={`QR Code for ${connector.connector_type_display}`}
                          className="qr-image"
                          onError={() => handleImageError(connector.connector_id)}
                          onLoad={() => console.log('QR Code loaded successfully:', connector.qr_code_url)}
                        />
                      </div>
                    ) : fallbackQRCodes[connector.connector_id] ? (
                      <div className="qr-image-container">
                        <img
                          src={fallbackQRCodes[connector.connector_id]}
                          alt={`QR Code for ${connector.connector_type_display}`}
                          className="qr-image"
                        />
                        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                          Generated QR Code
                        </p>
                      </div>
                    ) : connector.qr_payment_url ? (
                      <div className="qr-image-container">
                        <button
                          onClick={() => generateFallbackQR(connector)}
                          className="generate-qr-btn"
                          style={{
                            padding: '1rem 2rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}
                        >
                          Generate QR Code
                        </button>
                      </div>
                    ) : (
                      <div className="no-qr">
                        <p>QR code not available</p>
                        {process.env.NODE_ENV === 'development' && (
                          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                            <p>Debug info:</p>
                            <p>Connector ID: {connector.connector_id}</p>
                            <p>QR Code URL: {connector.qr_code_url || 'No URL'}</p>
                            <p>Payment URL: {connector.qr_payment_url || 'No Payment URL'}</p>
                            <p>Full QR URL: {connector.qr_code_url ? `https://mengedmate-backend.onrender.com${connector.qr_code_url}` : 'N/A'}</p>
                            <p>Image Error: {imageErrors[connector.connector_id] ? 'Yes' : 'No'}</p>
                            <p>Has Fallback: {fallbackQRCodes[connector.connector_id] ? 'Yes' : 'No'}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="qr-actions">
                    <div className="payment-url">
                      <label>Payment URL:</label>
                      <div className="url-container">
                        <input 
                          type="text" 
                          value={connector.qr_payment_url || 'Not available'} 
                          readOnly 
                          className="url-input"
                        />
                        <button
                          onClick={(e) => copyToClipboard(connector.qr_payment_url, e.target)}
                          className="copy-btn"
                          disabled={!connector.qr_payment_url}
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button
                        onClick={() => handleDownloadQR(connector.connector_id, connector.connector_type_display)}
                        className="download-btn"
                        disabled={!connector.qr_code_url}
                      >
                        Download QR
                      </button>
                      <button
                        onClick={() => handleRegenerateQR(connector.connector_id)}
                        className="regenerate-btn"
                        disabled={regeneratingId === connector.connector_id}
                      >
                        {regeneratingId === connector.connector_id ? 'Regenerating...' : 'Regenerate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions" style={{ padding: '1.5rem 2rem' }}>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;

import { useState, useEffect } from 'react';

const EditConnectorModal = ({ connector, station, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    connector_type: 'type2',
    power_kw: 22,
    quantity: 1,
    price_per_kwh: 5.00,
    is_available: true,
    status: 'available'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connectorTypes = [
    { value: 'type1', label: 'Type 1 (J1772)' },
    { value: 'type2', label: 'Type 2 (Mennekes)' },
    { value: 'ccs1', label: 'CCS Combo 1' },
    { value: 'ccs2', label: 'CCS Combo 2' },
    { value: 'chademo', label: 'CHAdeMO' },
    { value: 'tesla', label: 'Tesla Supercharger' },
    { value: 'other', label: 'Other' }
  ];

  const powerOptions = [
    { value: 3.7, label: '3.7 kW (AC)' },
    { value: 7.4, label: '7.4 kW (AC)' },
    { value: 11, label: '11 kW (AC)' },
    { value: 22, label: '22 kW (AC)' },
    { value: 43, label: '43 kW (AC)' },
    { value: 50, label: '50 kW (DC)' },
    { value: 100, label: '100 kW (DC)' },
    { value: 150, label: '150 kW (DC)' },
    { value: 250, label: '250 kW (DC)' },
    { value: 350, label: '350 kW (DC)' }
  ];

  useEffect(() => {
    if (connector) {
      setFormData({
        connector_type: connector.connector_type || 'type2',
        power_kw: connector.power_kw || 22,
        quantity: connector.quantity || 1,
        price_per_kwh: connector.price_per_kwh || 5.00,
        is_available: connector.is_available !== undefined ? connector.is_available : true,
        status: connector.status || 'available'
      });
    }
  }, [connector]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              (name === 'power_kw' || name === 'price_per_kwh') ? parseFloat(value) :
              (name === 'quantity') ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const connectorId = connector.id?.toString() || '';

      if (!connectorId) {
        throw new Error('Invalid connector ID');
      }

      const response = await fetch(`https://mengedmate-backend.onrender.com/api/stations/${station.id}/connectors/${connectorId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedConnector = await response.json();
        console.log('Connector updated successfully:', updatedConnector);

        // Call the parent's onUpdate to update the UI
        if (onUpdate) {
          await onUpdate(station.id, connector.id, formData);
        }

        onClose();
      } else {
        const errorData = await response.text();
        console.error('Failed to update connector:', response.status, errorData);
        throw new Error(`Failed to update connector: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update connector:', error);
      setError('Failed to update connector. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this connector?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const connectorId = connector.id?.toString() || '';

      if (!connectorId) {
        throw new Error('Invalid connector ID');
      }

      const response = await fetch(`https://mengedmate-backend.onrender.com/api/stations/${station.id}/connectors/${connectorId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        console.log('Connector deleted successfully');

        // Call the parent's onUpdate to refresh the data
        if (onUpdate) {
          await onUpdate(station.id, connector.id, null, true); // true indicates deletion
        }

        onClose();
      } else {
        const errorData = await response.text();
        console.error('Failed to delete connector:', response.status, errorData);
        throw new Error(`Failed to delete connector: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete connector:', error);
      setError('Failed to delete connector. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!connector || !station) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-connector-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Connector</h2>
          <p className="modal-subtitle">Connector #{connector.id?.toString().slice(-5) || 'N/A'} at {station.name}</p>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="connector_type">Connector Type *</label>
              <select
                id="connector_type"
                name="connector_type"
                value={formData.connector_type}
                onChange={handleInputChange}
                required
              >
                {connectorTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="power_kw">Power Rating *</label>
              <select
                id="power_kw"
                name="power_kw"
                value={formData.power_kw}
                onChange={handleInputChange}
                required
              >
                {powerOptions.map(power => (
                  <option key={power.value} value={power.value}>
                    {power.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                max="50"
                required
              />
              <small className="form-help">Number of connectors of this type</small>
            </div>

            <div className="form-group">
              <label htmlFor="price_per_kwh">Price per kWh (ETB) *</label>
              <input
                type="number"
                id="price_per_kwh"
                name="price_per_kwh"
                value={formData.price_per_kwh}
                onChange={handleInputChange}
                min="0.01"
                max="100"
                step="0.01"
                required
              />
              <small className="form-help">Price charged per kilowatt hour</small>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="out_of_order">Out of Order</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                />
                Available for use
              </label>
            </div>
          </div>

          <div className="connector-preview">
            <h4>Connector Preview</h4>
            <div className="preview-card">
              <div className="preview-item">
                <span className="preview-label">Type:</span>
                <span className="preview-value">
                  {connectorTypes.find(t => t.value === formData.connector_type)?.label}
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Power:</span>
                <span className="preview-value">
                  {formData.power_kw} kW
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Quantity:</span>
                <span className="preview-value">
                  {formData.quantity} connector{formData.quantity > 1 ? 's' : ''}
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Price:</span>
                <span className="preview-value">
                  ETB {formData.price_per_kwh}/kWh
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Status:</span>
                <span className={`preview-value status-${formData.status}`}>
                  {formData.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Available:</span>
                <span className={`preview-value ${formData.is_available ? 'available' : 'unavailable'}`}>
                  {formData.is_available ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Connector
            </button>
            <div className="action-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Connector'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditConnectorModal;

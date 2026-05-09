import { useState } from 'react';

const AddConnectorModal = ({ station, onClose, onAdd }) => {
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

  const handleChange = (e) => {
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
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/stations/${station.id}/connectors/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newConnector = await response.json();
        console.log('Connector added successfully:', newConnector);

        // Show success message
        const connectorType = connectorTypes.find(t => t.value === formData.connector_type)?.label;
        alert(`Successfully added ${formData.quantity} x ${connectorType} (${formData.power_kw}kW) connector${formData.quantity > 1 ? 's' : ''} at ETB ${formData.price_per_kwh}/kWh`);

        // Call the parent's onAdd to update the UI
        if (onAdd) {
          await onAdd(station.id, formData);
        }

        onClose();
      } else {
        const errorData = await response.text();
        console.error('Failed to add connector:', response.status, errorData);
        throw new Error(`Failed to add connector: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to add connector:', error);
      setError('Failed to add connector. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const connectorTypes = [
    { value: 'type1', label: 'Type 1 (J1772)' },
    { value: 'type2', label: 'Type 2 (Mennekes)' },
    { value: 'ccs1', label: 'CCS Combo 1' },
    { value: 'ccs2', label: 'CCS Combo 2' },
    { value: 'chademo', label: 'CHAdeMO' },
    { value: 'tesla', label: 'Tesla' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Connector to {station.name}</h2>
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
                onChange={handleChange}
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
                onChange={handleChange}
                required
              >
                <option value={3.7}>3.7 kW (AC)</option>
                <option value={7.4}>7.4 kW (AC)</option>
                <option value={11}>11 kW (AC)</option>
                <option value={22}>22 kW (AC)</option>
                <option value={43}>43 kW (AC)</option>
                <option value={50}>50 kW (DC)</option>
                <option value={100}>100 kW (DC)</option>
                <option value={150}>150 kW (DC)</option>
                <option value={250}>250 kW (DC)</option>
                <option value={350}>350 kW (DC)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
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
                onChange={handleChange}
                min="0.01"
                max="100"
                step="0.01"
                required
              />
              <small className="form-help">Price charged per kilowatt hour</small>
            </div>

            <div className="form-group">
              <label htmlFor="status">Initial Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="out_of_order">Out of Order</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>

            <div className="form-group full-width checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                />
                Mark as available for use
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
              {loading ? 'Adding...' : 'Add Connector'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConnectorModal;

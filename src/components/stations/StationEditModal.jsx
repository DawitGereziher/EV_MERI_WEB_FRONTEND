import { useState, useEffect } from 'react';

const StationEditModal = ({ station, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    opening_hours: '',
    status: 'operational',
    has_restroom: false,
    has_wifi: false,
    has_restaurant: false,
    has_shopping: false,
    is_public: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name || '',
        description: station.description || '',
        address: station.address || '',
        city: station.city || '',
        state: station.state || '',
        zip_code: station.zip_code || '',
        opening_hours: station.opening_hours || '',
        status: station.status || 'operational',
        has_restroom: station.has_restroom || false,
        has_wifi: station.has_wifi || false,
        has_restaurant: station.has_restaurant || false,
        has_shopping: station.has_shopping || false,
        is_public: station.is_public !== undefined ? station.is_public : true,
      });
    }
  }, [station]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onUpdate(station.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating station:', error);
      setError('Failed to update station. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!station) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content station-edit-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Station</h2>
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
              <label htmlFor="name">Station Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="opening_hours">Opening Hours</label>
              <input
                type="text"
                id="opening_hours"
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleInputChange}
                placeholder="e.g., 24/7 or Mon-Fri 8AM-6PM"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Station Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="operational">Operational</option>
                <option value="closed">Closed</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="in_use">In Use</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Brief description of the charging station"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="zip_code">ZIP Code</label>
              <input
                type="text"
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="amenities-section">
            <h4>Amenities</h4>
            <div className="checkbox-grid">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="has_restroom"
                    checked={formData.has_restroom}
                    onChange={handleInputChange}
                  />
                  Restroom
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="has_wifi"
                    checked={formData.has_wifi}
                    onChange={handleInputChange}
                  />
                  WiFi
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="has_restaurant"
                    checked={formData.has_restaurant}
                    onChange={handleInputChange}
                  />
                  Restaurant
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="has_shopping"
                    checked={formData.has_shopping}
                    onChange={handleInputChange}
                  />
                  Shopping
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                  />
                  Public Access
                </label>
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
              {loading ? 'Updating...' : 'Update Station'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StationEditModal;

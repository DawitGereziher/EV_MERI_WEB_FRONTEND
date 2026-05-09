import { useState } from 'react';

const EditStationModal = ({ station, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: station.name || '',
    address: station.address || '',
    city: station.city || '',
    state: station.state || '',
    zip_code: station.zip_code || '',
    country: station.country || 'Ethiopia',
    latitude: station.latitude || '',
    longitude: station.longitude || '',
    description: station.description || '',
    opening_hours: station.opening_hours || '',
    has_restroom: station.has_restroom || false,
    has_wifi: station.has_wifi || false,
    has_restaurant: station.has_restaurant || false,
    has_shopping: station.has_shopping || false,
    status: station.status || 'operational',
    is_active: station.is_active !== undefined ? station.is_active : true,
    is_public: station.is_public !== undefined ? station.is_public : true
  });
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.latitude || !formData.longitude) {
      setError('Please fill in all required fields (Name, Address, City, State, Latitude, Longitude)');
      setLoading(false);
      return;
    }

    try {
      // Try JSON first, then FormData if image is included
      let submitData;
      let isFormData = false;

      if (mainImage) {
        // Use FormData only when image is included
        submitData = new FormData();
        isFormData = true;

        // Append all form fields
        Object.keys(formData).forEach(key => {
          const value = formData[key];
          if (value !== null && value !== undefined) {
            submitData.append(key, value);
          }
        });

        submitData.append('main_image', mainImage);
      } else {
        // Use JSON when no image
        submitData = formData;
        isFormData = false;
      }

      await onUpdate(station.id, submitData, isFormData);
      onClose();
    } catch (error) {
      setError('Failed to update station. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'operational', label: 'Operational' },
    { value: 'under_maintenance', label: 'Under Maintenance' },
    { value: 'closed', label: 'Closed' },
    { value: 'coming_soon', label: 'Coming Soon' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                onChange={handleChange}
                placeholder="e.g., Bole Station 1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., 123 Main Street"
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
                onChange={handleChange}
                placeholder="e.g., Addis Ababa"
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
                onChange={handleChange}
                placeholder="e.g., Addis Ababa"
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
                onChange={handleChange}
                placeholder="e.g., 12345"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., Ethiopia"
              />
            </div>

            <div className="form-group">
              <label htmlFor="latitude">Latitude *</label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g., 9.0192"
                step="any"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude *</label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g., 38.7525"
                step="any"
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
                onChange={handleChange}
                placeholder="e.g., 24/7 or Mon-Fri 8AM-6PM"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Station is Active
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                />
                Public Station
              </label>
            </div>

            <div className="form-group amenities-group">
              <label>Amenities</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="has_restroom"
                    checked={formData.has_restroom}
                    onChange={handleChange}
                  />
                  Restroom
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="has_wifi"
                    checked={formData.has_wifi}
                    onChange={handleChange}
                  />
                  WiFi
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="has_restaurant"
                    checked={formData.has_restaurant}
                    onChange={handleChange}
                  />
                  Restaurant
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="has_shopping"
                    checked={formData.has_shopping}
                    onChange={handleChange}
                  />
                  Shopping
                </label>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="main_image">Station Image</label>
              <input
                type="file"
                id="main_image"
                name="main_image"
                onChange={handleImageChange}
                accept="image/*"
              />
              {mainImage && (
                <div className="image-preview">
                  <p>Selected: {mainImage.name}</p>
                </div>
              )}
              {station.main_image && !mainImage && (
                <div className="current-image">
                  <p>Current image: {station.main_image}</p>
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional details about the station..."
                rows="3"
              />
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

export default EditStationModal;

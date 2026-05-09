import { useState, useEffect } from 'react';
import Sidebar from '../dashboard/Sidebar';
import MobileHeader from '../dashboard/MobileHeader';
import '../../styles/dashboard.css';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    ev_battery_capacity_kwh: '',
    ev_connector_type: 'none'
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_notifications: true,
    station_updates: true,
    booking_notifications: true,
    payment_notifications: true,
    maintenance_alerts: true,
    marketing_emails: false
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // EV Connector type options
  const connectorTypes = [
    { value: 'none', label: 'None' },
    { value: 'type1', label: 'Type 1 (J1772)' },
    { value: 'type2', label: 'Type 2 (Mennekes)' },
    { value: 'ccs1', label: 'CCS Combo 1' },
    { value: 'ccs2', label: 'CCS Combo 2' },
    { value: 'chademo', label: 'CHAdeMO' },
    { value: 'tesla', label: 'Tesla' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/auth/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          zip_code: userData.zip_code || '',
          ev_battery_capacity_kwh: userData.ev_battery_capacity_kwh || '',
          ev_connector_type: userData.ev_connector_type || 'none'
        });

        setNotificationPrefs(userData.notification_preferences || {
          email_notifications: true,
          station_updates: true,
          booking_notifications: true,
          payment_notifications: true,
          maintenance_alerts: true,
          marketing_emails: false
        });
      } else {
        setMessage('Failed to load profile data.');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setMessage('Failed to load profile data.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/auth/profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          notification_preferences: notificationPrefs
        }),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('New passwords do not match.');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        }),
      });

      if (response.ok) {
        setMessage('Password changed successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const settingsTabs = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
      )
    },
    {
      id: 'security',
      label: 'Security',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11C15.4,11 16,11.4 16,12V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V12C8,11.4 8.4,11 9,11V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="dashboard-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-content">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Settings" />
        <div className="settings-container">
          <div className="settings-header">
            <h1>Settings</h1>
          </div>

          <div className="settings-content">
            <div className="settings-sidebar">
              <div className="settings-tabs">
                {settingsTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="tab-icon">{tab.icon}</div>
                    <span className="tab-label">{tab.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-main">
              {activeTab === 'profile' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Profile Information</h2>
                    <p>Update your personal information and EV details</p>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="John"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Doe"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com"
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone_number">Phone Number</label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="+251912345678"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Addis Ababa"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="state">State/Region</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Addis Ababa"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="zip_code">Zip Code</label>
                      <input
                        type="text"
                        id="zip_code"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleInputChange}
                        placeholder="1000"
                      />
                    </div>
                  </div>

                  <div className="section-divider">
                    <h3>Electric Vehicle Information</h3>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="ev_battery_capacity_kwh">Battery Capacity (kWh)</label>
                      <input
                        type="number"
                        id="ev_battery_capacity_kwh"
                        name="ev_battery_capacity_kwh"
                        value={formData.ev_battery_capacity_kwh}
                        onChange={handleInputChange}
                        placeholder="75"
                        step="0.1"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="ev_connector_type">Connector Type</label>
                      <select
                        id="ev_connector_type"
                        name="ev_connector_type"
                        value={formData.ev_connector_type}
                        onChange={handleInputChange}
                      >
                        {connectorTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="save-btn"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>

                  {message && (
                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                      {message}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Notification Preferences</h2>
                    <p>Choose which notifications you want to receive</p>
                  </div>

                  <div className="notification-groups">
                    <div className="notification-group">
                      <h3>Essential Notifications</h3>
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="email_notifications"
                            checked={notificationPrefs.email_notifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="checkbox-text">Email Notifications</span>
                          <span className="checkbox-description">Receive important updates via email</span>
                        </label>

                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="booking_notifications"
                            checked={notificationPrefs.booking_notifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="checkbox-text">Booking Notifications</span>
                          <span className="checkbox-description">Get notified about your charging session bookings</span>
                        </label>

                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="payment_notifications"
                            checked={notificationPrefs.payment_notifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="checkbox-text">Payment Notifications</span>
                          <span className="checkbox-description">Receive payment confirmations and receipts</span>
                        </label>
                      </div>
                    </div>

                    <div className="notification-group">
                      <h3>Station Updates</h3>
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="station_updates"
                            checked={notificationPrefs.station_updates}
                            onChange={handleNotificationChange}
                          />
                          <span className="checkbox-text">Station Updates</span>
                          <span className="checkbox-description">Get notified about new stations and availability</span>
                        </label>

                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="maintenance_alerts"
                            checked={notificationPrefs.maintenance_alerts}
                            onChange={handleNotificationChange}
                          />
                          <span className="checkbox-text">Maintenance Alerts</span>
                          <span className="checkbox-description">Receive alerts about station maintenance</span>
                        </label>
                      </div>
                    </div>

                    <div className="notification-group">
                      <h3>Marketing</h3>
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="marketing_emails"
                            checked={notificationPrefs.marketing_emails}
                            onChange={handleNotificationChange}
                          />
                          <span className="checkbox-text">Marketing Emails</span>
                          <span className="checkbox-description">Receive promotional offers and news</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="save-btn"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>

                  {message && (
                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                      {message}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Security Settings</h2>
                    <p>Manage your account security</p>
                  </div>

                  <div className="security-section">
                    <h3>Change Password</h3>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label htmlFor="current_password">Current Password</label>
                        <input
                          type="password"
                          id="current_password"
                          name="current_password"
                          value={passwordData.current_password}
                          onChange={handlePasswordChange}
                          placeholder="Enter your current password"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="new_password">New Password</label>
                        <input
                          type="password"
                          id="new_password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirm_password">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirm_password"
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <div className="password-requirements">
                      <p>Password requirements:</p>
                      <ul>
                        <li>At least 8 characters long</li>
                        <li>Mix of uppercase and lowercase letters</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                      </ul>
                    </div>

                    <div className="form-actions">
                      <button
                        className="save-btn"
                        onClick={handleChangePassword}
                        disabled={loading || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>

                    {message && (
                      <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                        {message}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

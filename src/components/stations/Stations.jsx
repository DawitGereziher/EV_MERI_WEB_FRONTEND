import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import MobileHeader from '../dashboard/MobileHeader';
import StationTableRow from './StationTableRow';
import AddStationModal from './AddStationModal';
import StationFilters from './StationFilters';
import '../../styles/stations.css';

const Stations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [user, setUser] = useState(null);
  const [verificationError, setVerificationError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
    fetchStations();
  }, [navigate]);

  useEffect(() => {
    filterStations();
    setCurrentPage(1);
  }, [stations, searchQuery, statusFilter, locationFilter]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/station-owners/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchStations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/stations/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStations(data.results || data);
      } else {
        // Use mock data for demo
        setStations(mockStations);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      // Use mock data for demo
      setStations(mockStations);
    } finally {
      setLoading(false);
    }
  };

  const mockStations = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Bole Station 1',
      address: '123 Bole Road',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      zip_code: '1000',
      country: 'Ethiopia',
      latitude: 9.0192,
      longitude: 38.7525,
      status: 'operational',
      description: 'Fast charging station near Bole Airport',
      opening_hours: '24/7',
      has_restroom: true,
      has_wifi: true,
      has_restaurant: false,
      has_shopping: true,
      is_active: true,
      is_public: true,
      rating: 4.5,
      rating_count: 23,
      available_connectors: 2,
      total_connectors: 4,
      total_sessions: 156,
      total_energy: 2340,
      total_revenue: 585,
      last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      current_session: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Yeka Station 1',
      address: '456 Yeka Avenue',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      zip_code: '1001',
      country: 'Ethiopia',
      latitude: 9.0579,
      longitude: 38.8092,
      status: 'closed',
      description: 'High-power charging station',
      opening_hours: 'Mon-Fri 8AM-6PM',
      has_restroom: false,
      has_wifi: true,
      has_restaurant: false,
      has_shopping: false,
      is_active: false,
      is_public: true,
      rating: 3.8,
      rating_count: 15,
      available_connectors: 0,
      total_connectors: 2,
      total_sessions: 89,
      total_energy: 1890,
      total_revenue: 567,
      last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      current_session: false
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Megenagna Station 1',
      address: '789 Megenagna Street',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      zip_code: '1002',
      country: 'Ethiopia',
      latitude: 9.0355,
      longitude: 38.7635,
      status: 'under_maintenance',
      description: 'Standard charging station',
      opening_hours: '24/7',
      has_restroom: true,
      has_wifi: false,
      has_restaurant: true,
      has_shopping: false,
      is_active: true,
      is_public: true,
      rating: 4.2,
      rating_count: 31,
      available_connectors: 1,
      total_connectors: 3,
      total_sessions: 234,
      total_energy: 1560,
      total_revenue: 312,
      last_seen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      current_session: false
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Atlas Station 1',
      address: '321 Atlas Plaza',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      zip_code: '1003',
      country: 'Ethiopia',
      latitude: 9.0155,
      longitude: 38.7469,
      status: 'operational',
      description: 'Convenient location near shopping center',
      opening_hours: '6AM-10PM',
      has_restroom: true,
      has_wifi: true,
      has_restaurant: true,
      has_shopping: true,
      is_active: true,
      is_public: true,
      rating: 4.7,
      rating_count: 42,
      available_connectors: 3,
      total_connectors: 4,
      total_sessions: 67,
      total_energy: 890,
      total_revenue: 222,
      last_seen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      current_session: false
    },
    {
      id: '00123',
      name: 'Office Hub Charger 1',
      address: 'Addis Ababa, Bole',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      zip_code: '1004',
      country: 'Ethiopia',
      latitude: 9.0192,
      longitude: 38.7525,
      status: 'operational',
      description: 'Office charging station',
      opening_hours: '24/7',
      has_restroom: true,
      has_wifi: true,
      has_restaurant: false,
      has_shopping: true,
      is_active: true,
      is_public: true,
      rating: 4.5,
      rating_count: 23,
      available_connectors: 3,
      total_connectors: 4,
      total_sessions: 156,
      total_energy: 2340,
      total_revenue: 585,
      last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      current_session: true
    },
    {
      id: '00124',
      name: 'Mall Parking Station',
      address: 'Arat Kilo',
      city: 'Arat Kilo',
      state: 'Addis Ababa',
      zip_code: '1005',
      country: 'Ethiopia',
      latitude: 9.0355,
      longitude: 38.7635,
      status: 'in use',
      description: 'Mall parking charging station',
      opening_hours: '6AM-10PM',
      has_restroom: false,
      has_wifi: true,
      has_restaurant: false,
      has_shopping: false,
      is_active: true,
      is_public: true,
      rating: 3.8,
      rating_count: 15,
      available_connectors: 0,
      total_connectors: 5,
      total_sessions: 89,
      total_energy: 1890,
      total_revenue: 567,
      last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      current_session: false
    },
    {
      id: '01124',
      name: 'Highway ChargingPoint',
      address: 'Menagesha',
      city: 'Menagesha',
      state: 'Addis Ababa',
      zip_code: '1006',
      country: 'Ethiopia',
      latitude: 9.0155,
      longitude: 38.7469,
      status: 'closed',
      description: 'Highway charging point',
      opening_hours: '24/7',
      has_restroom: true,
      has_wifi: false,
      has_restaurant: true,
      has_shopping: false,
      is_active: false,
      is_public: true,
      rating: 4.2,
      rating_count: 31,
      available_connectors: 0,
      total_connectors: 1,
      total_sessions: 234,
      total_energy: 1560,
      total_revenue: 312,
      last_seen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      current_session: false
    },
    {
      id: '00154',
      name: 'Fleet Charging Station',
      address: 'Kality',
      city: 'Kality',
      state: 'Addis Ababa',
      zip_code: '1007',
      country: 'Ethiopia',
      latitude: 9.0579,
      longitude: 38.8092,
      status: 'closed',
      description: 'Fleet charging station',
      opening_hours: 'Mon-Fri 8AM-6PM',
      has_restroom: true,
      has_wifi: true,
      has_restaurant: true,
      has_shopping: true,
      is_active: false,
      is_public: true,
      rating: 4.7,
      rating_count: 42,
      available_connectors: 0,
      total_connectors: 2,
      total_sessions: 67,
      total_energy: 890,
      total_revenue: 222,
      last_seen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      current_session: false
    },
    {
      id: '01153',
      name: 'Airport EV Station',
      address: 'Megenagna',
      city: 'Megenagna',
      state: 'Addis Ababa',
      zip_code: '1008',
      country: 'Ethiopia',
      latitude: 9.0192,
      longitude: 38.7525,
      status: 'under_maintenance',
      description: 'Airport EV charging station',
      opening_hours: '24/7',
      has_restroom: true,
      has_wifi: true,
      has_restaurant: false,
      has_shopping: true,
      is_active: true,
      is_public: true,
      rating: 4.5,
      rating_count: 23,
      available_connectors: 0,
      total_connectors: 3,
      total_sessions: 156,
      total_energy: 2340,
      total_revenue: 585,
      last_seen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      current_session: false
    },
    {
      id: '01140',
      name: 'Downtown Charger 2',
      address: 'Downtown',
      city: 'Downtown',
      state: 'Addis Ababa',
      zip_code: '1009',
      country: 'Ethiopia',
      latitude: 9.0355,
      longitude: 38.7635,
      status: 'under_maintenance',
      description: 'Downtown charging station 2',
      opening_hours: '6AM-10PM',
      has_restroom: false,
      has_wifi: true,
      has_restaurant: false,
      has_shopping: false,
      is_active: true,
      is_public: true,
      rating: 3.8,
      rating_count: 15,
      available_connectors: 0,
      total_connectors: 5,
      total_sessions: 89,
      total_energy: 1890,
      total_revenue: 567,
      last_seen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      current_session: false
    },
    {
      id: '01157',
      name: 'Downtown Charger 2',
      address: 'Downtown Charger',
      city: 'Downtown Charger',
      state: 'Addis Ababa',
      zip_code: '1010',
      country: 'Ethiopia',
      latitude: 9.0155,
      longitude: 38.7469,
      status: 'under_maintenance',
      description: 'Downtown charging station duplicate',
      opening_hours: '24/7',
      has_restroom: true,
      has_wifi: false,
      has_restaurant: true,
      has_shopping: false,
      is_active: true,
      is_public: true,
      rating: 4.2,
      rating_count: 31,
      available_connectors: 0,
      total_connectors: 5,
      total_sessions: 234,
      total_energy: 1560,
      total_revenue: 312,
      last_seen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      current_session: false
    }
  ];

  const filterStations = () => {
    let filtered = stations;

    if (searchQuery) {
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (station.address && station.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (station.city && station.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        station.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(station => station.status === statusFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(station =>
        (station.city && station.city === locationFilter) ||
        (station.address && station.address === locationFilter)
      );
    }

    setFilteredStations(filtered);
  };

  const checkVerificationStatus = () => {
    if (!user) return false;
    return user.verification_status === 'verified';
  };

  const handleAddStationClick = () => {
    setVerificationError('');

    if (!checkVerificationStatus()) {
      setVerificationError('Please complete your profile verification before adding stations.');
      return;
    }

    setShowAddModal(true);
  };

  const handleAddStation = async (stationData) => {
    // Double-check verification before API call
    if (!checkVerificationStatus()) {
      setVerificationError('Please complete your profile verification before adding stations.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Check if stationData is FormData (for file uploads) or regular object
      const isFormData = stationData instanceof FormData;

      const headers = {
        'Authorization': `Token ${token}`,
      };

      // Don't set Content-Type for FormData, let browser set it with boundary
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch('https://mengedmate-backend.onrender.com/api/stations/', {
        method: 'POST',
        headers: headers,
        body: isFormData ? stationData : JSON.stringify(stationData),
      });

      if (response.ok) {
        const newStation = await response.json();
        setStations(prev => [...prev, newStation]);
        setShowAddModal(false);
      } else {
        const errorData = await response.text();
        console.error('Failed to add station:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error adding station:', error);
    }
  };

  const handleUpdateStation = async (stationId, updates, isFormData = false) => {
    try {
      const token = localStorage.getItem('token');

      const headers = {
        'Authorization': `Token ${token}`,
      };

      // Set Content-Type for JSON, let browser set it for FormData
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      console.log('Updating station:', stationId, 'isFormData:', isFormData, 'data:', updates);

      const response = await fetch(`https://mengedmate-backend.onrender.com/api/stations/${stationId}/`, {
        method: 'PATCH',
        headers: headers,
        body: isFormData ? updates : JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedStation = await response.json();
        console.log('Station updated successfully:', updatedStation);

        setStations(prev => prev.map(station =>
          station.id === stationId ? updatedStation : station
        ));

        alert('Station updated successfully!');
      } else {
        const errorData = await response.text();
        console.error('Failed to update station:', response.status, errorData);
        alert(`Failed to update station: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error updating station:', error);
      alert(`Error updating station: ${error.message}`);
    }
  };

  const handleDeleteStation = async (stationId) => {
    if (!window.confirm('Are you sure you want to delete this station?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/stations/${stationId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStations(prev => prev.filter(station => station.id !== stationId));
      } else {
        console.error('Failed to delete station');
      }
    } catch (error) {
      console.error('Error deleting station:', error);
    }
  };



  const getUniqueLocations = () => {
    const locations = stations.map(station => station.city || station.address).filter(Boolean);
    return [...new Set(locations)];
  };

  const getStationStats = () => {
    const total = stations.length;
    const online = stations.filter(s => s.status === 'operational').length;
    const offline = stations.filter(s => s.status === 'closed').length;
    const maintenance = stations.filter(s => s.status === 'under_maintenance').length;

    return { total, online, offline, maintenance };
  };

  const getPaginatedStations = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStations.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredStations.length / itemsPerPage);
  };

  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  const stats = getStationStats();

  return (
    <div className="stations-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="stations-content">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Stations" />
        <header className="stations-header">
          <div className="header-left">
            <h1>Station Management</h1>
            <p>Manage and monitor your charging stations</p>
          </div>
          <div className="header-right">
            <button
              className="btn btn-primary add-station-btn"
              onClick={handleAddStationClick}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add Station
            </button>
          </div>
        </header>

        {verificationError && (
          <div className="verification-error-banner">
            <div className="error-content">
              <svg viewBox="0 0 24 24" fill="currentColor" className="error-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div className="error-text">
                <strong>Profile Verification Required</strong>
                <p>{verificationError}</p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/station-owner/profile')}
              >
                Complete Profile
              </button>
            </div>
          </div>
        )}

        <div className="stations-stats">
          <div className="stat-item">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Stations</div>
          </div>
          <div className="stat-item online">
            <div className="stat-value">{stats.online}</div>
            <div className="stat-label">Online</div>
          </div>
          <div className="stat-item offline">
            <div className="stat-value">{stats.offline}</div>
            <div className="stat-label">Offline</div>
          </div>
          <div className="stat-item maintenance">
            <div className="stat-value">{stats.maintenance}</div>
            <div className="stat-label">Maintenance</div>
          </div>
        </div>

        <StationFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          locations={getUniqueLocations()}
        />

        <div className="stations-table-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <svg className="animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <p>Loading stations...</p>
            </div>
          ) : filteredStations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h3>No stations found</h3>
              <p>Add your first charging station to get started</p>
              <button
                className="btn btn-primary"
                onClick={handleAddStationClick}
              >
                Add Station
              </button>
            </div>
          ) : (
            <table className="stations-table">
              <thead>
                <tr>
                  <th>Station ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Connectors</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedStations().map(station => (
                  <StationTableRow
                    key={station.id}
                    station={station}
                    onUpdate={handleUpdateStation}
                    onDelete={handleDeleteStation}
                  />
                ))}
              </tbody>
            </table>
          )}

          {filteredStations.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStations.length)} of {filteredStations.length} stations
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn pagination-nav"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                  Previous
                </button>

                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  className="pagination-btn pagination-nav"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
                  disabled={currentPage === getTotalPages()}
                >
                  Next
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="stations-footer">
          <div className="footer-content">
            <p>© 2024 Charger Inc. All rights reserved.</p>
            <div className="footer-links">
              <a href="#about">About Us</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </footer>
      </div>

      {showAddModal && (
        <AddStationModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddStation}
        />
      )}
    </div>
  );
};

export default Stations;

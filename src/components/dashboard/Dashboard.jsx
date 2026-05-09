import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import StatsCards from './StatsCards';
import StationMap from './StationMap';
import ActivityFeed from './ActivityFeed';
import UsageChart from './UsageChart';
import TopStations from './TopStations';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeStations: 0,
    totalStations: 0,
    revenue: 0,
    sessions: 0,
    offlineStations: 0
  });
  const [activities, setActivities] = useState([]);
  const [topStations, setTopStations] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [stations, setStations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      const [profileRes, activitiesRes, stationsRes, analyticsRes, notificationsRes] = await Promise.all([
        fetch('https://mengedmate-backend.onrender.com/api/station-owners/profile/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('https://mengedmate-backend.onrender.com/api/activities/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('https://mengedmate-backend.onrender.com/api/stations/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('https://mengedmate-backend.onrender.com/api/analytics/usage/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('https://mengedmate-backend.onrender.com/api/notifications/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData.results || []);
      }

      if (stationsRes.ok) {
        const stationsData = await stationsRes.json();
        const stationsList = stationsData.results || stationsData || [];
        setStations(stationsList);

        // Always calculate stats from actual station data
        const calculatedStats = {
          totalStations: stationsList.length,
          activeStations: stationsList.filter(s => s.status === 'operational').length,
          offlineStations: stationsList.filter(s => s.status === 'closed').length,
          maintenanceStations: stationsList.filter(s => s.status === 'under_maintenance').length,
          revenue: stationsList.reduce((total, station) => total + (station.total_revenue || 0), 0),
          sessions: stationsList.reduce((total, station) => total + (station.total_sessions || 0), 0)
        };
        setStats(calculatedStats);

        const topStationsData = stationsList
          ?.sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))
          .slice(0, 3)
          .map((station, index) => ({
            id: station.id,
            name: station.name,
            revenue: station.total_revenue || 0,
            rank: index + 1
          })) || [];
        setTopStations(topStationsData);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setUsageData(analyticsData.hourly_usage || []);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        const notificationsList = notificationsData.results || [];
        setNotifications(notificationsList);

        const unreadNotifications = notificationsList.filter(notification => !notification.is_read);
        setUnreadCount(unreadNotifications.length);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://mengedmate-backend.onrender.com/api/notifications/${notificationId}/mark-read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('https://mengedmate-backend.onrender.com/api/notifications/mark-all-read/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="dashboard-content">
          <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Dashboard" />
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-content">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Dashboard" />
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="notifications-container" ref={notificationsRef}>
              <button
                className="notifications-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        className="mark-all-read-btn"
                        onClick={markAllNotificationsAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="notification-content">
                            <div className="notification-title">
                              {notification.title || notification.message}
                            </div>
                            <div className="notification-time">
                              {new Date(notification.created_at).toLocaleString()}
                            </div>
                          </div>
                          {!notification.is_read && (
                            <div className="unread-indicator"></div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>

                  {notifications.length > 5 && (
                    <div className="notifications-footer">
                      <button className="view-all-notifications-btn">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="user-info">
              <div className="user-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div className="user-details">
                <span className="user-name">
                  {user?.company_name || user?.first_name || 'Station Owner'}
                </span>
                {user?.verification_status !== 'verified' && (
                  <span className="verification-badge not-verified">
                    Not Verified
                  </span>
                )}
                {user?.verification_status === 'verified' && (
                  <span className="verification-badge verified">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="stats-section">
            <StatsCards stats={stats} />
          </div>

          <div className="main-content">
            <div className="content-row">
              <div className="map-section">
                <StationMap stations={stations} />
              </div>
              <div className="activity-section">
                <ActivityFeed activities={activities} />
              </div>
            </div>

            <div className="content-row">
              <div className="chart-section">
                <UsageChart data={usageData} />
              </div>
              <div className="top-stations-section">
                <TopStations stations={topStations} offlineCount={stats.offlineStations} totalStations={stats.totalStations} />
              </div>
            </div>
          </div>
        </div>

        <footer className="dashboard-footer">
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
    </div>
  );
};

export default Dashboard;

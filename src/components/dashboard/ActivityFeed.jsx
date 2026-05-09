const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'offline':
      case 'error':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
          </svg>
        );
      case 'maintenance':
      case 'warning':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        );
      case 'success':
      case 'completed':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        );
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'offline':
      case 'error':
        return 'red';
      case 'maintenance':
      case 'warning':
        return 'yellow';
      case 'success':
      case 'completed':
        return 'green';
      case 'info':
      default:
        return 'blue';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';

    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const processedActivities = activities.map(activity => ({
    id: activity.id,
    type: activity.type || 'info',
    title: activity.title || activity.message || 'Activity',
    description: activity.description || '',
    time: formatTime(activity.created_at || activity.timestamp),
    icon: getActivityIcon(activity.type || 'info'),
    color: getActivityColor(activity.type || 'info')
  }));

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h3>Recent Activity & Notifications</h3>
        <button className="view-all-btn">View All</button>
      </div>

      <div className="activity-list">
        {processedActivities.length > 0 ? (
          processedActivities.slice(0, 4).map((activity) => (
            <div key={activity.id} className={`activity-item ${activity.color}`}>
              <div className={`activity-icon ${activity.color}`}>
                {activity.icon}
              </div>
              <div className="activity-content">
                <div className="activity-title">{activity.title}</div>
                {activity.description && (
                  <div className="activity-description">{activity.description}</div>
                )}
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-activities">
            <div className="no-activities-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
            </div>
            <p>No recent activities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

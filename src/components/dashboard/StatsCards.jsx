import { useNavigate } from 'react-router-dom';

const StatsCards = ({ stats }) => {
  const navigate = useNavigate();
  const cards = [
    {
      id: 'total-stations',
      value: stats.totalStations,
      label: 'Total Stations',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="card-icon">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
        </svg>
      ),
      color: 'blue',
      filter: 'all'
    },
    {
      id: 'online-stations',
      value: stats.activeStations,
      label: 'Online Stations',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="card-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: 'green',
      filter: 'operational'
    },
    {
      id: 'offline-stations',
      value: stats.offlineStations,
      label: 'Offline Stations',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="card-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
        </svg>
      ),
      color: 'red',
      filter: 'closed'
    },
    {
      id: 'maintenance-stations',
      value: stats.maintenanceStations || 0,
      label: 'Maintenance',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="card-icon">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      color: 'yellow',
      filter: 'under_maintenance'
    }
  ];

  const handleCardClick = (filter) => {
    navigate(`/stations?status=${filter}`);
  };

  return (
    <div className="stats-cards">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`stat-card ${card.color} clickable`}
          onClick={() => handleCardClick(card.filter)}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-content">
            <div className="card-header">
              <div className={`card-icon-wrapper ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <div className="card-body">
              <div className="card-value">{card.value}</div>
              <div className="card-label">{card.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

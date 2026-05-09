const TopStations = ({ stations = [], offlineCount = 0, totalStations = 0 }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const processedStations = stations.map(station => ({
    ...station,
    revenue: formatCurrency(station.revenue || 0)
  }));

  const offlineInfo = {
    count: `${offlineCount}/${totalStations}`,
    label: 'Stations Offline'
  };

  return (
    <div className="top-stations">
      <div className="stations-header">
        <h3>Top 3 Stations by Revenue</h3>
      </div>

      <div className="stations-list">
        {processedStations.length > 0 ? (
          processedStations.map((station) => (
            <div key={station.id} className="station-item">
              <div className="station-rank">#{station.rank}</div>
              <div className="station-info">
                <div className="station-name">{station.name}</div>
                <div className="station-revenue">{station.revenue}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-stations">
            <p>No station data available</p>
          </div>
        )}
      </div>

      <div className="offline-section">
        <div className="offline-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
          </svg>
        </div>
        <div className="offline-info">
          <div className="offline-count">{offlineInfo.count}</div>
          <div className="offline-label">{offlineInfo.label}</div>
        </div>
      </div>
    </div>
  );
};

export default TopStations;

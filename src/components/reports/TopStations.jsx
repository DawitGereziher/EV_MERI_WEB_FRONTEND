const TopStations = ({ data }) => {
  // Handle empty or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="top-stations">
        <h3>Top 5 Stations by Revenue</h3>
        <div className="stations-list">
          <div className="empty-state">
            <p>No station data available</p>
          </div>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(station => station.revenue || 0));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="top-stations">
      <h3>Top 5 Stations by Revenue</h3>
      <div className="stations-list">
        {data.map((station, index) => {
          const revenue = station.revenue || 0;
          const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

          return (
            <div key={station.name || index} className="station-item">
              <div className="station-info">
                <span className="station-name">{station.name || 'Unknown Station'}</span>
                <span className="station-revenue">{formatCurrency(revenue)}</span>
              </div>
              <div className="revenue-bar">
                <div
                  className="revenue-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: `hsl(${200 + index * 10}, 70%, 50%)`
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopStations;

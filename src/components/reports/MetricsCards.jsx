const MetricsCards = ({ totalRevenue, totalEnergyDispensed, avgSessionDuration }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatEnergy = (kwh) => {
    return new Intl.NumberFormat('en-US').format(kwh);
  };

  return (
    <div className="metrics-cards">
      <div className="metric-card revenue-card">
        <div className="metric-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="metric-content">
          <div className="metric-value">{formatCurrency(totalRevenue)}</div>
          <div className="metric-label">Total Revenue</div>
        </div>
      </div>

      <div className="metric-card energy-card">
        <div className="metric-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.69 2.21L4.33 11.49c-.64.58-.28 1.65.58 1.73L13 14l-4.85 6.76c-.22.31-.19.74.08 1.01.3.3.77.31 1.08.02L19.67 12.51c.64-.58.28-1.65-.58-1.73L11 10l4.85-6.76c.22-.31.19-.74-.08-1.01-.3-.3-.77-.31-1.08-.02z"/>
          </svg>
        </div>
        <div className="metric-content">
          <div className="metric-value">{formatEnergy(totalEnergyDispensed)} <span className="unit">kWh</span></div>
          <div className="metric-label">Total Energy Dispensed</div>
        </div>
      </div>

      <div className="metric-card duration-card">
        <div className="metric-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="metric-content">
          <div className="metric-value">{avgSessionDuration} <span className="unit">min</span></div>
          <div className="metric-label">Avg. Session Duration</div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;

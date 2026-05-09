const WalletStats = ({ walletData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const stats = [
    {
      id: 'available',
      value: formatCurrency(walletData.availableBalance),
      label: 'Available Balance',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: 'blue',
      trend: 'up'
    },
    {
      id: 'withdrawn',
      value: formatCurrency(walletData.totalWithdrawn),
      label: 'Total withdrawn',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      ),
      color: 'orange',
      trend: 'up'
    },
    {
      id: 'revenue',
      value: formatCurrency(walletData.totalPlatformRevenue),
      label: 'Total Platform Revenue',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      ),
      color: 'green',
      trend: 'up'
    }
  ];

  return (
    <div className="wallet-stats">
      {stats.map((stat) => (
        <div key={stat.id} className={`wallet-stat-card ${stat.color}`}>
          <div className="stat-header">
            <div className={`stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <div className={`stat-trend ${stat.trend}`}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalletStats;

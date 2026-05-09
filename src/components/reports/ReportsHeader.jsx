import { useState, useEffect } from 'react';

const ReportsHeader = ({
  timeRange,
  setTimeRange,
  selectedStation,
  setSelectedStation,
  onDownloadReport
}) => {
  const [stations, setStations] = useState([]);

  const timeRangeOptions = [
    'Last 7 Days',
    'Last 30 Days',
    'Last 90 Days',
    'Last 6 Months',
    'Last Year'
  ];

  useEffect(() => {
    fetchStations();
  }, []);

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
        setStations(data.results || data || []);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const stationOptions = [
    'All Stations',
    ...stations.map(station => ({ id: station.id, name: station.name }))
  ];

  return (
    <div className="reports-header">
      <div className="header-left">
        <h1>Analytics & Reports</h1>
      </div>

      <div className="header-controls">
        <div className="filter-group">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="filter-select"
          >
            {timeRangeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="filter-select"
          >
            {stationOptions.map((option, index) => (
              <option
                key={index}
                value={typeof option === 'string' ? option : option.id}
              >
                {typeof option === 'string' ? option : option.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="download-btn"
          onClick={onDownloadReport}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ReportsHeader;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import MobileHeader from '../dashboard/MobileHeader';
import ReportsHeader from './ReportsHeader';
import MetricsCards from './MetricsCards';
import EnergyChart from './EnergyChart';
import RevenueChart from './RevenueChart';
import SessionDistribution from './SessionDistribution';
import TopStations from './TopStations';
import FaultOccurrences from './FaultOccurrences';
import '../../styles/reports.css';

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [selectedStation, setSelectedStation] = useState('All Stations');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalEnergyDispensed: 0,
    avgSessionDuration: 0,
    monthlyRevenue: [],
    dailyEnergyData: [],
    sessionDistribution: { morning: 0, afternoon: 0 },
    topStations: [],
    faultData: [],
    stationsCount: 0,
    transactionsCount: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAnalyticsData();
  }, [navigate, timeRange, selectedStation]);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/analytics/reports/?time_range=${encodeURIComponent(timeRange)}&station=${encodeURIComponent(selectedStation)}`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Analytics data received:', data); // Debug log
        setAnalyticsData(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch analytics data:', response.status, errorText);

        // Set default data if API fails
        setAnalyticsData({
          totalRevenue: 0,
          totalEnergyDispensed: 0,
          avgSessionDuration: 0,
          monthlyRevenue: [],
          dailyEnergyData: [],
          sessionDistribution: { morning: 0, afternoon: 0 },
          topStations: [],
          faultData: [],
          stationsCount: 0,
          transactionsCount: 0
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Set default data if API fails
      setAnalyticsData({
        totalRevenue: 0,
        totalEnergyDispensed: 0,
        avgSessionDuration: 0,
        monthlyRevenue: [],
        dailyEnergyData: [],
        sessionDistribution: { morning: 0, afternoon: 0 },
        topStations: [],
        faultData: [],
        stationsCount: 0,
        transactionsCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/analytics/download-report/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time_range: timeRange,
          station: selectedStation,
          format: 'pdf'
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="reports-page">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="reports-content">
          <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Reports" />
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="reports-content">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Reports" />
        <ReportsHeader
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          selectedStation={selectedStation}
          setSelectedStation={setSelectedStation}
          onDownloadReport={handleDownloadReport}
        />

        <MetricsCards
          totalRevenue={analyticsData.totalRevenue}
          totalEnergyDispensed={analyticsData.totalEnergyDispensed}
          avgSessionDuration={analyticsData.avgSessionDuration}
        />

        <div className="charts-grid">
          <div className="chart-section">
            <EnergyChart data={analyticsData.dailyEnergyData} />
          </div>

          <div className="chart-section">
            <RevenueChart data={analyticsData.monthlyRevenue} />
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-section">
            <SessionDistribution data={analyticsData.sessionDistribution} />
          </div>

          <div className="analytics-section">
            <TopStations data={analyticsData.topStations} />
          </div>

          <div className="analytics-section">
            <FaultOccurrences data={analyticsData.faultData} />
          </div>
        </div>

        <footer className="reports-footer">
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

export default Reports;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import MobileHeader from '../dashboard/MobileHeader';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import PayoutMethodsModal from './PayoutMethodsModal';
import WithdrawModal from './WithdrawModal';
import WalletCreditFix from './WalletCreditFix';
import '../../styles/revenue.css';

const Revenue = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All Types');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    totalTransactions: 0,
    averageTransactionValue: 0
  });
  const [showPayoutMethods, setShowPayoutMethods] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [payoutMethodsCount, setPayoutMethodsCount] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock transactions data
  const mockTransactions = [
    {
      id: 1,
      date: '04/09/2024',
      transactionId: '13112327',
      type: 'Charging Fee',
      description: 'Charge ses.# 1034',
      amount: 8750.50,
      status: 'Completed'
    },
    {
      id: 2,
      date: '04/19/2024',
      transactionId: '13912673',
      type: 'Deposit',
      description: 'Charge # 1034',
      amount: 120.00,
      status: 'Completed'
    },
    {
      id: 3,
      date: '03/22/2024',
      transactionId: '13236591',
      type: 'Refund',
      description: 'Charge fees',
      amount: 3.00,
      status: 'Completed'
    },
    {
      id: 4,
      date: '03/22/2024',
      transactionId: '13335428',
      type: 'Payout',
      description: 'Completed',
      amount: 7000.00,
      status: 'Pending'
    },
    {
      id: 5,
      date: '03/21/2024',
      transactionId: '13397678',
      type: 'Deposit',
      description: 'Charge ses.1#',
      amount: 13.803,
      status: 'Pending'
    },
    {
      id: 6,
      date: '03/20/2024',
      transactionId: '13735062',
      type: 'Refund',
      description: 'Charge fees',
      amount: 3.00,
      status: 'Failed'
    },
    {
      id: 7,
      date: '03/22/2024',
      transactionId: '03221284',
      type: 'Payout',
      description: 'Payout',
      amount: 16550,
      status: 'Completed'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch real data
    fetchTransactions();
    fetchPayoutMethodsCount();
  }, [navigate]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filterType]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch revenue data from the correct endpoint
      const revenueResponse = await fetch('https://mengedmate-backend.onrender.com/api/revenue/transactions/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (revenueResponse.ok) {
        const revenueData = await revenueResponse.json();
        console.log('Revenue data received:', revenueData);

        if (revenueData.success) {
          // Format transactions for the table
          const transactionsList = (revenueData.transactions || []).map(transaction => ({
            id: transaction.id,
            date: transaction.date || 'N/A',
            transactionId: transaction.transaction_id || transaction.id,
            type: transaction.type || 'Charging Payment',
            description: transaction.description || 'No description',
            amount: parseFloat(transaction.amount || 0),
            status: transaction.status || 'Unknown'
          }));

          // Calculate this month's revenue from actual transaction dates
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const thisMonthRevenue = transactionsList
            .filter(transaction => {
              if (transaction.date === 'N/A') return false;
              const transactionDate = new Date(transaction.date);
              return transactionDate.getMonth() === currentMonth &&
                     transactionDate.getFullYear() === currentYear &&
                     (transaction.status === 'Completed' || transaction.status === 'completed');
            })
            .reduce((sum, transaction) => sum + transaction.amount, 0);

          // Calculate available balance from completed transactions
          const completedTransactions = transactionsList.filter(t =>
            t.status === 'Completed' || t.status === 'completed'
          );

          const totalEarnings = completedTransactions
            .filter(t => t.type === 'Charging Fee' || t.type === 'Deposit' || t.type === 'Charging Payment')
            .reduce((sum, t) => sum + t.amount, 0);

          const totalWithdrawals = completedTransactions
            .filter(t => t.type === 'Withdrawal' || t.type === 'Payout')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

          const calculatedAvailableBalance = Math.max(0, totalEarnings - totalWithdrawals);

          // Set revenue stats from the API response
          setRevenueStats({
            totalRevenue: revenueData.summary?.total_revenue || 0,
            thisMonthRevenue: thisMonthRevenue,
            totalTransactions: revenueData.summary?.total_transactions || 0,
            averageTransactionValue: revenueData.summary?.total_transactions > 0
              ? (revenueData.summary.total_revenue / revenueData.summary.total_transactions)
              : 0
          });

          // Set available balance from calculated value or API if available
          setAvailableBalance(revenueData.summary?.available_balance || calculatedAvailableBalance);
          setTransactions(transactionsList);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } else {
        throw new Error('Revenue API request failed');
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);

      // Try the analytics endpoint as fallback
      try {
        const analyticsResponse = await fetch('https://mengedmate-backend.onrender.com/api/analytics/reports/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          console.log('Using analytics data as fallback:', analyticsData);

          setRevenueStats({
            totalRevenue: analyticsData.totalRevenue || 0,
            thisMonthRevenue: analyticsData.totalRevenue * 0.3 || 0,
            totalTransactions: analyticsData.transactionsCount || 0,
            averageTransactionValue: analyticsData.transactionsCount > 0
              ? (analyticsData.totalRevenue / analyticsData.transactionsCount)
              : 0
          });

          // Use empty transactions array since analytics doesn't provide transaction details
          setTransactions([]);
        } else {
          throw new Error('Analytics fallback also failed');
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);

        // Use mock data as final fallback
        setTransactions(mockTransactions);

        const mockRevenue = mockTransactions
          .filter(t => t.status === 'Completed' && (t.type === 'Charging Fee' || t.type === 'Deposit'))
          .reduce((sum, t) => sum + t.amount, 0);

        const mockCompleted = mockTransactions.filter(t => t.status === 'Completed');

        setRevenueStats({
          totalRevenue: mockRevenue,
          thisMonthRevenue: mockRevenue * 0.4,
          totalTransactions: mockCompleted.length,
          averageTransactionValue: mockCompleted.length > 0 ? mockRevenue / mockCompleted.length : 0
        });
      }
    } finally {
      setLoading(false);
    }
  };



  const filterTransactions = () => {
    let filtered = transactions;

    if (filterType !== 'All Types') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }

    setFilteredTransactions(filtered);
  };

  const handlePayoutMethodsUpdate = () => {
    // Refresh payout methods count or any related data
    fetchPayoutMethodsCount();
  };

  const fetchPayoutMethodsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/payments/payment-methods/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayoutMethodsCount((data.results || data || []).length);
      } else {
        setPayoutMethodsCount(2); // Mock count
      }
    } catch (error) {
      console.error('Error fetching payout methods count:', error);
      setPayoutMethodsCount(2); // Mock count
    }
  };

  const handleWithdrawSuccess = (withdrawalData) => {
    // Add the withdrawal transaction to the list
    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      transactionId: `WD${Date.now()}`,
      type: 'Withdrawal',
      description: `Withdrawal to ${withdrawalData.method_name}`,
      amount: -withdrawalData.amount,
      status: 'Pending'
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Update available balance
    setAvailableBalance(prev => prev - withdrawalData.amount);

    // Update revenue stats
    setRevenueStats(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1
    }));
  };



  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <div className="revenue-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="revenue-content">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Revenue" />
        <header className="revenue-header">
          <div className="header-left">
            <h1>Revenue</h1>
            <p>Manage your earnings and payout methods</p>
          </div>
          <div className="header-right">
            <button
              className="btn btn-secondary"
              onClick={() => setShowPayoutMethods(true)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              Payout Methods
            </button>
            <button
              className="btn btn-success"
              onClick={() => setShowWithdrawModal(true)}
              disabled={availableBalance <= 0}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
              Withdraw Funds
            </button>
            <button
              className="btn btn-primary export-btn"
              onClick={() => window.print()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Export Report
            </button>
          </div>
        </header>

        <div className="revenue-stats">
          <div className="stats-grid">
            <div className="stat-card available-balance">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Available Balance</h3>
                <p className="stat-value">ETB {availableBalance.toFixed(2)}</p>
                <span className="stat-label">Ready for withdrawal</span>
              </div>
              <button
                className="withdraw-quick-btn"
                onClick={() => setShowWithdrawModal(true)}
                disabled={availableBalance <= 0}
              >
                Withdraw
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">ETB {revenueStats.totalRevenue.toFixed(2)}</p>
                <span className="stat-label">All time earnings</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>This Month</h3>
                <p className="stat-value">ETB {revenueStats.thisMonthRevenue.toFixed(2)}</p>
                <span className="stat-label">Current month revenue</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Total Transactions</h3>
                <p className="stat-value">{revenueStats.totalTransactions}</p>
                <span className="stat-label">Completed transactions</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Average Value</h3>
                <p className="stat-value">ETB {revenueStats.averageTransactionValue.toFixed(2)}</p>
                <span className="stat-label">Per transaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Credit Fix Component */}
        {/* <WalletCreditFix /> */}

        <div className="revenue-main">
          <div className="transactions-section full-width">
            <TransactionFilters
              filterType={filterType}
              setFilterType={setFilterType}
            />

            <TransactionTable
              transactions={currentTransactions}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>

        <footer className="revenue-footer">
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

      {/* Payout Methods Modal */}
      {showPayoutMethods && (
        <PayoutMethodsModal
          onClose={() => setShowPayoutMethods(false)}
          onUpdate={handlePayoutMethodsUpdate}
        />
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          availableBalance={availableBalance}
          onClose={() => setShowWithdrawModal(false)}
          onWithdrawSuccess={handleWithdrawSuccess}
        />
      )}
    </div>
  );
};

export default Revenue;

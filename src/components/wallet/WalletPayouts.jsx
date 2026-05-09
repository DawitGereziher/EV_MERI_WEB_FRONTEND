import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import MobileHeader from '../dashboard/MobileHeader';
import '../../styles/wallet.css';

const WalletPayouts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [activeTab, setActiveTab] = useState('All Types');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [payoutFrequency, setPayoutFrequency] = useState('Weekly');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addFundsData, setAddFundsData] = useState({
    amount: '',
    phone_number: '',
    description: 'Add funds to wallet'
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWalletData();
  }, [navigate]);

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      };

      const [walletRes, transactionsRes, walletTransactionsRes, paymentMethodsRes] = await Promise.all([
        fetch('https://mengedmate-backend.onrender.com/api/payments/wallet/', { headers }),
        fetch('https://mengedmate-backend.onrender.com/api/payments/transactions/', { headers }),
        fetch('https://mengedmate-backend.onrender.com/api/payments/wallet/transactions/', { headers }),
        fetch('https://mengedmate-backend.onrender.com/api/payments/payment-methods/', { headers })
      ]);

      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWallet(walletData);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.results || transactionsData || []);
      }

      if (walletTransactionsRes.ok) {
        const walletTransactionsData = await walletTransactionsRes.json();
        setWalletTransactions(walletTransactionsData.results || walletTransactionsData || []);
      }

      if (paymentMethodsRes.ok) {
        const paymentMethodsData = await paymentMethodsRes.json();
        setPaymentMethods(paymentMethodsData.results || paymentMethodsData || []);
        const defaultMethod = (paymentMethodsData.results || paymentMethodsData || []).find(method => method.is_default);
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.id);
        }
      }

    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/payments/initiate/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFundsData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Payment initiated successfully! Please check your phone for M-Pesa prompt.');
        setShowAddFunds(false);
        setAddFundsData({ amount: '', phone_number: '', description: 'Add funds to wallet' });
        fetchWalletData();
      } else {
        const error = await response.json();
        alert(`Payment failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const getTransactionIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'deposit':
      case 'credit':
        return '↗️';
      case 'withdrawal':
      case 'debit':
        return '↙️';
      case 'payment':
        return '💳';
      case 'refund':
        return '🔄';
      default:
        return '💰';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      case 'processing':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateTotalWithdrawn = () => {
    return walletTransactions
      .filter(t => t.transaction_type === 'debit')
      .reduce((total, t) => total + parseFloat(t.amount || 0), 0);
  };

  const calculateTotalRevenue = () => {
    return walletTransactions
      .filter(t => t.transaction_type === 'credit')
      .reduce((total, t) => total + parseFloat(t.amount || 0), 0);
  };

  const filteredTransactions = activeTab === 'All Types' 
    ? [...transactions, ...walletTransactions]
    : transactions.filter(t => t.transaction_type_display === activeTab);

  if (loading) {
    return (
      <div className="wallet-page">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="wallet-content">
          <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Wallet" />
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading wallet data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="wallet-content">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Wallet" />
        <header className="wallet-header">
          <div className="header-left">
            <h1>Wallet & Payouts</h1>
          </div>
          <div className="header-right">
            <button 
              className="add-funds-btn"
              onClick={() => setShowAddFunds(true)}
            >
              + Add Funds
            </button>
          </div>
        </header>

        <div className="wallet-stats">
          <div className="stat-card available-balance">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(wallet?.balance || 0)}</div>
              <div className="stat-label">Available Balance</div>
            </div>
          </div>

          <div className="stat-card total-withdrawn">
            <div className="stat-icon">↙️</div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(calculateTotalWithdrawn())}</div>
              <div className="stat-label">Total Withdrawn</div>
            </div>
          </div>

          <div className="stat-card total-revenue">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(calculateTotalRevenue())}</div>
              <div className="stat-label">Total Platform Revenue</div>
            </div>
          </div>
        </div>

        <div className="wallet-main">
          <div className="transactions-section">
            <div className="section-header">
              <div className="tabs">
                {['All Types', 'Deposit', 'Payment', 'Refund'].map(tab => (
                  <button
                    key={tab}
                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="transactions-table">
              <div className="table-header">
                <div className="col">Date</div>
                <div className="col">Transaction ID</div>
                <div className="col">Type</div>
                <div className="col">Description</div>
                <div className="col">Amount</div>
                <div className="col">Status</div>
              </div>

              <div className="table-body">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.slice(0, 10).map((transaction, index) => (
                    <div key={transaction.id || index} className="table-row">
                      <div className="col">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </div>
                      <div className="col transaction-id">
                        {transaction.reference_number || transaction.transaction_reference || `TXN${index + 1}`}
                      </div>
                      <div className="col">
                        <span className="transaction-type">
                          {getTransactionIcon(transaction.transaction_type || transaction.transaction_type_display)}
                          {transaction.transaction_type_display || transaction.transaction_type}
                        </span>
                      </div>
                      <div className="col">
                        {transaction.description || 'Transaction'}
                      </div>
                      <div className="col amount">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="col">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(transaction.status) }}
                        >
                          {transaction.status_display || transaction.status || 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-transactions">
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="payment-settings">
            <h3>Payment Methods & Payout Settings</h3>
            
            <div className="payment-methods">
              {paymentMethods.length > 0 ? (
                paymentMethods.map(method => (
                  <div key={method.id} className="payment-method">
                    <div className="method-info">
                      <div className="method-type">{method.method_type_display}</div>
                      <div className="method-details">{method.phone_number || method.account_number}</div>
                    </div>
                    {method.is_default && <span className="default-badge">Default</span>}
                  </div>
                ))
              ) : (
                <div className="no-methods">
                  <p>No payment methods added</p>
                </div>
              )}
              
              <button className="add-method-btn">Add New Method</button>
            </div>

            <div className="payout-settings">
              <div className="setting-group">
                <label>Preferred Payout Method</label>
                <select 
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                >
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.method_type_display} - {method.phone_number || method.account_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="setting-group">
                <label>Payout Frequency</label>
                <select 
                  value={payoutFrequency}
                  onChange={(e) => setPayoutFrequency(e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <button className="save-settings-btn">Save Payout Settings</button>
            </div>
          </div>
        </div>

        {showAddFunds && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Add Funds to Wallet</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddFunds(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Amount (ETB)</label>
                  <input
                    type="number"
                    value={addFundsData.amount}
                    onChange={(e) => setAddFundsData({...addFundsData, amount: e.target.value})}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={addFundsData.phone_number}
                    onChange={(e) => setAddFundsData({...addFundsData, phone_number: e.target.value})}
                    placeholder="+251912345678"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={addFundsData.description}
                    onChange={(e) => setAddFundsData({...addFundsData, description: e.target.value})}
                    placeholder="Payment description"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowAddFunds(false)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-btn"
                  onClick={handleAddFunds}
                  disabled={!addFundsData.amount || !addFundsData.phone_number}
                >
                  Initiate Payment
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="wallet-footer">
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

export default WalletPayouts;

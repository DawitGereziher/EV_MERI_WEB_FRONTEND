import React, { useState, useEffect } from 'react';
import './WalletCreditFix.css';

const WalletCreditFix = () => {
  const [walletStatus, setWalletStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [message, setMessage] = useState('');

  const checkWalletStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/check-wallet-status/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setWalletStatus(data.wallet_status);
        if (data.wallet_status.needs_fix) {
          setMessage(`Found ${data.wallet_status.missing_credits_count} missing credits totaling ${data.wallet_status.missing_amount.toFixed(2)} ETB`);
        } else {
          setMessage('All payments have been properly credited to your wallet.');
        }
      } else {
        setMessage('Error checking wallet status: ' + data.message);
      }
    } catch (error) {
      console.error('Error checking wallet status:', error);
      setMessage('Failed to check wallet status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fixWalletCredits = async () => {
    setFixing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/process-pending-credits/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(`Successfully processed ${data.data.processed} missing credits. Your wallet balance is now ${data.data.current_wallet_balance.toFixed(2)} ETB.`);
        // Refresh wallet status
        await checkWalletStatus();
      } else {
        setMessage('Error fixing wallet credits: ' + data.message);
      }
    } catch (error) {
      console.error('Error fixing wallet credits:', error);
      setMessage('Failed to fix wallet credits. Please try again.');
    } finally {
      setFixing(false);
    }
  };

  useEffect(() => {
    checkWalletStatus();
  }, []);

  return (
    <div className="wallet-credit-fix">
      <div className="wallet-fix-header">
        <h3>💼 Wallet Credit Status</h3>
        <button 
          onClick={checkWalletStatus} 
          disabled={loading}
          className="refresh-btn"
        >
          {loading ? '🔄' : '🔍'} Check Status
        </button>
      </div>

      {walletStatus && (
        <div className="wallet-status-info">
          <div className="status-grid">
            <div className="status-item">
              <span className="label">Current Balance:</span>
              <span className="value">{walletStatus.current_balance.toFixed(2)} ETB</span>
            </div>
            <div className="status-item">
              <span className="label">Expected Balance:</span>
              <span className="value">{walletStatus.total_expected.toFixed(2)} ETB</span>
            </div>
            <div className="status-item">
              <span className="label">Missing Credits:</span>
              <span className={`value ${walletStatus.needs_fix ? 'error' : 'success'}`}>
                {walletStatus.missing_amount.toFixed(2)} ETB
              </span>
            </div>
          </div>

          {walletStatus.needs_fix && (
            <div className="missing-credits-section">
              <h4>Missing Credits ({walletStatus.missing_credits_count})</h4>
              <div className="missing-credits-list">
                {walletStatus.missing_credits.map((credit, index) => (
                  <div key={index} className="missing-credit-item">
                    <span className="amount">{credit.amount.toFixed(2)} ETB</span>
                    <span className="date">{new Date(credit.created_at).toLocaleDateString()}</span>
                    <span className="ref">{credit.transaction_ref.substring(0, 8)}...</span>
                  </div>
                ))}
                {walletStatus.missing_credits_count > 5 && (
                  <div className="more-credits">
                    ... and {walletStatus.missing_credits_count - 5} more
                  </div>
                )}
              </div>

              <button 
                onClick={fixWalletCredits}
                disabled={fixing}
                className="fix-btn"
              >
                {fixing ? '🔧 Fixing...' : '🔧 Fix Missing Credits'}
              </button>
            </div>
          )}

          {!walletStatus.needs_fix && (
            <div className="all-good">
              <span className="success-icon">✅</span>
              <span>All payments properly credited!</span>
            </div>
          )}
        </div>
      )}

      {message && (
        <div className={`message ${walletStatus?.needs_fix ? 'warning' : 'info'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default WalletCreditFix;

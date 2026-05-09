import { useState, useEffect } from 'react';

const WithdrawModal = ({ onClose, onWithdrawSuccess, availableBalance }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setPaymentMethods([]);
        return;
      }

      const response = await fetch('https://mengedmate-backend.onrender.com/api/payout-methods/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Handle both paginated and non-paginated responses
        const methods = data.results || data.data || data || [];
        const validMethods = Array.isArray(methods) ? methods : [];
        setPaymentMethods(validMethods);

        // Set default method
        const defaultMethod = validMethods.find(m => m.is_default) || validMethods[0];
        if (defaultMethod) {
          setSelectedMethod(defaultMethod.id.toString());
        }
      } else {
        // No fallback to mock data - show empty state
        setPaymentMethods([]);
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (response.status === 404) {
          setError('No payment methods found. Please add a payment method first.');
        } else {
          setError('Failed to load payment methods. Please add a payment method first.');
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setPaymentMethods([]);
      setError('Unable to connect to server. Please check your internet connection.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > availableBalance) {
      setError('Insufficient balance');
      return;
    }

    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      const selectedPaymentMethod = paymentMethods.find(m => m.id.toString() === selectedMethod);
      if (!selectedPaymentMethod) {
        setError('Selected payment method not found. Please select a valid payment method.');
        setLoading(false);
        return;
      }

      const response = await fetch('https://mengedmate-backend.onrender.com/api/withdrawals/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          payment_method_id: parseInt(selectedMethod),
          description: `Withdrawal to ${getMethodDisplayName(selectedPaymentMethod)}`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (onWithdrawSuccess && typeof onWithdrawSuccess === 'function') {
          onWithdrawSuccess({
            amount: parseFloat(amount),
            method_name: getMethodDisplayName(selectedPaymentMethod),
            message: data.message || 'Withdrawal request submitted successfully',
            ...data.data
          });
        }
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || `Failed to process withdrawal (${response.status})`;
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      setError('Failed to withdraw funds. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMethodDisplayName = (method) => {
    if (!method) return 'Unknown method';

    // Use masked_details from backend if available
    if (method.masked_details) {
      return `${method.masked_details.type} - ${method.masked_details.details}`;
    }

    // Fallback to manual formatting
    if (method.method_type === 'bank_account') {
      return `${method.bank_name} ${method.account_number}`;
    } else if (method.method_type === 'card') {
      return `${method.card_type || 'Card'} ${method.card_number}`;
    } else if (method.method_type === 'mobile_money') {
      return `${method.provider} ${method.phone_number}`;
    } else if (method.method_type === 'paypal') {
      return `PayPal ${method.paypal_email}`;
    }
    return 'Payment method';
  };

  const quickAmounts = [100, 500, 1000, Math.floor(availableBalance)].filter(amt => amt <= availableBalance && amt > 0);

  // Add safety checks to prevent white screen
  if (!onClose || typeof onClose !== 'function') {
    console.error('WithdrawModal: onClose prop is required and must be a function');
    return null;
  }

  if (typeof availableBalance !== 'number' || availableBalance < 0) {
    console.error('WithdrawModal: availableBalance must be a valid number');
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content withdraw-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Withdraw Funds</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="error-message">
              <p>Unable to load balance information. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content withdraw-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Withdraw Funds</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="balance-info">
              <div className="available-balance">
                <span>Available Balance:</span>
                <span className="balance-amount">
                  ETB {availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Withdrawal Amount</label>
              <div className="amount-input-container">
                <span className="currency-symbol">ETB</span>
                <input
                  type="number"
                  className="form-control amount-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  max={availableBalance}
                  step="0.01"
                  required
                />
              </div>
            </div>

            {quickAmounts.length > 0 && (
              <div className="quick-amounts">
                <label>Quick amounts:</label>
                <div className="quick-amount-buttons">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      className={`quick-amount-btn ${amount === quickAmount.toString() ? 'active' : ''}`}
                      onClick={() => setAmount(quickAmount.toString())}
                    >
                      ETB {quickAmount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Payout Method</label>
              {paymentMethods.length === 0 ? (
                <div className="no-methods-warning">
                  <p>No payment methods available. Please add a payment method first.</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      onClose();
                      // This would open the payout methods modal
                    }}
                  >
                    Add Payment Method
                  </button>
                </div>
              ) : (
                <select
                  className="form-control"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  required
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {getMethodDisplayName(method)}
                      {method.is_default ? ' (Default)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="withdrawal-info">
              <div className="info-row">
                <span>Withdrawal Amount:</span>
                <span>ETB {amount || '0.00'}</span>
              </div>
              <div className="info-row">
                <span>Processing Fee:</span>
                <span>ETB 0.00</span>
              </div>
              <div className="info-row total">
                <span>You'll Receive:</span>
                <span>ETB {amount || '0.00'}</span>
              </div>
            </div>

            <div className="withdrawal-notice">
              <div className="notice-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="notice-text">
                <p><strong>Processing Time:</strong> 1-3 business days</p>
                <p>Withdrawals are processed during business hours and may take longer on weekends and holidays.</p>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !amount || parseFloat(amount) > availableBalance || paymentMethods.length === 0}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', marginRight: '8px' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Withdraw Funds'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;

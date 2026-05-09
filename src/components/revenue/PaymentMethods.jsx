import { useState, useEffect } from 'react';

const PaymentMethods = () => {
  const [payoutSettings, setPayoutSettings] = useState({
    preferredMethod: '',
    frequency: 'Weekly'
  });

  const [showAddMethod, setShowAddMethod] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/payout-methods/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const methods = data.results || data || [];
        setPaymentMethods(methods);

        // Set default method as preferred if available
        const defaultMethod = methods.find(m => m.is_default);
        if (defaultMethod) {
          setPayoutSettings(prev => ({
            ...prev,
            preferredMethod: formatMethodForSelect(defaultMethod)
          }));
        }
      } else {
        setError('Failed to load payment methods');
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatMethodForSelect = (method) => {
    if (method.method_type === 'bank_account') {
      return `${method.bank_name} - ${method.account_number}`;
    } else if (method.method_type === 'card') {
      return `${method.card_type || 'Card'} ${method.card_number}`;
    }
    return method.account_holder_name;
  };

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/wallet/payout-settings/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payoutSettings),
      });

      if (response.ok) {
        alert('Payout settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving payout settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="payment-methods">
        <div className="loading-container">
          <p>Loading payment methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-methods">
      <div className="payment-methods-header">
        <h3>Payment Methods & Payout Settings</h3>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="payment-methods-list">
        {paymentMethods.length === 0 ? (
          <div className="empty-state">
            <p>No payment methods added yet.</p>
          </div>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="payment-method-item">
              <div className="method-info">
                <div className="method-type">
                  {method.method_type === 'bank_account' ? 'Bank Account' :
                   method.method_type === 'card' ? (method.card_type || 'Card') :
                   method.method_type}
                </div>
                <div className="method-number">
                  {method.method_type === 'bank_account' ?
                    `${method.bank_name} - ${method.account_number}` :
                    method.method_type === 'card' ?
                    `${method.card_number}` :
                    method.account_holder_name}
                </div>
              </div>
              {method.is_default && (
                <span className="default-badge">Default</span>
              )}
            </div>
          ))
        )}

        <button
          className="add-method-btn"
          onClick={() => setShowAddMethod(true)}
        >
          Add New Method
        </button>
      </div>

      <div className="payout-settings">
        <h4>Preferred Payout Method</h4>
        <select
          value={payoutSettings.preferredMethod}
          onChange={(e) => setPayoutSettings(prev => ({
            ...prev,
            preferredMethod: e.target.value
          }))}
          className="payout-select"
          disabled={paymentMethods.length === 0}
        >
          <option value="">Select a payment method</option>
          {paymentMethods.map((method) => (
            <option key={method.id} value={formatMethodForSelect(method)}>
              {formatMethodForSelect(method)}
            </option>
          ))}
        </select>

        <h4>Payout Frequency</h4>
        <select 
          value={payoutSettings.frequency}
          onChange={(e) => setPayoutSettings(prev => ({
            ...prev,
            frequency: e.target.value
          }))}
          className="payout-select"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>

        <button 
          className="save-settings-btn"
          onClick={handleSaveSettings}
        >
          Save Payout Settings
        </button>
      </div>

      {showAddMethod && (
        <div className="modal-overlay">
          <div className="add-method-modal">
            <div className="modal-header">
              <h3>Add Payment Method</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddMethod(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Method Type</label>
                <select className="form-control">
                  <option>Credit/Debit Card</option>
                  <option>Bank Account</option>
                  <option>PayPal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddMethod(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;

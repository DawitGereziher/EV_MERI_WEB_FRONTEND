import { useState, useEffect } from 'react';

const PayoutMethodsModal = ({ onClose, onUpdate }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Form state for adding new payment method
  const [newMethod, setNewMethod] = useState({
    method_type: 'bank_account',
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    routing_number: '',
    swift_code: '',
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    is_default: false
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
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
        setPaymentMethods(Array.isArray(methods) ? methods : []);
      } else {
        // No fallback to mock data - show empty state
        setPaymentMethods([]);
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (response.status === 404) {
          setError('No payment methods found. Add your first payment method below.');
        } else {
          setError('Failed to load payment methods. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setPaymentMethods([]);
      setError('Unable to connect to server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/payout-methods/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMethod),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle the response structure from our backend
        const newPayoutMethod = data.data || data;
        setPaymentMethods(prev => [...prev, newPayoutMethod]);
        setSuccessMessage(data.message || 'Payment method added successfully!');
        setShowAddForm(false);
        resetForm();
        if (onUpdate) onUpdate();
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.message || 'Failed to add payment method');
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      setError('Failed to add payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/payout-methods/${methodId}/set-default/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(prev =>
          prev.map(method => ({
            ...method,
            is_default: method.id === methodId
          }))
        );
        setSuccessMessage(data.message || 'Default payment method updated!');
        if (onUpdate) onUpdate();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update default method');
      }
    } catch (error) {
      console.error('Error setting default method:', error);
      setError('Failed to update default method');
    }
  };

  const handleDelete = async (methodId) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mengedmate-backend.onrender.com/api/payout-methods/${methodId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
        setSuccessMessage(data.message || 'Payment method deleted successfully!');
        if (onUpdate) onUpdate();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      setError('Failed to delete payment method');
    }
  };

  const resetForm = () => {
    setNewMethod({
      method_type: 'bank_account',
      account_holder_name: '',
      bank_name: '',
      account_number: '',
      routing_number: '',
      swift_code: '',
      card_number: '',
      card_type: '',
      expiry_month: '',
      expiry_year: '',
      phone_number: '',
      provider: '',
      paypal_email: '',
      is_default: false
    });
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'bank_account':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
            <path d="M11.5 1L2 6v2h20V6m-5 4v7h3v-7M2 22h20v-2H2m1-9v7h3v-7m5 0v7h3v-7"/>
          </svg>
        );
      case 'card':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
          </svg>
        );
      case 'mobile_money':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
            <path d="M17 18C15.89 18 15 17.11 15 16C15 14.89 15.89 14 17 14C18.11 14 19 14.89 19 16C19 17.11 18.11 18 17 18M7 18C5.89 18 5 17.11 5 16C5 14.89 5.89 14 7 14C8.11 14 9 14.89 9 16C9 17.11 8.11 18 7 18M7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.91 12.59 17.3 11.97L21.16 4H4.27L2.96 2H1V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.29 15 7.17 14.89 7.17 14.75Z"/>
          </svg>
        );
      case 'paypal':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
            <path d="M8.32 21.97C8.21 21.92 8.08 21.76 8.06 21.65C8.03 21.5 8 21.76 8.06 21.65L9.5 14.5H12.25C15.97 14.5 17.5 12.5 17.5 9.75C17.5 6.5 15.47 4.5 11.75 4.5H5.75C5.33 4.5 4.97 4.81 4.91 5.23L2.5 20.25C2.47 20.44 2.5 20.63 2.59 20.8C2.68 20.97 2.82 21.09 3 21.13C3.08 21.15 3.17 21.15 3.25 21.13L8.32 21.97M6.85 6H11.75C14.47 6 15.5 7.5 15.5 9.75C15.5 11.5 14.47 13 12.25 13H10.15L6.85 6Z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          </svg>
        );
    }
  };

  const formatAccountNumber = (method) => {
    // Use masked_details from backend if available
    if (method.masked_details) {
      return method.masked_details.details;
    }

    // Fallback to manual formatting
    if (method.method_type === 'bank_account') {
      return `${method.bank_name} - ${method.account_number}`;
    } else if (method.method_type === 'card') {
      return `${method.card_type || 'Card'} ${method.card_number}`;
    } else if (method.method_type === 'mobile_money') {
      return `${method.provider} - ${method.phone_number}`;
    } else if (method.method_type === 'paypal') {
      return `PayPal - ${method.paypal_email}`;
    }
    return 'Unknown method';
  };

  // Add error boundary-like behavior
  if (!onClose || typeof onClose !== 'function') {
    console.error('PayoutMethodsModal: onClose prop is required and must be a function');
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payout-methods-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Payout Methods</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {successMessage && (
            <div className="success-message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {error}
            </div>
          )}

          <div className="payout-methods-header">
            <h3>Your Payout Methods</h3>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px', marginRight: '8px' }}>
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add Method
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <svg className="animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <p>Loading payment methods...</p>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="currentColor" className="empty-icon">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              <h3>No Payment Methods</h3>
              <p>Add a payment method to receive payouts from your charging stations.</p>
            </div>
          ) : (
            <div className="payment-methods-list">
              {paymentMethods.map((method) => (
                <div key={method.id} className="payment-method-card">
                  <div className="method-info">
                    <div className="method-icon">
                      {getMethodIcon(method.method_type)}
                    </div>
                    <div className="method-details">
                      <h4>{method.account_holder_name}</h4>
                      <p>{formatAccountNumber(method)}</p>
                      <div className="method-status">
                        {method.is_default && <span className="default-badge">Default</span>}
                        {method.is_verified ? (
                          <span className="verified-badge">Verified</span>
                        ) : (
                          <span className="unverified-badge">Pending Verification</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="method-actions">
                    {!method.is_default && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </button>
                    )}
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(method.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddForm && (
            <div className="add-method-form">
              <h3>Add New Payment Method</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Method Type</label>
                  <select
                    value={newMethod.method_type}
                    onChange={(e) => setNewMethod(prev => ({ ...prev, method_type: e.target.value }))}
                    required
                  >
                    <option value="bank_account">Bank Account</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Account Holder Name</label>
                  <input 
                    type="text"
                    value={newMethod.account_holder_name}
                    onChange={(e) => setNewMethod(prev => ({ ...prev, account_holder_name: e.target.value }))}
                    placeholder="Enter account holder name"
                    required
                  />
                </div>

                {newMethod.method_type === 'bank_account' ? (
                  <>
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input 
                        type="text"
                        value={newMethod.bank_name}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, bank_name: e.target.value }))}
                        placeholder="Enter bank name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Account Number</label>
                      <input 
                        type="text"
                        value={newMethod.account_number}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, account_number: e.target.value }))}
                        placeholder="Enter account number"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Routing Number (Optional)</label>
                      <input 
                        type="text"
                        value={newMethod.routing_number}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, routing_number: e.target.value }))}
                        placeholder="Enter routing number"
                      />
                    </div>
                    <div className="form-group">
                      <label>SWIFT Code (Optional)</label>
                      <input 
                        type="text"
                        value={newMethod.swift_code}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, swift_code: e.target.value }))}
                        placeholder="Enter SWIFT code"
                      />
                    </div>
                  </>
                ) : newMethod.method_type === 'card' ? (
                  <>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        value={newMethod.card_number}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, card_number: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Card Type</label>
                      <select
                        value={newMethod.card_type || ''}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, card_type: e.target.value }))}
                        required
                      >
                        <option value="">Select card type</option>
                        <option value="Visa">Visa</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="American Express">American Express</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Month</label>
                        <select
                          value={newMethod.expiry_month}
                          onChange={(e) => setNewMethod(prev => ({ ...prev, expiry_month: e.target.value }))}
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Expiry Year</label>
                        <select
                          value={newMethod.expiry_year}
                          onChange={(e) => setNewMethod(prev => ({ ...prev, expiry_year: e.target.value }))}
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return <option key={year} value={year}>{year}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                  </>
                ) : newMethod.method_type === 'mobile_money' ? (
                  <>
                    <div className="form-group">
                      <label>Mobile Money Provider</label>
                      <select
                        value={newMethod.provider || ''}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, provider: e.target.value }))}
                        required
                      >
                        <option value="">Select provider</option>
                        <option value="M-Pesa">M-Pesa</option>
                        <option value="Airtel Money">Airtel Money</option>
                        <option value="Tigo Pesa">Tigo Pesa</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={newMethod.phone_number || ''}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, phone_number: e.target.value }))}
                        placeholder="+251912345678"
                        required
                      />
                    </div>
                  </>
                ) : newMethod.method_type === 'paypal' ? (
                  <div className="form-group">
                    <label>PayPal Email</label>
                    <input
                      type="email"
                      value={newMethod.paypal_email || ''}
                      onChange={(e) => setNewMethod(prev => ({ ...prev, paypal_email: e.target.value }))}
                      placeholder="your-email@example.com"
                      required
                    />
                  </div>
                ) : null}

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={newMethod.is_default}
                      onChange={(e) => setNewMethod(prev => ({ ...prev, is_default: e.target.checked }))}
                    />
                    Set as default payout method
                  </label>
                </div>

                <div className="form-actions">
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Method'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutMethodsModal;

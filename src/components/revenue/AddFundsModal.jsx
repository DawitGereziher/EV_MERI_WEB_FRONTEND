import { useState } from 'react';

const AddFundsModal = ({ onClose, onAddFunds }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Visa **** 1234');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await onAddFunds(amount, paymentMethod);
    } catch (error) {
      console.error('Error adding funds:', error);
      alert('Failed to add funds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [50, 100, 250, 500, 1000];

  return (
    <div className="modal-overlay">
      <div className="add-funds-modal">
        <div className="modal-header">
          <h3>Add Funds</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="form-group">
              <label>Amount</label>
              <div className="amount-input-container">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  className="form-control amount-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>

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
                    ${quickAmount}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="Visa **** 1234">Visa **** 1234</option>
                <option value="Bank Account --7880">Bank Account --7880</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>

            <div className="fee-info">
              <div className="fee-row">
                <span>Amount:</span>
                <span>${amount || '0.00'}</span>
              </div>
              <div className="fee-row">
                <span>Processing Fee (2.9%):</span>
                <span>${amount ? (parseFloat(amount) * 0.029).toFixed(2) : '0.00'}</span>
              </div>
              <div className="fee-row total">
                <span>Total:</span>
                <span>${amount ? (parseFloat(amount) * 1.029).toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
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
              disabled={loading || !amount}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Processing...
                </>
              ) : (
                'Add Funds'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFundsModal;

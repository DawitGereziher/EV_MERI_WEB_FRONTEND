import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../styles/verification-pending.css';

const VerificationPending = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);
  return (
    <div className="verification-pending-page">
      <header className="pending-header">
        <div className="container">
          <div className="pending-brand">
            <div className="logo-container">
             <img src="/evlogo" alt="" />
            </div>
            
          </div>
        </div>
      </header>

      <main className="pending-main">
        <div className="pending-container">
          <div className="pending-card">
            <div className="pending-icon">
              <div className="check-icon">
                <img src="/evlogo.jpg" alt="Evመሪ logo" />

              </div>
            </div>

            
            <h2 className="pending-subtitle">Verification Pending</h2>
            <p className="pending-description">Your account is currently under review</p>

            <div className="pending-divider"></div>

            <div className="pending-content">
              {message && (
                <div className="success-message">
                  {message}
                </div>
              )}

              <p className="pending-text">
                Thank you for submitting your information. Our team is currently
                reviewing your documents to verify your account. This typically takes 1-3
                business days.
              </p>

              <div className="status-steps">
                <div className="status-step completed">
                  <div className="step-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3.02944 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Profile Submitted</span>
                </div>

                <div className="status-step pending">
                  <div className="step-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 7V13L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Under Review</span>
                </div>

                <div className="status-step">
                  <div className="step-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3.02944 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Verification Complete</span>
                </div>
              </div>

              <Link to="/dashboard" className="btn btn-primary dashboard-btn">
                Go to Dashboard
              </Link>

              <p className="pending-note">
                If you need to make changes or have additional information, please contact our support team at
                <a href="mailto:support@mengedmate.com"> support@Evመሪ.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      </div>


  );
};

export default VerificationPending;

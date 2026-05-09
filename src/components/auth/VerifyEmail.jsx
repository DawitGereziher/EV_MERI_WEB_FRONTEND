import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../landing/Footer';
import Header from '../landing/Header';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleResendCode = useCallback(async () => {
    if (!email) return;

    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('https://mengedmate-backend.onrender.com/api/auth/resend-verification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification code sent to your email!');
      } else {
        setError(data.message || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.message) {
      setMessage(location.state.message);
      if (location.state.message.includes('already registered but not verified')) {
        handleResendCode();
      }
    }
  }, [location.state, handleResendCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://mengedmate-backend.onrender.com/api/station-owners/verify-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verification_code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token if provided by the verification endpoint
        if (data.token) {
          localStorage.setItem('token', data.token);
          // If we have a token, go directly to profile
          navigate('/station-owner/profile', {
            state: { message: 'Email verified successfully! Please complete your profile.' }
          });
        } else {
          // If no token is provided, redirect to login with success message
          navigate('/login', {
            state: {
              message: 'Email verified successfully! Please login to continue.',
              email: email
            }
          });
        }
      } else {
        setError(data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 px-4">
          {/* Left Side - Form */}
          <div className="flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              <div className="flex items-center space-x-3">
                
                  <img
  src="/evlogo.jpg"
  alt="Evመሪ Logo"
  className="w-24 h-24 object-contain mx-auto mb-4"
/>

                </div>
          

              <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
              <p className="text-gray-600">We've sent a verification code to your email.</p>

              {message && (
                <div className="bg-blue-100 text-blue-800 border-l-4 border-blue-500 p-3 rounded">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Verification Code</label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>

              <div className="text-sm mt-4 text-gray-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {resendLoading ? 'Resending...' : 'Resend'}
                </button>
              </div>

              <div className="mt-2">
                <Link to="/station-owner/register" className="text-blue-600 text-sm hover:underline">← Back to Registration</Link>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Info */}
          <div className="hidden lg:flex flex-col justify-center bg-blue-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Almost there!</h2>
            <p className="text-blue-800 mb-4">
              Verify your email to complete your registration and start managing your EV charging stations.
            </p>
            <div className="bg-white p-4 rounded shadow border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-700">Email Verification</h3>
              <p className="text-sm text-gray-600 mt-1">Secure your account by confirming your identity.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyEmail;

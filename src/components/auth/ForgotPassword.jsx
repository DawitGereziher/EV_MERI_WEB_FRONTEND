import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../landing/Footer';
import Header from '../landing/Header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('https://mengedmate-backend.onrender.com/api/auth/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset link has been sent to your email.');
      } else {
        setError(data.message || 'Failed to send reset link. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
     <Header/>

      {/* Main Section */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form */}
          <div className="p-10">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-blue-600">Forgot Password</h1>
              <p className="text-gray-600 mt-2">Enter your email and we’ll send you a reset link.</p>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="info@mengedmate.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-600 hover:underline">
                ← Back to Login
              </Link>
            </div>
          </div>

          {/* Right Side Info */}
          <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white p-10">
            <h2 className="text-3xl font-bold mb-4">Need to reset?</h2>
            <p className="text-lg text-center mb-6">
              We’ll email you instructions to reset your password. It’s easy and fast.
            </p>
            <div className="bg-white text-blue-600 rounded-lg px-6 py-4 shadow-md text-center">
              <h3 className="font-semibold text-lg">Secure Recovery</h3>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ForgotPassword;

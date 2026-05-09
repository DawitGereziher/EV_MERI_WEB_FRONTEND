import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Footer from '../landing/Footer';
import Header from '../landing/Header';

const StationOwnerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    company_name: '',
    password: '',
    password2: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters long');
    if (!/(?=.*[a-z])/.test(password)) errors.push('Must include a lowercase letter');
    if (!/(?=.*[A-Z])/.test(password)) errors.push('Must include an uppercase letter');
    if (!/(?=.*\d)/.test(password)) errors.push('Must include a number');
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.push('Must include a special character (@$!%*?&)');
    return errors;
  };

  const validatePasswordMatch = (password, confirmPassword) => password === confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if (name === 'password') {
      setPasswordErrors(validatePassword(value));
    }

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      setError('Please fix the password requirements below');
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://mengedmate-backend.onrender.com/api/station-owners/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/station-owner/verify-email', { state: { email: formData.email } });
      } else {
        if (data.email && data.email[0] === 'A user with this email already exists.') {
          try {
            const checkResponse = await fetch('https://mengedmate-backend.onrender.com/api/auth/check-verification/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email }),
            });

            const checkData = await checkResponse.json();

            if (checkResponse.ok) {
              if (checkData.is_verified) {
                setError('Email already taken. Please sign in instead.');
                setTimeout(() => navigate('/login'), 2000);
              } else {
                navigate('/station-owner/verify-email', {
                  state: {
                    email: formData.email,
                    message: 'Email already registered but not verified. Please verify your email.',
                  },
                });
              }
            } else {
              setError('Email already taken. Please sign in instead.');
            }
          } catch {
            setError('Email already taken. Please sign in instead.');
          }
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
          {/* Form Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Create a Station Owner Account</h1>
            <p className="text-gray-600 mb-6">Sign up to manage your EV charging stations</p>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {['email', 'first_name', 'last_name', 'company_name'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block mb-1 font-medium text-gray-700 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              ))}

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <div
                  className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {passwordErrors.length > 0 && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
                    <p className="font-semibold mb-1">Password must contain:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label htmlFor="password2" className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="password2"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <div
                  className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {formData.password2 && !validatePasswordMatch(formData.password, formData.password2) && (
                  <p className="mt-2 text-red-600 text-sm font-semibold">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
            </p>
          </div>

          {/* Right Side Section */}
          <div className="hidden md:flex flex-col justify-center bg-blue-50 rounded-lg p-10 shadow-md">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">Grow your EV charging business</h2>
            <p className="text-blue-600 mb-8">
              Join our network of station owners and get access to powerful tools to manage and expand your charging infrastructure.
            </p>
            <div className="bg-white p-6 rounded-lg shadow text-blue-700 font-semibold text-lg">
              EV Charging Network
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StationOwnerRegister;

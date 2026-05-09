import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import StationOwnerRegister from './components/auth/StationOwnerRegister';
import VerifyEmail from './components/auth/VerifyEmail';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import StationOwnerProfile from './components/auth/StationOwnerProfile';
import VerificationPending from './components/auth/VerificationPending';
import Dashboard from './components/dashboard/Dashboard';
import Stations from './components/stations/Stations';
import Revenue from './components/revenue/Revenue';
import Reports from './components/reports/Reports';
import WalletPayouts from './components/wallet/WalletPayouts';
import Settings from './components/settings/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AboutUs from './components/landing/AboutUs';
import Reviews from './components/reviews/Reviews';
import ContactUs from './components/landing/ContactUs';
import RouteDebug from './components/debug/RouteDebug';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
           <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/station-owner/register"
            element={
              <ProtectedRoute requireAuth={false}>
                <StationOwnerRegister />
              </ProtectedRoute>
            }
          />

          <Route
          path="/reviews"element={<Reviews/>}/>
          <Route
            path="/station-owner/verify-email"
            element={
              <ProtectedRoute requireAuth={false}>
                <VerifyEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute requireAuth={false}>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/station-owner/profile"
            element={
              <ProtectedRoute requireAuth={true}>
                <StationOwnerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification-pending"
            element={
              <ProtectedRoute requireAuth={true}>
                <VerificationPending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAuth={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stations"
            element={
              <ProtectedRoute requireAuth={true}>
                <Stations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revenue"
            element={
              <ProtectedRoute requireAuth={true}>
                <Revenue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute requireAuth={true}>
                <Reports />
              </ProtectedRoute>
            }
          />
             
          <Route
            path="/wallet"
            element={
              <ProtectedRoute requireAuth={true}>
                <WalletPayouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requireAuth={true}>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Go Home
              </a>
            </div>
          </div>} />
        </Routes>
        {/* Debug component - remove in production */}
        {process.env.NODE_ENV === 'development' && <RouteDebug />}
      </div>
    </Router>
  );
}

export default App;

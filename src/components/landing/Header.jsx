import { useState } from 'react';
import { Link } from 'react-router-dom';
import AboutUs from './AboutUs';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
   <header className="bg-white shadow-md sticky top-0 z-50">

      <div className="container mx-auto px-6 lg:px-20 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
           <img src="/evlogo.jpg" alt="   Evመሪ Logo" className="w-8 h-8 object-contain" />
            EVመሪ
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">Features</a>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About Us</Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition font-medium"
            >
              Login
            </Link>
            <Link
              to="/station-owner/register"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition font-medium"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="w-6 h-0.5 bg-gray-700"></span>
            <span className="w-6 h-0.5 bg-gray-700"></span>
            <span className="w-6 h-0.5 bg-gray-700"></span>
          </button>
        </nav>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About Us</Link>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            <Link to="/station-owner/register" className="text-blue-600 hover:underline">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

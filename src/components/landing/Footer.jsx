import {
  FaBolt,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section: Horizontal layout */}
        <div className="flex flex-col sm:flex-row justify-between space-y-10 sm:space-y-0 sm:space-x-10 mb-12">
          
          {/* Brand */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 text-2xl font-bold mb-4">
              <FaBolt className="text-indigo-400" />
              <span>Evመሪ</span>
            </div>
            <p className="text-slate-400 mb-4">
              Making EV charging station management simple and efficient for business owners worldwide.
            </p>
            <div className="flex gap-3">
              {[FaTwitter, FaFacebook, FaLinkedin, FaInstagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-md bg-slate-700 flex items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="flex-1 min-w-[150px]">
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="/about" className="hover:text-indigo-400">About Us</a></li>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">ContactUs</Link>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex-1 min-w-[150px]">
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#privacy" className="hover:text-indigo-400">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-indigo-400">Terms of Service</a></li>
              <li><a href="#security" className="hover:text-indigo-400">Security</a></li>
              <li><a href="#compliance" className="hover:text-indigo-400">Compliance</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-6 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Evመሪ. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useEffect } from 'react';
import { FaBolt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Hero = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="bg-gradient-to-br from-blue-100 to-white text-gray-800 py-20">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div data-aos="fade-right">
            <p className="text-sm uppercase tracking-widest text-blue-600 mb-2">
              EV Charging Made Easy
            </p>

            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Manage stations <span className="text-blue-600">instantly</span><br />
              from your dashboard<br />
              <span className="text-blue-600 inline-flex items-center gap-2">
                EVመሪ <FaBolt className="inline w-6 h-6" />
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Create, monitor, and optimize your EV charging business with ease. Receive instant notifications, analytics, and more — all from one powerful dashboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/station-owner/register"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <FaUser /> Login
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden md:block" data-aos="fade-left">
            <img
              src="/ev-charging.jpg"
              alt="EV Charging Illustration"
              className="w-full max-w-lg mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { FaMapMarkerAlt, FaBolt, FaCogs, FaUsers, FaChargingStation } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="flex-1 px-6 lg:px-20 py-16">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* Intro Section */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-700">About Evመሪ</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Evመሪ is Ethiopia’s pioneering digital platform for locating, managing, and expanding electric vehicle (EV) charging infrastructure—driven by technology, powered by purpose.
            </p>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-10 text-center">
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-600">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">Our Mission</h2>
              <p>
                To simplify and accelerate the adoption of electric vehicles in Ethiopia by connecting drivers with accessible, efficient, and reliable charging solutions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-600">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">Our Vision</h2>
              <p>
                To become the backbone of Ethiopia’s EV infrastructure by creating a sustainable and connected ecosystem for mobility.
              </p>
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-3xl font-bold text-blue-600 text-center mb-10">What We Offer</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow text-center space-y-4">
                <FaMapMarkerAlt className="text-4xl text-blue-600 mx-auto" />
                <h3 className="text-xl font-semibold text-blue-700">Charging Station Mapping</h3>
                <p>Locate available EV stations in real time across Ethiopia.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center space-y-4">
                <FaCogs className="text-4xl text-blue-600 mx-auto" />
                <h3 className="text-xl font-semibold text-blue-700">Smart Filtering</h3>
                <p>Search by charger type, availability, region, and more.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center space-y-4">
                <FaBolt className="text-4xl text-blue-600 mx-auto" />
                <h3 className="text-xl font-semibold text-blue-700">AI & Data Insights</h3>
                <p>Personalized recommendations powered by intelligent features.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center space-y-4">
                <FaChargingStation className="text-4xl text-blue-600 mx-auto" />
                <h3 className="text-xl font-semibold text-blue-700">Station Owner Dashboard</h3>
                <p>Manage your station and monitor activity with ease.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center space-y-4">
                <FaUsers className="text-4xl text-blue-600 mx-auto" />
                <h3 className="text-xl font-semibold text-blue-700">Community Engagement</h3>
                <p>Connect with EV owners, advocates, and sustainability partners.</p>
              </div>
            </div>
          </section>

          {/* Story */}
          <section className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-blue-600">Our Story</h2>
            <p className="max-w-4xl mx-auto text-gray-700">
              Evመሪ was founded with a clear goal: to transform the way electric vehicles are supported in Ethiopia. As the country shifts toward sustainable transportation, we recognized a crucial gap in accessible, reliable EV charging infrastructure. We built this platform to fill that gap—empowering both drivers and station owners with intelligent tools and real-time data to support Ethiopia’s green mobility revolution.
            </p>
          </section>

          {/* Team */}
          <section className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-blue-600">Our Team</h2>
            <p className="max-w-4xl mx-auto text-gray-700">
              We are a passionate team of innovators, developers, and designers united by a vision to build the future of clean transportation in Ethiopia. Our combined expertise drives the platform’s growth and impact.
            </p>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Get Involved</h2>
            <p className="mb-4">
              Are you a station owner, EV driver, or sustainability advocate? Join us in building a cleaner, greener Ethiopia.
            </p>
            <a
              href="/station-owner/register"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
            >
              Register Your Station
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;

import {
  FaChartLine,
  FaBell,
  FaCog,
  FaShieldAlt,
  FaMobile,
  FaHeadset,
  FaMapMarkerAlt,
  FaBolt,
} from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaChartLine className="text-indigo-600 text-3xl" />,
      title: "Real-time Analytics",
      description: "Track energy usage, session durations, and revenue at a glance.",
    },
    {
      icon: <FaBell className="text-yellow-500 text-3xl" />,
      title: "Instant Notifications",
      description: "Receive alerts for station downtime, charging errors, and customer activity.",
    },
    {
      icon: <FaMapMarkerAlt className="text-green-600 text-3xl" />,
      title: "Location Management",
      description: "Add and manage multiple EV charging locations easily.",
    },
    {
      icon: <FaBolt className="text-pink-500 text-3xl" />,
      title: "Smart Charger Control",
      description: "Start, stop, or schedule charging remotely for better energy use.",
    },
    {
      icon: <FaShieldAlt className="text-red-500 text-3xl" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade encryption and uptime guarantees for peace of mind.",
    },
    {
      icon: <FaMobile className="text-blue-500 text-3xl" />,
      title: "Mobile Ready",
      description: "Manage everything from your phone or tablet, anytime.",
    },
    {
      icon: <FaCog className="text-purple-500 text-3xl" />,
      title: "Centralized Control",
      description: "View and update settings for all your stations from a single dashboard.",
    },
    {
      icon: <FaHeadset className="text-teal-500 text-3xl" />,
      title: "24/7 Support",
      description: "Our expert support team is available around the clock to assist you.",
    },
  ];

  return (
    <section id="features" className="features bg-gray-100 py-20">
      <div className="container mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Platform Features</h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Empowering EV station owners with smart, efficient, and easy-to-use tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 text-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

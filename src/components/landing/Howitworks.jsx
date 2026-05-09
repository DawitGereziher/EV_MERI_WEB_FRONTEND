import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { FaUserPlus, FaPlug, FaChartLine, FaBell, FaRocket } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus className="text-indigo-600 text-4xl" />,
    title: "Sign Up & Register",
    description: "Create your account and add your EV charging stations quickly.",
  },
  {
    icon: <FaPlug className="text-green-600 text-4xl" />,
    title: "Connect Chargers",
    description: "Link your chargers and configure schedules remotely.",
  },
  {
    icon: <FaChartLine className="text-blue-600 text-4xl" />,
    title: "Monitor Analytics",
    description: "Track real-time energy usage and revenue from your dashboard.",
  },
  {
    icon: <FaBell className="text-yellow-500 text-4xl" />,
    title: "Receive Alerts",
    description: "Get instant notifications for downtime or errors.",
  },
  {
    icon: <FaRocket className="text-pink-600 text-4xl" />,
    title: "Manage & Grow",
    description: "Update pricing and manage multiple stations easily.",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleClick = () => {
  navigate('/station-owner/register');  };

  return (
    <section className="how-it-works py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <p className="mb-12 text-gray-600 max-w-2xl mx-auto">
          A simple process to get your EV charging business up and running smoothly.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-10">
          {steps.map(({ icon, title, description }, idx) => (
            <motion.div
              key={idx}
              className="flex-1 p-6 rounded-lg shadow-md border border-gray-200 bg-white bg-opacity-70 backdrop-blur-sm hover:shadow-lg transition cursor-pointer flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ scale: 1.05 }}
              aria-label={`Step ${idx + 1}: ${title}`}
            >
              <div className="mb-4 flex justify-center">{icon}</div>
              <h3 className="font-semibold text-xl mb-2">{title}</h3>
              <p className="text-gray-700 flex-grow">{description}</p>
            </motion.div>
          ))}
        </div>

        <button
          onClick={handleClick}
          className="mt-12 bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-white-700 transition"
        >
          Get Started Today
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;

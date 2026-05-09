import { useState } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import Header
 from "./Header";
import Footer from "./Footer";
     
export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "info", message: "Sending…" });

    try {
      const response = await axios.post(
        "https://your-backend.com/api/contact",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setStatus({ type: "success", message: response.data.message });
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", message: response.data.message });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Server error—please try again later.",
      });
    }
  };

  return (
    <div>
  <Header />
    <section id="contact" className="bg-slate-100 py-16"> 
    
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Contact Us
          </h2>
          <p className="text-slate-600">
            Reach out with questions, feedback, or inquiries.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-center text-slate-700">
              <FaMapMarkerAlt className="mr-3 text-blue-500" />
              Addis Ababa, Ethiopia
            </div>
            <div className="flex items-center text-slate-700">
              <FaPhone className="mr-3 text-blue-500" />
              +251 9xx xxx xxx
            </div>
            <div className="flex items-center text-slate-700">
              <FaEnvelope className="mr-3 text-blue-500" />
              support@evmeri.com
            </div>
            <div className="flex space-x-3 pt-4">
              {[FaTwitter, FaFacebook, FaLinkedin, FaInstagram].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-md bg-slate-700 flex items-center justify-center text-white hover:bg-blue-500 transition"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-md"
          >
            {status.message && (
              <p
                className={
                  status.type === "success"
                    ? "text-green-600"
                    : status.type === "error"
                    ? "text-red-600"
                    : "text-slate-700"
                }
              >
                {status.message}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-slate-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-slate-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                required
                className="mt-1 block w-full border border-slate-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={status.type === "info"}
            >
              {status.type === "info" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
    <Footer/>
    </div>
  );
}

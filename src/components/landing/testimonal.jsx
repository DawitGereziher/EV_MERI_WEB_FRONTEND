const Testimonials = () => {
  const testimonials = [
    {
      name: "Lidya T.",
      role: "EV Station Owner, Addis Ababa",
      quote:
        "Evመሪ helped me manage my charging station easily. Real-time analytics and instant alerts made my operations seamless.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Samuel D.",
      role: "Fleet Manager, Adama",
      quote:
        "The dashboard is super intuitive and reliable. It saved us time and helped increase station uptime.",
      image: "https://randomuser.me/api/portraits/men/35.jpg",
    },
    {
      name: "Mekdes A.",
      role: "New EV Station Owner",
      quote:
        "I launched my first station with Evመሪ in days. The support and simplicity were amazing!",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Henok B.",
      role: "Station Manager, Bahir Dar",
      quote:
        "Managing multiple stations has never been easier. The tools are powerful and user-friendly.",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    {
      name: "Yordanos M.",
      role: "Startup Founder, Hawassa",
      quote:
        "Evመሪ gave my startup a head start. The onboarding was smooth, and I love the analytics.",
      image: "https://randomuser.me/api/portraits/women/52.jpg",
    },
  ];

  // Duplicate testimonials to create infinite loop effect
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <>
      <style>{`
        .slider {
          display: flex;
          width: max-content;
          animation: scroll-left 30s linear infinite;
        }
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <section className="bg-gray-50 py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">What Our Users Say</h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            Real stories from EV station owners across Ethiopia.
          </p>

          <div className="slider">
            {duplicatedTestimonials.map((t, index) => (
              <div
                key={index}
                className="w-80 flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 px-6 py-8 mx-4"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
                <h4 className="font-semibold text-lg text-center">{t.name}</h4>
                <p className="text-sm text-gray-500 text-center">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;

const LandingDescription = () => {
  return (
    <div className="feature">
    <section className="bg-white py-20">
  <div className="container mx-auto px-6 md:flex md:items-center md:gap-16">
    {/* Image first */}
    <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
      <img
        src="ev.jpg"
        alt="Electric vehicle charging illustration"
        className="rounded-lg shadow-lg w-64 h-auto"
      />
    </div>

    {/* Text Content second */}
    <div className="md:w-1/2">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
        Empowering Ethiopia's EV Revolution
      </h2>
      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Evመሪ is your go-to platform for locating electric vehicle charging stations across Ethiopia. 
        We make it effortless to find, manage, and monitor EV charging points — driving a greener future.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed">
        Join thousands of station owners and EV drivers already benefiting from real-time updates, 
        seamless connectivity, and intelligent analytics — all in one place.
      </p>
    </div>
  </div>
</section>
</div>
  );
};

export default LandingDescription;

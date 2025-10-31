
import React from 'react';

const Hero: React.FC = () => {
  const handleOrderNowClick = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      // The block option is set to 'start' to align the top of the element with the top of the viewport.
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      className="relative bg-cover bg-center h-[50vh] min-h-[400px] text-white flex items-center justify-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')" }}
      role="banner"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center px-4">
        <h1 id="hero-heading" className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Your Tummy needs to Fill here
        </h1>
        <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl text-gray-200">
          Discover a world of flavors, crafted with passion and served with a smile.
        </p>
        <button
          onClick={handleOrderNowClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          aria-label="Order now and view the menu"
        >
          Order Now
        </button>
      </div>
    </section>
  );
};

export default Hero;

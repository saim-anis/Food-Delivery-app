
import React from 'react';

const Navbar: React.FC = () => {
  const navLinks = ['Home', 'About', 'Restaurant', 'Contact'];
  return (
    <nav className="hidden md:block">
      <ul className="flex items-center space-x-8">
        {navLinks.map(link => (
          <li key={link}>
            <a href="#" className="text-gray-600 hover:text-orange-500 font-semibold transition-colors duration-300 pb-1 border-b-2 border-transparent hover:border-orange-500">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

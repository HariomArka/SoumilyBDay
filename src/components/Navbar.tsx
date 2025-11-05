import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: '3rd Sem', path: '/3rdsem' },
    { name: '4th Sem', path: '/4thsem' },
    { name: 'Summer 2025', path: '/summer' },
    { name: 'Astami', path: '/astami' },
    { name: '5th Sem', path: '/5thsem' },
  ];

  return (
    <nav className="bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/girl.png" 
              alt="Logo" 
              className="h-12 w-12 rounded-full object-cover border-2 border-pink-300 group-hover:border-pink-400 transition-all duration-300 shadow-sm"
            />
            <span className="text-2xl font-cursive text-pink-800 font-semibold group-hover:text-pink-900 transition-colors duration-300">
              Happy Birth Day
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-pink-800 hover:text-pink-900 font-medium text-sm lg:text-base transition-all duration-300 hover:scale-105 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-pink-800 hover:text-pink-900 focus:outline-none transition-colors duration-300"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-pink-100">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-pink-800 hover:text-pink-900 hover:bg-pink-200 rounded-lg font-medium transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Collection', href: '#inventory' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#features' },
  { label: 'Inquire', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80; // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Expo ease
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? 'py-4 glass-panel' : 'py-8 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a 
          href="#" 
          onClick={handleLogoClick}
          className="group relative z-50"
        >
          <span className="font-display font-medium text-2xl tracking-[0.1em] text-brand-bone group-hover:text-brand-copper transition-colors duration-500">
            MANGA AUTOS
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-12">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="relative text-xs uppercase tracking-[0.2em] font-medium text-brand-bone/70 hover:text-brand-copper transition-colors duration-500 cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-bone hover:text-brand-copper transition-colors z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-brand-charcoal z-40 flex items-center justify-center"
          >
            <div className="flex flex-col space-y-8 text-center">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-3xl font-display text-brand-bone hover:text-brand-copper hover:italic transition-all duration-300 cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
              <div className="w-12 h-[1px] bg-brand-bone/20 mx-auto my-8"></div>
               <a 
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="text-sm uppercase tracking-[0.2em] text-brand-copper cursor-pointer"
              >
                Book Appointment
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
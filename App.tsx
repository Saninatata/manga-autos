import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import Inventory from './components/Inventory';
import About from './components/About';
import Features from './components/Features';
import TestDrive from './components/TestDrive';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reduced from 2000ms to 800ms for snappier load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-brand-charcoal text-brand-bone font-sans">
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }} // Slightly faster exit
            className="fixed inset-0 bg-brand-charcoal flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1 className="text-3xl font-display font-light tracking-[0.3em] text-brand-bone uppercase">
                Manga Autos
              </h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
                className="h-[1px] bg-brand-copper mt-4"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar />
          <main>
            <Hero />
            <Brands />
            <About />
            <Inventory />
            <Features />
            <TestDrive />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
};

export default App;
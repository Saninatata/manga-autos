import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=75&w=1920&auto=format&fit=crop', // Optimized
    subtitle: 'Est. 2015',
    title: 'BEST IN TOWN',
    highlight: 'PREMIUM SELECTION'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=75&w=1920&auto=format&fit=crop', // Optimized
    subtitle: 'The Best or Nothing',
    title: 'MERCEDES-BENZ',
    highlight: 'TIMELESS LUXURY'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1614026480418-bd11fdb9fa06?q=75&w=1920&auto=format&fit=crop', // Optimized
    subtitle: 'Vorsprung durch Technik',
    title: 'AUDI',
    highlight: 'MODERN INNOVATION'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?q=75&w=1920&auto=format&fit=crop', // Optimized
    subtitle: 'Expect the Unexpected',
    title: 'LAMBORGHINI',
    highlight: 'ITALIAN EXCELLENCE'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=75&w=1920&auto=format&fit=crop', // Optimized
    subtitle: 'There Is No Substitute',
    title: 'PORSCHE',
    highlight: 'GERMAN PRECISION'
  }
];

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const yBg = useTransform(scrollY, [0, 800], [0, 150]);
  const scaleImg = useTransform(scrollY, [0, 800], [1.1, 1]);
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  const handleScrollToInventory = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector('#inventory');
    if (element) {
      // Offset for sticky header
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-brand-charcoal">
      {/* Background Slideshow */}
      <motion.div 
        style={{ y: yBg, scale: scaleImg }}
        className="absolute inset-0 z-0 will-change-transform" // Hardware acceleration hint
      >
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
        <AnimatePresence mode="popLayout">
            <motion.img 
                key={slides[currentSlide].id}
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }} // Faster transition (1.5s vs 2.5s)
                className="absolute inset-0 w-full h-full object-cover object-center"
            />
        </AnimatePresence>
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ opacity: opacityText }}
        className="relative z-20 container mx-auto px-6 md:px-12 flex flex-col items-center text-center h-full justify-center pointer-events-none"
      >
         <div className="min-h-[250px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                key={slides[currentSlide].id}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                transition={{ duration: 1.0, ease: "easeOut" }} // Slightly snappier text fade
                className="flex flex-col items-center"
                >
                <span className="text-brand-bone/80 text-xs md:text-sm uppercase tracking-[0.3em] font-light mb-6 block">
                    {slides[currentSlide].subtitle}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-medium text-brand-bone mb-6 leading-tight tracking-tight">
                    {slides[currentSlide].title} <br/> 
                    <span className="text-2xl md:text-4xl italic text-brand-copper font-normal tracking-normal block mt-4">{slides[currentSlide].highlight}</span>
                </h1>
                </motion.div>
            </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mt-8 pointer-events-auto"
        >
          <a 
            href="#inventory" 
            onClick={handleScrollToInventory}
            className="inline-block px-10 py-4 border border-brand-bone/30 text-brand-bone text-xs uppercase tracking-[0.25em] transition-all duration-500 hover:bg-brand-copper hover:border-brand-copper hover:text-brand-charcoal backdrop-blur-sm cursor-pointer z-50 pointer-events-auto"
          >
            View Collection
          </a>
        </motion.div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-24 md:bottom-32 flex space-x-4 z-30 pointer-events-auto">
            {slides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-[2px] transition-all duration-700 ease-in-out cursor-pointer ${index === currentSlide ? 'w-12 bg-brand-copper' : 'w-4 bg-brand-bone/30 hover:bg-brand-bone'}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>

      </motion.div>
      
      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/60 to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};

export default Hero;
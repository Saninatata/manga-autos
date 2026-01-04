import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { name: 'Lamborghini', url: 'https://cdn.simpleicons.org/lamborghini/f5f5f0', website: 'https://www.lamborghini.com/' },
  { name: 'Ferrari', url: 'https://cdn.simpleicons.org/ferrari/f5f5f0', website: 'https://www.ferrari.com/' },
  { name: 'Porsche', url: 'https://cdn.simpleicons.org/porsche/f5f5f0', website: 'https://www.porsche.com/' },
  { name: 'Mercedes-Benz', url: '', website: 'https://www.mercedes-benz.com/' }, // Text render
  { name: 'Aston Martin', url: 'https://cdn.simpleicons.org/astonmartin/f5f5f0', website: 'https://www.astonmartin.com/' },
  { name: 'Bentley', url: 'https://cdn.simpleicons.org/bentley/f5f5f0', website: 'https://www.bentleymotors.com/' },
  { name: 'McLaren', url: 'https://cdn.simpleicons.org/mclaren/f5f5f0', website: 'https://cars.mclaren.com/' },
  { name: 'Rolls-Royce', url: 'https://cdn.simpleicons.org/rollsroyce/f5f5f0', website: 'https://www.rolls-roycemotorcars.com/' },
  { name: 'Bugatti', url: 'https://cdn.simpleicons.org/bugatti/f5f5f0', website: 'https://www.bugatti.com/' },
  { name: 'Maserati', url: 'https://cdn.simpleicons.org/maserati/f5f5f0', website: 'https://www.maserati.com/' },
  { name: 'BMW', url: 'https://cdn.simpleicons.org/bmw/f5f5f0', website: 'https://www.bmw.com/' },
  { name: 'Audi', url: 'https://cdn.simpleicons.org/audi/f5f5f0', website: 'https://www.audi.com/' },
  { name: 'Lexus', url: '', website: 'https://www.lexus.com/' }, // Text render
  { name: 'Toyota', url: 'https://cdn.simpleicons.org/toyota/f5f5f0', website: 'https://www.toyota.com/' },
  { name: 'Honda', url: 'https://cdn.simpleicons.org/honda/f5f5f0', website: 'https://www.honda.com/' },
];

const Brands: React.FC = () => {
  return (
    <section className="py-12 bg-brand-charcoal border-b border-brand-bone/5 relative overflow-hidden">
      {/* Gradient masks for smooth fade in/out */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-brand-charcoal to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-brand-charcoal to-transparent z-10"></div>

      <div className="flex">
        {/* We duplicate the list to create a seamless infinite loop */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 40, // Slower duration to accommodate more items
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-16 md:gap-24 items-center pr-16 md:pr-24 w-max"
        >
          {[...brands, ...brands].map((brand, index) => (
            <a 
              key={`${brand.name}-${index}`}
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center min-w-[100px] cursor-pointer"
              title={`Visit ${brand.name}`}
            >
              {brand.url ? (
                <img
                  src={brand.url}
                  alt={brand.name}
                  className="h-8 md:h-10 w-auto object-contain opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                />
              ) : (
                <span className={`opacity-30 group-hover:opacity-100 transition-opacity duration-500 text-brand-bone whitespace-nowrap ${
                  brand.name === 'Mercedes-Benz' 
                    ? 'font-display text-xl md:text-2xl tracking-wide font-medium' 
                    : 'font-sans text-lg md:text-xl font-bold tracking-[0.25em] uppercase'
                }`}>
                  {brand.name}
                </span>
              )}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Brands;
import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-brand-charcoal relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-graphite/50 to-transparent pointer-events-none" />
        
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full lg:w-1/2 relative"
          >
             <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden rounded-sm border border-brand-bone/5">
                <img 
                    src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop" 
                    alt="Manga Autos Showroom Detail" 
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-1000 ease-out"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 to-transparent"></div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-8 left-8 border border-brand-bone/20 bg-brand-charcoal/80 backdrop-blur-md p-6 max-w-xs">
                    <p className="font-display text-2xl text-brand-bone mb-1">Est. 2015</p>
                    <p className="text-xs uppercase tracking-widest text-brand-copper">Defining Luxury</p>
                </div>
             </div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
             <div className="flex items-center gap-4 mb-6">
                <span className="h-[1px] w-12 bg-brand-copper"></span>
                <span className="text-xs uppercase tracking-[0.25em] text-brand-copper">About Us</span>
             </div>
             
             <h2 className="text-3xl md:text-5xl font-display font-medium text-brand-bone leading-tight mb-8">
                Driven by perfection. <br/>
                <span className="text-brand-bone/40">Curated for the elite.</span>
             </h2>

             <p className="text-brand-bone/70 text-lg font-light leading-relaxed mb-8">
                Manga Autos is more than a dealership; it is a curator of automotive excellence. Located in the heart of Abuja, we specialize in sourcing and delivering the world's most prestigious vehicles to a discerning clientele.
             </p>

             <p className="text-brand-bone/50 text-sm leading-relaxed mb-12 text-balance">
                Our philosophy is simple: uncompromising quality. Whether it is a track-focused supercar or a bespoke luxury sedan, every vehicle in our collection undergoes a rigorous certification process to ensure it meets our exacting standards.
             </p>

             <div className="grid grid-cols-2 gap-8 border-t border-brand-bone/10 pt-8">
                <div>
                    <h4 className="text-4xl font-display text-brand-copper mb-2">500+</h4>
                    <p className="text-xs uppercase tracking-widest text-brand-bone/40">Vehicles Delivered</p>
                </div>
                <div>
                    <h4 className="text-4xl font-display text-brand-copper mb-2">98%</h4>
                    <p className="text-xs uppercase tracking-widest text-brand-bone/40">Client Satisfaction</p>
                </div>
             </div>

             <div className="mt-12">
                <a href="#contact" className="text-brand-bone hover:text-brand-copper text-xs uppercase tracking-[0.2em] border-b border-brand-bone/20 hover:border-brand-copper pb-2 transition-all duration-300">
                    Learn More About Our Heritage
                </a>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

const TestDrive: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the email content
    const subject = `Inquiry via Manga Autos Website`;
    const body = `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`;
    
    // Open the user's email client
    window.location.href = `mailto:mohdmanga2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Show success state
    setTimeout(() => {
        setSubmitted(true);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-32 bg-brand-graphite relative">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            <div className="flex flex-col h-full">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-6xl font-display text-brand-bone mb-6">Inquire</h2>
                    <p className="text-brand-bone/60 font-light text-lg max-w-md">
                        Begin your journey. Schedule a private viewing or test drive with our specialists.
                    </p>
                </div>
                
                <div className="w-full flex-grow min-h-[300px] relative overflow-hidden rounded-sm border border-brand-bone/10 bg-brand-charcoal group">
                     <iframe 
                        width="100%" 
                        height="100%" 
                        title="Manga Autos Location" 
                        className="absolute inset-0 w-full h-full grayscale contrast-125 opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src="https://maps.google.com/maps?q=No%2034,%20Shehu%20Shagari%20Way,%20Maitama,%20Abuja,%20Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
                     ></iframe>
                     
                     <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/90 to-transparent w-full pointer-events-none">
                        <div className="flex items-center gap-3 text-brand-bone">
                            <MapPin className="w-4 h-4 text-brand-copper" />
                            <p className="text-xs uppercase tracking-widest">Maitama, Abuja</p>
                        </div>
                     </div>
                     <div className="absolute inset-0 pointer-events-none border border-brand-bone/10 group-hover:border-brand-copper/30 transition-colors duration-500"></div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex flex-col justify-center"
            >
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="space-y-8">
                                <div className="group relative">
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        value={formState.name}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-brand-bone/20 py-4 text-brand-bone placeholder-brand-bone/20 focus:outline-none focus:border-brand-copper transition-colors duration-500 font-light text-lg"
                                        placeholder="Name"
                                    />
                                </div>
                                <div className="group relative">
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        value={formState.email}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-brand-bone/20 py-4 text-brand-bone placeholder-brand-bone/20 focus:outline-none focus:border-brand-copper transition-colors duration-500 font-light text-lg"
                                        placeholder="Email Address"
                                    />
                                </div>
                                <div className="group relative">
                                    <textarea 
                                        name="message"
                                        required
                                        rows={3}
                                        value={formState.message}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-brand-bone/20 py-4 text-brand-bone placeholder-brand-bone/20 focus:outline-none focus:border-brand-copper transition-colors duration-500 font-light text-lg resize-none"
                                        placeholder="Tell us about your request..."
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="group flex items-center space-x-4 text-brand-bone hover:text-brand-copper transition-colors duration-500"
                            >
                                <span className="uppercase tracking-[0.2em] text-sm">Submit Request</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                            </button>
                        </form>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col justify-center py-12"
                        >
                            <h3 className="text-3xl font-display text-brand-bone mb-4">Inquiry Initiated.</h3>
                            <p className="text-brand-bone/60 font-light">
                                Your email client has been opened to complete the request. We look forward to hearing from you.
                            </p>
                            <button 
                                onClick={() => setSubmitted(false)}
                                className="mt-8 text-xs uppercase tracking-widest text-brand-copper hover:text-brand-bone transition-colors"
                            >
                                Send another inquiry
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestDrive;
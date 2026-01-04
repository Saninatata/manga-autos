import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, Wrench } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    id: 1,
    title: 'Verified Provenance',
    description: 'Every chassis history is meticulously traced and certified by our heritage experts.',
    icon: <ShieldCheck size={24} strokeWidth={1} />
  },
  {
    id: 2,
    title: 'Concierge Delivery',
    description: 'White-glove transport to your residence, ensuring your vehicle arrives pristine.',
    icon: <Truck size={24} strokeWidth={1} />
  },
  {
    id: 3,
    title: 'Bespoke Finance',
    description: 'Private banking partnerships designed to facilitate seamless acquisition.',
    icon: <CreditCard size={24} strokeWidth={1} />
  },
  {
    id: 4,
    title: 'Lifetime Service',
    description: 'Access to our master technicians and global service network.',
    icon: <Wrench size={24} strokeWidth={1} />
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-brand-charcoal relative border-t border-brand-bone/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group"
            >
              <div className="text-brand-copper mb-6 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-display text-brand-bone mb-3">
                {feature.title}
              </h3>
              <p className="text-brand-bone/50 text-sm font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
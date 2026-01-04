import React, { useRef } from 'react';
import { Instagram, MessageCircle, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Throttling via requestAnimationFrame for performance
    if (requestRef.current) return;
    
    // Capture event data safely
    const { clientX, clientY } = e;

    requestRef.current = requestAnimationFrame(() => {
        if (containerRef.current && maskRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            const gradient = `radial-gradient(circle 400px at ${x}px ${y}px, black 0%, transparent 100%)`;
            
            maskRef.current.style.webkitMaskImage = gradient;
            maskRef.current.style.maskImage = gradient;
        }
        requestRef.current = undefined;
    });
  };

  const socialLinks = [
    { 
      name: 'Instagram',
      icon: <Instagram size={20} strokeWidth={1.5} />, 
      href: 'https://www.instagram.com/manga_automobiles' 
    },
    { 
      name: 'WhatsApp',
      icon: <MessageCircle size={20} strokeWidth={1.5} />, 
      href: 'https://api.whatsapp.com/message/6P2MDTWJRXRGI1?autoload=1&app_absent=0&fbclid=PAT01DUAPErANleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafRQgJVcBoe3erg3EBUa9ZXXzDteFKDob2N76bWVSBX3PwbiNmQzVxqB6MYVg_aem_kAj0AjJ_boZBPKZPGC9ElQ' 
    }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative bg-brand-charcoal pt-32 pb-12 overflow-hidden border-t border-brand-bone/5"
    >
      {/* Background Text Layer (Base - Faintly Visible) */}
      <div className="absolute bottom-[-2%] left-0 w-full flex justify-center pointer-events-none select-none z-0">
         <h1 
            className="text-[23vw] leading-[0.75] font-display font-black text-brand-bone/[0.03] uppercase tracking-tighter"
         >
           MANGA
         </h1>
      </div>

      {/* Background Text Layer (Illuminated Reveal - Brighter) */}
      <div 
        ref={maskRef}
        className="absolute bottom-[-2%] left-0 w-full flex justify-center pointer-events-none select-none z-10 transition-opacity duration-200"
        style={{
            WebkitMaskImage: 'radial-gradient(circle 400px at 50% 50%, black 0%, transparent 100%)',
            maskImage: 'radial-gradient(circle 400px at 50% 50%, black 0%, transparent 100%)',
        }}
      >
         {/* Increased brightness here (text-brand-bone/30) to make it less "deep" */}
         <h1 className="text-[23vw] leading-[0.75] font-display font-black text-brand-bone/30 uppercase tracking-tighter drop-shadow-2xl">
           MANGA
         </h1>
      </div>

      <div className="relative z-20 container mx-auto px-6 md:px-12 h-full flex flex-col justify-between min-h-[400px]">
        
        {/* Top Navigation Links - Functional */}
        <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-6 md:gap-12 mb-20 md:mb-32">
             <a href="#inventory" onClick={(e) => handleScroll(e, '#inventory')} className="text-[11px] font-bold uppercase tracking-widest text-brand-bone hover:text-brand-copper transition-colors cursor-pointer">Collection</a>
             <a href="#about" onClick={(e) => handleScroll(e, '#about')} className="text-[11px] font-bold uppercase tracking-widest text-brand-bone hover:text-brand-copper transition-colors cursor-pointer">The Brand</a>
             <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="text-[11px] font-bold uppercase tracking-widest text-brand-bone hover:text-brand-copper transition-colors cursor-pointer">Inquire</a>
        </div>

        {/* Bottom Info Section */}
        <div className="mt-auto">
             {/* Copyright */}
             <div className="mb-6">
                 <h3 className="text-[13px] font-bold uppercase tracking-wider text-brand-bone">© {new Date().getFullYear()} MANGA AUTOS.</h3>
             </div>

             <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12">
                 
                 {/* Left Column: Legal Links & Socials */}
                 <div className="w-full max-w-xl">
                     <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10 text-[11px] font-medium uppercase tracking-wider text-brand-bone/50">
                         <a href="#" className="hover:text-brand-bone transition-colors">Privacy Policy</a>
                         <a href="#" className="hover:text-brand-bone transition-colors">Terms of Service</a>
                         <a href="#" className="hover:text-brand-bone transition-colors">Cookie Settings</a>
                     </div>
                     
                     {/* Social Icons (Instagram & WhatsApp Only) */}
                     <div className="flex items-center gap-6 text-brand-bone">
                         {socialLinks.map((social, idx) => (
                             <a 
                                key={idx} 
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-brand-copper transition-colors hover:scale-110 duration-300 flex items-center gap-2 group"
                             >
                                 {social.icon}
                                 <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:inline-block">
                                    {social.name}
                                 </span>
                             </a>
                         ))}
                     </div>
                 </div>

                 {/* Right Column: Physical Address */}
                 <div className="flex flex-col items-start xl:items-end min-w-max text-right">
                     <div className="flex flex-col items-start xl:items-end gap-1">
                        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-copper mb-2">
                            <MapPin size={12} />
                            Flagship Showroom
                        </span>
                        <address className="not-italic text-brand-bone/60 text-xs font-medium leading-relaxed uppercase tracking-wider text-left xl:text-right">
                            No 34, Shehu Shagari Way<br/>
                            Maitama, Abuja<br/>
                            Nigeria
                        </address>
                     </div>
                 </div>
             </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
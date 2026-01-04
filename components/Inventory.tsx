import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car as CarType } from '../types';
import { Sparkles, Globe, ChevronDown, Search, Cpu, Gauge, Zap } from 'lucide-react';
import { GoogleGenAI, Type, Schema } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cars: CarType[] = [
  {
    id: 1,
    brand: 'Lamborghini',
    model: 'Aventador SVJ',
    price: 550000,
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?q=75&w=800&auto=format&fit=crop', // Optimized
    engine: '6.5L V12 Naturally Aspirated',
    specs: { hp: 759, zeroToSixty: '2.8s', topSpeed: '217 mph' }
  },
  {
    id: 4,
    brand: 'Mercedes-Benz',
    model: 'C300 4MATIC',
    price: 48000,
    category: 'Sedan',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=75&w=800&auto=format&fit=crop', // Optimized
    engine: '2.0L Inline-4 Turbo',
    specs: { hp: 255, zeroToSixty: '6.0s', topSpeed: '130 mph' }
  },
  {
    id: 5,
    brand: 'BMW',
    model: 'M3 Competition',
    price: 76000,
    category: 'Sedan',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=75&w=800&auto=format&fit=crop', // Optimized
    engine: '3.0L Twin-Turbo Inline-6',
    specs: { hp: 503, zeroToSixty: '3.8s', topSpeed: '180 mph' }
  },
  {
    id: 6,
    brand: 'Toyota',
    model: 'Camry 2025',
    price: 32000,
    category: 'Sedan',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=75&w=800&auto=format&fit=crop', // Optimized
    engine: '2.5L Hybrid',
    specs: { hp: 225, zeroToSixty: '7.0s', topSpeed: '112 mph' }
  },
  {
    id: 7,
    brand: 'Tesla',
    model: 'Model S Plaid',
    price: 89990,
    category: 'Electric',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=75&w=800&auto=format&fit=crop', // Optimized
    engine: 'Tri-Motor AWD',
    specs: { hp: 1020, zeroToSixty: '1.99s', topSpeed: '200 mph' }
  },
  {
    id: 8,
    brand: 'Audi',
    model: 'R8 V10 Performance',
    price: 158600,
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1614026480418-bd11fdb9fa06?q=75&w=800&auto=format&fit=crop', // Optimized
    engine: '5.2L V10 Naturally Aspirated',
    specs: { hp: 602, zeroToSixty: '3.1s', topSpeed: '205 mph' }
  }
];

const categories = ['All', 'Sport', 'SUV', 'Sedan', 'Electric'];

type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP';

const RATES: Record<Currency, number> = {
  NGN: 1650,
  USD: 1, 
  EUR: 0.92,
  GBP: 0.79
};

const SYMBOLS: Record<Currency, string> = {
  NGN: '₦',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

// Fallback images based on category - Optimized
const FALLBACK_IMAGES: Record<string, string> = {
    'Sport': 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81d?q=75&w=800&auto=format&fit=crop', 
    'SUV': 'https://images.unsplash.com/photo-1633512217163-54f3d2f913d8?q=75&w=800&auto=format&fit=crop', 
    'Sedan': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=75&w=800&auto=format&fit=crop', 
    'Electric': 'https://images.unsplash.com/photo-1594535182308-8ff240fde6a6?q=75&w=800&auto=format&fit=crop', 
    'Default': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=75&w=800&auto=format&fit=crop' 
};

const Inventory: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  
  // AI States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiCarResult, setAiCarResult] = useState<CarType | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Schema for Gemini Text Response
  const carSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      brand: { type: Type.STRING, description: "Car brand (e.g. BMW)" },
      model: { type: Type.STRING, description: "Car model (e.g. M5 CS)" },
      price: { type: Type.NUMBER, description: "Approximate market price in USD" },
      category: { type: Type.STRING, enum: ["Sport", "SUV", "Sedan", "Electric"] },
      engine: { type: Type.STRING, description: "Engine type (e.g. 4.4L V8 Twin-Turbo)" },
      specs: {
        type: Type.OBJECT,
        properties: {
          hp: { type: Type.NUMBER },
          zeroToSixty: { type: Type.STRING, description: "0-60 mph time (e.g. 2.9s)" },
          topSpeed: { type: Type.STRING, description: "Top speed (e.g. 190 mph)" }
        }
      }
    },
    required: ["brand", "model", "price", "category", "specs", "engine"]
  };

  // Debounced Search Handler
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!searchQuery || searchQuery.length < 3) {
      setAiCarResult(null);
      setIsAiLoading(false);
      return;
    }

    // Check if we already have a local match to avoid unnecessary API calls
    const localMatch = cars.some(car => 
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setIsAiLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
        let fetchedData: any = null;
        let fetchedImage: string | null = null;

        try {
            // 1. Fetch Text Data (Specs)
            const textResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate technical specifications and price for a car matching: "${searchQuery}". Ensure accurate, realistic data for a luxury dealership context.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: carSchema,
                    temperature: 0.3
                }
            });

            fetchedData = JSON.parse(textResponse.text || '{}');
            
            // 2. Fetch Image (Visual) - Only if we identified a car
            if (fetchedData && fetchedData.brand) {
                try {
                    const imageResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash-image',
                        contents: `Cinematic, photorealistic studio shot of a ${fetchedData.brand} ${fetchedData.model}, front 3/4 angle, dark luxurious atmosphere, rim lighting, 8k resolution, highly detailed car photography.`,
                        config: {
                           imageConfig: {
                              aspectRatio: "4:3",
                           },
                        }
                    });

                    // Extract Image
                    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
                        if (part.inlineData) {
                            fetchedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                            break;
                        }
                    }
                } catch (imgError) {
                    console.warn("Image generation failed, using fallback", imgError);
                }

                // Determine final image (Generated > Category Fallback > Default)
                const finalImage = fetchedImage || FALLBACK_IMAGES[fetchedData.category] || FALLBACK_IMAGES.Default;

                setAiCarResult({
                    id: 9999 + Math.floor(Math.random() * 1000), // Random ID
                    ...fetchedData,
                    image: finalImage
                });
            }
        } catch (error) {
            console.error("AI Search Error:", error);
        } finally {
            setIsAiLoading(false);
        }
    }, 1200); // 1.2s debounce

    return () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);


  // Determine what to display
  let displayCars = [...cars];

  if (searchQuery) {
     const localMatches = cars.filter(car => 
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
     );
     
     if (aiCarResult) {
        // Dedup: Don't show AI result if it looks exactly like a local match
        const isDuplicate = localMatches.some(c => c.model === aiCarResult.model && c.brand === aiCarResult.brand);
        if (!isDuplicate) {
            displayCars = [aiCarResult, ...localMatches];
        } else {
            displayCars = localMatches;
        }
     } else {
         displayCars = localMatches;
     }
  } else {
      // Normal category filtering
      displayCars = filter === 'All' 
        ? cars 
        : cars.filter(car => car.category === filter);
  }


  const formatPrice = (price: number) => {
    const converted = price * RATES[currency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <section id="inventory" className="py-32 bg-brand-charcoal relative">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header & Controls */}
        <div className="flex flex-col xl:flex-row justify-between items-end mb-16 border-b border-brand-bone/10 pb-8 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full xl:w-auto"
          >
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-brand-copper animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-copper font-medium">Manga AI Curated</span>
             </div>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-brand-bone">
              Recent Arrivals
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center w-full xl:w-auto flex-wrap">
            
            {/* Search Bar */}
            <div className="relative w-full md:w-64 group order-3 md:order-1">
                <Search className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isAiLoading ? 'text-brand-copper animate-pulse' : 'text-brand-bone/40 group-focus-within:text-brand-copper'}`} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAiLoading ? "Consulting AI Database..." : "Search any car model..."}
                    className="w-full bg-transparent border-b border-brand-bone/10 py-2 pl-8 pr-4 text-xs uppercase tracking-wider text-brand-bone placeholder-brand-bone/30 focus:outline-none focus:border-brand-copper transition-colors"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-6 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto order-1 md:order-2 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-xs uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                    filter === cat 
                      ? 'text-brand-copper border-b border-brand-copper pb-1' 
                      : 'text-brand-bone/40 hover:text-brand-bone pb-1'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <div className="relative z-30 order-2 md:order-3">
                <button 
                    onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-bone/60 hover:text-brand-copper transition-colors border border-brand-bone/10 px-4 py-2 rounded-full hover:border-brand-copper/30"
                >
                    <Globe className="w-3 h-3" />
                    <span>{currency}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${currencyMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                    {currencyMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-32 bg-brand-graphite border border-brand-bone/10 shadow-xl rounded-sm overflow-hidden"
                        >
                            {(Object.keys(RATES) as Currency[]).map((curr) => (
                                <button
                                    key={curr}
                                    onClick={() => {
                                        setCurrency(curr);
                                        setCurrencyMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider hover:bg-brand-bone/5 transition-colors ${currency === curr ? 'text-brand-copper' : 'text-brand-bone/60'}`}
                                >
                                    {curr} ({SYMBOLS[curr]})
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="min-h-[600px] relative">
            <AnimatePresence mode="wait">
                <motion.div 
                    key="grid"
                    layout
                    className="w-full"
                >
                    {displayCars.length > 0 || isAiLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                            {/* Loading Skeleton Card if AI is searching */}
                            {isAiLoading && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="border border-brand-copper/20 rounded-sm p-4 h-full flex flex-col justify-center items-center bg-brand-bone/5"
                                >
                                    <div className="w-8 h-8 border-2 border-brand-copper border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-[10px] uppercase tracking-widest text-brand-copper animate-pulse">Generating Visualization...</p>
                                </motion.div>
                            )}

                            <AnimatePresence mode="popLayout">
                                {displayCars.map((car) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    key={car.id}
                                    className="group cursor-pointer hover:-translate-y-2 transition-transform duration-500 ease-out"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-brand-graphite shadow-sm group-hover:shadow-[0_20px_40px_-15px_rgba(207,167,138,0.25)] transition-all duration-700 ease-out border border-transparent group-hover:border-brand-copper/30 rounded-sm">
                                        <motion.img 
                                            src={car.image} 
                                            alt={car.model} 
                                            loading="lazy"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                const fallback = FALLBACK_IMAGES[car.category] || FALLBACK_IMAGES.Default;
                                                if (target.src !== fallback) {
                                                    target.src = fallback;
                                                }
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                        />
                                        
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                                        {/* Dynamic Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {car.id > 9990 && (
                                                <div className="bg-brand-charcoal/90 backdrop-blur-md border border-brand-copper/30 px-3 py-1 rounded-full transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                                    <span className="text-[9px] uppercase tracking-widest text-brand-copper flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" /> AI GENERATED
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Specs Overlay (Visible on Hover) */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-black/60 backdrop-blur-sm border-t border-brand-bone/10">
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <Zap className="w-3 h-3 text-brand-copper mx-auto mb-1" />
                                                    <span className="block text-[10px] text-brand-bone/60">{car.specs.hp} HP</span>
                                                </div>
                                                <div>
                                                    <Gauge className="w-3 h-3 text-brand-copper mx-auto mb-1" />
                                                    <span className="block text-[10px] text-brand-bone/60">{car.specs.zeroToSixty}</span>
                                                </div>
                                                <div>
                                                    <Cpu className="w-3 h-3 text-brand-copper mx-auto mb-1" />
                                                    <span className="block text-[10px] text-brand-bone/60">{car.specs.topSpeed}</span>
                                                </div>
                                            </div>
                                            {car.engine && (
                                                <div className="mt-4 pt-4 border-t border-brand-bone/10 text-center">
                                                    <span className="text-[10px] uppercase tracking-widest text-brand-copper">{car.engine}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex justify-between items-start border-t border-brand-bone/10 pt-4 group-hover:border-brand-copper/50 transition-colors duration-500 px-1">
                                    <div>
                                        <h3 className="text-brand-bone/60 text-xs uppercase tracking-widest mb-1">{car.brand}</h3>
                                        <h2 className="text-xl md:text-2xl font-display text-brand-bone group-hover:text-white transition-colors">{car.model}</h2>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-brand-copper font-light tracking-wide mt-1 text-sm md:text-base group-hover:text-brand-copperLight group-hover:drop-shadow-[0_0_8px_rgba(207,167,138,0.5)] group-hover:scale-105 origin-right transition-all duration-500">
                                            {formatPrice(car.price)}
                                        </span>
                                        <span className="text-[10px] text-brand-bone/30 uppercase tracking-wider">Est. Price</span>
                                    </div>
                                    </div>
                                </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 border border-brand-bone/5 bg-brand-bone/5 rounded-sm"
                        >
                            <Search className="w-12 h-12 text-brand-bone/20 mb-4" />
                            <p className="text-brand-bone/50 text-sm uppercase tracking-widest mb-6">Start typing to search global database...</p>
                            <button 
                                onClick={() => {setFilter('All'); setSearchQuery('');}} 
                                className="text-brand-copper text-xs uppercase tracking-[0.2em] border-b border-brand-copper/50 hover:border-brand-copper pb-1 transition-all"
                            >
                                View Full Collection
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
        
        {/* Disclaimer Note */}
        <div className="mt-12 flex justify-center">
             <p className="text-[11px] text-brand-bone/40 italic text-center max-w-xl leading-relaxed">
                 * Caution: The prices displayed are estimates and may fluctuate above or below the listed figures depending on market conditions, timing, and availability. Please contact us for real-time pricing.
             </p>
        </div>

        <div className="mt-16 text-center">
            <a href="https://www.instagram.com/manga_automobiles" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-bone/60 hover:text-brand-copper transition-colors duration-300">
                <span>View Full Feed</span>
                <Globe className="w-3 h-3" />
            </a>
        </div>
      </div>
    </section>
  );
};

export default Inventory;
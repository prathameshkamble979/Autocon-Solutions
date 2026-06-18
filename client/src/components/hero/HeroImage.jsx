import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDER_IMAGES = [
  "/images/industrial-conveyor-3.jpg",
  "/images/hero_conveyor_1773902700148.png",
  "/images/industrial-conveyor-2.jpg"
];

const HeroImage = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % SLIDER_IMAGES.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-[2rem] overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.5)] group w-full h-[400px] lg:h-[600px] mt-6 lg:mt-0"
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
            {/* Images stacked — AnimatePresence fades cleanly one at a time */}
            <AnimatePresence mode="sync">
                <motion.img
                    key={current}
                    src={SLIDER_IMAGES[current]}
                    alt={`Industrial Conveyor Facility ${current + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Bottom gradient for blending into dark background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent z-10 pointer-events-none" />

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {SLIDER_IMAGES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-amber-400 w-5' : 'w-2 bg-white/40'}`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default HeroImage;

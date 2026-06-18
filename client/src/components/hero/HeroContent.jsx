import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const CATEGORIES = [
    "Belt", "Roller", "Chain", "Slat", "Modular", "Spiral", "Wiremesh"
];

const TRUST_INDICATORS = [
    "Custom Design",
    "Pan-India Service",
    "Reliable Performance"
];

const HeroContent = () => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="flex flex-col justify-center h-full pt-2 lg:pt-0"
        >
            {/* Category Chips */}
            <motion.div
                variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                }}
                className="flex flex-wrap gap-2 mb-6 max-w-[90%]"
            >
                {CATEGORIES.map(tag => (
                    <span
                        key={tag}
                        className="px-4 py-1.5 bg-[#111827] border border-white/10 hover:border-[#f97316] text-white/80 hover:text-white text-xs font-semibold rounded-full tracking-wider uppercase transition-colors cursor-default"
                    >
                        {tag}
                    </span>
                ))}
            </motion.div>

            {/* Main Heading */}
            <motion.h1
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                className="text-white text-5xl md:text-6xl lg:text-[4.5rem] font-bold mb-6 leading-[1.1] tracking-tight"
            >
                Engineering Excellence <br />
                in Industrial <br />
                <span className="text-[#f97316]">Conveyor Systems</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                className="mb-8 text-lg lg:text-xl max-w-[540px] text-slate-300 leading-relaxed font-medium"
            >
                Custom-built conveyor solutions designed for performance, durability, and efficiency.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
            >
                <Link
                    to="/contact"
                    className="group px-8 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                    Get a Quote
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                    to="/products"
                    className="px-8 py-3.5 border border-slate-500 hover:border-[#f97316] text-white font-bold rounded-lg transition-all duration-300 hover:bg-[#f97316]/5 hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                    View Products
                </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } }
                }}
                className="flex flex-col sm:flex-row gap-y-3 gap-x-6 border-t border-white/10 pt-6 mt-auto"
            >
                {TRUST_INDICATORS.map(indicator => (
                    <div key={indicator} className="flex items-center gap-2 text-slate-300">
                        <div className="bg-[#f97316]/20 p-1 rounded-full">
                            <Check size={14} className="text-[#f97316] font-bold" />
                        </div>
                        <span className="text-sm font-semibold tracking-wide">{indicator}</span>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default HeroContent;

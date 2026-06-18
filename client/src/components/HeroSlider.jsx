import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Move, Layers, Zap, Settings2 } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { tenant } from '../config';
import { getFeaturedProducts } from '../utils/api';

const STATS = [
    { value: "500+", label: "Projects Delivered" },
    { value: "11", label: "Conveyor Types" },
    { value: "15+", label: "Years Experience" },
    { value: "50+", label: "Industries Served" },
];

const HeroSlider = () => {    const [slides, setSlides] = useState([]);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data } = await getFeaturedProducts();
                setSlides(data);
            } catch (error) {
                console.error('Error fetching hero slides:', error);
            }
        };
        fetchSlides();
    }, []);

    // Prevent rendering Swiper until we have slides, or we can use a fallback
    // if (!slides.length) return null; // Or show loading

    return (
        <section className="relative min-h-[calc(100vh-80px)] bg-slate-950 overflow-hidden flex flex-col justify-center">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black z-0"></div>
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,200,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,200,0,0.05)_1px,transparent_1px)] bg-[size:60px_60px] z-0"></div>

            {/* Yellow accent bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 via-amber-500 to-transparent z-10"></div>

            <div className="container mx-auto px-4 md:px-6 z-10 w-full py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-5 text-white"
                        >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 mb-6 border border-amber-500/30 bg-amber-500/10 rounded-full backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            <span className="text-amber-400 font-semibold tracking-wide uppercase text-[10px] md:text-xs">Conveyor System Specialists</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold leading-tight mb-4">
                            Industrial <span className="text-transparent uppercase bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Conveyor</span>
                            <br />
                            <span className="text-amber-500 uppercase">Systems</span>
                            <br />
                            <span className="text-slate-300 uppercase text-2xl md:text-3xl font-bold">& Automation Solutions</span>
                        </h1>

                        <p className="text-base md:text-lg text-slate-400 mb-6 max-w-lg leading-relaxed">
                            India's trusted manufacturer of <span className="text-amber-400 font-semibold">industrial conveyor systems</span>. 
                            Belt, Roller, Chain, Screw and 7 more conveyor types — precision-built for your industry.
                        </p>

                        {/* Quick Conveyor Type Chips */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {['Belt', 'Roller', 'Chain', 'Screw', 'Spiral', 'Slat', '+5 more'].map((type) => (
                                <span key={type} className="px-3 py-1 bg-slate-800/80 border border-slate-600/50 text-slate-300 text-xs font-medium rounded-full">
                                    {type}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link
                                to="/products"
                                className="group flex items-center justify-center space-x-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/40 hover:-translate-y-1"
                            >
                                <span>Explore Conveyors</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/contact"
                                className="flex items-center justify-center space-x-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 text-white rounded-xl font-bold transition-all backdrop-blur-sm"
                            >
                                <span>Request Quote</span>
                                <ChevronRight size={20} />
                            </Link>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800">
                            {STATS.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-xl md:text-2xl font-extrabold text-amber-400">{stat.value}</div>
                                    <div className="text-xs text-slate-500 mt-1 leading-tight">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Content - Slider */}
                    <div className="lg:col-span-7 w-full relative">
                        <div className="h-[480px] md:h-[620px] w-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900 group">
                            <Swiper
                                modules={[Autoplay, Pagination, EffectFade]}
                                spaceBetween={0}
                                effect={'fade'}
                                speed={1200}
                                autoplay={{ delay: 4500, disableOnInteraction: false }}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                loop={true}
                                className="h-full w-full"
                            >
                                {slides.map((slide, i) => (
                                    <SwiperSlide key={slide._id || i} className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent z-10" />

                                        <img
                                            src={slide.image || (slide.images && slide.images[0]) || '/images/bright_blue_roller_conveyor_1774170831815.png'}
                                            alt={slide.name}
                                            className="w-full h-full object-cover object-[center_bottom] transition-transform duration-[10s] ease-linear scale-100 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/bright_blue_roller_conveyor_1774170831815.png';
                                            }}
                                        />

                                        <div className="absolute bottom-12 md:bottom-20 left-0 right-0 px-6 md:px-10 z-20">
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-slate-950/40 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 inline-block max-w-[90%]"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                                                        {slide.category || "Featured"}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                                                    {slide.name}
                                                </h3>
                                                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                                                    {slide.shortDesc || slide.description || 'Precision engineered industrial solutions.'}
                                                </p>
                                                <Link
                                                    to={`/product/${slide.slug}`}
                                                    className="inline-flex items-center text-amber-400 hover:text-amber-300 font-bold transition-colors text-sm group/btn"
                                                >
                                                    Learn More <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Feature pills below slider */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            {[
                                { icon: Move, label: "Material Handling" },
                                { icon: Zap, label: "High Speed" },
                                { icon: Settings2, label: "Custom Built" },
                                { icon: Layers, label: "Modular Design" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
                                    <item.icon size={14} className="text-amber-400 flex-shrink-0" />
                                    <span className="text-slate-400 text-xs font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSlider;


import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

const cases = [
    {
        id: 1,
        title: "Automated Assembly Line",
        client: "AutoParts Mfg Pvt Ltd",
        desc: "Designed and installed a fully automated conveyor assembly line with 6 workstations.",
        image: "/images/hero_conveyor_1773902700148.png",
        results: ["30% Efficiency Boost", "Zero Downtime", "ISO Compliant"],
        category: "Automation"
    },
    {
        id: 2,
        title: "Pharmaceutical Conveyor",
        client: "MedLife Sciences",
        desc: "Stainless steel food-grade belt conveyor system for cleanroom packaging.",
        image: "/images/hero_conveyor_1773902700148.png",
        results: ["FDA Approved Material", "Hygienic Design", "High Speed"],
        category: "Conveyor"
    },
    {
        id: 3,
        title: "Heavy Duty Machine Frame",
        client: "TechMech Solutions",
        desc: "Custom aluminum profile structure for a 5-ton CNC milling machine enclosure.",
        image: "/images/hero_conveyor_1773902700148.png",
        results: ["Vibration Damping", "Modular Setup", "Safety Interlocks"],
        category: "Structure"
    }
];

const CaseStudies = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black z-0"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div className="max-w-2xl">
                        <div className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">Success Stories</div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                            Proven Results in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Action</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            See how we've helped industry leaders optimize their production.
                        </p>
                    </div>
                    <a href="/projects" className="hidden md:flex items-center space-x-2 text-white border-b border-blue-500 pb-1 hover:text-blue-400 transition-colors">
                        <span>View All Projects</span>
                        <ArrowRight size={20} />
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image Section */}
                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 group">
                        <AnimatePresence mode='wait'>
                            <motion.img
                                key={cases[activeIndex].image}
                                src={cases[activeIndex].image}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>

                        {/* Overlay Card */}
                        <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-6 rounded-xl border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-400 text-sm font-bold uppercase">{cases[activeIndex].category}</span>
                                <span className="text-slate-400 text-xs">{cases[activeIndex].client}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{cases[activeIndex].title}</h3>
                            <p className="text-slate-300 text-sm line-clamp-2">{cases[activeIndex].desc}</p>
                        </div>
                    </div>

                    {/* Content / Selector */}
                    <div className="space-y-6">
                        {cases.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => setActiveIndex(index)}
                                className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${index === activeIndex
                                        ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-900/20'
                                        : 'bg-transparent border-slate-700 hover:bg-slate-800'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className={`text-xl font-bold mb-2 ${index === activeIndex ? 'text-blue-400' : 'text-white'}`}>
                                        {item.title}
                                    </h4>
                                    {index === activeIndex && <motion.div layoutId="active-indicator" className="w-2 h-2 rounded-full bg-blue-500" />}
                                </div>

                                {index === activeIndex && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4"
                                    >
                                        <div className="flex flex-wrap gap-3">
                                            {item.results.map((res, i) => (
                                                <span key={i} className="flex items-center space-x-1 text-sm text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                                    <CheckCircle size={14} className="text-emerald-400" />
                                                    <span>{res}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center md:hidden">
                    <a href="/projects" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors font-bold">
                        <span>View All Projects</span>
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CaseStudies;


import { motion } from 'framer-motion';
import { Settings, PenTool, Package, Box, Zap, Headphones } from 'lucide-react';
import { tenant } from '../config';

const features = [
    {
        title: "Precision Engineering",
        desc: "High-tolerance component manufacturing using advanced CNC machining centers.",
        icon: Settings,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        title: "In-House Fabrication",
        desc: "Complete structural fabrication services with laser cutting and bending capabilities.",
        icon: PenTool,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        title: "Custom Conveyor Design",
        desc: "Belt, roller, and chain conveyor systems tailored to your specific layout.",
        icon: Package,
        color: "text-green-600",
        bg: "bg-green-50"
    },
    {
        title: "Machine Structures",
        desc: "Robust aluminum profile frameworks designed for stability and modularity.",
        icon: Box,
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        title: "Rapid Prototyping",
        desc: "Fast turnaround on prototypes to validate designs before mass production.",
        icon: Zap,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        title: "After Sales Support",
        desc: "Dedicated maintenance teams and spare parts availability for zero downtime.",
        icon: Headphones,
        color: "text-red-600",
        bg: "bg-red-50"
    }
];

const FeaturesSection = () => {    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(#1e40af 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            ></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-3 py-1 mb-4 border border-blue-100 bg-blue-50 rounded-full">
                        <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Why Choose {tenant.name}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        Engineering <span className="text-blue-600">Capabilities</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        We combine technical expertise with state-of-the-art manufacturing to deliver superior industrial solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;

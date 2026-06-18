import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { getFeaturedProducts } from '../utils/api';

export default function FeaturedProducts() {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await getFeaturedProducts();
                setFeatured(data);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            }
        };
        fetchFeatured();
    }, []);

    if (featured.length === 0) return null;

    return (
        <section className="py-24 bg-[#0F172A] relative overflow-hidden">
            {/* Subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(250,204,21,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(250,204,21,0.025)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-amber-400 to-transparent" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 border border-amber-500/30 bg-amber-500/10 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Featured Systems</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                            Conveyor <span className="text-amber-400">Systems</span>
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="shrink-0 inline-flex items-center gap-2 px-6 py-3 border border-slate-700 text-slate-300 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 rounded-xl font-bold transition-all"
                    >
                        View All Products <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featured.map((product, i) => (
                        <motion.div
                            key={product._id || product.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Link
                                to={`/product/${product.slug}`}
                                className="group flex flex-col bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/50 rounded-2xl overflow-hidden hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 h-full"
                            >
                                {/* Image */}
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={product.image || (product.images && product.images[0]) || '/images/hero_conveyor_1773902700148.png'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-75 group-hover:brightness-90"
                                        onError={e => { e.target.onerror = null; e.target.src = '/images/hero_conveyor_1773902700148.png'; }}
                                    />
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold rounded uppercase">Featured</span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex flex-col flex-grow p-5">
                                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                                        {product.shortDesc || product.description || 'View product for details'}
                                    </p>
                                    {/* Features list */}
                                    <ul className="space-y-1.5 mb-4">
                                        {(product.features || []).slice(0, 4).map((f, fi) => (
                                            <li key={fi} className="flex items-start gap-2 text-xs text-slate-400">
                                                <CheckCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 group-hover:text-amber-400 transition-colors mt-auto">
                                        View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

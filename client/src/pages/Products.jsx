import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Package, Search } from 'lucide-react';
import { PRODUCTS, tenant } from '../config';

const card = {
    hidden:  { opacity: 0, y: 28 },
    visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' } }),
};

const Products = () => {
    const [search, setSearch] = useState('');

    const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-[65px] pb-16">

            {/* Header */}
            <div className="relative bg-[#0f172a] text-white py-20 mb-10 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-60" />
                <div className="absolute left-0 top-0 w-1.5 h-full bg-amber-500" />
                <div className="container mx-auto px-4 md:px-8 relative">
                    {/* Breadcrumb */}
                    <div className="flex items-center text-sm text-slate-400 mb-6">
                        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-amber-400 font-semibold">Products</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                                Product Catalogue
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black mb-3 font-display uppercase">
                                Conveyor <span className="text-amber-500">Systems</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-2xl">
                                {tenant.name} manufactures custom conveyor and material handling systems for all industries.
                            </p>
                        </div>
                        <div className="relative w-full md:w-72 flex-shrink-0">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8">
                {/* Info bar */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-slate-600 font-medium">
                        Showing <span className="font-bold text-slate-900">{filtered.length}</span> product types
                    </p>
                    <span className="text-sm text-slate-500">Click a product to view details</span>
                </div>

                {/* Grid */}
                <AnimatePresence>
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((product, i) => (
                                <motion.div
                                    key={product.slug}
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    variants={card}
                                    layout
                                >
                                    <Link
                                        to={`/products/${product.slug}`}
                                        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-amber-400 transition-all duration-300 hover:-translate-y-2 h-full"
                                    >
                                        <div className="relative h-52 overflow-hidden bg-slate-200">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={e => { e.target.onerror = null; e.target.src = '/images/hero_conveyor_1773902700148.png'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold rounded uppercase tracking-wide">
                                                Conveyor
                                            </span>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors font-display">
                                                {product.name}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                                                {product.shortDesc}
                                            </p>
                                            <div className="flex items-center text-sm font-bold text-amber-600">
                                                View Details <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                            <Package className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No products found</h3>
                            <p className="text-slate-500 mb-6">Try a different search term.</p>
                            <button onClick={() => setSearch('')} className="text-amber-600 font-bold hover:underline">
                                Clear search
                            </button>
                        </div>
                    )}
                </AnimatePresence>

                {/* CTA */}
                <div className="mt-20 bg-[#0f172a] rounded-3xl p-10 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-60" />
                    <div className="relative">
                        <h2 className="text-2xl md:text-4xl font-black mb-4 font-display uppercase">
                            Need a <span className="text-amber-500">Custom Conveyor</span> Solution?
                        </h2>
                        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                            Our engineering team designs and builds conveyor systems tailored exactly to your production layout, 
                            load requirements and automation goals.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all"
                        >
                            Request a Custom Quote <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;

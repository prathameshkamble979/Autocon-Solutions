
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Search, Package, ChevronRight } from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';

// Map of subcategory slug -> display info
const SUBCATEGORY_INFO = {
    'belt-conveyors': {
        name: 'Belt Conveyor',
        desc: 'We manufacture a complete range of belt conveyors for flat transport, inclined elevation, and cleated product retention across all industries.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Belt Conveyor',
    },
    'roller-conveyors': {
        name: 'Roller Conveyor',
        desc: 'Gravity and motorized roller conveyors designed for efficient product handling in warehouses, distribution centers, and manufacturing plants.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Roller Conveyor',
    },
    'chain-conveyors': {
        name: 'Chain Conveyor',
        desc: 'Heavy-duty chain drive conveyors engineered to move heavy pallets, automotive components, and large industrial workpieces reliably.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Chain Conveyor',
    },
    'slat-conveyors': {
        name: 'Slat Conveyor',
        desc: 'Rigid steel or aluminum slat conveyors for transporting heavy, hot, or abrasive materials across production facilities.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Slat Conveyor',
    },
    'modular-conveyors': {
        name: 'Modular Belt Conveyor',
        desc: 'FDA-compliant modular plastic belt conveyors for food processing, pharmaceutical, and packaging applications requiring easy cleaning.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Modular Belt Conveyor',
    },
    'spiral-conveyors': {
        name: 'Spiral Conveyor',
        desc: 'Space-efficient vertical spiral conveyors for elevating or lowering products between floors without large horizontal footprints.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Spiral Conveyor',
    },
    'wiremesh-conveyors': {
        name: 'Wiremesh Conveyor',
        desc: 'Open stainless-steel wire mesh belt conveyors for cooling tunnels, baking ovens, drying chambers, and heat treatment processes.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Wiremesh Conveyor',
    },
    'telescopic-conveyors': {
        name: 'Telescopic Conveyor',
        desc: 'Extendable telescopic belt conveyors that retract and extend for variable-depth reach into truck bays and storage areas.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Telescopic Conveyor',
    },
    'flexible-conveyors': {
        name: 'Flexible Conveyor',
        desc: 'Laterally flexible conveyors that bend around obstacles and change direction to adapt to any floor layout without fixed infrastructure.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Flexible Conveyor',
    },
    'screw-conveyors': {
        name: 'Screw Conveyor',
        desc: 'Horizontal, inclined, and vertical screw conveyors for enclosed transport of bulk powders, grains, granules, and paste materials.',
        image: '/images/hero_conveyor_1773902700148.png',
        dbName: 'Screw Conveyor',
    },
};

// Demo products to show when DB has no entries yet (or to pad real DB entries)
const DEMO_PRODUCTS = {
    'belt-conveyors': [
        { _id: 'd1', slug: 'flat-belt-conveyor', name: 'Flat Belt Conveyor', subcategory: 'Belt Conveyor', shortDesc: 'Standard flat belt conveyor for horizontal material transport. Available in widths from 300mm to 1500mm with customizable lengths.', image: '/images/hero_belt_closeup_1774197768471.png', featured: true },
        { _id: 'd2', slug: 'inclined-belt-conveyor', name: 'Inclined Belt Conveyor', subcategory: 'Belt Conveyor', shortDesc: 'Steep angle inclined belt conveyor for elevating materials. Angles from 15° to 45° with return idlers and snub pulleys.', image: '/images/modern_blue_belt_conveyor_1774170860378.png', featured: false },
        { _id: 'd3', slug: 'cleated-belt-conveyor', name: 'Cleated Belt Conveyor', subcategory: 'Belt Conveyor', shortDesc: 'Belt conveyor with transverse cleats preventing product rollback on steep inclines. Ideal for granular and lumpy materials.', image: '/images/industrial-conveyor-1.jpg', featured: false },
        { _id: 'd4', slug: 'heavy-duty-belt-conveyor', name: 'Heavy Duty Belt Conveyor', subcategory: 'Belt Conveyor', shortDesc: 'Reinforced frame belt conveyor for loads up to 2000 kg/m. Built for quarries, mining, and heavy industrial applications.', image: '/images/hero_conveyor_1773902700148.png', featured: true },
    ],
    'roller-conveyors': [
        { _id: 'd5', slug: 'gravity-roller-conveyor', name: 'Gravity Roller Conveyor', subcategory: 'Roller Conveyor', shortDesc: 'Non-powered roller conveyor using gravity for natural product flow. Cost-effective solution for warehouses and distribution centers.', image: '/images/hero_roller_closeup_1774197786131.png', featured: true },
        { _id: 'd6', slug: 'powered-roller-conveyor', name: 'Powered Roller Conveyor', subcategory: 'Roller Conveyor', shortDesc: 'Motor-driven roller conveyor with speed control for precise product movement in assembly and packaging lines.', image: '/images/bright_blue_roller_conveyor_1774170831815.png', featured: false },
        { _id: 'd6b', slug: 'accumulation-roller-conveyor', name: 'Accumulation Roller Conveyor', subcategory: 'Roller Conveyor', shortDesc: 'Zero-pressure accumulation conveyor that keeps products queued without back-pressure damage. Ideal for fragile items.', image: '/images/roller_conveyor_1773902757204.png', featured: false },
    ],
    'chain-conveyors': [
        { _id: 'd7', slug: 'heavy-duty-chain-conveyor', name: 'Heavy Duty Chain Conveyor', subcategory: 'Chain Conveyor', shortDesc: 'Robust dual-strand chain conveyor for moving heavy loads and pallets in manufacturing and assembly facilities.', image: '/images/hero_chain_closeup_1774197804641.png', featured: true },
        { _id: 'd8', slug: 'drag-chain-conveyor', name: 'Drag Chain Conveyor', subcategory: 'Chain Conveyor', shortDesc: 'Rugged en-masse chain conveyor for handling hot, abrasive, or heavy bulk materials at temperatures up to 400°C.', image: '/images/chain_conveyor_1773902777149.png', featured: false },
        { _id: 'd8b', slug: 'pallet-chain-conveyor', name: 'Pallet Chain Conveyor', subcategory: 'Chain Conveyor', shortDesc: 'Precision pallet conveyor system with accumulation and transfer capabilities for automated assembly lines.', image: '/images/industrial-conveyor-2.jpg', featured: false },
    ],
    'slat-conveyors': [
        { _id: 'd9a', slug: 'steel-slat-conveyor', name: 'Steel Slat Conveyor', subcategory: 'Slat Conveyor', shortDesc: 'Heavy-duty steel slat conveyor for high-temperature or abrasive materials. Used in foundries, paint shops, and automotive lines.', image: '/images/bright_warehouse_conveyor_1774170894702.png', featured: true },
        { _id: 'd9b', slug: 'aluminum-slat-conveyor', name: 'Aluminium Slat Conveyor', subcategory: 'Slat Conveyor', shortDesc: 'Lightweight aluminium slat conveyor ideal for assembly lines, electronics, and light manufacturing applications.', image: '/images/logistics_massive_warehouse_1774198018974.png', featured: false },
    ],
    'modular-conveyors': [
        { _id: 'd10a', slug: 'flat-top-modular-conveyor', name: 'Flat Top Modular Belt Conveyor', subcategory: 'Modular Belt Conveyor', shortDesc: 'FDA-grade modular plastic belt conveyor for food processing and packaging. Easy to clean and sanitize between batches.', image: '/images/modular_conveyor_1773902794000.png', featured: true },
        { _id: 'd10b', slug: 'raised-rib-modular-conveyor', name: 'Raised-Rib Modular Conveyor', subcategory: 'Modular Belt Conveyor', shortDesc: 'Modular belt with raised ribs for inclined transport of bottles, cans, and small consumer products without rollback.', image: '/images/logistics_curve_conveyor_1774198000137.png', featured: false },
    ],
    'spiral-conveyors': [
        { _id: 'd11a', slug: 'spiral-belt-conveyor', name: 'Spiral Belt Conveyor', subcategory: 'Spiral Conveyor', shortDesc: 'Compact vertical spiral conveyor that elevates products between floors within a very small footprint.', image: '/images/spiral_conveyor_1773902810373.png', featured: true },
        { _id: 'd11b', slug: 'spiral-cooling-conveyor', name: 'Spiral Cooling Conveyor', subcategory: 'Spiral Conveyor', shortDesc: 'Spiral conveyor with integrated airflow for cooling baked goods, chocolates, or cooked products before packaging.', image: '/images/industrial-conveyor-3.jpg', featured: false },
    ],
    'wiremesh-conveyors': [
        { _id: 'd12a', slug: 'ss-wiremesh-conveyor', name: 'SS Wire Mesh Conveyor', subcategory: 'Wiremesh Conveyor', shortDesc: 'Stainless-steel wire mesh belt conveyor for baking ovens, cooling tunnels, and drying chambers up to 300°C.', image: '/images/hero_belt_closeup_1774197768471.png', featured: true },
        { _id: 'd12b', slug: 'balanced-weave-wiremesh', name: 'Balanced Weave Wiremesh Conveyor', subcategory: 'Wiremesh Conveyor', shortDesc: 'Balanced weave open mesh belt for heat treatment, annealing, and tempering furnace applications.', image: '/images/hero_conveyor_1773902700148.png', featured: false },
    ],
    'telescopic-conveyors': [
        { _id: 'd13a', slug: 'telescopic-belt-conveyor', name: 'Telescopic Belt Conveyor', subcategory: 'Telescopic Conveyor', shortDesc: 'Extendable belt conveyor that reaches deep into truck bays for fast loading and unloading without manual handling.', image: '/images/logistics_massive_warehouse_1774198018974.png', featured: true },
        { _id: 'd13b', slug: 'powered-telescopic-conveyor', name: 'Powered Telescopic Conveyor', subcategory: 'Telescopic Conveyor', shortDesc: 'Motorised telescopic conveyor with powered extension for heavy parcel and carton handling in logistics hubs.', image: '/images/bright_warehouse_conveyor_1774170894702.png', featured: false },
    ],
    'flexible-conveyors': [
        { _id: 'd14a', slug: 'flexible-snake-conveyor', name: 'Flexible Snake Conveyor', subcategory: 'Flexible Conveyor', shortDesc: 'Laterally flexible roller conveyor that bends around obstacles and adapts to any floor layout on the fly.', image: '/images/logistics_curve_conveyor_1774198000137.png', featured: true },
        { _id: 'd14b', slug: 'extendable-flexible-conveyor', name: 'Extendable Flexible Belt Conveyor', subcategory: 'Flexible Conveyor', shortDesc: 'Accordion-style belt conveyor that extends and flexes for efficient loading dock and baggage handling operations.', image: '/images/logistics_sorting_conveyor_1774198038572.png', featured: false },
    ],
    'screw-conveyors': [
        { _id: 'd15', slug: 'horizontal-screw-conveyor', name: 'Horizontal Screw Conveyor', subcategory: 'Screw Conveyor', shortDesc: 'Horizontal helical screw conveyor for bulk material transfer in food, chemical, and agricultural industries.', image: '/images/industrial-conveyor-1.jpg', featured: true },
        { _id: 'd16', slug: 'inclined-screw-conveyor', name: 'Inclined Screw Conveyor', subcategory: 'Screw Conveyor', shortDesc: 'Inclined tube screw conveyor for elevating powders and granules at angles up to 45 degrees.', image: '/images/modern_blue_belt_conveyor_1774170860378.png', featured: false },
        { _id: 'd16b', slug: 'vertical-screw-conveyor', name: 'Vertical Screw Conveyor', subcategory: 'Screw Conveyor', shortDesc: 'High-speed vertical screw conveyor for moving bulk powders and grains straight up to overhead hoppers or silos.', image: '/images/bright_blue_roller_conveyor_1774170831815.png', featured: false },
    ],
};


const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
    }),
};

const SubcategoryPage = () => {
    const { subcategory } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const info = SUBCATEGORY_INFO[subcategory];

    useEffect(() => {
        if (!info) {
            navigate('/products');
            return;
        }
        fetchProducts();
        window.scrollTo(0, 0);
    }, [subcategory]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const fetchPromise = api.get(`/products?subcategory=${encodeURIComponent(info.dbName)}`);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), 5000)
            );
            const res = await Promise.race([fetchPromise, timeoutPromise]);
            
            // Extract array safely regardless of whether the interceptor executed
            let dbItems = [];
            if (res && res.data) {
                if (Array.isArray(res.data)) {
                    dbItems = res.data;
                } else if (Array.isArray(res.data.data)) {
                    dbItems = res.data.data;
                }
            }

            // Merge: DB products come first, then fill in demo products the DB is missing
            const demoFallback = DEMO_PRODUCTS[subcategory] || [];
            
            // Merge and deduplicate by name (case-insensitive)
            const dbNames = new Set(dbItems.map(p => (p.name || '').toLowerCase()));
            const extraDemo = demoFallback.filter(p => !dbNames.has((p.name || '').toLowerCase()));
            
            const merged = [...dbItems, ...extraDemo];
            setProducts(merged.length > 0 ? merged : demoFallback);
        } catch (err) {
            console.error("Error fetching subcategory products", err);
            // On timeout or network error fall back to demo immediately
            setProducts(DEMO_PRODUCTS[subcategory] || []);
        } finally {
            setLoading(false);
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(search.toLowerCase())
    );

    if (!info) return null;

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-12">
            {/* Hero Header */}
            <div className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={info.image}
                        alt={info.name}
                        className="w-full h-full object-cover opacity-20"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,200,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,200,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute left-0 top-0 w-1 h-full bg-amber-400"></div>

                <div className="container mx-auto px-4 md:px-6 py-16 relative">
                    {/* Breadcrumb */}
                    <nav className="flex items-center text-sm text-slate-400 mb-6">
                        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
                        <ChevronRight size={14} className="mx-2" />
                        <Link to="/products" className="hover:text-amber-400 transition-colors">Products</Link>
                        <ChevronRight size={14} className="mx-2" />
                        <span className="text-amber-400 font-semibold">{info.name}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Conveyor Systems</span>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{info.name}</h1>
                            <p className="text-slate-400 text-lg max-w-2xl">{info.desc}</p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => navigate('/products')}
                                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                            >
                                <ArrowLeft size={16} /> All Types
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg transition-colors text-sm font-bold"
                            >
                                Request Quote
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 mt-8">
                {/* Search + info bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <p className="text-slate-600">
                        {loading ? (
                            <span className="animate-pulse bg-slate-200 text-transparent rounded px-2">Loading</span>
                        ) : (
                            <span className="font-bold text-slate-900">{filtered.length}</span>
                        )}
                        {' '}products in {info.name}
                    </p>
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none shadow-sm"
                        />
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="bg-white rounded-2xl h-96 animate-pulse border border-slate-100 overflow-hidden">
                                <div className="h-52 bg-slate-200"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product._id}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                            >
                                <Link
                                    to={`/product/${product.slug || product._id}`}
                                    className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1.5 h-full"
                                >
                                    <div className="relative h-52 overflow-hidden bg-slate-200">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/hero_conveyor_1773902700148.png';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                        {product.featured && (
                                            <div className="absolute top-3 left-3">
                                                <span className="px-2 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold rounded uppercase">Featured</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                                                {product.subcategory || info.name}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                                            {product.shortDesc}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">
                                                <span>View Details</span>
                                                <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            <button
                                                onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                                                className="text-xs text-slate-500 hover:text-amber-600 font-medium transition-colors border border-slate-200 hover:border-amber-300 px-3 py-1 rounded-lg"
                                            >
                                                Quote
                                            </button>
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
                        <p className="text-slate-500 mb-6">Try a different search term or browse all conveyor types.</p>
                        <Link to="/products" className="text-amber-600 font-bold hover:underline">Browse All Conveyor Types</Link>
                    </div>
                )}

                {/* Quote CTA */}
                <div className="mt-16 bg-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-white">
                        <h3 className="text-xl font-bold mb-2">Need a custom {info.name}?</h3>
                        <p className="text-slate-400 text-sm">Our engineers will design and build a conveyor to your exact specifications.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all"
                    >
                        Request Custom Quote <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <EnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialProduct={info.name}
            />
        </div>
    );
};

export default SubcategoryPage;

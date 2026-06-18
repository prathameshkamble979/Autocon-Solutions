
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getProductBySlug } from '../utils/api';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, Share2, Printer, FileText, Settings, Layers, Box, FileDown } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProductBrochure from '../components/ProductBrochure';
import EnquiryModal from '../components/EnquiryModal';
import { tenant } from '../config';

const CONVEYOR_SLUG_TO_SUBCATEGORY = {
    'flat-belt-conveyor': 'belt-conveyor',
    'inclined-belt-conveyor': 'belt-conveyor',
    'cleated-belt-conveyor': 'belt-conveyor',
    'heavy-duty-belt-conveyor': 'belt-conveyor',
    'gravity-roller-conveyor': 'roller-conveyor',
    'powered-roller-conveyor': 'roller-conveyor',
    'heavy-duty-chain-conveyor': 'chain-conveyor',
    'pallet-chain-conveyor': 'chain-conveyor',
    'horizontal-screw-conveyor': 'screw-conveyor',
    'inclined-screw-conveyor': 'screw-conveyor',
};

const DEMO_PRODUCTS_MAP = {
    'flat-belt-conveyor': { _id: 'd1', slug: 'flat-belt-conveyor', name: 'Flat Belt Conveyor', category: 'Conveyors', subcategory: 'Belt Conveyor', shortDesc: 'Standard flat belt conveyor for horizontal material transport. Available in widths from 300mm to 1500mm with customizable lengths.', image: '/images/hero_belt_closeup_1774197768471.png', images: ['/images/hero_belt_closeup_1774197768471.png', '/images/industrial-conveyor-1.jpg'], features: ['Heavy-duty steel frame construction', 'PVC / Rubber / PU belt options', 'Variable speed drive control', 'Emergency stop systems', 'Side guides and end stops', 'Custom width and length'], specifications: [{ label: 'Belt Width', value: '300mm – 1500mm' }, { label: 'Belt Speed', value: '0.1 – 3.0 m/s (adjustable)' }, { label: 'Load Capacity', value: 'Up to 500 kg/m' }, { label: 'Frame Material', value: 'Mild Steel / Stainless Steel' }, { label: 'Drive', value: 'Motorized Pulley / Gearmotor' }, { label: 'Voltage', value: '415V / 3-Phase / 50Hz' }], applications: ['Warehouse Automation', 'Packaging Lines', 'Food Processing', 'Logistics & Distribution', 'Manufacturing Assembly'] },
    'inclined-belt-conveyor': { _id: 'd2', slug: 'inclined-belt-conveyor', name: 'Inclined Belt Conveyor', category: 'Conveyors', subcategory: 'Belt Conveyor', shortDesc: 'Steep angle inclined belt conveyor for elevating materials between floors or process levels. Angles from 15° to 45°.', image: '/images/modern_blue_belt_conveyor_1774170860378.png', images: ['/images/modern_blue_belt_conveyor_1774170860378.png'], features: ['Adjustable inclination angles 15–45°', 'Cleated belt options for steep angles', 'Return idler and snub pulley system', 'Anti-rollback device', 'Configurable discharge height'], specifications: [{ label: 'Inclination', value: '15° to 45°' }, { label: 'Belt Width', value: '400mm – 1200mm' }, { label: 'Lift Height', value: 'Up to 8 meters' }, { label: 'Material', value: 'MS Frame / SS optional' }], applications: ['Material Elevation', 'Mining & Quarrying', 'Grain Handling', 'Construction Materials'] },
    'gravity-roller-conveyor': { _id: 'd5', slug: 'gravity-roller-conveyor', name: 'Gravity Roller Conveyor', category: 'Conveyors', subcategory: 'Roller Conveyor', shortDesc: 'Non-powered gravity roller conveyor for cost-effective product flow in warehouses, sorting areas, and pick-and-pack stations.', image: '/images/hero_roller_closeup_1774197786131.png', images: ['/images/hero_roller_closeup_1774197786131.png', '/images/roller_conveyor_1773902757204.png'], features: ['No motor required — gravity driven', 'Adjustable inclination legs', 'Steel or galvanized roller options', 'Custom roller pitch (span)', 'Modular sections for easy expansion'], specifications: [{ label: 'Roller Diameter', value: '50mm / 60mm / 76mm' }, { label: 'Roller Material', value: 'Mild Steel / Galvanized / SS' }, { label: 'Frame Width', value: '300mm – 900mm' }, { label: 'Roller Pitch', value: '75mm – 300mm (adjustable)' }], applications: ['Warehouse Sortation', 'Retail Distribution', 'Assembly Staging', 'Packing Stations'] },
    'heavy-duty-chain-conveyor': { _id: 'd7', slug: 'heavy-duty-chain-conveyor', name: 'Heavy Duty Chain Conveyor', category: 'Conveyors', subcategory: 'Chain Conveyor', shortDesc: 'Dual-strand heavy duty chain conveyor for transporting pallets, engine blocks, and heavy industrial components up to 5000 kg.', image: '/images/hero_chain_closeup_1774197804641.png', images: ['/images/hero_chain_closeup_1774197804641.png'], features: ['Dual or single strand chain options', 'Cast iron or engineering plastic outriggers', 'Drive shaft with sprocket and bearing assembly', 'Accumulation zones available', 'Push dog or friction drive modes'], specifications: [{ label: 'Chain Type', value: 'ANSI / DIN Roller Chain' }, { label: 'Load Capacity', value: 'Up to 5000 kg per pallet' }, { label: 'Chain Speed', value: '0.05 – 0.5 m/s' }, { label: 'Frame', value: 'Heavy Structural Steel' }], applications: ['Automotive Manufacturing', 'Engine Assembly', 'Pallet Handling', 'Heavy Component Transfer'] },
    'horizontal-screw-conveyor': { _id: 'd9', slug: 'horizontal-screw-conveyor', name: 'Horizontal Screw Conveyor', category: 'Conveyors', subcategory: 'Screw Conveyor', shortDesc: 'Enclosed horizontal screw conveyor for bulk material handling. Ideal for powders, granules and semi-solids in food, chemical and agri industries.', image: '/images/industrial-conveyor-1.jpg', images: ['/images/industrial-conveyor-1.jpg'], features: ['Carbon steel or SS 304/316 trough', 'U-trough or enclosed tube options', 'Sectional hanger bearing design', 'Variable pitch or stepped flighting', 'Dust-tight sealed construction'], specifications: [{ label: 'Screw Diameter', value: '100mm – 600mm' }, { label: 'Length', value: '1m – 20m per section' }, { label: 'Capacity', value: 'Up to 250 m³/hour' }, { label: 'Material', value: 'MS or SS 304 / 316' }], applications: ['Food Processing', 'Cement & Minerals', 'Chemical Industry', 'Agriculture Grain Handling'] },
};

const ProductDetails = () => {    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!location.state?.product);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedImage, setSelectedImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!product || (product.slug && product.slug !== slug)) {
            fetchProductData();
        } else {
            window.scrollTo(0, 0);
        }
    }, [slug]);

    const fetchProductData = async () => {
        try {
            setLoading(true);
            // Try fetching by slug from DB first
            const { data } = await getProductBySlug(slug);
            setProduct(data);
        } catch (error) {
            // Check demo data
            if (DEMO_PRODUCTS_MAP[slug]) {
                setProduct(DEMO_PRODUCTS_MAP[slug]);
            } else {
                toast.error("Product not found");
                navigate('/products');
            }
        } finally {
            setLoading(false);
        }
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!product) return null;

    const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
    // Detect parent subcategory slug for breadcrumb
    const parentSlug = CONVEYOR_SLUG_TO_SUBCATEGORY[slug] || (product.subcategory || '').toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            {/* Breadcrumbs */}
            <div className="container mx-auto px-4 md:px-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <nav className="flex items-center text-sm text-slate-500 flex-wrap gap-1">
                        <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
                        <ChevronRight size={14} className="mx-1" />
                        <Link to="/products" className="hover:text-amber-600 transition-colors">Products</Link>
                        <ChevronRight size={14} className="mx-1" />
                        {parentSlug && (
                            <>
                                <Link to={`/products/${parentSlug}`} className="hover:text-amber-600 transition-colors capitalize">
                                    {product.subcategory || parentSlug.replace(/-/g, ' ')}
                                </Link>
                                <ChevronRight size={14} className="mx-1" />
                            </>
                        )}
                        <span className="font-semibold text-slate-900 truncate max-w-[200px]">{product.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-500 hover:text-amber-600 hover:bg-white rounded-lg transition-all" title="Share">
                            <Share2 size={18} />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-amber-600 hover:bg-white rounded-lg transition-all" title="Print">
                            <Printer size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT COLUMN: Gallery */}
                    <div className="lg:col-span-7 space-y-4">
                        <motion.div
                            layoutId={`product-image-${product._id || slug}`}
                            className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 overflow-hidden relative group"
                        >
                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative">
                                <img
                                    src={gallery[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/hero_conveyor_1773902700148.png';
                                    }}
                                />
                                {/* Yellow accent bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400"></div>
                            </div>
                        </motion.div>

                        {/* Thumbnails */}
                        {gallery.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {gallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-amber-500 ring-2 ring-amber-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Info */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wide">
                                        {product.category || 'Conveyors'}
                                    </div>
                                    {product.subcategory && (
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                            {product.subcategory}
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                                    {product.name}
                                </h1>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    {product.shortDesc}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex-1 bg-amber-500 text-slate-900 py-4 px-6 rounded-xl font-bold text-lg hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                                >
                                    <FileText size={20} />
                                    Request Quote
                                </button>
                                <PDFDownloadLink
                                    document={<ProductBrochure product={product} tenant={tenant} />}
                                    fileName={`${product.slug || 'product'}-brochure.pdf`}
                                    className="flex-1 bg-white text-slate-700 border border-slate-200 py-4 px-6 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {({ loading }) => (
                                        <>
                                            <FileDown size={20} />
                                            {loading ? 'Generating...' : 'Download Brochure'}
                                        </>
                                    )}
                                </PDFDownloadLink>
                            </div>

                            {/* Key Features */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Check className="text-amber-500" size={18} />
                                    Key Features
                                </h3>
                                <div className="space-y-3">
                                    {product.features && product.features.length > 0 ? (
                                        product.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                                {feature}
                                            </div>
                                        ))
                                    ) : (
                                        ['Heavy-duty industrial construction', 'Precision engineered components', 'Low maintenance design', 'Customizable configurations', 'CE / ISO compliant'].map((f, i) => (
                                            <div key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                                {f}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="mt-20">
                    <div className="border-b border-slate-200 flex gap-8 overflow-x-auto">
                        {['overview', 'specifications', 'applications'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'border-amber-500 text-amber-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="py-10 min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="max-w-4xl"
                                >
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Product Overview</h3>
                                    <div className="prose prose-slate max-w-none text-slate-600">
                                        <p>{product.description || product.shortDesc}</p>
                                        <p className="mt-4">
                                            Manufactured by {tenant.name}, this conveyor system is designed for seamless integration 
                                            into modern production environments and satisfies the rigorous demands of industrial operations. 
                                            Our engineering team focuses on reliability, efficiency, and safety — compliant with international standards.
                                        </p>
                                        <p className="mt-4">
                                            All conveyor systems are custom-manufactured to your exact requirements. Contact our sales team 
                                            for a detailed technical consultation and quotation.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'specifications' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="max-w-4xl"
                                >
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <Settings size={20} className="text-slate-400" />
                                        Technical Specifications
                                    </h3>
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                        <table className="w-full text-left text-sm">
                                            <tbody className="divide-y divide-slate-100">
                                                {product.specifications && product.specifications.length > 0 ? (
                                                    product.specifications.map((spec, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50">
                                                            <th className="py-4 px-6 font-semibold text-slate-900 w-1/3 bg-slate-50/50">{spec.label}</th>
                                                            <td className="py-4 px-6 text-slate-600 font-mono">{spec.value}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <>
                                                        <tr><th className="py-4 px-6 font-semibold text-slate-900 w-1/3 bg-slate-50/50">Material</th><td className="py-4 px-6 text-slate-600">Mild Steel / Stainless Steel (optional)</td></tr>
                                                        <tr><th className="py-4 px-6 font-semibold text-slate-900 bg-slate-50/50">Load Capacity</th><td className="py-4 px-6 text-slate-600">Up to 500 kg/m (standard)</td></tr>
                                                        <tr><th className="py-4 px-6 font-semibold text-slate-900 bg-slate-50/50">Operating Temp</th><td className="py-4 px-6 text-slate-600">-10°C to 80°C</td></tr>
                                                        <tr><th className="py-4 px-6 font-semibold text-slate-900 bg-slate-50/50">Voltage</th><td className="py-4 px-6 text-slate-600">415V / 3-Phase / 50Hz</td></tr>
                                                        <tr><th className="py-4 px-6 font-semibold text-slate-900 bg-slate-50/50">Warranty</th><td className="py-4 px-6 text-slate-600">1 Year Standard</td></tr>
                                                        <tr><th className="py-4 px-6 font-semibold text-slate-900 bg-slate-50/50">Dimensions</th><td className="py-4 px-6 text-slate-600">Customizable — Contact for datasheet</td></tr>
                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'applications' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                >
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <Layers size={20} className="text-slate-400" />
                                        Application Industries
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {(product.applications && product.applications.length > 0 ? product.applications :
                                            (product.useCases && product.useCases.length > 0 ? product.useCases :
                                                ['Warehouse Automation', 'Manufacturing', 'Packaging Lines', 'Logistics & Distribution', 'Food Processing', 'Pharmaceuticals'])
                                        ).map((app, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-amber-300 transition-colors group">
                                                <Box size={24} className="text-amber-500 shrink-0" />
                                                <span className="font-medium text-slate-700 group-hover:text-amber-700 transition-colors">{app}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <EnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialProduct={product.name}
            />
        </div>
    );
};

export default ProductDetails;

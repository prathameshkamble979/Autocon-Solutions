import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EnquiryModal from './EnquiryModal';

const ProductCard = memo(({ product }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 flex flex-col h-full"
            >
                <Link to={`/product/${product.slug || product._id}`} state={{ product }} className="h-56 overflow-hidden relative bg-slate-100 shrink-0 block cursor-pointer">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/hero_conveyor_1773902700148.png'; // Fallback
                        }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    {product.featured && (
                        <span className="absolute top-3 right-3 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            Featured
                        </span>
                    )}
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">{product.category}</div>
                    <Link to={`/product/${product.slug || product._id}`} state={{ product }} className="block">
                        <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-amber-700 transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed flex-grow">{product.shortDesc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                        <Link
                            to={`/product/${product.slug || product._id}`}
                            state={{ product: product }} // Pass full product object to avoid 404 on static items
                            className="text-slate-700 font-semibold hover:text-amber-600 transition-colors text-sm flex items-center group/link"
                        >
                            View Details
                            <span className="ml-1 transition-transform group-hover/link:translate-x-1">→</span>
                        </Link>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm hover:shadow-md"
                        >
                            Enquire
                        </button>
                    </div>
                </div>
            </motion.div>

            <EnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialProduct={product.name}
            />
        </>
    );
});

export default ProductCard;

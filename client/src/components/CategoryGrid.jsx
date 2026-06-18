import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MoveRight } from 'lucide-react';
import { PRODUCTS } from '../config';

export default function CategoryGrid() {
  return (
    <section id="products" className="py-20 relative bg-slate-900 overflow-hidden text-center">
      {/* Heavy industrial background image with deep contrast overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/modular_conveyor_1773902794000.png" 
          alt="factory background" 
          className="w-full h-full object-cover opacity-20 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10">

        {/* Header (Now High Contrast) */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Our Conveyors</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 font-display uppercase tracking-tight">
            Conveyor <span className="text-amber-500">Systems</span>
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed font-medium">
            Custom-manufactured conveyor systems engineered for performance, precision, and longevity across all industries.
          </p>
        </div>

        {/* 10-Item Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 text-left">
          {PRODUCTS.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 5) * 0.08, duration: 0.5, ease: 'easeOut' }}
            >
              <Link
                to={`/products/${cat.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 h-full relative border border-slate-100/50"
              >
                {/* Image Section */}
                <div className="relative h-44 overflow-hidden bg-[#1E293B]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    onError={e => { e.target.onerror = null; e.target.src = '/images/hero_conveyor_1773902700148.png'; }}
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent" />
                  
                  {/* Top glowing bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                  
                  {/* Floating Action Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-amber-500/30">
                     <MoveRight size={20} />
                  </div>

                  <h3 className="absolute bottom-4 left-4 right-4 text-center text-lg font-black text-white font-display uppercase tracking-wide drop-shadow-md group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-5 bg-white">
                  <p className="text-[#64748B] text-sm leading-relaxed line-clamp-2 mb-4 text-center">
                    {cat.shortDesc}
                  </p>
                  <div className="mt-auto flex justify-center items-center text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-amber-500 transition-colors">
                    View Details <ArrowRight size={14} className="ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-9 py-4 bg-[#0F172A] hover:bg-amber-500 text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg"
          >
            Explore Complete Catalog <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

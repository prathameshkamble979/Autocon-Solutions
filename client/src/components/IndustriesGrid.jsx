import { motion } from 'framer-motion';
import { Factory, FlaskConical, ShoppingCart, Car, Warehouse } from 'lucide-react';

const INDUSTRIES = [
  { icon: Factory,      name: 'Food',       desc: 'Hygienic PU belt systems for food-safe conveying'         },
  { icon: FlaskConical, name: 'Pharma',     desc: 'Cleanroom-ready stainless steel conveyor solutions'       },
  { icon: ShoppingCart, name: 'FMCG',       desc: 'Reliable roller and belt systems for maximum throughput'  },
  { icon: Car,          name: 'Auto',       desc: 'Heavy-duty slat & chain conveyors for automotive assembly'},
  { icon: Warehouse,    name: 'Logistics',  desc: 'High-speed sortation and automated warehouse routing'       },
];

export default function IndustriesGrid() {
  return (
    <section className="py-24 bg-[#0F172A] relative overflow-hidden">
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
      <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-500/60" />

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 border border-amber-500/30 bg-amber-500/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">Industries We Serve</span>
          </div>
          <h2 className="font-display font-black uppercase text-white text-4xl md:text-5xl leading-none mb-4">
            Built for <span className="text-amber-500">Every</span> Industry
          </h2>
          <p className="text-[#64748B] text-lg">
            Our conveyor systems are engineered specifically for the distinct demands of these core sectors.
          </p>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {INDUSTRIES.map(({ icon: Icon, name, desc }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative p-7 bg-[#1E293B] border border-white/5 hover:border-amber-500/40 rounded-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-default shadow-xl"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              {/* Glowing accent border top */}
              <div className="absolute left-0 top-0 w-full h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-t-2xl" />

              <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-5 group-hover:bg-amber-500 group-hover:text-[#0F172A] shadow-lg shadow-amber-500/5 transition-all duration-300">
                  <Icon size={26} strokeWidth={2} />
                </div>
                <h3 className="text-white font-black text-xl mb-3 font-display uppercase tracking-wider group-hover:text-amber-400 transition-colors">{name}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

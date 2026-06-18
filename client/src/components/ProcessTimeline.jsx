import { motion } from 'framer-motion';
import { ClipboardList, PenTool, Hammer, ShieldCheck, Truck } from 'lucide-react';

const STEPS = [
  { icon: ClipboardList, step: '01', title: 'Requirement',    desc: 'We analyze your facility, load specs, and operational goals.' },
  { icon: PenTool,       step: '02', title: 'Design',         desc: 'Engineers draft precise 3D CAD layouts for custom integration.' },
  { icon: Hammer,        step: '03', title: 'Manufacturing',  desc: 'Heavy-duty fabrication using premium industrial-grade steel.' },
  { icon: ShieldCheck,   step: '04', title: 'Quality Check',  desc: 'Rigorous stress and performance testing pre-dispatch.' },
  { icon: Truck,         step: '05', title: 'Delivery',       desc: 'Secure transport and on-site expert installation.' },
];

export default function ProcessTimeline() {
  return (
    <section className="py-24 bg-[#1E293B] relative overflow-hidden border-t border-white/5">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
      
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/5 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 border border-amber-500/30 bg-amber-500/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">Our Methodology</span>
          </div>
          <h2 className="font-display font-black uppercase text-white text-4xl md:text-5xl leading-none mb-6 tracking-tight">
            The Autocon <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Process</span>
          </h2>
          <p className="text-[#94A3B8] text-lg leading-relaxed">
            A transparent, highly-structured engineering pipeline designed to build trust and guarantee performance from start to finish.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative pt-4">
          
          {/* Horizontal Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[3px] bg-slate-800 rounded-full">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-amber-500/20 via-amber-400 to-amber-500/20 rounded-full" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
            {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex flex-col items-center text-center group relative z-10"
              >
                {/* Icon Circle */}
                <div className="relative mb-6">
                  {/* Outer glow ring on hover */}
                  <div className="absolute inset-[-8px] bg-amber-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Circle body */}
                  <div className="w-[88px] h-[88px] rounded-full bg-[#0F172A] border-[3px] border-[#334155] group-hover:border-amber-500 flex items-center justify-center relative z-10 transition-colors duration-300 shadow-xl">
                    <Icon size={34} className="text-slate-400 group-hover:text-amber-400 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  
                  {/* Step number badge */}
                  <div className="absolute -top-1 -right-2 w-7 h-7 bg-amber-500 text-[#0F172A] rounded-full text-[11px] font-black flex items-center justify-center z-20 shadow-lg shadow-amber-500/40">
                    {i + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="w-full">
                  <div className="text-amber-500/60 font-black text-[13px] mb-2 tracking-[0.2em]">{step}</div>
                  <h3 className="text-white font-black text-xl mb-3 font-display uppercase tracking-wide group-hover:text-amber-400 transition-colors leading-snug">
                    {title}
                  </h3>
                  <p className="text-slate-400 text-[15px] leading-relaxed max-w-[240px] mx-auto">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

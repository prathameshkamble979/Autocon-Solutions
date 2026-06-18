import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, ChevronRight, CheckCircle2 } from 'lucide-react';
import { tenant } from '../config';

export default function AboutSection() {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200 shadow-inner">
      {/* Industrial subtle texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* ── LEFT: Factory / Machine Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Main large image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] lg:h-[650px] border border-slate-100">
              <img 
                src="/images/hero_conveyor_1773902700148.png" 
                alt="Industrial Factory Automation" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
              
              {/* Floating aesthetic badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                  <CheckCircle2 className="text-[#0F172A]" size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg font-display uppercase tracking-wider">Trusted Quality</h4>
                  <p className="text-white/80 text-sm">Engineered for maximum durability.</p>
                </div>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -z-10 -top-8 -left-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          </motion.div>


          {/* ── RIGHT: Content (About + Vision + Mission) ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col"
          >
            {/* Header / About */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-amber-50 border border-amber-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-700 text-xs font-bold uppercase tracking-widest">About Us</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-6 font-display uppercase leading-tight">
                Pioneering <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">Conveyor</span> Innovation
              </h2>

              <p className="text-[#64748B] text-lg leading-relaxed">
                <strong className="text-[#0F172A]">{tenant.name}</strong> engineers and manufactures heavy-duty material handling systems. We deliver custom-built conveyors designed to optimize production lines, increase throughput, and ensure flawless daily operations.
              </p>
            </div>

            {/* Vision & Mission Block */}
            <div className="flex flex-col gap-8 mb-12">
              
              {/* Vision */}
              <div className="flex items-start gap-5 p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-amber-200 hover:bg-amber-50/30 transition-colors group">
                <div className="w-14 h-14 bg-white shadow-sm border border-slate-200 text-amber-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                  <Eye size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black font-display text-[#0F172A] mb-2 uppercase tracking-wide">Our Vision</h3>
                  <p className="text-[#64748B] font-medium">
                    To be the preferred partner for industrial material handling through intelligent automation and engineering excellence.
                  </p>
                </div>
              </div>

              {/* Mission */}
              <div className="flex items-start gap-5 p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-amber-200 hover:bg-amber-50/30 transition-colors group">
                <div className="w-14 h-14 bg-white shadow-sm border border-slate-200 text-amber-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                  <Target size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black font-display text-[#0F172A] mb-2 uppercase tracking-wide">Our Mission</h3>
                  <p className="text-[#64748B] font-medium">
                    To design and manufacture conveyor solutions that maximize efficiency, eliminate downtime, and scale client productivity.
                  </p>
                </div>
              </div>

            </div>

            {/* CTA */}
            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-9 py-4 bg-[#0F172A] hover:bg-amber-500 text-white hover:text-[#0F172A] font-bold rounded-xl transition-all duration-300 shadow-lg shadow-slate-900/10 group"
              >
                Learn More About Us <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

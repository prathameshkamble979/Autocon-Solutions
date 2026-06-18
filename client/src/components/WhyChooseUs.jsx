import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WHY = [
  { title: 'Custom Design',       desc: 'Every system is engineered to your exact layout and production specs.' },
  { title: 'Durable Build',       desc: 'Heavy-duty steel frameworks and premium components for max lifespan.' },
  { title: 'Efficient Operation', desc: 'Low-maintenance drives that definitively boost your daily throughput.' },
  { title: 'On-time Delivery',    desc: 'Strict in-house manufacturing timelines to ensure you hit your launch dates.' },
];

const STATS = [
  { value: '100+', label: 'Systems Built' },
  { value: '50+',  label: 'Happy Clients' },
  { value: 'Pan',  label: 'India Supply' },
  { value: '100%', label: 'Commitment' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-28 bg-[#0F172A] relative overflow-hidden">
      {/* Background dark grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full mx-auto">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">The Autocon Advantage</span>
        </div>

        <h2 className="font-display font-black uppercase text-white text-4xl md:text-5xl leading-tight mb-16 tracking-tight">
          Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Choose Us</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {WHY.map(({ title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-8 bg-[#1E293B]/80 backdrop-blur-md border border-white/5 hover:border-amber-500/50 hover:bg-[#1E293B] rounded-2xl transition-all duration-300 group shadow-xl"
            >
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full group-hover:bg-amber-500/40 transition-all" />
                 <CheckCircle2 className="relative text-amber-500 shrink-0 group-hover:scale-110 transition-transform" size={48} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-black font-display text-white text-xl mb-3 group-hover:text-amber-400 transition-colors tracking-wide uppercase">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-600 mb-2 font-display">
                {value}
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-[0.15em]">
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-9 py-4 bg-amber-500 hover:bg-amber-400 text-[#0F172A] font-black rounded-xl transition-all uppercase tracking-wide text-sm shadow-lg shadow-amber-500/20 hover:-translate-y-1"
        >
          Get a Free Consultation <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

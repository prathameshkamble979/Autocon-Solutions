import { motion } from 'framer-motion';
import { CheckCircle, Users, Award, Clock, Layers, Globe } from 'lucide-react';

const STATS = [
  { label: 'Systems Installed', value: '100+',      icon: CheckCircle },
  { label: 'Satisfied Clients', value: '50+',       icon: Users       },
  { label: 'Years Experience',  value: '2+',        icon: Award       },
  { label: 'On-Time Delivery',  value: '100%',      icon: Clock       },
  { label: 'Conveyor Types',    value: '6',         icon: Layers      },
  { label: 'States Served',     value: 'Pan India', icon: Globe       },
];

export default function StatsSection() {
  return (
    <section className="bg-[#1E293B] py-12 relative overflow-hidden border-t border-b border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-white/5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center text-center px-4 py-5 group"
              >
                <div className="w-10 h-10 mb-3 flex items-center justify-center text-amber-500 bg-amber-500/10 rounded-xl group-hover:bg-amber-500 group-hover:text-[#0F172A] transition-all duration-200">
                  <Icon size={19} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-0.5 font-display">{stat.value}</h3>
                <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

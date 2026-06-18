import { Hexagon, Building2, Factory, Package, MonitorPlay } from 'lucide-react';

const CLIENTS = [
  { name: 'Accurate Engineering', icon: Building2 },
  { name: 'Raph Labs',            icon: MonitorPlay },
  { name: 'K.T. Industries',      icon: Factory },
  { name: 'Vasai Pharma Pack',    icon: Package },
  { name: 'Maharashtra Logistics',icon: Building2 },
  { name: 'Apex Manufacturing',   icon: Hexagon },
  { name: 'Pioneer Automotives',  icon: Factory },
  { name: 'Nexus Foods',          icon: Package },
];

export default function ClientLogos() {
  return (
    <section className="py-20 bg-slate-100 relative overflow-hidden border-y border-slate-200">
      {/* Industrial mechanical texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-[0.02]" />
      
      <div className="container mx-auto px-4 md:px-8 mb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 border border-amber-500/30 bg-amber-50 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-700 text-xs font-bold uppercase tracking-[0.2em]">Our Network</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] font-display uppercase tracking-tight">
          Trusted by <span className="text-amber-500">Industry Leaders</span>
        </h2>
      </div>

      {/* Auto-scrolling Marquee Container */}
      <div className="relative flex overflow-hidden w-full group">
        
        {/* Transparent gradient masks for smooth fade edges */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-slate-100 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-slate-100 to-transparent z-10 pointer-events-none" />

        {/* The Track moving continuously */}
        <div className="flex gap-8 animate-marquee group-hover:[animation-play-state:paused] w-max select-none py-4 px-4">
          
          {[...CLIENTS, ...CLIENTS].map(({ name, icon: Icon }, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-8 py-5 bg-white border border-slate-200 hover:border-amber-400 rounded-2xl min-w-[280px] transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-default shrink-0 group/card hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center group-hover/card:bg-amber-500 group-hover/card:border-amber-500 transition-colors duration-300 shrink-0">
                <Icon size={24} className="text-slate-400 group-hover/card:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <p className="font-bold text-base text-[#0F172A] whitespace-nowrap tracking-wide leading-tight group-hover/card:text-amber-600 transition-colors">
                {name}
              </p>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
}

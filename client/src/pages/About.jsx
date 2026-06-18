import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Target, Zap, ShieldCheck, Users, Settings } from 'lucide-react';
import AboutSection from '../components/AboutSection';
import ProcessTimeline from '../components/ProcessTimeline';
import ClientLogos from '../components/ClientLogos';
import WhyChooseUs from '../components/WhyChooseUs';

const VISION_POINTS = [
  'Provide high-quality custom conveyor systems',
  'Ensure timely delivery for minimal downtime',
  'Build long-term, trusted client relationships',
];

const STATS = [
  { icon: Award,  value: '2+',       label: 'Years Experience'    },
  { icon: Users,  value: '50+',      label: 'Happy Clients'       },
  { icon: Settings, value: '100+',   label: 'Systems Installed'   },
  { icon: ShieldCheck, value: 'Pune', label: 'Maharashtra, India' },
];

const About = () => {
  return (
    <div className="pt-[65px]">

      {/* ── Hero ── */}
      <div className="relative bg-[#0f172a] py-24 overflow-hidden border-b-4 border-amber-500">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-[url('/images/hero_conveyor_1773902700148.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        </div>
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute left-0 top-0 w-1.5 h-full bg-amber-500" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Our Story</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 font-display uppercase">
            About <span className="text-amber-500">Autocon Solutions LLP</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Accelerating industrial efficiency through robust, reliable, and customized material handling systems. 
            Based in Pune, Maharashtra.
          </motion.p>
        </div>
      </div>

      {/* ── About Section ── */}
      <AboutSection />

      {/* ── Vision & Mission ── */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-amber-50 border border-amber-200 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-amber-700 text-xs font-bold uppercase tracking-widest">Our Core Purpose</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display uppercase">
              Vision & <span className="text-amber-500">Mission</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 group-hover:bg-amber-500 transition-colors duration-300" />
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 font-display">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                "To become a trusted and preferred partner in material handling and{' '}
                <strong className="text-slate-900">automation</strong> solutions, known for{' '}
                <strong className="text-slate-900">quality, innovation</strong>, and customer satisfaction."
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-[#0f172a] border border-slate-800 rounded-3xl p-10 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
              <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-black text-white mb-6 font-display">Our Mission</h3>
              <ul className="space-y-4">
                {VISION_POINTS.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-amber-500 font-bold mt-0.5">✓</span>
                    <span className="text-lg">{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 bg-amber-500">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="w-14 h-14 bg-slate-900/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <s.icon size={28} className="text-slate-900" />
                </div>
                <div className="text-3xl font-black text-slate-900 font-display">{s.value}</div>
                <div className="text-slate-800 text-sm font-bold uppercase tracking-wider mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <WhyChooseUs />

      {/* ── Process ── */}
      <ProcessTimeline />

      {/* ── Clients ── */}
      <ClientLogos />
    </div>
  );
};

export default About;

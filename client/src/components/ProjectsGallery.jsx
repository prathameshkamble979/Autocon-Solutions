import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tenant } from '../config';
import { getCaseStudies } from '../utils/api';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ProjectsGallery() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await getCaseStudies();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    if (projects.length === 0) return null;

    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden shadow-inner border-y border-slate-200">
            {/* Industrial Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 border border-amber-500/30 bg-white shadow-sm rounded-full">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-amber-700 font-bold text-xs uppercase tracking-[0.2em]">Our Portfolio</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] font-display uppercase tracking-tight">
                            Projects & <span className="text-amber-500">Installations</span>
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-lg font-medium">
                            Real conveyor systems designed, manufactured, and flawlessly installed by {tenant.name}.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button id="projects-prev" className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm hover:border-amber-500 hover:bg-amber-500 hover:text-slate-900 text-slate-700 transition-all duration-300 hover:-translate-y-1">
                            <ArrowLeft size={22} />
                        </button>
                        <button id="projects-next" className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm hover:border-amber-500 hover:bg-amber-500 hover:text-slate-900 text-slate-700 transition-all duration-300 hover:-translate-y-1">
                            <ArrowRight size={22} />
                        </button>
                    </div>
                </div>

                {/* Swiper */}
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    navigation={{ prevEl: '#projects-prev', nextEl: '#projects-next' }}
                    autoplay={{ delay: 4500, disableOnInteraction: false }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    loop
                    breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 24 },
                        768: { slidesPerView: 2, spaceBetween: 28 },
                        1200: { slidesPerView: 3, spaceBetween: 32 },
                    }}
                    className="pb-16"
                >
                    {projects.map((project, i) => (
                        <SwiperSlide key={project._id || i}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative h-60 overflow-hidden bg-slate-900 shrink-0">
                                    <img
                                        src={project.mainImage || '/images/hero_conveyor_1773902700148.png'}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                        onError={e => { e.target.onerror = null; e.target.src = '/images/hero_conveyor_1773902700148.png'; }}
                                    />
                                    {/* Top glow bar */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />
                                    
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1 bg-amber-500 text-slate-900 text-[11px] font-black rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/30">
                                            {project.industry}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <div className="p-7 flex flex-col flex-grow">
                                    <div className="flex items-start gap-2 text-slate-500 text-xs mb-3 font-semibold uppercase tracking-wider">
                                        <MapPin size={14} className="shrink-0 text-amber-500" />
                                        {project.client} {project.location ? `— ${project.location}` : ''}
                                    </div>
                                    <h3 className="text-xl font-black font-display text-[#0F172A] mb-3 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mt-auto">
                                        {project.problem || 'View full project requirements and engineering solution details...'}
                                    </p>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Bottom CTA */}
                <div className="text-center mt-6">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 px-9 py-4 bg-[#0F172A] hover:bg-amber-500 text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-1"
                    >
                        View Full Project Gallery <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

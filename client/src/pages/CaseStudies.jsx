import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCaseStudies } from '../utils/api';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Globe, Building2 } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const CaseStudies = () => {
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchCaseStudies();
    }, []);

    const fetchCaseStudies = async () => {
        try {
            const { data } = await getCaseStudies();
            setCaseStudies(data);
        } catch (error) {
            console.error("Failed to fetch case studies", error);
        } finally {
            setLoading(false);
        }
    };

    const industries = ['All', ...new Set(caseStudies.map(cs => cs.industry))];
    const filteredStudies = filter === 'All' ? caseStudies : caseStudies.filter(cs => cs.industry === filter);

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Header */}
            <div className="container mx-auto px-4 md:px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl"
                >
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                        Proven Results
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        Engineering Success Stories
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Discover how our automation solutions have transformed operations for industry leaders across various sectors.
                    </p>
                </motion.div>
            </div>

            {/* Filter Tabs */}
            <div className="container mx-auto px-4 md:px-6 mb-12 overflow-x-auto">
                <div className="flex gap-2 pb-2">
                    {industries.map(ind => (
                        <button
                            key={ind}
                            onClick={() => setFilter(ind)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${filter === ind
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                                }`}
                        >
                            {ind}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 md:px-6">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden h-[450px] border border-slate-100">
                                <Skeleton className="h-56 w-full" />
                                <div className="p-6 space-y-4">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStudies.map((study) => (
                            <motion.div
                                key={study._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={study.mainImage}
                                        alt={study.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/hero_conveyor_1773902700148.png';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="flex items-center gap-2 text-xs font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                                            <Building2 size={12} />
                                            {study.industry}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {study.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
                                        {study.problem}
                                    </p>

                                    {/* Mini Stats */}
                                    {study.stats && study.stats.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-100">
                                            {study.stats.slice(0, 2).map((stat, idx) => (
                                                <div key={idx}>
                                                    <div className="text-xl font-bold text-blue-600">{stat.value}</div>
                                                    <div className="text-xs text-slate-500 uppercase tracking-wide">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        to={`/projects/${study.slug}`}
                                        state={{ study }}
                                        className="mt-auto flex items-center justify-between text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                                    >
                                        View Case Study
                                        <span className="bg-slate-100 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <ArrowRight size={16} />
                                        </span>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && filteredStudies.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                        <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No Case Studies Found</h3>
                        <p className="text-slate-500">Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseStudies;

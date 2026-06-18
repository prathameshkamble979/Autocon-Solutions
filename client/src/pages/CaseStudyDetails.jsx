import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getCaseStudyBySlug } from '../utils/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, BarChart3, Building2, MapPin, Calendar } from 'lucide-react';

const CaseStudyDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [study, setStudy] = useState(location.state?.study || null);
    const [loading, setLoading] = useState(!location.state?.study);

    useEffect(() => {
        if (!study || study.slug !== slug) {
            fetchStudyData();
        } else {
            window.scrollTo(0, 0);
        }
    }, [slug]);

    const fetchStudyData = async () => {
        try {
            setLoading(true);
            const { data } = await getCaseStudyBySlug(slug);
            setStudy(data);
        } catch (error) {
            console.error('Error fetching case study:', error);
            navigate('/projects');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!study) return null;

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            {/* Hero Section */}
            <div className="relative bg-slate-900 h-[60vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={study.mainImage}
                        alt={study.title}
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
                    <Link to="/projects" className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors font-medium">
                        <ArrowLeft size={16} className="mr-2" /> Back to Projects
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider mb-6">
                            <Building2 size={12} /> {study.industry}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                            {study.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-slate-300 text-sm font-medium">
                            {study.client && (
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    {study.client}
                                </div>
                            )}
                            {study.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500" />
                                    {study.location}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-blue-500" />
                                {new Date(study.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 space-y-12">

                            {/* Problem */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">1</span>
                                    The Challenge
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {study.problem}
                                </p>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Solution */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">2</span>
                                    Our Solution
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap mb-6">
                                    {study.solution}
                                </p>

                                {/* Gallery */}
                                {study.images && study.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        {study.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Gallery ${idx}`}
                                                className="rounded-xl w-full h-48 object-cover hover:opacity-90 transition-opacity cursor-pointer border border-slate-100"
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            <hr className="border-slate-100" />

                            {/* Results */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">3</span>
                                    The Results
                                </h2>
                                <div className="space-y-4">
                                    {study.results && study.results.map((res, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-green-50/50 rounded-xl border border-green-100">
                                            <div className="mt-1 bg-green-500 text-white rounded-full p-1 shrink-0">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            <p className="text-slate-700 font-medium">{res}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            {/* Key Metrics */}
                            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <BarChart3 className="text-blue-400" />
                                    Impact At A Glance
                                </h3>
                                <div className="space-y-6">
                                    {study.stats && study.stats.map((stat, idx) => (
                                        <div key={idx} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                            <div className="text-3xl font-extrabold text-blue-400 mb-1">{stat.value}</div>
                                            <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-blue-600 rounded-2xl p-6 shadow-lg text-center">
                                <h3 className="text-xl font-bold text-white mb-2">Have a similar project?</h3>
                                <p className="text-blue-100 text-sm mb-6">Let's discuss how we can engineer a solution for your needs.</p>
                                <Link to="/contact" className="block w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudyDetails;

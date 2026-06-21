import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects'); // Assuming backend has GET /api/projects public endpoint
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Our Work</span>
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mt-2 mb-6">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Projects</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Explore how we've helped clients achieve their industrial automation goals with precision and innovation.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100"></div>
                        ))}
                    </div>
                ) : projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col"
                            >
                                <div className="h-60 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
                                    <img
                                        src={project.images?.[0] || '/images/hero_conveyor_1773902700148.png'}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md ${project.status === 'Completed'
                                            ? 'bg-green-500/90 text-white'
                                            : 'bg-blue-500/90 text-white'
                                        }`}>
                                        {project.status || 'Completed'}
                                    </div>
                                </div>

                                <div className="p-8 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                                        {project.description}
                                    </p>

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                                        <span>{new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                                        <button 
                                            onClick={() => setSelectedProject(project)}
                                            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="mx-auto h-20 w-20 text-slate-200 mb-4 bg-slate-50 rounded-full flex items-center justify-center">
                            <span className="text-4xl">📂</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
                        <p className="text-slate-500">New case studies will be added soon.</p>
                    </div>
                )}
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="h-64 sm:h-80 relative shrink-0">
                                <img 
                                    src={selectedProject.images?.[0] || '/images/hero_conveyor_1773902700148.png'} 
                                    alt={selectedProject.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedProject.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                                            {selectedProject.status || 'Completed'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                            <Tag size={12} /> {selectedProject.category}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white leading-tight">{selectedProject.title}</h2>
                                </div>
                            </div>
                            
                            <div className="p-6 sm:p-8 overflow-y-auto">
                                <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold mb-6 pb-6 border-b border-slate-100">
                                    <Calendar size={16} />
                                    <span>Completed on {new Date(selectedProject.completedAt || selectedProject.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Project Overview</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {selectedProject.description}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;

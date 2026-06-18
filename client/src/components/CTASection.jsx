
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import BookVisitModal from './BookVisitModal';

const CTASection = () => {
    const [isVisitOpen, setIsVisitOpen] = useState(false);

    return (
        <>
            <BookVisitModal isOpen={isVisitOpen} onClose={() => setIsVisitOpen(false)} />

            <section className="py-24 bg-amber-600 relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
                            Ready to Optimize Your <br /> Manufacturing Process?
                        </h2>
                        <p className="text-amber-100 text-xl mb-10 max-w-2xl mx-auto">
                            Get a free consultation and quote for your industrial automation and fabrication needs today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => setIsVisitOpen(true)}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-amber-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-slate-50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <CalendarCheck size={20} />
                                Schedule a Factory Visit
                            </button>
                            <a
                                href="/contact"
                                className="w-full sm:w-auto px-8 py-4 bg-amber-700/50 border border-amber-400/30 text-white rounded-xl font-bold text-lg hover:bg-amber-700 transition-all backdrop-blur-sm flex items-center justify-center"
                            >
                                <span>Request a Quote</span>
                                <ArrowRight size={20} className="ml-2" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default CTASection;

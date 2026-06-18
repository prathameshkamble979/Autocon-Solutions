import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageCircle, CalendarCheck } from 'lucide-react';
import BookVisitModal from './BookVisitModal';
import { tenant } from '../config';

const FloatingActions = () => {
    const [isVisible,   setIsVisible]   = useState(false);
    const [isVisitOpen, setIsVisitOpen] = useState(false);

    useEffect(() => {
        const fn = () => setIsVisible(window.pageYOffset > 300);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const getWhatsAppLink = (phone, text) => {
        const encodedText = encodeURIComponent(text);
        // Using the standard Meta URL which handles native app opening and fallback appropriately
        return `https://wa.me/${phone}?text=${encodedText}`;
    };

    const whatsappUrl = getWhatsAppLink(tenant.contact.whatsapp, "Hi, I'm interested in Autocon Solutions conveyor systems. Please share more details.");

    return (
        <>
            <BookVisitModal isOpen={isVisitOpen} onClose={() => setIsVisitOpen(false)} />

            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
                {/* Book a Visit */}
                <motion.button
                    onClick={() => setIsVisitOpen(true)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.08 }}
                    className="bg-slate-900 text-amber-400 border border-amber-500/40 px-4 py-3 rounded-full shadow-lg hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 transition-all flex items-center gap-2 text-sm font-bold"
                    title="Schedule a Visit"
                >
                    <CalendarCheck size={18} />
                    <span className="hidden sm:inline">Book a Visit</span>
                </motion.button>

                {/* WhatsApp */}
                <motion.a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="relative bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:shadow-green-500/40 transition-shadow flex items-center justify-center"
                    title="Chat on WhatsApp"
                >
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    <MessageCircle size={24} fill="white" />
                </motion.a>

                {/* Scroll to top */}
                <AnimatePresence>
                    {isVisible && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            onClick={scrollToTop}
                            className="bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
                            title="Back to Top"
                        >
                            <ArrowUp size={20} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default FloatingActions;

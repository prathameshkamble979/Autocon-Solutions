import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { tenant } from '../config';

const WhatsAppButton = () => {
    const getWhatsAppLink = (phone, text) => {
        const encodedText = encodeURIComponent(text);
        // Using the standard Meta URL which handles native app opening and fallback appropriately
        return `https://wa.me/${phone}?text=${encodedText}`;
    };

    const whatsappUrl = getWhatsAppLink(tenant.contact.whatsapp, "Hi, I'm interested in Autocon Solutions conveyor systems.");

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center group"
            title="Chat on WhatsApp"
        >
            <MessageCircle size={28} fill="white" />
            <span className="absolute right-full mr-3 bg-white text-slate-800 px-3 py-1 rounded-lg text-sm font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us
            </span>
        </motion.a>
    );
};

export default WhatsAppButton;

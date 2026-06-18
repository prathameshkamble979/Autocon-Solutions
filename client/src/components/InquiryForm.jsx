import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Phone, Mail, User, MessageSquare, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { tenant } from '../config';

const CONVEYOR_TYPES = [
    'Belt Conveyor', 'Roller Conveyor', 'Chain Conveyor', 'Slat Conveyor',
    'Modular Belt Conveyor', 'Spiral Conveyor', 'Wiremesh Conveyor',
    'Truck Loading Conveyor', 'Telescopic Conveyor', 'Flexible Conveyor',
    'Screw Conveyor', 'Custom / Not Sure',
];

const REQ_TYPES = [
    { value: 'NEW', label: 'New Installation' },
    { value: 'UPGRADE', label: 'System Upgrade / Expansion' },
    { value: 'REPAIR', label: 'Maintenance / Spares' }
];

export default function InquiryForm() {
    const [form, setForm] = useState({
        name: '', phone: '', email: '', productType: '', requirementType: 'NEW', message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = e =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.email || !form.productType) {
            toast.error('Please fill in all required fields.');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                type: 'PRODUCT',
                source: 'Website Footer',
                name: form.name,
                phone: form.phone,
                email: form.email,
                product: form.productType,
                requirementType: form.requirementType,
                message: form.message,
            };
            
            await api.post('/bookings', payload);
            
            setSubmitted(true);
            toast.success('Your request has been submitted successfully!');
            
        } catch (err) {
            console.error('Enquiry form error:', err);
            toast.error('Failed to submit. Please call us directly.');
        } finally {
            setSubmitting(false);
        }
    };

    const getWhatsAppLink = (phone, text) => {
        const encodedText = encodeURIComponent(text);
        // Using the standard Meta URL which handles native app opening and fallback appropriately
        return `https://wa.me/${phone}?text=${encodedText}`;
    };

    return (
        <section id="quote" className="py-24 bg-[#0F172A] relative overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(250,204,21,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(250,204,21,0.025)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-amber-400 via-amber-500 to-transparent" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                    {/* Left: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-white"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-amber-500/30 bg-amber-500/10 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Connect With Us</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight font-display uppercase tracking-tight">
                            Let's Build It <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Together</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">
                            Share your material handling requirements with our engineering team, and we’ll prepare a complete technical quotation within 24 hours.
                        </p>

                        {/* High-Contrast Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <a 
                                href={getWhatsAppLink(tenant.contact.whatsapp, 'Hi Autocon Solutions, I have an inquiry.')}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD58] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#25D366]/20 hover:-translate-y-1"
                            >
                                <MessageSquare size={22} className="fill-current" />
                                WhatsApp Us
                            </a>
                            
                            <a 
                                href={`tel:${tenant.contact.phone1}`}
                                className="flex-1 flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:-translate-y-1"
                            >
                                <Phone size={22} className="text-amber-500 fill-amber-500/20" />
                                Call Directly
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        {submitted ? (
                            <div className="bg-slate-800/60 border border-green-500/30 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[550px]">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} className="text-green-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-3">Your request has been submitted successfully!</h3>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">Our engineering team has received your enquiry and will contact you within 24 hours.</p>
                                
                                <div className="p-6 bg-slate-900/60 rounded-xl mb-8 border border-slate-700/50 w-full">
                                    <p className="text-emerald-400 font-bold mb-4 flex justify-center items-center gap-2">
                                        <MessageSquare size={18} /> Need instant assistance?
                                    </p>
                                    <a
                                        href={getWhatsAppLink('918788345829', `Hi, I'm ${form.name}. I just submitted an enquiry on your website regarding ${form.productType}.`)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center w-full py-3.5 bg-[#25D366] hover:bg-[#20BD58] text-white font-bold rounded-xl transition-colors shadow-sm"
                                    >
                                        Continue on WhatsApp
                                    </a>
                                </div>

                                <button
                                    onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', productType: '', requirementType: 'NEW', message: '' }); }}
                                    className="px-8 py-3.5 border border-amber-500/50 text-amber-500 font-bold rounded-xl hover:bg-amber-500/10 transition-colors"
                                >
                                    Submit Another Request
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white/5 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 space-y-5"
                            >
                                {/* Trust Signals */}
                                <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700/50 pb-6">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                                        <CheckCircle size={14} /> Free consultation
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                                        <CheckCircle size={14} /> Quote within 24 hrs
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                                        <CheckCircle size={14} /> Custom conveyor solutions
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {REQ_TYPES.map(rt => (
                                        <label key={rt.value} className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${form.requirementType === rt.value ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                                            <input type="radio" name="requirementType" value={rt.value} checked={form.requirementType === rt.value} onChange={handleChange} className="hidden" />
                                            <span className="text-[10px] sm:text-xs font-bold uppercase text-center">{rt.label.split(' / ')[0]}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                                            Name <span className="text-amber-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-4 top-3.5 text-slate-500" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Your full name"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                                            Phone <span className="text-amber-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-4 top-3.5 text-slate-500" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="+91..."
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                                        Email <span className="text-amber-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-3.5 text-slate-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                                        Conveyor Type Required <span className="text-amber-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="productType"
                                            value={form.productType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none cursor-pointer transition-all"
                                        >
                                            <option value="">— Select Conveyor Type —</option>
                                            {CONVEYOR_TYPES.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-3.5 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                                        Project Details / Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Describe your requirement: material, dimensions, load capacity, speed, quantity..."
                                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 mt-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <div className="w-6 h-6 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />
                                    ) : (
                                        <Send size={22} />
                                    )}
                                    {submitting ? 'Sending...' : 'Request Quote'}
                                </button>
                                <p className="text-center text-slate-400 text-xs mt-4">
                                    No spam. We only use your info to respond to this enquiry.
                                </p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

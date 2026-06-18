import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Linkedin, Send, CheckCircle } from 'lucide-react';
import { tenant } from '../config';
import api from '../utils/api';

const ENQUIRY_TYPES = [
    'PU Belt Conveyors',
    'Modular Belt Conveyors',
    'Roller Conveyors',
    'Slat Conveyors',
    'Inclined Conveyors',
    'Customized Material Handling Systems',
    'General Enquiry',
];

const Contact = () => {
    const [form,     setForm]     = useState({ name: '', email: '', phone: '', company: '', enquiryType: '', message: '' });
    const [loading,  setLoading]  = useState(false);
    const [success,  setSuccess]  = useState(false);
    const [error,    setError]    = useState('');

    const handle = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async e => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await api.post('/bookings', form);
            setSuccess(true);
            setForm({ name: '', email: '', phone: '', company: '', enquiryType: '', message: '' });
        } catch {
            setError('Something went wrong. Please call us directly.');
        } finally {
            setLoading(false);
        }
    };

    const CONTACT_ITEMS = [
        {
            icon: Phone,
            title: 'Call Us',
            lines: [
                `${tenant.contact.director1.name}: ${tenant.contact.phone1}`,
                `${tenant.contact.director2.name}: ${tenant.contact.phone2}`,
            ],
            href: `tel:${tenant.contact.phone1.replace(/\s/g, '')}`,
        },
        {
            icon: Mail,
            title: 'Email Us',
            lines: [tenant.contact.email],
            href: `mailto:${tenant.contact.email}`,
        },
        {
            icon: MapPin,
            title: 'Location',
            lines: [tenant.contact.address],
        },
        {
            icon: Instagram,
            title: 'Instagram',
            lines: ['@autocon_solutions_llp'],
            href: tenant.social.instagram,
        },
        {
            icon: Linkedin,
            title: 'LinkedIn',
            lines: ['Autocon Solutions LLP'],
            href: tenant.social.linkedin,
        },
    ];

    return (
        <div className="pt-[65px] min-h-screen bg-slate-50">

            {/* Header */}
            <div className="relative bg-[#0f172a] py-20 overflow-hidden border-b-4 border-amber-500">
                <div className="absolute inset-0 grid-bg opacity-50" />
                <div className="absolute left-0 top-0 w-1.5 h-full bg-amber-500" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-amber-500/10 border border-amber-500/30 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-display uppercase">
                        Contact <span className="text-amber-500">Us</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Ready to upgrade your production line? Talk to our engineering team and get a free consultation.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Left – Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        <div className="bg-[#0f172a] rounded-3xl p-8 text-white mb-6">
                            <h2 className="text-2xl font-black mb-2 font-display uppercase">Autocon Solutions LLP</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Manufacturers of custom conveyor systems and material handling solutions. Pune, Maharashtra.
                            </p>
                        </div>

                        {CONTACT_ITEMS.map((item, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-100 hover:border-amber-300 rounded-2xl p-5 transition-all duration-200 flex items-start gap-4 group shadow-sm hover:shadow-md"
                            >
                                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm mb-0.5">{item.title}</p>
                                    {item.lines.map((l, j) => (
                                        item.href ? (
                                            <a key={j} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block text-slate-500 hover:text-amber-600 text-sm transition-colors">{l}</a>
                                        ) : (
                                            <p key={j} className="text-slate-500 text-sm">{l}</p>
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Right – Enquiry Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900 mb-2 font-display uppercase">Send an Enquiry</h2>
                            <p className="text-slate-500 text-sm mb-8">Fill in your details and we'll get back to you within 24 hours.</p>

                            {success ? (
                                <div className="flex flex-col items-center text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle size={32} className="text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Enquiry Submitted!</h3>
                                    <p className="text-slate-500">Thank you! Our team will contact you within 24 hours.</p>
                                    <button onClick={() => setSuccess(false)} className="mt-6 text-amber-600 font-bold hover:underline text-sm">
                                        Submit another enquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name *</label>
                                            <input name="name" value={form.name} onChange={handle} required placeholder="e.g. Rajesh Kumar"
                                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone *</label>
                                            <input name="phone" value={form.phone} onChange={handle} required placeholder="+91 XXXXX XXXXX"
                                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                        <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company / Organization</label>
                                        <input name="company" value={form.company} onChange={handle} placeholder="ABC Manufacturing Pvt. Ltd."
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product / Enquiry Type *</label>
                                        <select name="enquiryType" value={form.enquiryType} onChange={handle} required
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all bg-white">
                                            <option value="">— Select a product —</option>
                                            {ENQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Message / Requirements *</label>
                                        <textarea name="message" value={form.message} onChange={handle} required rows={4}
                                            placeholder="Describe your conveyor requirements, dimensions, material type, throughput, etc."
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all resize-none" />
                                    </div>

                                    {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-black py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-md hover:shadow-amber-300/40"
                                    >
                                        {loading ? 'Sending...' : <><Send size={18} /> Send Enquiry</>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

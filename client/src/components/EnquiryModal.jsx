import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Send, MessageSquare } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

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

const EnquiryModal = ({ isOpen, onClose, initialProduct = '' }) => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { requirementType: 'NEW' }
    });
    const [submitted, setSubmitted] = useState(false);
    const watchRequirementType = watch("requirementType");
    const watchProduct = watch("product");
    const watchName = watch("name");

    useEffect(() => {
        if (isOpen) {
            setSubmitted(false);
            reset({
                name: '',
                phone: '',
                email: '',
                product: initialProduct || '',
                requirementType: 'NEW',
                message: ''
            });
            // If initialProduct is in our list, set it, otherwise it might be custom
            if (initialProduct && !CONVEYOR_TYPES.includes(initialProduct)) {
                 setValue('product', 'Custom / Not Sure');
                 setValue('message', `Interested in: ${initialProduct}`);
            }
        }
    }, [isOpen, initialProduct, reset, setValue]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                type: 'PRODUCT',
                source: 'Website Header',
                name: data.name,
                phone: data.phone,
                email: data.email,
                product: data.product,
                requirementType: data.requirementType,
                message: data.message || ''
            };

            await api.post('/bookings', payload);

            setSubmitted(true);
            toast.success('Your request has been submitted successfully!');
            
        } catch (error) {
            console.error(error);
            toast.error('Failed to send request. Please call us directly.');
        }
    };

    const getWhatsAppLink = (phone, text) => {
        const encodedText = encodeURIComponent(text);
        // Using the standard Meta URL which handles native app opening and fallback appropriately
        return `https://wa.me/${phone}?text=${encodedText}`;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 z-10 max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="bg-slate-900 px-6 py-5 flex justify-between items-center text-white sticky top-0 z-20">
                        <div>
                            <h3 className="text-xl font-bold">Request a Smart Quote</h3>
                            <p className="text-slate-400 text-xs mt-1">Get an engineering estimate within 24 hours.</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                            <X size={24} />
                        </button>
                    </div>

                    {submitted ? (
                        <div className="p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Request Submitted!</h3>
                            <p className="text-slate-600 mb-8 max-w-sm">Our engineering team has received your request and will contact you within 24 hours.</p>
                            
                            <div className="w-full bg-slate-50 border border-slate-200 p-5 rounded-xl mb-6">
                                <p className="text-slate-700 text-sm font-bold mb-3 flex items-center justify-center gap-2">
                                    <MessageSquare size={16} className="text-emerald-500" /> Need instant assistance?
                                </p>
                                <a
                                    href={getWhatsAppLink('918788345829', `Hi, I'm ${watchName}. I just submitted an enquiry on your website regarding ${watchProduct}.`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center w-full py-3 bg-[#25D366] hover:bg-[#20BD58] text-white font-bold rounded-lg transition-colors shadow-sm"
                                >
                                    Continue on WhatsApp
                                </a>
                            </div>

                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                            >
                                Close Window
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                            {/* Trust Signals */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                    <CheckCircle size={12} className="text-amber-500" /> Free consultation
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                    <CheckCircle size={12} className="text-amber-500" /> Quote within 24 hrs
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                    <CheckCircle size={12} className="text-amber-500" /> Custom solutions
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* Requirement Type */}
                                <div className="flex gap-2 mb-2">
                                    {REQ_TYPES.map(rt => (
                                        <label key={rt.value} className={`flex-1 flex flex-col items-center justify-center p-2 border rounded-xl cursor-pointer transition-all ${watchRequirementType === rt.value ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                            <input type="radio" value={rt.value} {...register('requirementType')} className="hidden" />
                                            <span className="text-[10px] sm:text-xs font-bold uppercase text-center">{rt.label.split(' / ')[0]}</span>
                                        </label>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                    <input {...register('name', { required: 'Name is required' })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-sm" placeholder="John Doe" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                        <input {...register('phone', { required: 'Phone is required' })} type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-sm" placeholder="+91..." />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                                        <input {...register('email', { required: 'Email is required' })} type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-sm" placeholder="john@company.com" />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Conveyor Type <span className="text-red-500">*</span></label>
                                    <select {...register('product', { required: 'Please select a conveyor type' })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all text-sm appearance-none cursor-pointer">
                                        <option value="">— Select Conveyor Type —</option>
                                        {CONVEYOR_TYPES.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Project Details / Message</label>
                                    <textarea {...register('message')} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none resize-none placeholder:text-slate-400 text-sm" placeholder="Dimensions, specs, capacity..."></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Quote Request
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EnquiryModal;

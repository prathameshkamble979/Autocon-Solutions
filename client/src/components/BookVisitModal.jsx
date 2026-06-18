import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, CalendarCheck, MapPin, Clock, Users } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BookVisitModal = ({ isOpen, onClose }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const onSubmit = async (data) => {
        try {
            await api.post('/bookings', {
                type: 'VISIT',
                name: data.name,
                email: data.email,
                phone: data.phone,
                company: data.company || '',
                preferredDate: data.preferredDate,
                message: data.message || '',
            });

            toast.success('Visit scheduled! We will confirm your appointment shortly.');
            onClose();
            reset();
        } catch (error) {
            console.error(error);
            toast.error('Failed to schedule visit. Please try again.');
        }
    };

    if (!isOpen) return null;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split('T')[0];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 24 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-yellow-900 px-6 py-5 flex justify-between items-start text-white sticky top-0 z-20">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <CalendarCheck size={20} className="text-amber-300" />
                                <h3 className="text-xl font-bold">Schedule a Factory Visit</h3>
                            </div>
                            <p className="text-slate-400 text-xs">
                                See our manufacturing capabilities in person.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-1 mt-0.5"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* Info Strip */}
                    <div className="grid grid-cols-3 divide-x divide-slate-100 bg-amber-50 border-b border-amber-100">
                        {[
                            { icon: MapPin, label: 'Narhe, Pune' },
                            { icon: Clock, label: 'Mon–Sat 9am–6pm' },
                            { icon: Users, label: 'Free Consultation' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex flex-col items-center py-3 gap-1">
                                <Icon size={16} className="text-amber-600" />
                                <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none transition-all bg-slate-50 placeholder:text-slate-400 text-sm"
                                    placeholder="John Doe"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Company Name
                                </label>
                                <input
                                    {...register('company')}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none transition-all bg-slate-50 placeholder:text-slate-400 text-sm"
                                    placeholder="Acme Industries (optional)"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('phone', {
                                        required: 'Phone is required',
                                        pattern: { value: /^[0-9+\s-]{10,}$/, message: 'Enter a valid phone number' },
                                    })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none transition-all bg-slate-50 placeholder:text-slate-400 text-sm"
                                    placeholder="+91 98765 43210"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none transition-all bg-slate-50 placeholder:text-slate-400 text-sm"
                                    placeholder="john@company.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Preferred Visit Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                min={minDateStr}
                                {...register('preferredDate', { required: 'Please select a preferred date' })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none transition-all bg-slate-50 text-slate-700 text-sm"
                            />
                            {errors.preferredDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.preferredDate.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                What would you like to see / discuss?
                            </label>
                            <textarea
                                {...register('message')}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none transition-all bg-slate-50 placeholder:text-slate-400 text-sm resize-none"
                                placeholder="e.g. Conveyor systems, production line setup, custom fabrication..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-amber-700 text-white font-bold py-3.5 rounded-xl hover:bg-yellow-800 transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <CalendarCheck size={18} />
                                    Confirm Visit Request
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-slate-400">
                            Our team will call you within 24 hours to confirm the appointment.
                        </p>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookVisitModal;

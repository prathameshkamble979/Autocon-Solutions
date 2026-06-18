
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { tenant } from '../config';

const BusinessCard = () => {    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">{tenant.name}</h3>
            <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider font-semibold">Industrial Automation Experts</p>

            <div className="space-y-6">
                <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide mb-1">Headquarters</h4>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {tenant.contactInfo?.address || 'Pune, Maharashtra 411041'}
                        </p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0">
                        <Phone size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide mb-1">Phone</h4>
                        <p className="text-slate-600 font-medium">{tenant.contactInfo?.phone}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0">
                        <Mail size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide mb-1">Email</h4>
                        <a href={`mailto:${tenant.contactInfo?.email}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                            {tenant.contactInfo?.email}
                        </a>
                    </div>
                </div>

                <div className="flex items-start space-x-4 border-t border-slate-100 pt-6">
                    <div className="bg-slate-50 p-3 rounded-lg text-slate-600 shrink-0">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide mb-1">Business Hours</h4>
                        <div className="grid grid-cols-2 gap-x-8 text-sm text-slate-600">
                            <span>Mon - Fri:</span>
                            <span className="font-medium text-slate-800">9:00 AM - 6:00 PM</span>
                            <span>Saturday:</span>
                            <span className="font-medium text-slate-800">9:00 AM - 2:00 PM</span>
                            <span>Sunday:</span>
                            <span className="text-red-500 font-medium">Closed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessCard;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Building2, User, Loader2, Download, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { PRODUCTS } from '../config';

const ProposalGenerator = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [backendProducts, setBackendProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
                if (res.data.success) {
                    setBackendProducts(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        fetchProducts();
    }, []);

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        company: '',
        productId: '',
        systemCost: 1500000,
        workersReplaced: 10,
        monthlySavings: 200000,
        paybackPeriod: 7.5
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const selectedBackendProduct = backendProducts.find(p => p._id === formData.productId);
            if (!selectedBackendProduct) {
                alert("Please select a valid product.");
                setLoading(false);
                return;
            }

            const payload = {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                company: formData.company,
                productId: selectedBackendProduct._id,
                roiData: {
                    systemCost: Number(formData.systemCost),
                    workersReplaced: Number(formData.workersReplaced),
                    monthlySavings: Number(formData.monthlySavings),
                    paybackPeriod: Number(formData.paybackPeriod)
                }
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/proposals/generate`, payload);
            
            if (res.data.success) {
                setResult(res.data);
                setStep(2);
            }
        } catch (error) {
            console.error(error);
            alert("Error generating proposal. Please ensure your backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-[80px] pb-16">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                
                <div className="text-center mb-10 print:hidden">
                    <span className="inline-block px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                        Enterprise Sales Tool
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 font-display uppercase">
                        AI Proposal <span className="text-amber-500">Generator</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Transform technical specifications and ROI data into a persuasive, boardroom-ready business proposal in seconds.
                    </p>
                </div>

                {step === 1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Client Info */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <User size={18} className="text-amber-500"/> Client Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Lead Name *</label>
                                        <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Company Name *</label>
                                        <input required type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address *</label>
                                        <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Technical & ROI Info */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Building2 size={18} className="text-amber-500"/> Solution & ROI Metrics
                                </h3>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Proposed System *</label>
                                    <select required name="productId" value={formData.productId} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
                                        <option value="">Select a Conveyor Type...</option>
                                        {backendProducts.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">System Cost (₹)</label>
                                        <input required type="number" name="systemCost" value={formData.systemCost} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Workers Replaced</label>
                                        <input required type="number" name="workersReplaced" value={formData.workersReplaced} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Monthly Savings (₹)</label>
                                        <input required type="number" name="monthlySavings" value={formData.monthlySavings} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Payback Period (Months)</label>
                                        <input required type="number" step="0.1" name="paybackPeriod" value={formData.paybackPeriod} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading || !formData.productId}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20}/> : <FileText size={20} className="text-amber-500"/>}
                                {loading ? 'Drafting Proposal with AI...' : 'Generate Official Proposal'}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && result && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-10 shadow-2xl border border-slate-200"
                    >
                        {/* Letterhead */}
                        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Autocon<span className="text-amber-500">Solutions</span></h1>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Industrial Automation Systems</p>
                            </div>
                            <div className="text-right text-sm text-slate-600">
                                <p className="font-bold text-slate-900">Date: {new Date().toLocaleDateString()}</p>
                                <p>Prepared For: <span className="font-bold text-slate-900">{result.proposal.customerName}</span></p>
                                <p>Company: <span className="font-bold text-slate-900">{result.proposal.company}</span></p>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">System Implementation Proposal</h2>
                            <p className="text-lg text-slate-600">Custom {result.productName} Solution</p>
                        </div>

                        {/* Sections */}
                        <div className="space-y-10 text-slate-800 leading-relaxed">
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wide">1. Executive Summary</h3>
                                <p className="whitespace-pre-line text-lg">{result.proposal.aiProposalText.executiveSummary}</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wide">2. Proposed Technical Solution</h3>
                                <p className="whitespace-pre-line text-lg">{result.proposal.aiProposalText.technicalSolution}</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wide">3. Financial Impact & ROI</h3>
                                <p className="whitespace-pre-line text-lg mb-6">{result.proposal.aiProposalText.financialImpact}</p>
                                
                                {/* Data Table */}
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 w-full max-w-2xl mx-auto">
                                    <table className="w-full text-left text-sm">
                                        <tbody>
                                            <tr className="border-b border-slate-200"><th className="py-3 text-slate-600 font-medium">Total System Investment</th><td className="py-3 font-bold text-right text-slate-900">₹{result.proposal.roiData.systemCost.toLocaleString('en-IN')}</td></tr>
                                            <tr className="border-b border-slate-200"><th className="py-3 text-slate-600 font-medium">Manual Positions Replaced</th><td className="py-3 font-bold text-right text-slate-900">{result.proposal.roiData.workersReplaced}</td></tr>
                                            <tr className="border-b border-slate-200"><th className="py-3 text-slate-600 font-medium">Est. Monthly Savings</th><td className="py-3 font-bold text-right text-green-600">+ ₹{result.proposal.roiData.monthlySavings.toLocaleString('en-IN')}</td></tr>
                                            <tr><th className="py-3 text-slate-600 font-medium">Projected Payback Period</th><td className="py-3 font-bold text-right text-amber-600">{result.proposal.roiData.paybackPeriod} Months</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>

                        {/* Signatures */}
                        <div className="mt-16 pt-8 flex justify-between items-end">
                            <div className="w-64 border-t border-slate-400 pt-2 text-center text-sm text-slate-600">
                                Authorized Signature (Autocon Solutions)
                            </div>
                            <div className="w-64 border-t border-slate-400 pt-2 text-center text-sm text-slate-600">
                                Client Acceptance Signature
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-16 flex gap-4 print:hidden border-t border-slate-100 pt-8">
                            <button onClick={() => window.print()} className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black uppercase tracking-wide rounded-xl flex justify-center items-center gap-2 transition-all">
                                <Download size={18}/> Export Proposal to PDF
                            </button>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default ProposalGenerator;

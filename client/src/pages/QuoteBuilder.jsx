import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../config';
import { FileText, Calculator, Sparkles, CheckCircle2, Loader2, Download, RefreshCw } from 'lucide-react';
import api from '../utils/api';

const QuoteBuilder = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [backendProducts, setBackendProducts] = useState([]);

    useEffect(() => {
        // Fetch real products from the backend when component mounts
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
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
        phone: '',
        productId: '', // We will find the DB _id on submit or just pass the slug
        length: 10,
        width: 500,
        loadCapacity: 50,
        material: 'Mild Steel',
        speed: 15
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
                phone: formData.phone,
                productId: selectedBackendProduct._id,
                parameters: {
                    length: Number(formData.length),
                    width: Number(formData.width),
                    loadCapacity: Number(formData.loadCapacity),
                    material: formData.material,
                    speed: Number(formData.speed)
                }
            };

            const res = await api.post('/quotes/generate', payload);
            
            if (res.data.success) {
                setResult(res.data);
                setStep(2);
            }
        } catch (error) {
            console.error(error);
            alert("Error generating quote. Please ensure your backend is running and the product exists in the DB.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const reset = () => {
        setStep(1);
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-[80px] pb-16">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                
                <div className="text-center mb-10 print:hidden">
                    <span className="inline-block px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                        Smart Quotation Builder
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 font-display uppercase">
                        Instant <span className="text-amber-500">Estimates</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Configure your ideal conveyor system and receive a highly accurate, AI-analyzed price estimate instantly.
                    </p>
                </div>

                {step === 1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Contact Details */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <FileText size={18} className="text-amber-500"/> Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name *</label>
                                        <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address *</label>
                                        <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Company</label>
                                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Phone</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Technical Specs */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Calculator size={18} className="text-amber-500"/> Technical Specifications
                                </h3>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Base System *</label>
                                    <select required name="productId" value={formData.productId} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
                                        <option value="">Select a Conveyor Type...</option>
                                        {backendProducts.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Length (Meters)</label>
                                        <input required type="number" min="1" name="length" value={formData.length} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Width (mm)</label>
                                        <input required type="number" min="100" name="width" value={formData.width} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Load Capacity (kg/m)</label>
                                        <input required type="number" min="1" name="loadCapacity" value={formData.loadCapacity} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-1">Operating Speed (m/min)</label>
                                        <input required type="number" min="1" name="speed" value={formData.speed} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Construction Material *</label>
                                    <div className="flex flex-wrap gap-4">
                                        {['Mild Steel', 'Stainless Steel (Food Grade)', 'Aluminum'].map(mat => (
                                            <label key={mat} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="material" 
                                                    value={mat} 
                                                    checked={formData.material === mat} 
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-amber-500 focus:ring-amber-500" 
                                                />
                                                <span className="text-sm font-medium text-slate-700">{mat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading || !formData.productId}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20} className="text-amber-500"/>}
                                {loading ? 'Calculating & Analyzing...' : 'Generate Smart Quote'}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && result && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
                    >
                        <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-black uppercase text-slate-900 mb-1">Official Estimate</h2>
                                <p className="text-slate-500">Prepared for {result.quote.customerName} {result.quote.company && `(${result.quote.company})`}</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Estimated Cost</span>
                                <span className="text-4xl font-black text-amber-500">₹{result.quote.calculatedCost.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-slate-50 rounded-2xl p-6">
                                <h4 className="font-bold text-slate-800 mb-4 uppercase text-sm tracking-wider">System Specifications</h4>
                                <ul className="space-y-3">
                                    <li className="flex justify-between text-sm"><span className="text-slate-500">System Type</span><span className="font-bold text-slate-900">{result.productName}</span></li>
                                    <li className="flex justify-between text-sm"><span className="text-slate-500">Length</span><span className="font-bold text-slate-900">{result.quote.parameters.length} Meters</span></li>
                                    <li className="flex justify-between text-sm"><span className="text-slate-500">Width</span><span className="font-bold text-slate-900">{result.quote.parameters.width} mm</span></li>
                                    <li className="flex justify-between text-sm"><span className="text-slate-500">Material</span><span className="font-bold text-slate-900">{result.quote.parameters.material}</span></li>
                                    <li className="flex justify-between text-sm"><span className="text-slate-500">Load Capacity</span><span className="font-bold text-slate-900">{result.quote.parameters.loadCapacity} kg/m</span></li>
                                </ul>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 relative overflow-hidden">
                                <Sparkles className="absolute top-4 right-4 text-amber-200/50" size={64}/>
                                <h4 className="font-bold text-amber-800 mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
                                    <Sparkles size={16}/> AI Value Insights
                                </h4>
                                <p className="text-amber-900/80 text-sm leading-relaxed relative z-10">
                                    {result.quote.aiInsights}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 print:hidden">
                            <button onClick={handlePrint} className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all">
                                <Download size={18}/> Download PDF
                            </button>
                            <button onClick={reset} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl flex justify-center items-center gap-2 transition-all">
                                <RefreshCw size={18}/> New Quote
                            </button>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default QuoteBuilder;

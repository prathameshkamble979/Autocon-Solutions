import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Package, Search, Sparkles, Loader2, Bot, Mic, Globe } from 'lucide-react';
import { PRODUCTS, tenant } from '../config';
import axios from 'axios';

const LANGUAGES = [
    { code: 'en-US', label: 'English' },
    { code: 'hi-IN', label: 'Hindi (हिंदी)' },
    { code: 'mr-IN', label: 'Marathi (मराठी)' },
    { code: 'es-ES', label: 'Spanish (Español)' },
    { code: 'fr-FR', label: 'French (Français)' },
    { code: 'de-DE', label: 'German (Deutsch)' }
];

const card = {
    hidden:  { opacity: 0, y: 28 },
    visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' } }),
};

const Products = () => {
    const [search, setSearch] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [aiResults, setAiResults] = useState(null);
    const [aiReasoningMap, setAiReasoningMap] = useState({});
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('en-US');
    const location = useLocation();
    const hasStartedVoiceRef = useRef(false);

    useEffect(() => {
        // If the user navigates here with autoVoice state, automatically start the mic
        if (location.state?.autoVoice && location.state.autoVoice !== hasStartedVoiceRef.current) {
            hasStartedVoiceRef.current = location.state.autoVoice;
            
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance("Search product. What do you want to search?");
                utterance.lang = "en-US";
                
                utterance.onend = () => {
                    startVoiceSearch();
                };
                
                // Fallback in case onend fails to fire
                const fallbackTimeout = setTimeout(() => {
                    startVoiceSearch();
                }, 4000);
                
                utterance.addEventListener('end', () => clearTimeout(fallbackTimeout));
                
                window.speechSynthesis.speak(utterance);
            } else {
                setTimeout(() => {
                    startVoiceSearch();
                }, 300);
            }
            
            // Clean up the state so it doesn't re-trigger on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const startVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Voice Search. Please try Google Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearch(transcript);
            performSearch(transcript, true);
        };

        recognition.onerror = (event) => {
            console.error("Voice Recognition Error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const performSearch = async (query, isVoice = false) => {
        if (!query.trim()) {
            setAiResults(null);
            setAiReasoningMap({});
            return;
        }

        setLoadingAI(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/search`, { query, language });
            if (res.data.success) {
                // If AI returns empty array, we will just set empty array and it shows "No products found"
                setAiResults(res.data.results);
                
                // Create a map of productId -> reason for easy lookup
                const reasons = {};
                if (res.data.aiReasoning) {
                    res.data.aiReasoning.forEach(r => {
                        reasons[r.productId] = r.reason;
                    });
                }
                setAiReasoningMap(reasons);

                // Speak back if it was a voice search
                if (isVoice && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    let utteranceText = res.data.speechSummary || "";
                    if (!utteranceText) {
                        if (res.data.results.length === 0) {
                            utteranceText = "I'm sorry, I couldn't find any products matching your criteria.";
                        } else {
                            utteranceText = `I found ${res.data.results.length} products for you. `;
                            if (res.data.aiReasoning && res.data.aiReasoning.length > 0) {
                                const topProductName = res.data.results[0].name;
                                const topReason = res.data.aiReasoning[0].reason;
                                utteranceText += `The top match is ${topProductName}, because ${topReason}`;
                            }
                        }
                    }
                    const utterance = new SpeechSynthesisUtterance(utteranceText);
                    utterance.lang = language;
                    window.speechSynthesis.speak(utterance);
                }
            }
        } catch (error) {
            console.error("AI Search Error:", error);
            // Fallback to local static search if AI fails
            setAiResults(null); 
        } finally {
            setLoadingAI(false);
        }
    };

    const handleAiSearch = () => performSearch(search, false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAiSearch();
        }
    };

    // Use AI results if available, otherwise fallback to local static filtering
    const filtered = aiResults !== null ? aiResults : PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-[65px] pb-16">

            {/* Header */}
            <div className="relative bg-[#0f172a] text-white py-20 mb-10 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-60" />
                <div className="absolute left-0 top-0 w-1.5 h-full bg-amber-500" />
                <div className="container mx-auto px-4 md:px-8 relative">
                    {/* Breadcrumb */}
                    <div className="flex items-center text-sm text-slate-400 mb-6">
                        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-amber-400 font-semibold">Products</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                                Product Catalogue
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black mb-3 font-display uppercase">
                                Conveyor <span className="text-amber-500">Systems</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-2xl">
                                {tenant.name} manufactures custom conveyor and material handling systems for all industries.
                            </p>
                        </div>
                        <div className="w-full md:w-[450px] flex-shrink-0">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <Sparkles size={14} className="text-amber-400" /> AI Semantic Search
                                </label>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/50 rounded-full pl-2 pr-1 py-0.5 border border-slate-700/50">
                                    <Globe size={12} />
                                    <select 
                                        value={language} 
                                        onChange={e => setLanguage(e.target.value)}
                                        className="bg-transparent border-none outline-none cursor-pointer focus:ring-0 text-slate-300"
                                    >
                                        {LANGUAGES.map(l => (
                                            <option key={l.code} value={l.code} className="bg-slate-800">{l.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="e.g. I need a conveyor for heavy boxes..."
                                    value={search}
                                    onChange={e => {
                                        setSearch(e.target.value);
                                        if (e.target.value === '') setAiResults(null);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    className="w-full pl-10 pr-32 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                                <button 
                                    onClick={startVoiceSearch}
                                    type="button"
                                    className={`absolute right-24 p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                    title="Voice Search"
                                >
                                    <Mic size={18} />
                                </button>
                                <button 
                                    onClick={handleAiSearch}
                                    disabled={loadingAI}
                                    className="absolute right-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
                                >
                                    {loadingAI ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8">
                {/* Info bar */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-slate-600 font-medium flex items-center gap-2">
                        {aiResults !== null && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1"><Bot size={12}/> AI Results</span>}
                        Showing <span className="font-bold text-slate-900">{filtered.length}</span> product types
                    </p>
                    <span className="text-sm text-slate-500">Click a product to view details</span>
                </div>

                {/* Grid */}
                <AnimatePresence>
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((product, i) => (
                                <motion.div
                                    key={product.slug || product._id}
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    variants={card}
                                    layout
                                >
                                    <Link
                                        to={`/products/${product.slug}`}
                                        className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-amber-400 transition-all duration-300 hover:-translate-y-2 h-full"
                                    >
                                        <div className="relative h-52 overflow-hidden bg-slate-200 shrink-0">
                                            <img
                                                src={product.image || '/placeholder.jpg'}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={e => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold rounded uppercase tracking-wide">
                                                Conveyor
                                            </span>
                                        </div>
                                        <div className="p-6 flex-grow flex flex-col">
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors font-display">
                                                {product.name}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                                                {product.shortDesc}
                                            </p>
                                            
                                            {/* Show AI Reasoning if this was an AI Search */}
                                            {aiReasoningMap[product._id] && (
                                                <div className="mt-auto mb-4 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                                                    <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
                                                        <Sparkles size={12} /> Why it matches
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-snug">
                                                        {aiReasoningMap[product._id]}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-auto flex items-center text-sm font-bold text-amber-600">
                                                View Details <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                            <Package className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No products found</h3>
                            <p className="text-slate-500 mb-6">Try a different search term.</p>
                            <button onClick={() => { setSearch(''); setAiResults(null); }} className="text-amber-600 font-bold hover:underline">
                                Clear search
                            </button>
                        </div>
                    )}
                </AnimatePresence>

                {/* CTA */}
                <div className="mt-20 bg-[#0f172a] rounded-3xl p-10 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-60" />
                    <div className="relative">
                        <h2 className="text-2xl md:text-4xl font-black mb-4 font-display uppercase">
                            Need a <span className="text-amber-500">Custom Conveyor</span> Solution?
                        </h2>
                        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                            Our engineering team designs and builds conveyor systems tailored exactly to your production layout, 
                            load requirements and automation goals.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all"
                        >
                            Request a Custom Quote <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;

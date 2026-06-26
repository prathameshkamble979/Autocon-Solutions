import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { tenant } from '../config';

const QUESTIONS = [
  {
    id: 'industry',
    title: 'What industry are you in?',
    type: 'select',
    options: ['Food & Beverage', 'Automotive', 'Warehouse & Logistics', 'Pharmaceutical', 'Manufacturing', 'Other']
  },
  {
    id: 'material',
    title: 'What type of material will be transported?',
    type: 'text',
    placeholder: 'e.g., Heavy boxes, loose powders, glass bottles...'
  },
  {
    id: 'weightCapacity',
    title: 'What is the required weight capacity?',
    type: 'select',
    options: ['Light (up to 50kg)', 'Medium (50kg - 200kg)', 'Heavy (200kg - 1000kg)', 'Extra Heavy (1000kg+)']
  },
  {
    id: 'environment',
    title: 'What is the operating environment?',
    type: 'select',
    options: ['Indoor (Clean)', 'Indoor (Dusty/Harsh)', 'Outdoor', 'Cold Storage']
  },
  {
    id: 'foodGrade',
    title: 'Do you require Food Grade (Stainless Steel) construction?',
    type: 'select',
    options: ['Yes', 'No', 'Not Sure']
  }
];

const AIAdvisorPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: value }));
  };

  const nextStep = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      // Submit to AI
      setLoading(true);
      try {
        const response = await api.post('/ai/advisor/recommend', answers);
        setResult(response.data.recommendation);
      } catch (error) {
        console.error("AI Advisor Error:", error);
        setResult({ error: true, message: "We encountered an error. Please try again later." });
      } finally {
        setLoading(false);
      }
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="min-h-[calc(100vh-62px)] bg-slate-50 flex flex-col pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl flex-grow flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-6">
            <Bot size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-4 tracking-tight">
            AI Product Advisor
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Answer a few quick questions and our AI will recommend the perfect industrial solution for your specific needs.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10 flex-grow flex flex-col relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* Loading State */}
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10"
              >
                <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-[#0F172A]">Analyzing your requirements...</h3>
                <p className="text-slate-500 mt-2">Our AI is searching the catalog for the best match.</p>
              </motion.div>
            )}

            {/* Results State */}
            {!loading && result && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full"
              >
                {result.error || !result.product ? (
                  <div className="text-center py-12">
                    <PackageSearch size={48} className="mx-auto text-slate-400 mb-4" />
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">No exact match found</h3>
                    <p className="text-slate-500 mb-8">{result.message || "We couldn't find a perfect off-the-shelf product for those precise criteria."}</p>
                    <button onClick={reset} className="btn-primary">Try Again</button>
                    <div className="mt-4">
                      <span className="text-slate-500">Or contact our engineering team for a custom solution.</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-6 text-amber-600 font-bold bg-amber-50 p-4 rounded-xl">
                      <CheckCircle2 size={24} />
                      <span>Match Found! Here is our AI's recommendation:</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      {/* Product Card visual */}
                      <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm group">
                        <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                           <img 
                              src={result.product.image !== 'no-photo.jpg' ? result.product.image : '/placeholder.jpg'} 
                              alt={result.product.name}
                              className="w-full h-full object-cover"
                           />
                           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#0F172A]">
                             {result.product.category}
                           </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-black text-[#0F172A] mb-2">{result.product.name}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4">{result.product.shortDesc}</p>
                          <Link to={`/product/${result.product.slug}`} className="flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700">
                            View Full Details <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>

                      {/* AI Reasoning */}
                      <div className="flex flex-col justify-center">
                        <h4 className="text-lg font-bold text-[#0F172A] mb-3">Why this fits your needs:</h4>
                        <p className="text-slate-600 mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {result.reason}
                        </p>
                        
                        <h4 className="text-lg font-bold text-[#0F172A] mb-3">Key Advantages:</h4>
                        <ul className="space-y-2 mb-8">
                          {result.advantages?.map((adv, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-600">
                              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-sm">{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                       <button onClick={reset} className="text-slate-500 font-semibold hover:text-[#0F172A]">
                         Start Over
                       </button>
                       <Link to="/contact" className="bg-[#0F172A] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                         Request Quote <ArrowRight size={18} />
                       </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Questions State */}
            {!loading && !result && (
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                   <motion.div 
                     className="h-full bg-amber-500" 
                     initial={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                     animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                   />
                </div>

                <div className="mb-2 text-amber-600 font-bold text-sm tracking-widest uppercase">
                  Question {step + 1} of {QUESTIONS.length}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-8">
                  {QUESTIONS[step].title}
                </h2>

                <div className="flex-grow">
                  {QUESTIONS[step].type === 'select' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {QUESTIONS[step].options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(opt)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            answers[QUESTIONS[step].id] === opt 
                              ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold' 
                              : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50 text-[#0F172A] font-semibold'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input 
                      type="text"
                      autoFocus
                      className="w-full text-lg p-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all outline-none text-[#0F172A] font-semibold"
                      placeholder={QUESTIONS[step].placeholder}
                      value={answers[QUESTIONS[step].id] || ''}
                      onChange={(e) => handleAnswer(e.target.value)}
                      onKeyDown={(e) => { if(e.key === 'Enter' && answers[QUESTIONS[step].id]) nextStep() }}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
                  <button 
                    onClick={prevStep}
                    disabled={step === 0}
                    className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg transition-colors ${
                      step === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-[#0F172A] hover:bg-slate-100'
                    }`}
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  
                  <button 
                    onClick={nextStep}
                    disabled={!answers[QUESTIONS[step].id]}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      !answers[QUESTIONS[step].id] 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-amber-500 text-[#0F172A] hover:bg-amber-400 shadow-md shadow-amber-500/20 hover:scale-[1.02]'
                    }`}
                  >
                    {step === QUESTIONS.length - 1 ? 'Find My Solution' : 'Continue'} <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorPage;

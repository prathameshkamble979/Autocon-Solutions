import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calculator, TrendingDown, Clock, Download, IndianRupee } from 'lucide-react';

const ROICalculator = () => {
    const [inputs, setInputs] = useState({
        systemCost: 500000,
        workersReplaced: 4,
        workerSalary: 20000, // Monthly salary per worker
        maintenanceCost: 5000 // Monthly maintenance for conveyor
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: Number(value) }));
    };

    // Calculations
    const monthlyLaborCost = inputs.workersReplaced * inputs.workerSalary;
    const monthlySavings = monthlyLaborCost - inputs.maintenanceCost;
    const paybackPeriod = monthlySavings > 0 ? (inputs.systemCost / monthlySavings).toFixed(1) : 'Never';
    const yearlySavings = monthlySavings * 12;
    const fiveYearROI = ((yearlySavings * 5) - inputs.systemCost);

    // Chart Data Generation (Over 24 months)
    const chartData = useMemo(() => {
        let data = [];
        let cumulativeManualCost = 0;
        let cumulativeAutoCost = inputs.systemCost;

        for (let i = 0; i <= 24; i++) {
            data.push({
                month: `Month ${i}`,
                manualCost: cumulativeManualCost,
                automatedCost: cumulativeAutoCost
            });
            cumulativeManualCost += monthlyLaborCost;
            cumulativeAutoCost += inputs.maintenanceCost;
        }
        return data;
    }, [inputs, monthlyLaborCost]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="min-h-screen bg-slate-50 pt-[80px] pb-16">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                
                <div className="text-center mb-10 print:hidden">
                    <span className="inline-block px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                        Financial Analysis
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 font-display uppercase">
                        ROI <span className="text-amber-500">Calculator</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        See exactly how quickly an Autocon Solutions system pays for itself by reducing manual labor costs.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Inputs Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 lg:col-span-1 print:hidden"
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Calculator size={18} className="text-amber-500"/> Investment Details
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Estimated System Cost (₹)</label>
                                <input type="number" name="systemCost" value={inputs.systemCost} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Manual Workers Replaced</label>
                                <input type="number" name="workersReplaced" value={inputs.workersReplaced} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Avg. Monthly Salary per Worker (₹)</label>
                                <input type="number" name="workerSalary" value={inputs.workerSalary} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Est. Monthly Maintenance (₹)</label>
                                <input type="number" name="maintenanceCost" value={inputs.maintenanceCost} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                            </div>
                        </div>

                        <button onClick={() => window.print()} className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all">
                            <Download size={18}/> Download Report
                        </button>
                    </motion.div>

                    {/* Results Dashboard */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 lg:col-span-2"
                    >
                        <h2 className="text-2xl font-black uppercase text-slate-900 mb-6">Financial Impact</h2>
                        
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                                <span className="block text-xs font-bold text-amber-800 uppercase mb-2 flex items-center gap-1"><Clock size={14}/> Payback Period</span>
                                <span className="text-3xl font-black text-amber-600">{paybackPeriod} <span className="text-sm font-semibold">Months</span></span>
                            </div>
                            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                                <span className="block text-xs font-bold text-green-800 uppercase mb-2 flex items-center gap-1"><TrendingDown size={14}/> Monthly Savings</span>
                                <span className="text-3xl font-black text-green-600">{formatCurrency(monthlySavings)}</span>
                            </div>
                            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                                <span className="block text-xs font-bold text-blue-800 uppercase mb-2 flex items-center gap-1"><IndianRupee size={14}/> 5-Year Net Profit</span>
                                <span className="text-3xl font-black text-blue-600">{formatCurrency(fiveYearROI)}</span>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="h-[400px] w-full">
                            <h4 className="font-bold text-slate-600 uppercase text-xs tracking-wider mb-4 text-center">Cumulative Cost Comparison (24 Months)</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} minTickGap={30} />
                                    <YAxis tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                                    <Area type="monotone" name="Manual Process Cost" dataKey="manualCost" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorManual)" />
                                    <Area type="monotone" name="Autocon System Cost" dataKey="automatedCost" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAuto)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default ROICalculator;

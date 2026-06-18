
import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { tenant } from '../../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            toast.success('Welcome back to the System.');
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] font-sans">
            <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200 w-full max-w-[420px]">
                {/* Header */}
                <div className="text-center mb-8">
                    {tenant?.branding?.logo && (
                        <div className="mx-auto mb-5 flex justify-center">
                            <img src={tenant.branding.logo} alt="Company Logo" className="h-14 object-contain" />
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight font-poppins">
                        System Access
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Industrial Management Portal</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm mb-6 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Username / Email
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="Enter system ID"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Security Key
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-11 py-3 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="Enter access password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D97706] hover:bg-[#B45309] text-white py-3 mt-4 rounded font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                    >
                        {loading ? 'Authenticating...' : 'Submit Credentials'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                    <a href="/" className="text-sm font-semibold text-slate-500 hover:text-[#D97706] mb-4 inline-block transition-colors">
                        &larr; Return to Website
                    </a>
                    <p className="text-xs text-slate-400">
                        Unauthorized access is strictly prohibited.<br/>
                        &copy; Autocon Solutions LLP
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

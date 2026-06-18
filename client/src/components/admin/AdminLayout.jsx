
import Sidebar from './Sidebar';
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { LogOut, User, AlertTriangle, X, CheckCircle, Eye, EyeOff, Pencil } from 'lucide-react';

const AdminLayout = ({ children, title = "Admin Panel" }) => {
    const { logout, user, updateProfile } = useContext(AuthContext);

    // Logout modal
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const handleLogoutClick = () => setShowLogoutModal(true);
    const handleConfirmLogout = () => { setShowLogoutModal(false); logout(); };
    const handleCancelLogout = () => setShowLogoutModal(false);

    // Profile modal
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '' });
    const [showCurrPass, setShowCurrPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [profileMsg, setProfileMsg] = useState(null); // { type: 'success'|'error', text }
    const [savingProfile, setSavingProfile] = useState(false);

    const openProfile = () => {
        setProfileForm({ name: user?.name || '', email: user?.email || '', currentPassword: '', newPassword: '' });
        setProfileMsg(null);
        setShowProfileModal(true);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileMsg(null);
        const payload = { name: profileForm.name, email: profileForm.email };
        if (profileForm.newPassword) {
            payload.password = profileForm.newPassword;
            payload.currentPassword = profileForm.currentPassword;
        }
        const result = await updateProfile(payload);
        setSavingProfile(false);
        if (result.success) {
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
            setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        } else {
            setProfileMsg({ type: 'error', text: result.message });
        }
    };

    return (
        <div className="flex h-screen bg-[#F1F5F9] font-sans overflow-hidden">
            <Sidebar />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
                    <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">{title}</h1>
                    <div className="flex items-center gap-5">
                        {/* Administrator chip — clickable */}
                        <button
                            onClick={openProfile}
                            className="flex items-center gap-2.5 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-colors group"
                        >
                            <div className="w-6 h-6 rounded-full bg-[#0F172A] flex items-center justify-center text-amber-500">
                                <User size={14} strokeWidth={2.5} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{user?.name || 'Administrator'}</span>
                            <Pencil size={12} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                        </button>
                        <div className="h-6 w-px bg-slate-300"></div>
                        <button 
                            onClick={handleLogoutClick} 
                            className="text-sm font-semibold text-slate-500 flex items-center gap-2 hover:text-[#D97706] transition-colors"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* ── Profile Modal ── */}
            {showProfileModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowProfileModal(false); }}
                >
                    <div className="bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center">
                                    <User size={20} className="text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg leading-tight">Admin Profile</h2>
                                    <p className="text-slate-500 text-xs">Manage your account details</p>
                                </div>
                            </div>
                            <button onClick={() => setShowProfileModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleProfileSave} className="px-7 py-6 space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Display Name</label>
                                <input
                                    type="text"
                                    value={profileForm.name}
                                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Administrator"
                                    className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="admin@autocon.com"
                                    className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-700"></div>
                                <span className="text-slate-500 text-xs">Change Password (optional)</span>
                                <div className="flex-1 h-px bg-slate-700"></div>
                            </div>

                            {/* Current Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrPass ? 'text' : 'password'}
                                        value={profileForm.currentPassword}
                                        onChange={e => setProfileForm(p => ({ ...p, currentPassword: e.target.value }))}
                                        placeholder="Enter current password"
                                        className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                    <button type="button" onClick={() => setShowCurrPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                        {showCurrPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPass ? 'text' : 'password'}
                                        value={profileForm.newPassword}
                                        onChange={e => setProfileForm(p => ({ ...p, newPassword: e.target.value }))}
                                        placeholder="Enter new password"
                                        className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                    <button type="button" onClick={() => setShowNewPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                        {showNewPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>

                            {/* Feedback message */}
                            {profileMsg && (
                                <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
                                    profileMsg.type === 'success'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                    {profileMsg.type === 'success' ? <CheckCircle size={15}/> : <AlertTriangle size={15}/>}
                                    {profileMsg.text}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(false)}
                                    className="flex-1 py-2.5 rounded-lg border border-slate-600 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="flex-1 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-60"
                                >
                                    {savingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Logout Confirmation Modal ── */}
            {showLogoutModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
                >
                    <div className="bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <AlertTriangle size={28} className="text-amber-500" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-white text-lg font-bold mb-1">Confirm Logout</h2>
                            <p className="text-slate-400 text-sm">Do you want to logout from the admin panel?</p>
                        </div>
                        <div className="flex gap-3 w-full mt-1">
                            <button
                                onClick={handleCancelLogout}
                                className="flex-1 py-2.5 rounded-lg border border-slate-600 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors"
                            >
                                No, Stay
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="flex-1 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut size={15} /> Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;


import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, FolderKanban, MessageSquarePlus } from 'lucide-react';
import clsx from 'clsx';
import { tenant } from '../../config';

const Sidebar = () => {
    const location = useLocation();
    
    const links = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: PackageSearch },
        { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
        { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquarePlus },
    ];

    return (
        <div className="w-64 bg-[#0F172A] border-r border-slate-800 text-slate-300 min-h-screen flex flex-col shrink-0 drop-shadow-2xl z-10">
            {/* Logo area */}
            <div className="h-16 flex items-center px-6 border-b border-white/10 bg-[#0B1120]">
                <div className="flex items-center gap-3">
                    <span className="text-white font-bold tracking-wide uppercase text-sm truncate" title={tenant?.name || 'Industrial System'}>
                        System OS
                    </span>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-6 px-4 space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Management</div>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname.includes(link.path);

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                                isActive
                                    ? "bg-[#D97706] text-white shadow-md"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            )}
                        >
                            <Icon size={18} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
            
            {/* Bottom Section */}
            <div className="p-4 border-t border-white/10 text-xs text-slate-500 text-center">
                Autocon Solutions<br/>v1.2.0-rc1
            </div>
        </div>
    );
};

export default Sidebar;

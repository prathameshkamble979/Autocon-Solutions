
import { useEffect, useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Inbox,
    PhoneCall,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    X,
    User,
    Building2,
    Mail,
    Phone,
    MessageSquare,
    Calendar,
    Search,
    Clock,
    AlertTriangle,
    Zap,
    Filter
} from 'lucide-react';

const STATUS_COLORS = {
    NEW: 'bg-blue-100 text-blue-700 border-blue-200',
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    CONTACTED: 'bg-blue-100 text-blue-700 border-blue-200',
    CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
    ACCEPTED: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
};

const TYPE_COLORS = {
    PROJECT: 'bg-purple-100 text-purple-700',
    PRODUCT: 'bg-blue-100 text-blue-700',
    CONTACT: 'bg-emerald-100 text-emerald-700',
    VISIT: 'bg-rose-100 text-rose-700',
    ENQUIRY: 'bg-amber-100 text-amber-700'
};

const PRIORITY_COLORS = {
    HIGH: 'bg-red-100 text-red-700 border-red-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    LOW: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

const DetailDrawer = ({ enquiry, onClose, onStatusChange, onDelete }) => {
    if (!enquiry) return null;

    const fields = [
        { icon: User, label: 'Name', value: enquiry.name },
        { icon: Building2, label: 'Company', value: enquiry.company || '—' },
        { icon: Phone, label: 'Phone', value: enquiry.phone },
        { icon: Mail, label: 'Email', value: enquiry.email },
        { icon: Package, label: 'Product / Interest', value: enquiry.product || '—' },
        { icon: Package, label: 'Requirement Type', value: enquiry.requirementType || 'NEW' },
        { icon: Calendar, label: 'Source', value: enquiry.source || 'Website' },
        { icon: MessageSquare, label: 'Message', value: enquiry.message || '—' },
    ];

    const waLink = `https://wa.me/${enquiry.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${enquiry.name}, regarding your enquiry for ${enquiry.product || 'our solutions'} at Autocon Solutions...`)}`;

    return (
        <AnimatePresence>
            <motion.div
                key="drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 z-40"
                onClick={onClose}
            />
            <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-900 text-white relative overflow-hidden">
                    {enquiry.priority === 'HIGH' && (
                        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20 transform translate-x-4 -translate-y-4">
                            <Zap size={80} className="text-red-500" />
                        </div>
                    )}
                    <div className="relative z-10 w-full pr-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${TYPE_COLORS[enquiry.type] || 'bg-slate-500/80'}`}>
                                {enquiry.type}
                            </span>
                            {enquiry.priority && (
                                <span className={`inline-block text-xs font-bold px-2 py-0.5 border rounded ${PRIORITY_COLORS[enquiry.priority]}`}>
                                    {enquiry.priority} PRIORITY
                                </span>
                            )}
                            {enquiry.isDuplicate && (
                                <span className={`inline-block text-xs font-bold px-2 py-0.5 border bg-rose-100 text-rose-700 border-rose-200 rounded flex items-center gap-1`}>
                                    <AlertTriangle size={12}/> DUPLICATE
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-black">{enquiry.name}</h3>
                        <p className="text-slate-400 text-xs mt-1">{new Date(enquiry.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded transition-colors z-20 bg-slate-800">
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="px-6 py-4 bg-white border-b border-slate-100 flex gap-3">
                    <a
                        href={`tel:${enquiry.phone}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 rounded-lg transition-colors border border-blue-200 shadow-sm"
                    >
                        <PhoneCall size={16} /> Call Lead
                    </a>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2.5 rounded-lg transition-colors border border-emerald-200 shadow-sm"
                    >
                        <MessageSquare size={16} /> WhatsApp
                    </a>
                </div>

                {/* Status Changer */}
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex flex-col gap-3">
                    <span className="text-sm font-bold text-slate-800">Pipeline Status</span>
                    <div className="flex flex-wrap gap-2">
                        {['PENDING', 'CONTACTED', 'CLOSED'].map((s) => (
                            <button
                                key={s}
                                onClick={() => onStatusChange(enquiry._id, s)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex-1 ${enquiry.status === s || (enquiry.status === 'NEW' && s === 'PENDING')
                                    ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current shadow-md'
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100 opacity-60'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fields */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
                    {fields.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <Icon size={15} className="text-slate-500" />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">{label}</p>
                                <p className="text-sm text-slate-800 font-semibold whitespace-pre-wrap">{value}</p>
                            </div>
                        </div>
                    ))}
                    
                    {enquiry.drawing && (
                        <div className="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Package size={15} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Attachment</p>
                                <a
                                    href={enquiry.drawing}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 font-bold underline"
                                >
                                    View Drawing / File
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Button */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={() => onDelete(enquiry._id)}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold transition-colors"
                    >
                        Delete Enquiry
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    const fetchEnquiries = async () => {
        try {
            const { data } = await api.get('/bookings');
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setEnquiries(sortedData);
        } catch (error) {
            console.error('Failed to fetch enquiries', error);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const handleStatusChange = async (id, newStatus, adminNote = '') => {
        try {
            await api.put(`/bookings/${id}`, { status: newStatus, adminNote });
            setSelectedEnquiry((prev) => prev && prev._id === id ? { ...prev, status: newStatus } : prev);
            fetchEnquiries();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            setSelectedEnquiry(null);
            fetchEnquiries();
        } catch (error) {
            console.error('Failed to delete enquiry', error);
        }
    };

    // --- Stats ---
    const stats = useMemo(() => {
        const total = enquiries.length;
        const pending = enquiries.filter((b) => b.status === 'PENDING' || b.status === 'NEW').length;
        const highPriority = enquiries.filter((b) => b.priority === 'HIGH').length;
        const contacted = enquiries.filter((b) => b.status === 'CONTACTED').length;
        return { total, pending, highPriority, contacted };
    }, [enquiries]);

    const statCards = [
        { label: 'Total Leads', value: stats.total, icon: Inbox, color: 'bg-slate-900 border border-slate-800 text-white' },
        { label: 'High Priority', value: stats.highPriority, icon: Zap, color: 'bg-red-600 border border-red-500 text-white' },
        { label: 'Pending Action', value: stats.pending, icon: Clock, color: 'bg-amber-500 border border-amber-400 text-white' },
        { label: 'Contacted', value: stats.contacted, icon: PhoneCall, color: 'bg-blue-600 border border-blue-500 text-white' },
    ];

    // --- Filtered & Searched data ---
    const filteredEnquiries = useMemo(() => {
        let result = enquiries;

        if (activeFilter !== 'ALL') {
            if (activeFilter === 'PENDING') {
                result = result.filter(b => b.status === 'PENDING' || b.status === 'NEW');
            } else {
                result = result.filter((b) => b.status === activeFilter);
            }
        }

        if (priorityFilter !== 'ALL') {
             result = result.filter((b) => b.priority === priorityFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b => 
                (b.name && b.name.toLowerCase().includes(query)) || 
                (b.phone && b.phone.includes(query)) ||
                (b.email && b.email.toLowerCase().includes(query)) ||
                (b.company && b.company.toLowerCase().includes(query)) ||
                (b.product && b.product.toLowerCase().includes(query))
            );
        }

        return result;
    }, [enquiries, activeFilter, priorityFilter, searchQuery]);

    const filterTabs = [
        { label: 'All Leads', key: 'ALL' },
        { label: 'Pending', key: 'PENDING' },
        { label: 'Contacted', key: 'CONTACTED' },
        { label: 'Closed', key: 'CLOSED' },
    ];

    const columns = useMemo(
        () => [
            {
                accessorKey: 'priority',
                header: 'Pri',
                cell: (info) => {
                    const pri = info.getValue() || 'MEDIUM';
                    return (
                        <div className="flex justify-center">
                            <span className={`w-3 h-3 rounded-full ${pri === 'HIGH' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : pri === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} title={`${pri} Priority`}></span>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'name', 
                header: 'Lead Name', 
                cell: info => (
                    <div>
                        <span className="font-bold text-slate-900 block">{info.getValue()}</span>
                        {info.row.original.isDuplicate && <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Duplicate</span>}
                    </div>
                ) 
            },
            { accessorKey: 'phone', header: 'Phone', cell: info => <span className="text-slate-600 font-medium">{info.getValue()}</span> },
            {
                accessorKey: 'product',
                header: 'Interest / Source',
                cell: (info) => (
                    <div>
                         <span className="truncate max-w-[160px] block font-bold text-slate-800 text-xs mb-0.5" title={info.getValue()}>{info.getValue() || '—'}</span>
                         <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{info.row.original.source || 'Website'}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Workflow Stage',
                cell: (info) => {
                    let currentStatus = info.getValue() === 'NEW' ? 'PENDING' : info.getValue();
                    const id = info.row.original._id;
                    return (
                        <select
                            value={currentStatus}
                            onChange={(e) => { e.stopPropagation(); handleStatusChange(id, e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-xs font-black border rounded-lg px-2 py-1.5 outline-none cursor-pointer tracking-wider ${STATUS_COLORS[currentStatus] || ''}`}
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="CLOSED">CLOSED</option>
                        </select>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Received',
                cell: (info) => {
                    const date = new Date(info.getValue());
                    const today = new Date();
                    const diffTime = Math.abs(today - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    const isPendingAction = (info.row.original.status === 'NEW' || info.row.original.status === 'PENDING') && diffDays > 1;

                    return (
                        <div>
                             <span className={`text-xs block font-bold mb-0.5 ${diffDays <= 1 ? 'text-amber-600' : 'text-slate-600'}`}>
                                {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                             </span>
                             {isPendingAction && <span className="text-[10px] bg-red-100 text-red-700 px-1 py-0.5 rounded font-black border border-red-200">URGENT</span>}
                        </div>
                    );
                }
            },
        ],
        []
    );

    const table = useReactTable({
        data: filteredEnquiries,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Engine CRM</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Qualify, prioritize, and respond to incoming leads</p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className={`${color} rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-slate-200/50`}>
                            <div>
                                <p className="text-[12px] uppercase tracking-wider font-bold opacity-80 mb-2">{label}</p>
                                <p className="text-4xl font-black leading-none">{value}</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Icon size={28} className="opacity-100" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters, Search & Priority */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {filterTabs.map(({ label, key }) => (
                                <button
                                    key={key}
                                    onClick={() => { setActiveFilter(key); table.setPageIndex(0); }}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === key
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                             <Filter size={16} className="text-slate-400 ml-2" />
                             <select 
                                value={priorityFilter} 
                                onChange={(e) => setPriorityFilter(e.target.value)} 
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                              >
                                  <option value="ALL">All Priorities</option>
                                  <option value="HIGH">High Priority</option>
                                  <option value="MEDIUM">Medium Priority</option>
                                  <option value="LOW">Low Priority</option>
                             </select>
                        </div>
                    </div>
                    
                    <div className="relative w-full lg:w-80">
                        <Search size={16} className="absolute left-4 top-3 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search name, phone, email, product..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/80 border-b border-slate-200">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className={`px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest ${header.column.id === 'priority' ? 'w-12 text-center' : ''}`}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center py-24 text-slate-500">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Inbox size={32} className="text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">No leads found</h3>
                                            <p className="text-sm font-medium">Try adjusting your filters or search query.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => {
                                        const isHigh = row.original.priority === 'HIGH';
                                        return (
                                        <tr
                                            key={row.id}
                                            onClick={() => setSelectedEnquiry(row.original)}
                                            className={`border-b cursor-pointer transition-colors group ${isHigh ? 'border-red-100 bg-red-50/20 hover:bg-red-50' : 'border-slate-100 hover:bg-slate-50'}`}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    )})
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredEnquiries.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                Showing <span className="text-slate-900">{table.getRowModel().rows.length}</span> of {filteredEnquiries.length} leads
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-xs font-bold text-slate-600 px-3">
                                    Page {table.getState().pagination.pageIndex + 1}
                                </span>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Drawer */}
            {selectedEnquiry && (
                <DetailDrawer
                    enquiry={selectedEnquiry}
                    onClose={() => setSelectedEnquiry(null)}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                />
            )}
        </AdminLayout>
    );
};

export default Enquiries;

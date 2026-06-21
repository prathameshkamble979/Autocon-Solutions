import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { PackageSearch, FolderKanban, MessageSquarePlus, Calculator, FileText } from 'lucide-react';
import api from '../../utils/api';

const Dashboard = () => {
    const [stats, setStats] = useState({ products: 0, projects: 0, enquiries: 0, quotes: 0, proposals: 0 });
    const [recentEnquiries, setRecentEnquiries] = useState([]);
    const [recentQuotes, setRecentQuotes] = useState([]);
    const [recentProposals, setRecentProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch directly from the allowed APIs
                const [productsRes, projectsRes, bookingsRes, statsRes, quotesRes, proposalsRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/projects'),
                    api.get('/bookings'),
                    api.get('/dashboard/stats'),
                    api.get('/quotes').catch(() => ({ data: { quotes: [] } })),
                    api.get('/proposals').catch(() => ({ data: { proposals: [] } }))
                ]);

                const bookings = bookingsRes.data || [];

                setStats({
                    products: statsRes.data?.counts?.products || productsRes.data?.length || 0,
                    projects: statsRes.data?.counts?.projects || projectsRes.data?.length || 0,
                    enquiries: statsRes.data?.counts?.bookings || bookings.length,
                    quotes: statsRes.data?.counts?.quotes || 0,
                    proposals: statsRes.data?.counts?.proposals || 0
                });

                setRecentQuotes(quotesRes.data?.quotes?.slice(0, 5) || []);
                setRecentProposals(proposalsRes.data?.proposals?.slice(0, 5) || []);

                // Top 5 most recent enquiries
                const sorted = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentEnquiries(sorted.slice(0, 5));

            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <AdminLayout title="Dashboard Overview"><div className="py-20 text-center text-slate-500 font-medium animate-pulse">Loading system metrics...</div></AdminLayout>;

    return (
        <AdminLayout title="Dashboard Overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Products</p>
                        <h3 className="text-4xl font-extrabold text-[#0F172A]">{stats.products}</h3>
                    </div>
                    <div className="w-14 h-14 rounded bg-[#F1F5F9] flex items-center justify-center text-[#0F172A] border border-slate-200">
                        <PackageSearch size={26} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Projects</p>
                        <h3 className="text-4xl font-extrabold text-[#0F172A]">{stats.projects}</h3>
                    </div>
                    <div className="w-14 h-14 rounded bg-[#F1F5F9] flex items-center justify-center text-[#D97706] border border-slate-200">
                        <FolderKanban size={26} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Enquiries</p>
                        <h3 className="text-4xl font-extrabold text-[#0F172A]">{stats.enquiries}</h3>
                    </div>
                    <div className="w-14 h-14 rounded bg-[#F1F5F9] flex items-center justify-center text-blue-600 border border-slate-200">
                        <MessageSquarePlus size={26} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Generated Quotes</p>
                        <h3 className="text-4xl font-extrabold text-[#0F172A]">{stats.quotes}</h3>
                    </div>
                    <div className="w-14 h-14 rounded bg-[#F1F5F9] flex items-center justify-center text-amber-500 border border-slate-200">
                        <Calculator size={26} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">AI Proposals</p>
                        <h3 className="text-4xl font-extrabold text-[#0F172A]">{stats.proposals}</h3>
                    </div>
                    <div className="w-14 h-14 rounded bg-[#F1F5F9] flex items-center justify-center text-indigo-500 border border-slate-200">
                        <FileText size={26} />
                    </div>
                </div>
            </div>

            {/* Recent Enquiries Table Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-lg font-bold text-[#0F172A]">Recent Enquiries</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200 bg-white">
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentEnquiries.map(enquiry => (
                                    <tr key={enquiry._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6 text-sm font-medium text-slate-800">{enquiry.name}</td>
                                        <td className="py-4 px-6">
                                            <span className="px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border-blue-200 border">
                                                {enquiry.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-lg font-bold text-[#0F172A]">Recent AI Proposals</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200 bg-white">
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProposals.map(proposal => (
                                    <tr key={proposal._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6 text-sm font-medium text-slate-800">{proposal.customerName}</td>
                                        <td className="py-4 px-6 text-sm text-slate-600">{proposal.productId?.name || 'Custom System'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;

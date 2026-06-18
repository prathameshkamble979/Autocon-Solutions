import { Package, FolderKanban, MessageSquare, ShoppingBag } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
    </div>
);

const DashboardStats = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Products"
                value={stats.counts.products}
                icon={Package}
                color="bg-blue-600"
            />
            <StatCard
                title="Active Projects"
                value={stats.counts.projects}
                icon={FolderKanban}
                color="bg-indigo-600"
            />
            <StatCard
                title="Total Enquiries"
                value={stats.counts.bookings}
                icon={MessageSquare}
                color="bg-emerald-600"
            />
            <StatCard
                title="New Requests"
                value={stats.counts.newBookings}
                icon={ShoppingBag}
                color="bg-amber-500"
            />
        </div>
    );
};

export default DashboardStats;


import { CheckCircle, Award, Clock, Users } from 'lucide-react';

const stats = [
    { label: "Projects Delivered", value: "500+", icon: CheckCircle },
    { label: "Rated on Google", value: "5.0 ⭐", icon: Award },
    { label: "On-Time Delivery", value: "98%", icon: Clock },
    { label: "Expert Engineers", value: "50+", icon: Users },
];

const StatsRow = () => {
    return (
        <div className="bg-slate-900 text-white py-10 relative overflow-hidden">
            {/* Tech Pattern Background */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            ></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-800/50">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="flex flex-col items-center justify-center p-2 group hover:-translate-y-1 transition-transform duration-300">
                                <div className="mb-3 p-3 bg-blue-600/20 rounded-full text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{stat.value}</h3>
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StatsRow;

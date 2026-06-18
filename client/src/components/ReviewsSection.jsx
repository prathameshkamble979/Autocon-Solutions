
import { Star } from 'lucide-react';
import { tenant } from '../config';

const ReviewsSection = () => {    // Demo reviews
    const reviews = [
        {
            id: 1,
            name: "Rajesh Kumar",
            role: "Plant Manager",
            rating: 5,
            text: `${tenant.name} provided exceptional service in automating our packaging line. Highly professional team.`,
            date: "2 months ago"
        },
        {
            id: 2,
            name: "Amit Patel",
            role: "Director, Apex Industries",
            rating: 5,
            text: "Quality of the aluminum profiles is top-notch. Delivery was on time and the pricing is competitive.",
            date: "1 month ago"
        }
    ];

    return (
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">Client Testimonials</h3>
                    <div className="flex items-center mt-2">
                        <span className="text-amber-500 font-bold text-xl mr-2">5.0</span>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={18} className="fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="text-slate-500 text-sm ml-2">on Google Reviews</span>
                    </div>
                </div>
                <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:block text-blue-600 font-semibold hover:underline"
                >
                    View all reviews →
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg mr-3">
                                {review.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                                <p className="text-slate-500 text-xs">{review.role}</p>
                            </div>
                        </div>
                        <div className="flex mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed italic">"{review.text}"</p>
                        <p className="text-slate-400 text-xs mt-4">{review.date}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
                <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline"
                >
                    View all reviews →
                </a>
            </div>
        </div>
    );
};

export default ReviewsSection;

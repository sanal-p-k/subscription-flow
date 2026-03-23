import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Plan() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        // Pre-check if profile was set
        if (!localStorage.getItem('gym_user_id')) {
            navigate('/profile');
            return;
        }

        const fetchPlans = async () => {
            try {
                const res = await api.get('/plans');
                if (res.data.success) {
                    setPlans(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load plans", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();

        // Restore active selection from storage if previous
        const savedPlanId = localStorage.getItem('gym_plan_id');
        if (savedPlanId) setSelectedPlan(parseInt(savedPlanId));
    }, [navigate]);

    const handleSelect = (plan) => {
        setSelectedPlan(plan.id);
        localStorage.setItem('gym_plan_id', plan.id);
        localStorage.setItem('gym_plan_name', plan.name);
        localStorage.setItem('gym_plan_price', plan.price);

        // Brief delay before navigation for slick feel
        setTimeout(() => navigate('/coupon'), 300);
    };

    if (loading) return <div className="text-center py-20 animate-pulse text-indigo-400 font-medium">Loading premium plans...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Choose your Goal</h2>
            <p className="text-slate-500 mb-8 text-sm text-center">Select the membership that fits you best.</p>

            <div className="space-y-4">
                {plans.map(plan => (
                    <button
                        key={plan.id}
                        onClick={() => handleSelect(plan)}
                        className={`w-full text-left p-6 flex items-center justify-between rounded-3xl border-2 transition-all duration-300 ${selectedPlan === plan.id
                                ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-100/50 scale-[1.02]'
                                : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg'
                            }`}
                    >
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                            <p className="text-slate-500 text-sm">Full facility access</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-indigo-600">₹{plan.price}</span>
                            <span className="text-slate-400 text-sm block">/month</span>
                        </div>
                    </button>
                ))}
            </div>

            <button
                onClick={() => navigate('/profile')}
                className="w-full mt-6 py-4 text-slate-500 font-medium hover:text-slate-800 transition-colors"
            >
                Back to Profile
            </button>
        </div>
    );
}

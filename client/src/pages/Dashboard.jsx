import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('gym_user_id');
        if (!userId) {
            navigate('/profile');
            return;
        }

        const fetchSub = async () => {
            try {
                const res = await api.get(`/subscriptions/user/${userId}`);
                if (res.data.success) {
                    setSubscription(res.data.data);
                }
            } catch (err) {
                navigate('/plan');
            } finally {
                setLoading(false);
            }
        };

        fetchSub();
    }, [navigate]);

    if (loading) return <div className="text-center py-20 animate-pulse text-indigo-400 font-medium">Loading dashboard...</div>;
    if (!subscription) return null;

    const createdDate = new Date(subscription.created_at);
    const renewalDate = new Date(createdDate.setDate(createdDate.getDate() + 30));

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="p-8 pb-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                <div className="min-w-0 flex-1 pr-4">
                    <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-3 tracking-wide uppercase">
                        Welcome Back
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 truncate">Welcome back, {subscription.user_name.split(' ')[0]}!</h2>
                    <p className="text-slate-500 text-sm mt-1 truncate">Here's your membership overview</p>
                </div>
                <button onClick={() => { localStorage.clear(); navigate('/profile'); }} className="px-4 py-2 hover:bg-slate-200 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                </button>
            </div>

            <div className="p-8 space-y-6">

                {/* Account Details Block */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-100/50">
                    <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">Account Details</h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 mb-1">Name</p>
                            <p className="font-bold text-slate-800 truncate">{subscription.user_name}</p>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 mb-1">Username</p>
                            <p className="font-bold text-slate-800 truncate">@{subscription.username}</p>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 mb-1">Age</p>
                            <p className="font-bold text-slate-800 truncate">{subscription.age ? `${subscription.age} years` : 'N/A'}</p>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 mb-1">Body Stats</p>
                            <p className="font-bold text-slate-800 truncate">{subscription.weight ? `${subscription.weight} kg` : '-'} / {subscription.height ? `${subscription.height} cm` : '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Current Plan Block */}
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-emerald-900 flex justify-between items-center shadow-sm">
                    <div>
                        <h3 className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-1">Current Plan</h3>
                        <p className="text-2xl font-black">{subscription.plan_name}</p>
                        <p className="text-emerald-700 font-medium">₹{(subscription.final_price / 100).toFixed(2)}/month</p>
                    </div>
                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm uppercase tracking-wider border border-yellow-200">
                        Active
                    </div>
                </div>

                {/* Next Renewal Block */}
                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-50 flex justify-between items-center shadow-sm">
                    <div>
                        <h3 className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-1">Next Renewal</h3>
                        <p className="text-xl font-bold text-indigo-900">{renewalDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <button className="bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors active:scale-95 text-sm">
                        Manage Plan
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-4">
                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg transition-colors active:scale-[0.98]">
                        Update Profile
                    </button>

                    <div className="text-center">
                        <button className="text-slate-400 font-medium hover:text-slate-600 text-sm transition-colors">
                            View Payment History
                        </button>
                    </div>
                </div>

                {/* Footer Switcher */}
                <div className="border-t border-slate-100 pt-6 text-right mt-8">
                    <button
                        onClick={() => { localStorage.clear(); navigate('/profile'); }}
                        className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors underline underline-offset-4"
                    >
                        [Demo] Switch to New User
                    </button>
                </div>

            </div>
        </div>
    );
}

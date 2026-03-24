import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Summary() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Load payload from storage
    const userId = localStorage.getItem('gym_user_id');
    const planId = localStorage.getItem('gym_plan_id');
    const planName = localStorage.getItem('gym_plan_name');
    const planPrice = parseInt(localStorage.getItem('gym_plan_price') || '0');

    const couponCode = localStorage.getItem('gym_coupon_code');
    const discountPercent = parseInt(localStorage.getItem('gym_coupon_discount') || '0');

    useEffect(() => {
        if (!userId || !planId) {
            navigate('/profile');
        }
    }, [userId, planId, navigate]);

    const discountAmount = Math.floor(planPrice * (discountPercent / 100));
    const finalPrice = planPrice - discountAmount;

    const handleConfirm = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/subscriptions/subscribe', {
                user_id: parseInt(userId),
                plan_id: parseInt(planId),
                coupon_code: couponCode || undefined
            });

            if (res.data.success) {
                setSuccess(true);
                // Clean up sensitive storage if desired
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete subscription. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-emerald-500 rounded-3xl p-10 text-center text-white animate-in zoom-in duration-500 shadow-2xl shadow-emerald-200">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-black mb-2">You're All Set!</h2>
                <p className="text-emerald-100 font-medium">Your EazyGym membership is now active.</p>
                <button onClick={() => { localStorage.clear(); navigate('/profile'); }} className="mt-8 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">Start Over</button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-50 p-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900">Review Summary</h2>
                <p className="text-slate-500 text-sm mt-1">Almost there! Review your details.</p>
            </div>

            <div className="p-6 space-y-6">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

                <div className="flex justify-between items-center bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                    <div>
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Selected Plan</p>
                        <p className="text-lg font-bold text-indigo-900">{planName}</p>
                    </div>
                    <p className="text-lg font-bold text-slate-900">₹{planPrice}</p>
                </div>

                {couponCode && (
                    <div className="flex justify-between items-center px-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{couponCode}</span>
                            <span className="text-sm text-slate-500">Discount ({discountPercent}%)</span>
                        </div>
                        <p className="font-bold text-emerald-600">-₹{discountAmount}</p>
                    </div>
                )}

                <div className="border-t border-slate-100 pt-6 flex justify-between items-end px-4">
                    <p className="text-slate-500 font-medium tracking-wide">Total Due</p>
                    <p className="text-4xl font-black text-slate-900">₹{finalPrice}</p>
                </div>

                <button
                    disabled={loading}
                    onClick={handleConfirm}
                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                    {loading ? 'Processing...' : 'Confirm Subscription'}
                </button>
                <button
                    disabled={loading}
                    onClick={() => navigate('/coupon')}
                    className="w-full mt-2 py-4 text-slate-400 font-medium hover:text-slate-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

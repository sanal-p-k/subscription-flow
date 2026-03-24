import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Coupon() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [status, setStatus] = useState(null); // 'checking', 'valid', 'invalid'
    const [message, setMessage] = useState('');
    const [availableCoupons, setAvailableCoupons] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem('gym_plan_id')) {
            navigate('/plan');
        }
        const savedCode = localStorage.getItem('gym_coupon_code');
        if (savedCode) setCode(savedCode);

        const loadCoupons = async () => {
            try {
                const res = await api.get('/coupons');
                if (res.data.success) {
                    setAvailableCoupons(res.data.data);
                }
            } catch (err) {
                // Handled visually in layout fallback internally
            }
        };
        loadCoupons();
    }, [navigate]);

    const handleValidate = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;

        setStatus('checking');
        setMessage('');

        try {
            const res = await api.post('/coupons/validate', { code: code.toUpperCase() });
            if (res.data.valid) {
                setStatus('valid');
                setMessage(`Awesome! ${res.data.discount_percent}% discount applied.`);
                localStorage.setItem('gym_coupon_code', code.toUpperCase());
                localStorage.setItem('gym_coupon_discount', res.data.discount_percent);

                setTimeout(() => navigate('/summary'), 1200);
            }
        } catch (err) {
            setStatus('invalid');
            setMessage(err.response?.data?.message || 'Invalid or expired coupon');
            localStorage.removeItem('gym_coupon_code');
            localStorage.removeItem('gym_coupon_discount');
        }
    };

    const handleSkip = () => {
        localStorage.removeItem('gym_coupon_code');
        localStorage.removeItem('gym_coupon_discount');
        navigate('/summary');
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Have a Promo Code?</h2>
            <p className="text-slate-500 mb-6 text-sm">Enter it below to unlock your discount.</p>

            <form onSubmit={handleValidate} className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value.toUpperCase());
                            setStatus(null);
                        }}
                        className={`w-full px-5 py-4 text-lg font-bold tracking-widest rounded-xl border-2 transition-all outline-none ${status === 'invalid' ? 'border-red-300 focus:border-red-500 focus:ring-red-100' :
                            status === 'valid' ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100 text-emerald-700' :
                                'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                            }`}
                        placeholder="e.g. FLAT50"
                    />
                </div>

                {message && (
                    <div className={`p-3 rounded-lg text-sm font-medium animate-in fade-in ${status === 'valid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {message}
                    </div>
                )}

                <button
                    disabled={status === 'checking' || !code.trim() || status === 'valid'}
                    type="submit"
                    className="w-full mt-2 bg-slate-900 hover:bg-black text-white font-semibold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                    {status === 'checking' ? 'Validating...' : 'Apply Coupon'}
                </button>
            </form>

            {availableCoupons.length > 0 && (
                <div className="mt-6 mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Available Promos</p>
                    <div className="flex flex-wrap gap-2">
                        {availableCoupons.map(c => (
                            <button
                                type="button"
                                key={c.code}
                                onClick={() => {
                                    setCode(c.code);
                                    setStatus(null);
                                    setMessage('');
                                }}
                                className="px-4 py-2 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold rounded-xl border border-indigo-100 transition-all active:scale-[0.97]"
                            >
                                {c.code} <span className="opacity-70 font-medium ml-1 bg-white/70 px-1.5 py-0.5 rounded-md">{c.discount_percent}% OFF</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={handleSkip}
                className="w-full mt-6 py-4 text-slate-500 font-medium hover:text-slate-800 transition-colors"
            >
                Skip this step
            </button>
        </div>
    );
}

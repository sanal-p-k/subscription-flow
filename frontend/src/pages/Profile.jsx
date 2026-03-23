import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Profile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        age: '',
        weight: '',
        height: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('gym_profile_data');
        if (saved) {
            setFormData(JSON.parse(saved));
        }
    }, []);

    const handleChange = (e) => {
        const updated = { ...formData, [e.target.name]: e.target.value };
        setFormData(updated);
        localStorage.setItem('gym_profile_data', JSON.stringify(updated));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                age: parseInt(formData.age),
                weight: parseFloat(formData.weight),
                height: parseFloat(formData.height)
            };

            const response = await api.post('/users/profile', payload);

            if (response.data.success) {
                // Save confirmed user_id for the checkout step
                localStorage.setItem('gym_user_id', response.data.data.user.id);
                navigate('/plan');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your Profile</h2>
            <p className="text-slate-500 mb-6 text-sm">Tell us a bit about yourself to get started.</p>

            {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                    <input required type="text" name="username" value={formData.username} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="johndoe123" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="John Doe" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
                        <input required type="number" min="0" max="120" name="age" value={formData.age} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                            placeholder="25" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Weight (kg)</label>
                        <input required type="number" min="1" step="0.1" name="weight" value={formData.weight} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                            placeholder="70" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Height (cm)</label>
                        <input required type="number" min="1" step="0.1" name="height" value={formData.height} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                            placeholder="175" />
                    </div>
                </div>

                <button disabled={loading} type="submit" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none">
                    {loading ? 'Continuing...' : 'Continue to Plans'}
                </button>
            </form>
        </div>
    );
}

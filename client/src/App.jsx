import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import Plan from './pages/Plan';
import Coupon from './pages/Coupon';
import Summary from './pages/Summary';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 flex items-center h-16 px-6 shadow-sm">
        <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          EazyGym
        </h1>
      </header>

      <main className="max-w-xl mx-auto py-10 px-4">
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/coupon" element={<Coupon />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;

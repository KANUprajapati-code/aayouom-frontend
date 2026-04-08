import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-600 rounded-[32px] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-primary-200">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Member Login</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Healthcare Access</p>
        </div>

        <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-border-main">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className={`p-5 rounded-2xl text-[10px] font-black uppercase text-center border animate-in slide-in-from-top-4 duration-300 ${
                error.includes('pending') 
                ? 'bg-amber-50 text-amber-700 border-amber-100' 
                : 'bg-red-50 text-red-500 border-red-100'
              }`}>
                {error.includes('pending') ? (
                  <div className="space-y-2">
                    <p className="text-sm italic tracking-tight mb-2">Verification In Progress</p>
                    <p className="opacity-70 leading-relaxed tracking-wider">Your medical verification is currently in our primary queue. Once our team verifies your credentials, you will receive an active status.</p>
                  </div>
                ) : error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@clinic.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4.5 pl-12 pr-6 text-slate-900 font-bold focus:ring-2 focus:ring-primary-400 outline-none transition-all"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-2">Password</label>
              <div className="relative">
                <input 
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4.5 pl-12 pr-6 text-slate-900 font-bold focus:ring-2 focus:ring-primary-400 outline-none transition-all"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full btn-primary py-5 rounded-3xl shadow-2xl shadow-primary-600/20 text-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all font-black uppercase tracking-widest"
            >
              {loading ? 'Entering...' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <p className="text-slate-400 font-bold text-sm mb-4 italic">New to Wedome?</p>
            <Link to="/register" className="inline-flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest text-[10px] hover:text-primary-700 transition-colors">
              <UserPlus className="w-4 h-4" /> Request Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { 
  Stethoscope, 
  Mail, 
  Lock, 
  Briefcase, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    clinicName: '',
    phone: '',
    medicalRegId: '' // Adding this as it's in the UI
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await register(formData);
    
    if (result.success) {
      setSuccess(result.message);
      setFormData({
        name: '', email: '', password: '', clinicName: '', phone: '', medicalRegId: ''
      });
      // Optionally redirect after a few seconds
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4">
      <div className="grid lg:grid-cols-2 max-w-5xl w-full bg-white rounded-[32px] shadow-premium border border-surface-border overflow-hidden">
        {/* Form Section */}
        <div className="p-8 lg:p-16 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Join Wedome Doctors</h1>
            <p className="text-text-muted mt-2">Set up your professional account to start bulk ordering.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm border border-red-100">{error}</div>}
            {success && (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-3 animate-in fade-in zoom-in duration-500">
                <div className="flex items-center gap-3 text-emerald-700 font-black uppercase text-xs tracking-widest">
                  <CheckCircle2 size={20} /> Identity Staging Successful
                </div>
                <p className="text-sm font-medium text-emerald-800 leading-relaxed">
                  Your registration is now in our <span className="font-black">Medical Verification Queue</span>. Our administrators will review your credentials within 2-4 business hours.
                </p>
                <div className="pt-2">
                  <Link to="/login" className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">Proceed to Login Gate &rarr;</Link>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Dr. John Doe" 
                  className="w-full px-4 py-3 bg-surface-light border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210" 
                  className="w-full px-4 py-3 bg-surface-light border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Practice Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="doctor@practice.com" 
                  className="w-full pl-12 pr-4 py-3 bg-surface-light border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinic Name</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  required
                  placeholder="City Health Clinic" 
                  className="w-full pl-12 pr-4 py-3 bg-surface-light border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3 bg-surface-light border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
               <input type="checkbox" id="terms" required className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600" />
               <label htmlFor="terms" className="text-xs text-text-muted leading-tight">
                 I confirm that I am a registered healthcare professional and I agree to the <span className="text-primary-600 font-bold hover:underline cursor-pointer">Professional Purchase Terms</span>.
               </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-base mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Professional Account'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-text-muted">
            Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="hidden lg:block bg-primary-600 p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-center space-y-12">
             <div className="space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                   <ShieldCheck size={32} strokeWidth={1.5} />
                </div>
                <h2 className="text-4xl font-bold leading-tight">Verified Exclusive <br />Access for Doctors</h2>
             </div>

             <div className="space-y-6">
                {[
                  "Bulk drug discounts up to 30%",
                  "Transparent pharmaceutical schemes",
                  "Verified medical logisitics network",
                  "Priority clinic support 24/7"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-secondary-500 flex items-center justify-center shrink-0 shadow-lg shadow-secondary-500/20 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-lg font-medium text-primary-50">{benefit}</span>
                  </div>
                ))}
             </div>

             <div className="mt-auto pt-12 border-t border-white/10">
                <p className="text-sm text-primary-200">Trusted by over 12,000 verified doctors and clinics across the country.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

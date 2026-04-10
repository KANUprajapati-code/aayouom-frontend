import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Mail, Phone, Building, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user: authUser } = useAuth();
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    clinicName: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          clinicName: res.data.clinicName || ''
        });
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };
    
    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
    }
    
    if (passwordData.newPassword.length < 6) {
      return setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My <span className="text-emerald-600">Profile</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Manage your personal and clinic details</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Profile Details Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Personal Info</h2>
            </div>

            {profileMessage.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 ${profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {profileMessage.type === 'success' && <CheckCircle2 size={18} />}
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" required
                    value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-xl pl-12 pr-4 py-3 font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" required
                    value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-xl pl-12 pr-4 py-3 font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-xl pl-12 pr-4 py-3 font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Clinic Name</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    value={profileData.clinicName} onChange={e => setProfileData({...profileData, clinicName: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-xl pl-12 pr-4 py-3 font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={profileLoading}
                className="w-full py-4 mt-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                {profileLoading && <Loader2 className="animate-spin" size={16} />}
                Save Changes
              </button>
            </form>
          </motion.div>

          {/* Password Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-xl shadow-slate-900/50 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/10 text-emerald-400 rounded-2xl backdrop-blur-md border border-white/10">
                  <KeyRound size={24} />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Security</h2>
              </div>

              {passwordMessage.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 ${passwordMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                  {passwordMessage.type === 'success' && <CheckCircle2 size={18} />}
                  {passwordMessage.text}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Current Password</label>
                  <input 
                    type="password" required
                    value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 font-bold text-white outline-none transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">New Password</label>
                  <input 
                    type="password" required
                    value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 font-bold text-white outline-none transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Confirm New Password</label>
                  <input 
                    type="password" required
                    value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 font-bold text-white outline-none transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit" disabled={passwordLoading}
                  className="w-full py-4 mt-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50"
                >
                  {passwordLoading && <Loader2 className="animate-spin" size={16} />}
                  Update Password
                </button>
              </form>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;

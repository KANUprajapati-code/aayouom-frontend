import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Mail, Phone, Building, KeyRound, Loader2, CheckCircle2, Package } from 'lucide-react';
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
        const res = await axios.get('https://ayuom-backend.vercel.app/api/auth/profile', {
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
      await axios.put('https://ayuom-backend.vercel.app/api/auth/profile', profileData, {
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
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-8">
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Profile Sidebar - From Image */}
        <div className="w-full md:w-72 border-r border-slate-50 p-8 flex flex-col gap-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green">
                 <User size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Account Settings</h2>
           </div>

           <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-brand-green text-white font-bold text-[10px] md:text-sm shadow-lg shadow-brand-green/20 whitespace-nowrap">
                 <User size={16} className="md:w-4.5 md:h-4.5" /> Profile
              </button>
              <button className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-slate-500 hover:bg-slate-50 font-medium text-[10px] md:text-sm transition-colors whitespace-nowrap">
                 <Building size={16} className="md:w-4.5 md:h-4.5" /> Addresses
              </button>
              <Link to="/orders" className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-slate-500 hover:bg-slate-50 font-medium text-[10px] md:text-sm transition-colors whitespace-nowrap">
                 <Package size={16} className="md:w-4.5 md:h-4.5" /> Orders
              </Link>
           </nav>
        </div>

        {/* Profile Content - From Image */}
        <div className="flex-grow flex flex-col">
           {/* Green Header Bar */}
           <div className="h-20 bg-brand-green w-full"></div>

           <div className="p-8 md:p-12 space-y-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                 <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>
                 <button className="btn-primary !bg-brand-green !px-5 md:!px-6 !py-2 !text-[10px] md:!text-xs">Edit Profile</button>
              </div>

              {profileMessage.text && (
                <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-2 ${profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {profileMessage.type === 'success' && <CheckCircle2 size={18} />}
                  {profileMessage.text}
                </div>
              )}

              <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-10 shadow-sm">
                 {/* Profile Photo - Simplified circle */}
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 relative group cursor-pointer border border-slate-200">
                       <User size={48} />
                       <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <CheckCircle2 size={24} className="text-white" />
                       </div>
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-slate-900 leading-none">Profile Photo</h3>
                       <p className="text-xs text-slate-400 mt-2">Update your avatar from settings.</p>
                    </div>
                 </div>

                 <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                       <input 
                         type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 font-bold text-slate-900 focus:outline-none focus:border-brand-green/30 focus:ring-4 focus:ring-brand-green/5 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                       <input 
                         type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 font-bold text-slate-900 focus:outline-none focus:border-brand-green/30 focus:ring-4 focus:ring-brand-green/5 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                       <input 
                         type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 font-bold text-slate-900 focus:outline-none focus:border-brand-green/30 focus:ring-4 focus:ring-brand-green/5 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinic / Hospital</label>
                       <input 
                         type="text" value={profileData.clinicName} onChange={e => setProfileData({...profileData, clinicName: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 font-bold text-slate-900 focus:outline-none focus:border-brand-green/30 focus:ring-4 focus:ring-brand-green/5 transition-all"
                       />
                    </div>

                    <div className="md:col-span-2 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 pt-4">
                       <button 
                         type="submit" disabled={profileLoading}
                         className="btn-primary !bg-brand-green !px-10 !py-3.5 md:!py-4 !text-xs md:!text-sm"
                       >
                          {profileLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                          Save Changes
                       </button>
                       <button type="button" className="btn-secondary !px-10 !py-3.5 md:!py-4 !text-xs md:!text-sm">Cancel</button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      </div>
    </div>

  );
};

export default Profile;

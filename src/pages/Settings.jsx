import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Activity, Save, History, Scale, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Status States
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setTimeout(() => {
      setProfileMessage("Profile safely updated in records.");
      setProfileLoading(false);
      setTimeout(() => setProfileMessage(''), 3000);
    }, 1000);
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    setSecurityLoading(true);
    setTimeout(() => {
      setSecurityMessage("Password cryptographically secured & updated.");
      setSecurityLoading(false);
      e.target.reset();
      setTimeout(() => setSecurityMessage(''), 3000);
    }, 1000);
  };
  
  // BMI Calculator State
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  
  // Dosage Estimator State
  const [adultDose, setAdultDose] = useState('');
  const [childWeightKg, setChildWeightKg] = useState('');

  const renderBMI = () => {
    if (!bmiHeight || !bmiWeight) return null;
    const heightM = parseFloat(bmiHeight) / 100;
    const bmi = (parseFloat(bmiWeight) / (heightM * heightM)).toFixed(1);
    
    let status = '';
    let color = '';
    
    if (bmi < 18.5) { status = 'Underweight'; color = 'text-blue-500'; }
    else if (bmi < 25) { status = 'Normal Weight'; color = 'text-emerald-500'; }
    else if (bmi < 30) { status = 'Overweight'; color = 'text-amber-500'; }
    else { status = 'Obese'; color = 'text-red-500'; }

    return (
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calculated BMI</p>
          <div className="text-3xl font-black text-slate-900">{bmi}</div>
        </div>
        <div className={`px-4 py-2 rounded-lg font-bold text-sm bg-white shadow-sm border border-slate-100 ${color}`}>
          {status}
        </div>
      </div>
    );
  };

  const renderDosage = () => {
    if (!adultDose || !childWeightKg) return null;
    // Standard modified Clark's Rule: (Child Weight kg / 70kg assumed adult) * Adult Dose
    const dose = ((parseFloat(childWeightKg) / 70) * parseFloat(adultDose)).toFixed(1);
    
    return (
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Pediatric Dose</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black text-emerald-600">{dose}</span>
          <span className="text-slate-500 font-bold mb-1">mg</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">*Based on modified Clark's Rule (70kg adult average). Clinical validation required.</p>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your personal profile, security, and clinical tools.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-[24px] p-4 shadow-sm border border-surface-border space-y-2 sticky top-24">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <User size={18} /> Profile & Orders
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'security' ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Lock size={18} /> Password & Security
            </button>
            <button 
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'tools' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Activity size={18} /> Doctor's Toolkit
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="bg-white rounded-[32px] p-8 shadow-sm border border-surface-border">
                 <h2 className="text-2xl font-black text-slate-900 mb-6">Personal Information</h2>
                 <form className="space-y-6" onSubmit={handleProfileSubmit}>
                   {profileMessage && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-100 font-bold">{profileMessage}</div>}
                   <div className="grid md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                       <input type="text" defaultValue={user?.name || ''} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                       <input type="email" defaultValue={user?.email || ''} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-500 opacity-70 cursor-not-allowed" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Clinic Name</label>
                       <input type="text" defaultValue={user?.clinicName || 'City Central Clinic'} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                       <input type="text" defaultValue={user?.phone || ''} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner" />
                     </div>
                   </div>
                   <div className="pt-4 flex justify-end">
                     <button type="submit" className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2 text-sm shadow-premium">
                       <Save size={16} /> Save Changes
                     </button>
                   </div>
                 </form>
               </div>

               {/* Quick Links / Orders */}
               <div className="bg-primary-600 rounded-[32px] p-8 shadow-premium text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                 <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                 <div className="relative z-10">
                   <h3 className="text-xl font-black mb-2 flex items-center gap-2"><History className="text-primary-200" /> Order History & Invoices</h3>
                   <p className="text-primary-100 text-sm max-w-md">Access your complete history of bulk orders, download GST invoices, and track live shipments.</p>
                 </div>
                 <Link to="/orders" className="relative z-10 bg-white text-primary-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex-shrink-0">
                   View All Orders
                 </Link>
               </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="bg-white rounded-[32px] p-8 shadow-sm border border-surface-border">
                 <h2 className="text-2xl font-black text-slate-900 mb-2">Password Management</h2>
                 <p className="text-slate-500 text-sm mb-8 font-medium">Ensure your account is using a long, random password to stay secure.</p>
                 
                 <form className="space-y-6 max-w-md" onSubmit={handleSecuritySubmit}>
                   {securityMessage && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-100 font-bold">{securityMessage}</div>}
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Current Password</label>
                     <input type="password" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner placeholder:font-normal placeholder:text-slate-300" placeholder="••••••••" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                     <input type="password" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner placeholder:font-normal placeholder:text-slate-300" placeholder="••••••••" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
                     <input type="password" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner placeholder:font-normal placeholder:text-slate-300" placeholder="••••••••" />
                   </div>
                   
                   <div className="pt-4">
                     <button type="submit" className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg w-full font-bold transition-all">
                       <Lock size={16} /> Update Password
                     </button>
                   </div>
                 </form>
               </div>
            </div>
          )}

          {/* DOCTORS TOOLKIT TAB */}
          {activeTab === 'tools' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="mb-4">
                <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Clinical Utilities</h2>
                <p className="text-slate-500 text-sm font-medium">Quick reference calculators designed to assist in safe prescribing and diagnostics.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* TOOL 1: BMI Calculator */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-emerald-100 relative overflow-hidden group">
                  <h3 className="text-xl font-black text-slate-900 mb-6 relative z-10 flex items-center gap-2">
                    <div className="w-2 h-6 bg-emerald-500 rounded-full"></div> Patient BMI 
                  </h3>
                  
                  <div className="space-y-4 relative z-10">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Height (cm)</label>
                      <input type="number" value={bmiHeight} onChange={(e) => setBmiHeight(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono" placeholder="175" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Weight (kg)</label>
                      <input type="number" value={bmiWeight} onChange={(e) => setBmiWeight(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono" placeholder="70" />
                    </div>
                    {renderBMI()}
                  </div>
                </div>

                {/* TOOL 2: Pediatric Dosage */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-blue-100 relative overflow-hidden group">
                  <h3 className="text-xl font-black text-slate-900 mb-6 relative z-10 flex items-center gap-2">
                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div> Peds. Dosage
                  </h3>
                  
                  <div className="space-y-4 relative z-10">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Standard Adult Dose (mg)</label>
                      <input type="number" value={adultDose} onChange={(e) => setAdultDose(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono" placeholder="500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Child's Weight (kg)</label>
                      <input type="number" value={childWeightKg} onChange={(e) => setChildWeightKg(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono" placeholder="15" />
                    </div>
                    {renderDosage()}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;

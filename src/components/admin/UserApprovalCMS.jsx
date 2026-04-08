import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, UserCheck, XCircle, Phone, Mail, Building, Clipboard, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserApprovalCMS = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://ayuom-backend.vercel.app/api/admin/users/pending');
      setPendingUsers(data);
    } catch (err) {
      console.error('Failed to fetch pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`https://ayuom-backend.vercel.app/api/admin/users/${id}/approve`);
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
    } catch (err) {
      alert('Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this practitioner?')) return;
    setActionLoading(id);
    try {
      await axios.delete(`https://ayuom-backend.vercel.app/api/admin/users/${id}`);
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
    } catch (err) {
      alert('Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Practitioner Verification</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Medical Identity Staging Area</p>
        </div>
        <button 
          onClick={fetchPendingUsers}
          className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100 shadow-sm"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Scanning Verification Nodes...</p>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[32px] p-20 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
             <ShieldCheck size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Queue is Clear</h3>
          <p className="text-slate-400 font-medium max-w-sm mx-auto uppercase tracking-widest text-[10px]">All registered medical practitioners have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {pendingUsers.map(user => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={user._id}
                className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-premium flex flex-col lg:flex-row items-center gap-10 hover:border-emerald-500/20 transition-all group"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 font-black text-2xl border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-500">
                  {user.name.charAt(0)}
                </div>

                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Practitioner</p>
                    <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">{user.name}</h4>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2"><Mail size={12} /> {user.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Clinic / Institution</p>
                    <p className="text-sm font-black text-slate-700 uppercase tracking-tight flex items-center gap-2"><Building size={14} className="text-slate-400"/> {user.clinicName || 'Private Practice'}</p>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2"><Phone size={12} /> {user.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verification ID</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                       <Clipboard size={12} className="text-slate-400" />
                       <span className="text-xs font-black text-slate-600 font-mono tracking-tighter uppercase">{user.medicalRegId || 'NOT_PROVIDED'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button 
                      disabled={actionLoading === user._id}
                      onClick={() => handleReject(user._id)}
                      className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all border border-rose-100 group/rej"
                    >
                      <XCircle size={20} className="group-hover/rej:scale-110 transition-transform" />
                    </button>
                    <button 
                      disabled={actionLoading === user._id}
                      onClick={() => handleApprove(user._id)}
                      className="flex-grow lg:flex-none px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3 group/app"
                    >
                      {actionLoading === user._id ? 'Processing...' : (
                        <>
                          <UserCheck size={18} className="group-hover/app:scale-110 transition-transform" />
                          Approve Identity
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="p-8 bg-slate-900 rounded-[40px] flex items-center gap-10 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -u-translate-y-1/2 translate-x-1/2"></div>
         <div className="w-20 h-20 bg-white/10 rounded-[28px] flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-md">
            <AlertCircle size={40} className="text-emerald-400" />
         </div>
         <div className="space-y-2">
            <h4 className="text-xl font-black uppercase italic tracking-tighter">Identity Compliance Protocol</h4>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">System only allows verified medical practitioners to access wholesale schemes. Manual review of Medical Registration IDs is strictly advised during this stage.</p>
         </div>
      </div>
    </div>
  );
};

export default UserApprovalCMS;

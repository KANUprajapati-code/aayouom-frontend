import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, UserCheck, XCircle, Phone, Mail, 
  Building, Clipboard, Search, AlertCircle, RefreshCw,
  Sparkles, ShieldAlert, Zap, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const UserApprovalCMS = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/admin/users/pending`, getAuthConfig());
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
      await axios.put(`${API_BASE_URL}/admin/users/${id}/approve`, {}, getAuthConfig());
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
    } catch (err) {
      alert('Approval failed. Quantum handshake error.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Erase this practitioner record? This cannot be undone.')) return;
    setActionLoading(id);
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`, getAuthConfig());
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
    } catch (err) {
      alert('Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Header section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-white/40 shadow-soft relative overflow-hidden group">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-unicorn-cyan/5 rounded-full blur-[100px] group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-unicorn-indigo via-unicorn-purple to-unicorn-magenta rounded-3xl shadow-unicorn">
               <ShieldCheck size={32} className="text-white" />
            </div>
            Practitioner Staging
          </h2>
          <p className="text-text-silver mt-4 font-black uppercase tracking-[0.4em] text-[11px] opacity-60">Medical Identity Verification Hub • Node 0.4</p>
        </div>
        <button 
          onClick={fetchPendingUsers}
          className={`p-6 bg-white/40 rounded-3xl hover:bg-text-main hover:text-white transition-all text-text-silver shadow-soft group border border-white/40 relative z-10 ${loading ? 'pointer-events-none' : ''}`}
        >
          <RefreshCw size={24} className={`group-hover:rotate-180 transition-transform duration-700 ${loading ? 'animate-spin text-unicorn-cyan' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-8 animate-pulse text-center">
          <div className="w-24 h-24 border-[6px] border-unicorn-cyan/10 border-t-unicorn-cyan rounded-full animate-spin shadow-unicorn"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-text-silver">Scanning Verification Grid...</p>
        </div>
      ) : pendingUsers.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/40 backdrop-blur-md border border-white/40 rounded-[64px] p-32 text-center space-y-8 shadow-soft relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-unicorn-cyan/5 to-unicorn-magenta/5 opacity-50"></div>
          <div className="w-32 h-32 bg-white/60 text-unicorn-cyan rounded-[48px] flex items-center justify-center mx-auto border border-white/40 shadow-unicorn relative z-10">
             <ShieldCheck size={56} className="animate-pulse" />
          </div>
          <div className="space-y-3 relative z-10">
            <h3 className="text-3xl font-black text-text-main tracking-tighter italic uppercase underline decoration-unicorn-cyan decoration-4 underline-offset-8">Queue Optimized</h3>
            <p className="text-text-silver font-black max-w-sm mx-auto uppercase tracking-[0.3em] text-[11px]">All medical entity registration nodes have been synchronized.</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          <AnimatePresence mode="popLayout">
            {pendingUsers.map(user => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                key={user._id}
                className="bg-white/40 backdrop-blur-md border border-white/40 rounded-[56px] p-10 shadow-premium flex flex-col xl:flex-row items-center gap-12 hover:bg-white/60 transition-all group relative overflow-hidden border-l-[16px] border-l-unicorn-purple/20 hover:border-l-unicorn-purple"
              >
                <div className="w-28 h-28 bg-white/80 rounded-[32px] flex items-center justify-center text-text-main font-black text-4xl border border-white group-hover:bg-text-main group-hover:text-white transition-all duration-700 shadow-soft group-hover:shadow-unicorn group-hover:-rotate-3 shrink-0">
                  {user.name.charAt(0)}
                </div>

                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] opacity-60">Practitioner Node</p>
                    <h4 className="text-2xl font-black text-text-main uppercase italic tracking-tighter truncate">{user.name}</h4>
                    <p className="text-xs font-bold text-text-silver flex items-center gap-3 transition-colors group-hover:text-unicorn-magenta"><Mail size={14} className="text-unicorn-magenta/40" /> {user.email}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] opacity-60">Operational Base</p>
                    <p className="text-base font-black text-text-main uppercase tracking-tight flex items-center gap-3 truncate"><Building size={18} className="text-unicorn-purple/40"/> {user.clinicName || 'Private Practice'}</p>
                    <p className="text-xs font-bold text-text-silver flex items-center gap-3 transition-colors group-hover:text-unicorn-cyan"><Phone size={14} className="text-unicorn-cyan/40" /> {user.phone}</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] opacity-60">Verification Schema</p>
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/60 border border-white rounded-2xl shadow-inner group-hover:border-unicorn-indigo/20 transition-all">
                       <Clipboard size={16} className="text-unicorn-indigo/40" />
                       <span className="text-sm font-black text-text-main font-mono tracking-tighter uppercase">{user.medicalRegId || 'NOT_PROVIDED'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-5">
                    <button 
                      disabled={actionLoading === user._id}
                      onClick={() => handleReject(user._id)}
                      className="p-6 bg-white/40 text-rose-500 rounded-3xl hover:bg-rose-500 hover:text-white transition-all border border-white/40 shadow-soft group/rej hover:rotate-6 active:scale-95"
                    >
                      <XCircle size={24} className="group-hover/rej:scale-110 transition-transform" />
                    </button>
                    <button 
                      disabled={actionLoading === user._id}
                      onClick={() => handleApprove(user._id)}
                      className="flex-grow lg:flex-none px-12 py-6 bg-text-main text-white rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-black hover:shadow-unicorn/20 transition-all shadow-premium active:scale-95 flex items-center justify-center gap-4 group/app overflow-hidden relative"
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-unicorn-cyan via-unicorn-purple to-unicorn-magenta opacity-0 group-hover/app:opacity-10 transition-opacity"></div>
                      {actionLoading === user._id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <UserCheck size={20} className="group-hover/app:scale-125 transition-transform" />
                          Commit Identity
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

      {/* Compliance Notice */}
      <div className="p-12 bg-text-main text-white rounded-[56px] flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group shadow-premium">
         <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-unicorn-cyan to-unicorn-magenta opacity-10 blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
         <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-md shadow-inner">
            <ShieldAlert size={48} className="text-unicorn-cyan animate-pulse" />
         </div>
         <div className="space-y-4 relative z-10">
            <h4 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
              <Zap className="text-unicorn-magenta" size={24}/> Identity Compliance Protocol v4.2
            </h4>
            <p className="text-text-silver font-bold text-base leading-relaxed max-w-3xl opacity-80">
              Protocol restricts wholesale tier access to verified medical entities. Manual cross-referencing with the National Medical Register is <span className="text-unicorn-cyan uppercase">mandatory</span> prior to identity commitment. Reject any non-compliant nodes immediately to maintain grid integrity.
            </p>
         </div>
         <div className="ml-auto hidden xl:block relative z-10">
            <Wand2 size={80} className="text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
         </div>
      </div>
    </div>
  );
};

export default UserApprovalCMS;

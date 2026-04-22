import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Wallet, IndianRupee, Gift, PlusCircle, MinusCircle, 
  User, Loader2, X, Sparkles, TrendingUp, Zap, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const AdminWalletCMS = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustType, setAdjustType] = useState('add'); // 'add' or 'deduct'
  const [adjustField, setAdjustField] = useState('balance'); // 'balance' or 'points'
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/wallet/admin/users`, getAuthConfig());
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch wallet users via Nexus Node.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0 || !reason) return;
    
    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE_URL}/wallet/admin/adjust-balance/${selectedUser._id}`,
        {
          type: adjustType,
          amount: Number(amount),
          adjustField,
          reason
        },
        getAuthConfig()
      );
      
      closeModal();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Adjustment failed in the ether.');
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (user, field) => {
    setSelectedUser(user);
    setAdjustField(field);
    setAdjustType('add');
    setAmount('');
    setReason('');
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-8 animate-pulse text-center">
        <div className="w-24 h-24 border-[6px] border-unicorn-cyan/10 border-t-unicorn-cyan rounded-full animate-spin shadow-unicorn"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-text-silver">Decrypting Wallet Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 font-sans">
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-white/40 shadow-soft relative overflow-hidden group">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-unicorn-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-unicorn-indigo via-unicorn-purple to-unicorn-magenta rounded-3xl shadow-unicorn">
               <Wallet size={32} className="text-white" />
            </div>
            Nexus Wallet
          </h2>
          <p className="text-text-silver mt-4 font-black uppercase tracking-[0.4em] text-[11px] opacity-60">Global Liquidity & Credit Control Node</p>
        </div>
        <div className="relative z-10 p-6 bg-white/40 rounded-[32px] border border-white/40 shadow-soft hidden xl:flex items-center gap-6 group-hover:shadow-unicorn transition-all duration-700">
           <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-silver opacity-60">Total Ledger Flux</p>
              <p className="text-2xl font-black text-text-main tracking-tighter italic">₹ {users.reduce((acc, u) => acc + (u.walletBalance || 0), 0).toLocaleString()}</p>
           </div>
           <TrendingUp className="text-unicorn-cyan animate-bounce" size={32} />
        </div>
      </div>

      {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-8 rounded-[32px] text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-top-4"><ShieldAlert /> {error}</div>}

      {/* Users Table */}
      <div className="bg-white/40 backdrop-blur-md rounded-[56px] border border-white/40 shadow-soft overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-unicorn-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
        <table className="w-full text-left relative z-10">
          <thead className="bg-white/30 border-b border-white/10">
            <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-text-silver">
              <th className="px-12 py-8">Entity Identifier</th>
              <th className="px-12 py-8">Liquidity [INR]</th>
              <th className="px-12 py-8">Loyalty Points</th>
              <th className="px-12 py-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-sans">
            {users.length === 0 ? (
               <tr><td colSpan="4" className="p-20 text-center text-text-silver font-black uppercase tracking-[0.5em] italic">No entities detected in registry.</td></tr>
            ) : users.map(user => (
              <tr key={user._id} className="hover:bg-white/40 transition-all group">
                <td className="px-12 py-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-soft text-text-silver flex items-center justify-center border border-white group-hover:bg-text-main group-hover:text-white transition-all duration-500 group-hover:shadow-unicorn group-hover:rotate-3">
                       {user.name ? user.name.charAt(0) : <User size={24} />}
                    </div>
                    <div>
                      <p className="font-black text-text-main text-lg italic tracking-tighter uppercase leading-none group-hover:text-unicorn-cyan transition-colors">{user.name}</p>
                      <p className="text-[10px] font-black text-text-silver uppercase tracking-widest mt-2 opacity-60">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-12 py-8">
                  <div className="flex items-center gap-4 group/bal">
                    <span className="text-2xl font-black text-text-main flex items-center gap-2 group-hover/bal:text-unicorn-cyan transition-colors italic tracking-tighter">
                      <IndianRupee size={20} className="text-text-silver group-hover/bal:text-unicorn-cyan transition-colors" />{user.walletBalance || 0}
                    </span>
                    <button onClick={() => openModal(user, 'balance')} className="p-2 bg-white rounded-xl text-text-silver hover:bg-unicorn-cyan hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </td>
                <td className="px-12 py-8">
                  <div className="flex items-center gap-4 group/pts">
                    <span className="text-2xl font-black text-text-main flex items-center gap-3 italic tracking-tighter group-hover/pts:text-unicorn-magenta transition-colors">
                      {user.walletPoints || 0} <span className="text-[10px] uppercase font-black tracking-widest text-text-silver">PTS</span>
                    </span>
                    <button onClick={() => openModal(user, 'points')} className="p-2 bg-white rounded-xl text-text-silver hover:bg-unicorn-magenta hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </td>
                <td className="px-12 py-8 text-right">
                  <button onClick={() => openModal(user, 'balance')} className="px-8 py-4 bg-text-main text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-premium active:scale-95 border border-white/20">
                    Adjust Flux
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-2xl animate-in fade-in duration-500 font-sans">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 cursor-crosshair"
               onClick={closeModal}
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
               className="bg-white/90 backdrop-blur-3xl rounded-[64px] p-16 max-w-xl w-full relative z-50 shadow-unicorn border border-white/40 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-unicorn-magenta/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <button onClick={closeModal} className="absolute right-10 top-10 p-5 bg-white/40 rounded-3xl hover:bg-rose-500 hover:text-white transition-all text-text-silver shadow-soft group">
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
              
              <div className="space-y-4 mb-12">
                 <h3 className="text-3xl font-black text-text-main italic uppercase tracking-tighter leading-none">Modify {adjustField === 'balance' ? 'Credit' : 'Influence'}</h3>
                 <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em]">Target: <span className="text-text-main underline decoration-unicorn-cyan decoration-2 underline-offset-4">{selectedUser.name}</span></p>
              </div>

              <form onSubmit={handleAdjustSubmit} className="space-y-10 relative z-10">
                
                <div className="flex p-2 bg-text-main/5 border border-white rounded-[32px] font-black uppercase tracking-[0.4em] text-[8px] shadow-inner">
                  <button type="button" onClick={() => setAdjustType('add')} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[24px] transition-all duration-500 ${adjustType === 'add' ? 'bg-white text-unicorn-cyan shadow-soft' : 'text-text-silver opacity-40 hover:opacity-100'}`}>
                    <PlusCircle size={20} /> Inject
                  </button>
                  <button type="button" onClick={() => setAdjustType('deduct')} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[24px] transition-all duration-500 ${adjustType === 'deduct' ? 'bg-white text-rose-600 shadow-soft' : 'text-text-silver opacity-40 hover:opacity-100'}`}>
                    <MinusCircle size={20} /> Extract
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase text-text-silver tracking-[0.4em] ml-6 italic">Transfer Magnitude</label>
                  <div className="relative">
                    {adjustField === 'balance' ? (
                       <div className="absolute left-6 top-1/2 -translate-y-1/2 text-unicorn-cyan scale-125"><IndianRupee size={24} /></div>
                    ) : (
                       <div className="absolute left-6 top-1/2 -translate-y-1/2 text-unicorn-magenta scale-125"><Zap size={24} /></div>
                    )}
                    <input 
                      type="number" min="1" required
                      value={amount} onChange={e => setAmount(e.target.value)}
                      className="w-full bg-white border border-white/60 focus:shadow-unicorn focus:bg-white rounded-[32px] pl-20 pr-10 py-8 font-black text-text-main text-3xl outline-none transition-all tracking-tighter italic"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase text-text-silver tracking-[0.4em] ml-6 italic">Adjustment Protocol Proof</label>
                  <input 
                    type="text" required
                    value={reason} onChange={e => setReason(e.target.value)}
                    className="w-full bg-white border border-white/60 focus:shadow-unicorn focus:bg-white rounded-[32px] px-10 py-7 font-black text-text-main text-sm outline-none transition-all tracking-tight"
                    placeholder="e.g. Manual Refund Node, Bonus Flux"
                  />
                </div>

                <button 
                  type="submit" disabled={submitting}
                  className={`w-full py-8 text-white rounded-[40px] font-black uppercase tracking-[0.5em] text-[11px] transition-all flex items-center justify-center gap-4 shadow-premium active:scale-95 group overflow-hidden relative ${
                    submitting ? 'bg-slate-300' : adjustType === 'add' ? 'bg-text-main hover:bg-black' : 'bg-rose-600 hover:bg-black'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-unicorn-cyan via-unicorn-purple to-unicorn-magenta opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  {submitting ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={24} className="group-hover:scale-125 group-hover:rotate-12 transition-transform" />}
                  Synchronize {adjustType === 'add' ? 'Injection' : 'Extraction'}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminWalletCMS;

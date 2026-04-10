import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, IndianRupee, Gift, PlusCircle, MinusCircle, User, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/wallet/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch wallet users');
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
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/wallet/admin/adjust-balance/${selectedUser._id}`,
        {
          type: adjustType,
          amount: Number(amount),
          adjustField,
          reason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      closeModal();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Adjustment failed');
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
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* Header */}
      <div className="bg-emerald-600 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center shadow-xl shadow-emerald-100">
        <div className="relative z-10">
           <h2 className="text-3xl font-black tracking-tight">Wallet Management</h2>
           <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest mt-2">View & Adjust User Balances</p>
        </div>
        <div className="relative z-10 w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md hidden md:flex">
          <Wallet size={40} className="text-emerald-100" />
        </div>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500 rounded-full blur-2xl opacity-50"></div>
      </div>

      {error && <div className="bg-rose-50 text-rose-500 p-4 rounded-xl text-sm font-bold">{error}</div>}

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Wallet Balance</th>
              <th className="px-6 py-4">Loyalty Points</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
               <tr><td colSpan="4" className="p-8 text-center text-slate-400 font-bold">No users found.</td></tr>
            ) : users.map(user => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                       <User size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{user.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-emerald-600 flex items-center gap-1">
                      <IndianRupee size={16} />{user.walletBalance || 0}
                    </span>
                    <button onClick={() => openModal(user, 'balance')} className="p-1 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <PlusCircle size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-amber-500 flex items-center gap-1">
                      {user.walletPoints || 0} <span className="text-xs">Pts</span>
                    </span>
                    <button onClick={() => openModal(user, 'points')} className="p-1 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <PlusCircle size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(user, 'balance')} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                    Adjust
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
               onClick={closeModal}
            />
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-white rounded-3xl p-8 max-w-md w-full relative z-50 shadow-2xl"
            >
              <button onClick={closeModal} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-black text-slate-900 mb-1">Adjust {adjustField === 'balance' ? 'Balance' : 'Points'}</h3>
              <p className="text-xs font-bold text-slate-500 mb-6">User: <span className="text-slate-900">{selectedUser.name}</span></p>

              <form onSubmit={handleAdjustSubmit} className="space-y-6">
                
                <div className="flex p-1 bg-slate-100 text-[11px] font-black uppercase tracking-widest rounded-xl">
                  <button type="button" onClick={() => setAdjustType('add')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${adjustType === 'add' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>
                    <PlusCircle size={16} /> Add
                  </button>
                  <button type="button" onClick={() => setAdjustType('deduct')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${adjustType === 'deduct' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}>
                    <MinusCircle size={16} /> Deduct
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Amount</label>
                  <div className="relative">
                    {adjustField === 'balance' ? (
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><IndianRupee size={18} /></div>
                    ) : (
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Gift size={18} /></div>
                    )}
                    <input 
                      type="number" min="1" required
                      value={amount} onChange={e => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-slate-200 rounded-xl px-12 py-4 font-black text-slate-900 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Reason for Adjustment</label>
                  <input 
                    type="text" required
                    value={reason} onChange={e => setReason(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-slate-200 rounded-xl px-4 py-4 font-black text-slate-900 outline-none transition-all"
                    placeholder="e.g. Manual Refund, Bonus"
                  />
                </div>

                <button 
                  type="submit" disabled={submitting}
                  className={`w-full py-4 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 ${
                    submitting ? 'bg-slate-300' : adjustType === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  Confirm {adjustType === 'add' ? 'Addition' : 'Deduction'}
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

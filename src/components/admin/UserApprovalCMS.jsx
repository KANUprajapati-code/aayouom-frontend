import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, CheckCircle2, XCircle, Search, 
  ShieldCheck, ArrowUpRight, Mail, Phone, MapPin, 
  User, Activity, Trash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const UserApprovalCMS = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('pending');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState('');

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/users/all`, getAuthConfig());
      const mappedUsers = res.data.map(u => ({
        ...u,
        status: u.isApproved ? 'approved' : 'pending'
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${id}/approve`, { status: 'approved' }, getAuthConfig());
      setUsers(users.map(u => u._id === id ? { ...u, status: 'approved' } : u));
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this user validation? This will permanently remove the registration request.')) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`, getAuthConfig());
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Rejection failed.');
    }
  };

  const handleAddPoints = async () => {
    if (!pointsToAdd || Number(pointsToAdd) <= 0) return alert("Please enter a valid amount");
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${selectedUser._id}/wallet`, {
        points: Number(pointsToAdd),
        description: 'Manual credit by Administrator'
      }, getAuthConfig());
      alert(`Successfully added ${pointsToAdd} points to ${selectedUser.name}!`);
      setWalletModalOpen(false);
      setPointsToAdd('');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add points');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'all' || u.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Authenticating User Registry...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
               <ShieldCheck className="text-blue-600" /> Practitioner Verifier
            </h2>
            <p className="text-slate-500 text-sm mt-1">Review and authenticate medical practitioner registration requests.</p>
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
             {['all', 'pending', 'approved', 'rejected'].map(f => (
               <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{f}</button>
             ))}
          </div>
       </div>

       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <Search className="text-slate-400" size={18} />
          <input placeholder="Search by name, email or clinic..." className="flex-grow bg-transparent outline-none font-bold text-slate-900 placeholder:font-normal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredUsers.map(user => (
            <div key={user._id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-600 transition-all flex flex-col">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-600 border border-slate-200">
                        {user.name?.[0]}
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-slate-900">{user.name}</h4>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">{user.role || 'Practitioner'}</p>
                     </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${user.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : user.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                     {user.status}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-500 text-xs">
                     <Mail size={14} className="opacity-50" /> {user.email}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-xs">
                     <Phone size={14} className="opacity-50" /> {user.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-xs col-span-full">
                     <MapPin size={14} className="opacity-50" /> {user.address || 'Location Not Provided'}
                  </div>
               </div>

               {user.status === 'pending' && (
                  <div className="mt-auto flex gap-4 pt-6 border-t border-slate-100">
                     <button onClick={() => handleApprove(user._id)} className="flex-grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all"><CheckCircle2 size={16} /> Authenticate</button>
                     <button onClick={() => handleReject(user._id)} className="flex-grow py-3 bg-white hover:bg-rose-50 text-rose-600 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-rose-100 shadow-sm flex items-center justify-center gap-2 transition-all"><XCircle size={16} /> Block Node</button>
                  </div>
               )}
               {user.status === 'approved' && (
                  <div className="mt-auto flex gap-4 pt-6 border-t border-slate-100">
                     <button onClick={() => { setSelectedUser(user); setWalletModalOpen(true); }} className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all"><Activity size={16} /> Credit Wallet Balance</button>
                  </div>
               )}
            </div>
          ))}
          {filteredUsers.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 uppercase tracking-widest font-bold text-xs opacity-50">No users found in this buffer.</div>}
       </div>

       {walletModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">Credit Balance</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Add manual cash balance to <span className="font-bold text-blue-600">{selectedUser.name}'s</span> account</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount (₹)</label>
                <input type="number" min="1" className="w-full mt-1 p-4 bg-slate-50 rounded-xl border border-slate-100 font-bold outline-none focus:bg-white focus:border-blue-600 transition-all text-xl" value={pointsToAdd} onChange={(e) => setPointsToAdd(e.target.value)} placeholder="e.g. 500" />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => { setWalletModalOpen(false); setPointsToAdd(''); }} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">Cancel</button>
              <button onClick={handleAddPoints} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserApprovalCMS;

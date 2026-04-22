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
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/users/approve/${id}`, { status: 'approved' }, getAuthConfig());
      setUsers(users.map(u => u._id === id ? { ...u, status: 'approved' } : u));
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this user validation?')) return;
    try {
      await axios.put(`${API_BASE_URL}/admin/users/approve/${id}`, { status: 'rejected' }, getAuthConfig());
      setUsers(users.map(u => u._id === id ? { ...u, status: 'rejected' } : u));
    } catch (err) {
      alert('Rejection failed.');
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
            </div>
          ))}
          {filteredUsers.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 uppercase tracking-widest font-bold text-xs opacity-50">No users found in this buffer.</div>}
       </div>
    </div>
  );
};

export default UserApprovalCMS;

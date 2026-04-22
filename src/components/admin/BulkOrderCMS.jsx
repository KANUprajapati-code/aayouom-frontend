import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, Trash2, CheckCircle, Clock, 
  Search, Mail, Phone, MapPin, Package,
  ExternalLink, FileText, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const BulkOrderCMS = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/bulk-orders`, getAuthConfig());
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/bulk-orders/${id}`, { status }, getAuthConfig());
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    } catch (err) {
      alert('Update failed');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/bulk-orders/${id}`, getAuthConfig());
      setOrders(orders.filter(o => o._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filtered = orders.filter(o => 
    o.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(o => activeFilter === 'all' || o.status === activeFilter);

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs font-sans">Scanning Bulk Channel...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
               <ShoppingBag className="text-blue-600" /> B2B Procurement Pipeline
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage wholesale inquiries and hospital-grade bulk quote requests.</p>
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
             {['all', 'pending', 'processed', 'delivered'].map(f => (
               <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{f}</button>
             ))}
          </div>
       </div>

       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <Search className="text-slate-400" size={18} />
          <input placeholder="Search inquiries by hospital, practitioner or drug name..." className="flex-grow bg-transparent outline-none font-bold text-slate-900" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
       </div>

       <div className="grid grid-cols-1 gap-6">
          {filtered.map(order => (
            <div key={order._id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-600 transition-all">
               <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="flex-grow space-y-6">
                     <div className="flex justify-between items-start">
                        <div>
                           <h4 className="text-xl font-bold text-slate-900 italic tracking-tight">{order.hospitalName || 'Individual Practitioner'}</h4>
                           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Inquiry ID: {order._id.slice(-8)}</p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${order.status === 'processed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : order.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                           {order.status}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-slate-50">
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requested Items</p>
                           <p className="text-sm font-bold text-slate-900">{order.items || 'General Medical Inventory'}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Volume</p>
                           <p className="text-sm font-bold text-slate-900">{order.quantity || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Origin Contact</p>
                           <p className="text-sm font-bold text-slate-900">{order.name} ({order.phone})</p>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-6 text-xs text-slate-500">
                        <div className="flex items-center gap-2"><Mail size={14} /> {order.email}</div>
                        <div className="flex items-center gap-2"><MapPin size={14} /> {order.address || 'Global Dispatch'}</div>
                        <div className="flex items-center gap-2"><Clock size={14} /> Received: {new Date(order.createdAt).toLocaleDateString()}</div>
                     </div>
                  </div>

                  <div className="lg:w-48 flex flex-col gap-3 shrink-0">
                     <button onClick={() => updateStatus(order._id, 'processed')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2"><CheckCircle size={14} /> Mark Processed</button>
                     <button onClick={() => updateStatus(order._id, 'delivered')} className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2"><Package size={14} /> Log Delivery</button>
                     <button onClick={() => deleteOrder(order._id)} className="w-full py-3 bg-white hover:bg-rose-50 text-rose-600 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-rose-100 transition-all flex items-center justify-center gap-2"><Trash2 size={14} /> Purge Record</button>
                  </div>
               </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="py-20 text-center text-slate-400 uppercase tracking-widest font-bold text-xs opacity-50 italic">No wholesale inquiries in this buffer.</div>}
       </div>
    </div>
  );
};

export default BulkOrderCMS;

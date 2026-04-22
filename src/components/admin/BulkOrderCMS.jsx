import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, Phone, User, CheckCircle, 
  Clock, Trash2, ExternalLink, Sparkles, 
  Wand2, Zap, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const BulkOrderCMS = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const getAuthConfig = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchInquiries = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/bulk-orders`, getAuthConfig());
            setInquiries(data);
        } catch (error) {
            console.error('Error fetching bulk orders', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${API_BASE_URL}/bulk-orders/${id}`, { status }, getAuthConfig());
            fetchInquiries();
        } catch (error) {
            alert('Error updating status');
        }
    };

    const deleteInquiry = async (id) => {
        if (!window.confirm('Delete this procurement entry?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/bulk-orders/${id}`, getAuthConfig());
            fetchInquiries();
        } catch (error) {
            alert('Error deleting inquiry');
        }
    };

    const contactWhatsApp = (phone, medicine) => {
        const msg = encodeURIComponent(`Admin from Wedome Node regarding your bulk inquiry for: ${medicine}. Protocol initiated. How can we proceed?`);
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24 font-sans">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-white/40 shadow-soft relative overflow-hidden group">
                <div className="absolute -left-10 -top-10 w-48 h-48 bg-unicorn-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-5">
                       <div className="p-4 bg-gradient-to-br from-unicorn-indigo via-unicorn-purple to-unicorn-magenta rounded-3xl shadow-unicorn">
                          <ShoppingBag size={32} className="text-white" />
                       </div>
                       Bulk Flux
                    </h2>
                    <p className="text-text-silver mt-4 font-black uppercase tracking-[0.4em] text-[11px] opacity-60">High-Volume Procurement Queue • Registry Phase</p>
                </div>
                <div className="relative z-10 p-6 bg-white/40 rounded-[32px] border border-white/40 shadow-soft hidden xl:flex items-center gap-6 group-hover:shadow-unicorn transition-all duration-700">
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-silver opacity-60">Active Stream</p>
                      <p className="text-2xl font-black text-text-main tracking-tighter italic">{inquiries.length} Inquiries</p>
                   </div>
                   <Zap className="text-unicorn-cyan animate-pulse" size={32} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-unicorn-cyan/5 to-unicorn-magenta/5 opacity-50 rounded-[64px] blur-3xl pointer-events-none"></div>
                
                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center space-y-8 animate-pulse text-center">
                        <div className="w-24 h-24 border-[6px] border-unicorn-cyan/10 border-t-unicorn-cyan rounded-full animate-spin shadow-unicorn"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-text-silver">Scanning Procurement Grid...</p>
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-md p-32 rounded-[64px] text-center border border-white shadow-soft relative overflow-hidden">
                        <div className="w-32 h-32 bg-white/60 text-unicorn-cyan/30 rounded-[48px] flex items-center justify-center mx-auto mb-10 border border-white shadow-inner">
                            <ShoppingBag size={56} />
                        </div>
                        <p className="font-black uppercase tracking-[0.5em] text-[10px] text-text-silver">No active procurement nodes detected</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {inquiries.map((order) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                key={order._id} 
                                className="bg-white/40 backdrop-blur-md rounded-[56px] p-12 border border-white shadow-soft hover:bg-white/60 transition-all group relative overflow-hidden border-l-[16px] border-l-unicorn-cyan/20 hover:border-l-unicorn-cyan"
                            >
                                <div className="flex flex-col xl:flex-row justify-between gap-12 relative z-10">
                                    <div className="flex-grow space-y-8">
                                        <div className="flex items-center gap-5">
                                            <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-sm border ${
                                                order.status === 'Pending' ? 'bg-unicorn-magenta/10 text-unicorn-magenta border-unicorn-magenta/20' : 
                                                order.status === 'Completed' ? 'bg-unicorn-cyan/10 text-unicorn-cyan border-unicorn-cyan/20' : 'bg-unicorn-purple/10 text-unicorn-purple border-unicorn-purple/20'
                                            }`}>
                                                {order.status} Protocol
                                            </span>
                                            <span className="text-text-silver text-[9px] font-black uppercase tracking-[0.3em] opacity-40">NODE ID: {order._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        
                                        <h3 className="text-3xl font-black text-text-main uppercase italic tracking-tighter group-hover:text-unicorn-cyan transition-colors duration-500">
                                            {order.medicineList}
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                            <div className="flex items-center gap-5 group/info">
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-text-silver transition-all group-hover/info:rotate-12 group-hover/info:scale-110 group-hover/info:text-unicorn-indigo">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase font-black tracking-[0.4em] text-text-silver opacity-60 mb-1">Entity Source</p>
                                                    <p className="font-black text-text-main text-base italic tracking-tighter uppercase">{order.doctorName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 group/info">
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-text-silver transition-all group-hover/info:rotate-12 group-hover/info:scale-110 group-hover/info:text-unicorn-purple">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase font-black tracking-[0.4em] text-text-silver opacity-60 mb-1">Facility Locus</p>
                                                    <p className="font-black text-text-main text-base italic tracking-tighter uppercase">{order.clinicName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 group/info border-l border-white/20 pl-6 border-dashed">
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-unicorn-cyan transition-all group-hover/info:rotate-12 group-hover/info:scale-110 shadow-unicorn/10">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase font-black tracking-[0.4em] text-unicorn-cyan opacity-60 mb-1">Quantum Magnitude</p>
                                                    <p className="font-black text-unicorn-cyan text-base italic tracking-tighter uppercase">{order.estimatedQuantity || 'STAGING'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col justify-end gap-5 pt-10 xl:pt-0 shrink-0 xl:border-l xl:border-white/20 xl:pl-10">
                                        <button 
                                            onClick={() => contactWhatsApp(order.phone, order.medicineList)}
                                            className="px-10 py-6 bg-text-main hover:bg-black text-white rounded-[28px] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-4 shadow-premium active:scale-95 transition-all group/wa relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-unicorn-cyan via-unicorn-purple to-unicorn-magenta opacity-0 group-hover/wa:opacity-20 transition-opacity"></div>
                                            <Phone size={20} className="group-hover/wa:rotate-12 transition-transform" /> Sync via WA
                                        </button>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => updateStatus(order._id, 'Completed')}
                                                className="flex-grow py-6 bg-white/40 hover:bg-unicorn-magenta hover:text-white rounded-[28px] font-black uppercase text-[10px] tracking-[0.4em] active:scale-95 transition-all border border-white hover:border-unicorn-magenta/40 hover:shadow-premium"
                                            >
                                                Resolve
                                            </button>
                                            <button 
                                                onClick={() => deleteInquiry(order._id)}
                                                className="p-6 bg-white/40 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[28px] border border-white hover:border-rose-300 active:scale-95 transition-all shadow-soft"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4 overflow-hidden">
                                    <p className="text-[8px] font-black text-text-silver uppercase tracking-[1em] opacity-20 whitespace-nowrap">AUTHENTICATED PROCUREMENT PROTOCOL 690-X</p>
                                    <div className="h-px bg-white/5 flex-grow"></div>
                                    <Sparkles size={16} className="text-text-silver/10" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Verification Notice */}
            <div className="p-12 bg-white/20 backdrop-blur-xl text-text-main rounded-[56px] flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group border border-white/40 shadow-soft">
               <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-unicorn-cyan/10 to-unicorn-magenta/10 opacity-40 blur-[100px] pointer-events-none"></div>
               <div className="w-24 h-24 bg-white/80 rounded-[32px] flex items-center justify-center shrink-0 border border-white shadow-soft">
                  <ShieldCheck size={48} className="text-unicorn-cyan" />
               </div>
               <div className="space-y-4 relative z-10">
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter">Procurement Integrity Check</h4>
                  <p className="text-text-silver font-black text-xs leading-relaxed max-w-2xl opacity-60 uppercase tracking-widest">
                    Manual contact point validation is strictly required for all orders exceeding the wholesale threshold. Resolve inquiries only after confirming financial commitment.
                  </p>
               </div>
               <div className="ml-auto hidden xl:block relative z-10">
                  <Wand2 size={60} className="text-text-main/10 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
               </div>
            </div>
        </div>
    );
};

export default BulkOrderCMS;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Phone, User, CheckCircle, Clock, Trash2, ExternalLink } from 'lucide-react';

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
            const { data } = await axios.get('https://ayuom-backend.vercel.app/api/bulk-orders', getAuthConfig());
            setInquiries(data);
        } catch (error) {
            console.error('Error fetching bulk orders', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`https://ayuom-backend.vercel.app/api/bulk-orders/${id}`, { status }, getAuthConfig());
            fetchInquiries();
        } catch (error) {
            alert('Error updating status');
        }
    };

    const deleteInquiry = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
        try {
            await axios.delete(`https://ayuom-backend.vercel.app/api/bulk-orders/${id}`, getAuthConfig());
            fetchInquiries();
        } catch (error) {
            alert('Error deleting inquiry');
        }
    };

    const contactWhatsApp = (phone, medicine) => {
        const message = encodeURIComponent(`Hello, I am Wedome Admin regarding your interest in bulk order for: ${medicine}. How can I assist you today?`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Bulk Order Inquiries</h2>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Manage high-volume medical procurement requests</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest animate-pulse">Scanning Inquiry Nodes...</div>
                ) : inquiries.length === 0 ? (
                    <div className="bg-white p-20 rounded-[40px] text-center text-slate-400 border border-slate-100 shadow-sm">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="font-black uppercase tracking-widest text-xs">No active bulk inquiries found</p>
                    </div>
                ) : inquiries.map((order) => (
                    <div key={order._id} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                            <div className="flex-grow space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        order.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                                        order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {order.status}
                                    </span>
                                    <span className="text-slate-300 text-[10px] font-bold">Inquiry ID: {order._id.slice(-8).toUpperCase()}</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{order.medicineList}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-10 text-sm">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 font-bold">Dr</div>
                                        <div>
                                            <p className="text-[9px] uppercase font-black tracking-widest opacity-50">Practitioner</p>
                                            <p className="font-bold text-slate-800">{order.doctorName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Clock size={16} /></div>
                                        <div>
                                            <p className="text-[9px] uppercase font-black tracking-widest opacity-50">Facility</p>
                                            <p className="font-bold text-slate-800">{order.clinicName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><ShoppingBag size={16} /></div>
                                        <div>
                                            <p className="text-[9px] uppercase font-black tracking-widest opacity-50 text-emerald-600/60">Estimated Qty</p>
                                            <p className="font-bold text-emerald-700">{order.estimatedQuantity || 'Not Specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex lg:flex-col justify-end gap-3 pt-4 lg:pt-0 shrink-0 border-t border-slate-50 lg:border-t-0 lg:border-l lg:pl-8">
                                <button 
                                    onClick={() => contactWhatsApp(order.phone, order.medicineList)}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                                >
                                    <Phone size={14} /> Send SMS/WA
                                </button>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => updateStatus(order._id, 'Completed')}
                                        className="flex-grow py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                                    >
                                        Mark Done
                                    </button>
                                    <button 
                                        onClick={() => deleteInquiry(order._id)}
                                        className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl border border-rose-100 active:scale-95 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BulkOrderCMS;

import React, { useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Send, Phone, User, Building, ClipboardList, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BulkInquiry = () => {
    const [formData, setFormData] = useState({
        doctorName: '',
        clinicName: '',
        phone: '',
        medicineList: '',
        estimatedQuantity: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setError('');
            await axios.post('https://ayuom-backend.vercel.app/api/bulk-orders', formData);
            setSubmitted(true);
        } catch (err) {
            setError('System error submitting inquiry. Please text our emergency WhatsApp line.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-xl shadow-emerald-500/10">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">Inquiry Successful</h1>
                    <p className="text-slate-500 font-medium">Your bulk procurement request has been registered. Our procurement officer will contact you on WhatsApp/SMS within 2 hours.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all"
                    >
                        Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <section className="bg-slate-900 pt-32 pb-48 px-8 text-center text-white rounded-b-[80px]">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">Bulk <span className="text-primary-500">Procurement</span></h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">Connect directly with our distribution hub for clinic-wide medicine supplies and high-volume procurement.</p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-8 -mt-32">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[56px] shadow-3xl p-10 lg:p-16 border border-slate-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 font-bold">{error}</div>}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><User size={12} /> Practitioner Name</label>
                                <input required type="text" placeholder="Dr. John Doe" className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:bg-white focus:border-primary-500 transition-all" value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Building size={12} /> Clinic/Hospital Name</label>
                                <input required type="text" placeholder="City General Hospital" className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:bg-white focus:border-primary-500 transition-all" value={formData.clinicName} onChange={e => setFormData({...formData, clinicName: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Phone size={12} /> WhatsApp/Contact Number</label>
                            <input required type="text" placeholder="+91 00000 00000" className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:bg-white focus:border-primary-500 transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><ClipboardList size={12} /> Detailed Medicine List</label>
                            <textarea required rows="4" placeholder="Enter list of medicines you require in bulk..." className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:bg-white focus:border-primary-500 transition-all resize-none" value={formData.medicineList} onChange={e => setFormData({...formData, medicineList: e.target.value})}></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><ShoppingBag size={12} /> Estimated Periodic Quantity</label>
                            <input type="text" placeholder="e.g. 500 strips per month" className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:bg-white focus:border-primary-500 transition-all" value={formData.estimatedQuantity} onChange={e => setFormData({...formData, estimatedQuantity: e.target.value})} />
                        </div>

                        <button disabled={loading} type="submit" className="w-full bg-slate-900 py-6 rounded-3xl font-black uppercase tracking-widest text-white shadow-2xl flex items-center justify-center gap-4 hover:bg-black active:scale-95 transition-all text-xs">
                            {loading ? 'Registering Inquiry...' : <><Send size={18} /> Submit Bulk Procurement Inquiry</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default BulkInquiry;

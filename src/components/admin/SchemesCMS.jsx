import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Zap, Save, Trash2, Plus, X, Edit, 
  ShieldCheck, TrendingDown, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const SchemesCMS = () => {
  const [schemes, setSchemes] = useState([]);
  const [schemesHeroData, setSchemesHeroData] = useState({ title: '', subtitle: '', description: '', imageUrl: '' });
  const [isUpdatingHero, setIsUpdatingHero] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'All Products', color: 'blue', icon: 'Zap', status: 'Active' });

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [heroRes, schemeRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/content/schemes`).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/schemesData`)
      ]);
      if (heroRes.data) setSchemesHeroData(heroRes.data);
      setSchemes(schemeRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateHero = async (e) => {
    e.preventDefault();
    setIsUpdatingHero(true);
    try {
      await axios.put(`${API_BASE_URL}/content/schemes`, schemesHeroData, getAuthConfig());
      alert('Updated successfully!');
    } catch (err) {
      alert('Failed to update.');
    } finally {
      setIsUpdatingHero(false);
    }
  };

  const handleOpenModal = (mode, sc = null) => {
    setModalMode(mode);
    if (mode === 'edit' && sc) {
      setFormData({ ...sc });
      setCurrentId(sc._id);
    } else {
      setFormData({ title: '', description: '', category: 'All Products', color: 'blue', icon: 'Zap', status: 'Active' });
      setCurrentId(null);
    }
    setShowModal(true);
  };

  const handleSubmitScheme = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const res = await axios.post(`${API_BASE_URL}/schemesData`, formData, getAuthConfig());
        setSchemes([...schemes, res.data]);
      } else {
        const res = await axios.put(`${API_BASE_URL}/schemesData/${currentId}`, formData, getAuthConfig());
        setSchemes(schemes.map(s => s._id === currentId ? res.data : s));
      }
      setShowModal(false);
    } catch (err) {
      alert('Error saving scheme.');
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!window.confirm('Erase this scheme?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/schemesData/${id}`, getAuthConfig());
      setSchemes(schemes.filter(s => s._id !== id));
    } catch (err) {
      alert('Error deleting.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between gap-8">
          <div>
             <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><Zap className="text-blue-600" /> Promotion Matrix</h2>
             <p className="text-slate-500 text-sm mt-1">Configure active schemes and landing page headers.</p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 self-start">
             <Plus size={18} /> New Campaign
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {schemes.map(sc => (
            <div key={sc._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-6 hover:border-blue-600 transition-all group">
               <div className={`w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0`}>
                  <Zap size={28} className="text-blue-600" />
               </div>
               <div className="flex-grow space-y-2">
                  <div className="flex justify-between items-start">
                     <div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${sc.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{sc.status}</span>
                        <h4 className="font-bold text-slate-900 mt-1">{sc.title}</h4>
                     </div>
                     <div className="flex gap-1">
                        <button onClick={() => handleOpenModal('edit', sc)} className="p-2 text-slate-400 hover:text-blue-600"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteScheme(sc._id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                     </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{sc.description}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sc.category}</p>
               </div>
            </div>
          ))}
       </div>
       
       {showModal && (
         <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
               <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">{modalMode === 'add' ? 'Initiate Scheme' : 'Edit Campaign'}</h3>
                  <button onClick={() => setShowModal(false)}><X size={20} /></button>
               </div>
               <form onSubmit={handleSubmitScheme} className="p-8 space-y-6">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 italic">Campaign Title</label>
                     <input required className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500">Category Qualifier</label>
                     <input required className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500">System Description</label>
                     <textarea className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-grow space-y-1">
                        <label className="text-xs font-bold text-slate-500">Status Node</label>
                        <select className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-bold" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                           <option>Active</option>
                           <option>Inactive</option>
                        </select>
                     </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-[10px]">Commit Protocol</button>
               </form>
            </div>
         </div>
       )}
    </div>
  );
};

export default SchemesCMS;

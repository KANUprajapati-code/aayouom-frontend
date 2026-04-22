import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Plus, Edit, Trash2, X, Save, 
  Search, Link as LinkIcon, Globe, Layout,
  Eye, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const PagesCMS = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', status: 'published' });

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/pages`);
      setPages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, page = null) => {
    setModalMode(mode);
    if (mode === 'edit' && page) {
      setFormData({ title: page.title, slug: page.slug, content: page.content, status: page.status || 'published' });
      setCurrentId(page._id);
    } else {
      setFormData({ title: '', slug: '', content: '', status: 'published' });
      setCurrentId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const res = await axios.post(`${API_BASE_URL}/pages`, formData, getAuthConfig());
        setPages([...pages, res.data]);
      } else {
        const res = await axios.put(`${API_BASE_URL}/pages/${currentId}`, formData, getAuthConfig());
        setPages(pages.map(p => p._id === currentId ? res.data : p));
      }
      setShowModal(false);
    } catch (err) {
      alert('Error saving page.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this page?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/pages/${id}`, getAuthConfig());
      setPages(pages.filter(p => p._id !== id));
    } catch (err) {
      alert('Delete failed.');
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs font-sans">Compiling Page Registry...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
               <FileText className="text-blue-600" /> Dynamic Page Node
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage transactional pages, terms, and legal documentation segments.</p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 self-start shadow-lg">
             <Plus size={18} /> New Page Site
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map(page => (
            <div key={page._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-600 transition-all flex flex-col group">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-blue-600">
                     <Globe size={24} />
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => handleOpenModal('edit', page)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                     <button onClick={() => handleDelete(page._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-tight truncate">{page.title}</h4>
                    <p className="text-[10px] font-bold text-blue-600 mt-1">/{page.slug}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-200">{page.status || 'Published'}</span>
                     <button className="text-[9px] font-bold text-slate-400 hover:text-slate-900 flex items-center gap-1 uppercase tracking-widest"><Eye size={12} /> Preview</button>
                  </div>
               </div>
            </div>
          ))}
       </div>

       {showModal && (
         <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200">
               <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-sans">
                  <h3 className="font-bold text-slate-900">{modalMode === 'add' ? 'New Page Protocol' : 'Modify Page Structure'}</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
               </div>
               <form onSubmit={handleSubmit} className="p-8 space-y-6 text-sans">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Page Identity</label>
                        <input required className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Slug Handle</label>
                        <input required className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold text-blue-600 text-sm" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500">Content Ledger (Markdown/HTML Support)</label>
                     <textarea rows="10" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 transition-all text-sm font-mono resize-none" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-[10px]">Commit Page to Public Grid</button>
               </form>
            </div>
         </div>
       )}
    </div>
  );
};

export default PagesCMS;

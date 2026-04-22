import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Plus, Edit, Trash2, Save, X, 
  ChevronDown, ChevronUp, Layout, 
  Database, Zap, AlignLeft, Eye, 
  Sparkles, Wand2, ShieldCheck, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const PagesCMS = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentPageId, setCurrentPageId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    active: true,
    sections: []
  });

  const [categories, setCategories] = useState([]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchPages();
    fetchCategories();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/pages/admin/all`, getAuthConfig());
      setPages(res.data);
    } catch (err) {
      console.error('Fetch pages error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(res.data.map(c => c.name));
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  const handleOpenModal = (mode, page = null) => {
    setModalMode(mode);
    if (mode === 'edit' && page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        active: page.active,
        sections: page.sections || []
      });
      setCurrentPageId(page._id);
    } else {
      setFormData({
        title: '',
        slug: '',
        active: true,
        sections: []
      });
      setCurrentPageId(null);
    }
    setShowModal(true);
  };

  const handleAddSection = (type) => {
    const newSection = {
      type,
      title: '',
      subtitle: '',
      category: categories[0] || 'General',
      content: '',
      active: true
    };
    setFormData({ ...formData, sections: [...formData.sections, newSection] });
  };

  const handleRemoveSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const moveSection = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.sections.length - 1) return;
    
    const newSections = [...formData.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.slug) {
        alert('Slug protocol required');
        return;
    }
    try {
      if (modalMode === 'add') {
        await axios.post(`${API_BASE_URL}/pages`, formData, getAuthConfig());
        alert('Dynamic Page Node Created Successfully!');
      } else {
        await axios.put(`${API_BASE_URL}/pages/${currentPageId}`, formData, getAuthConfig());
        alert('Dynamic Page Node Synchronized Successfully!');
      }
      setShowModal(false);
      fetchPages();
    } catch (err) {
      alert('Error saving node: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Erase this architectural node?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/pages/${id}`, getAuthConfig());
      setPages(pages.filter(p => p._id !== id));
    } catch (err) {
      alert('Error deleting node.');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12 pb-24 font-sans">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-white/40 shadow-soft relative overflow-hidden group">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-unicorn-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-unicorn-indigo via-unicorn-purple to-unicorn-magenta rounded-3xl shadow-unicorn">
               <FileText size={32} className="text-white" />
            </div>
            Node Architect
          </h2>
          <p className="text-text-silver mt-4 font-black uppercase tracking-[0.4em] text-[11px] opacity-60">Dynamic Landing Page Constructor • v3.0</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="bg-text-main hover:bg-black text-white px-12 py-5 rounded-[28px] text-[12px] font-black uppercase tracking-[0.3em] shadow-premium flex items-center gap-4 transition-all active:scale-95 group relative z-10">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Instantiate Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full py-20 text-center space-y-6">
               <div className="w-16 h-16 border-4 border-unicorn-cyan/10 border-t-unicorn-cyan rounded-full animate-spin mx-auto"></div>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-text-silver">Scanning Page Nodes...</p>
            </div>
          ) : pages.map(page => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={page._id} 
              className="bg-white/40 backdrop-blur-md p-10 rounded-[48px] border border-white/40 shadow-soft hover:bg-white hover:shadow-premium transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-unicorn-purple/5 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 bg-white shadow-soft rounded-3xl flex items-center justify-center border border-white/60 group-hover:shadow-unicorn group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                  <FileText size={28} className="text-unicorn-cyan" />
                </div>
                <div className="flex items-center gap-3">
                   <button onClick={() => handleOpenModal('edit', page)} className="p-4 bg-white/60 hover:bg-text-main hover:text-white rounded-2xl text-text-silver shadow-sm transition-all border border-white/40"><Edit size={18} /></button>
                   <button onClick={() => handleDelete(page._id)} className="p-4 bg-white/60 hover:bg-rose-500 hover:text-white rounded-2xl text-text-silver shadow-sm transition-all border border-white/40"><Trash2 size={18} /></button>
                </div>
              </div>
              
              <div className="space-y-3 relative z-10">
                 <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none group-hover:text-unicorn-cyan transition-colors">{page.title}</h3>
                 <p className="text-[10px] font-black text-unicorn-magenta uppercase tracking-widest opacity-60">/page/{page.slug}</p>
              </div>
              
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/20 relative z-10">
                 <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${page.active ? 'bg-unicorn-cyan shadow-[0_0_8px_rgba(0,210,255,0.8)] animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className="text-[9px] font-black uppercase text-text-silver tracking-widest">{page.active ? 'Operational' : 'Staged'}</span>
                 </div>
                 <a href={`/page/${page.slug}`} target="_blank" rel="noreferrer" className="p-3 bg-white/60 rounded-xl text-text-main hover:bg-unicorn-cyan hover:text-white transition-all shadow-soft group/eye">
                    <Eye size={16} className="group-hover/eye:scale-125 transition-transform" />
                 </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className="bg-white/80 backdrop-blur-3xl rounded-[64px] w-full max-w-5xl overflow-hidden shadow-unicorn border border-white/40 animate-in zoom-in-95 duration-500 h-[90vh] flex flex-col relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-unicorn-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="p-16 border-b border-white/20 flex justify-between items-center shrink-0 relative z-10">
                 <div className="space-y-3">
                    <h2 className="text-4xl font-black text-text-main italic uppercase tracking-tighter leading-none">{modalMode === 'add' ? 'Construct Dynamic Node' : 'Modify Node Topology'}</h2>
                    <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em]">Resource Infrastructure Manager</p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-6 bg-white/40 rounded-3xl hover:bg-rose-500 hover:text-white transition-all text-text-silver shadow-soft group">
                    <X size={32} className="group-hover:rotate-90 transition-transform" />
                 </button>
              </div>

              <div className="flex-grow overflow-y-auto p-16 custom-scrollbar relative z-10 space-y-12">
                 <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-6">Page Core Designation</label>
                          <input required type="text" placeholder="e.g. SPECIAL CLEARANCE OFFERS" className="w-full bg-white/50 p-8 rounded-[32px] font-black text-text-main border border-white/60 outline-none focus:bg-white focus:shadow-unicorn transition-all uppercase text-lg tracking-tighter italic" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-6">URL Pointer (Slug)</label>
                          <div className="relative">
                             <span className="absolute left-8 top-1/2 -translate-y-1/2 text-text-silver/40 font-black text-xs uppercase tracking-widest">/page/</span>
                             <input required type="text" placeholder="discount-hub" className="w-full bg-white/50 p-8 pl-24 rounded-[32px] font-black text-unicorn-cyan border border-white/60 outline-none focus:bg-white focus:shadow-unicorn transition-all text-base tracking-tighter lowercase" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.replace(/\s+/g, '-').toLowerCase()})} />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-10">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/20 pb-8 italic">
                          <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-4"><div className="w-2 h-6 bg-unicorn-cyan rounded-full shadow-unicorn"></div> Sector Blueprint</h3>
                          <div className="flex flex-wrap gap-3">
                             {[
                               { id: 'hero', label: 'Inhale Hero', icon: Layout, color: 'text-unicorn-cyan' },
                               { id: 'products', label: 'Bind Products', icon: Database, color: 'text-unicorn-magenta' },
                               { id: 'schemes', label: 'Eject Schemes', icon: Zap, color: 'text-secondary-500' },
                               { id: 'text', label: 'Forge Text', icon: AlignLeft, color: 'text-unicorn-purple' }
                             ].map((tool) => (
                               <button 
                                 key={tool.id}
                                 type="button" 
                                 onClick={() => handleAddSection(tool.id)}
                                 className="px-6 py-4 bg-white/40 hover:bg-black hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/40 flex items-center gap-3 shadow-soft group"
                               >
                                  <tool.icon size={14} className={`${tool.color} group-hover:text-white transition-colors`} /> {tool.label}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-8 pb-10">
                          {formData.sections.map((section, index) => (
                            <motion.div 
                              layout
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={index} 
                              className="bg-white/50 border border-white rounded-[48px] p-10 relative group/section hover:bg-white transition-all duration-500 shadow-soft"
                            >
                               <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 scale-90">
                                  <button type="button" onClick={() => moveSection(index, 'up')} className="p-3 bg-white border border-white rounded-2xl hover:text-unicorn-cyan transition-all shadow-soft"><ChevronUp size={20} /></button>
                                  <button type="button" onClick={() => moveSection(index, 'down')} className="p-3 bg-white border border-white rounded-2xl hover:text-unicorn-cyan transition-all shadow-soft"><ChevronDown size={20} /></button>
                               </div>

                               <div className="flex items-center justify-between mb-10">
                                  <div className="flex items-center gap-5">
                                     <div className={`p-4 rounded-2xl shadow-inner ${section.type === 'hero' ? 'bg-unicorn-cyan/10 text-unicorn-cyan' : section.type === 'products' ? 'bg-unicorn-magenta/10 text-unicorn-magenta' : section.type === 'schemes' ? 'bg-secondary-500/10 text-secondary-500' : 'bg-unicorn-purple/10 text-unicorn-purple'}`}>
                                        {section.type === 'hero' && <Layout size={20} />}
                                        {section.type === 'products' && <Database size={20} />}
                                        {section.type === 'schemes' && <Zap size={20} />}
                                        {section.type === 'text' && <AlignLeft size={20} />}
                                     </div>
                                     <span className="text-[11px] font-black uppercase tracking-[0.4em] text-text-silver italic">Protocol: <span className="text-text-main line-through decoration-unicorn-cyan decoration-2">STAGING</span> <span className="text-text-main ml-2">{section.type}</span></span>
                                  </div>
                                  <button type="button" onClick={() => handleRemoveSection(index)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 uppercase font-black text-[9px] tracking-widest active:scale-95">Purge Block</button>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                  <div className="space-y-3">
                                     <label className="text-[9px] font-black text-text-silver uppercase tracking-[0.5em] ml-4 italic">Zone Identity</label>
                                     <input type="text" placeholder="MAIN HEADING..." className="w-full bg-slate-50 p-6 rounded-3xl font-black text-text-main border border-slate-100 outline-none focus:bg-white focus:shadow-unicorn transition-all text-base tracking-tighter uppercase italic" value={section.title} onChange={e => handleSectionChange(index, 'title', e.target.value)} />
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[9px] font-black text-text-silver uppercase tracking-[0.5em] ml-4 italic">Sub-Flux Label</label>
                                     <input type="text" placeholder="CAPTION..." className="w-full bg-slate-50 p-6 rounded-3xl font-bold text-text-main border border-slate-100 outline-none focus:bg-white focus:shadow-unicorn transition-all text-xs tracking-widest uppercase" value={section.subtitle} onChange={e => handleSectionChange(index, 'subtitle', e.target.value)} />
                                  </div>

                                  {section.type === 'products' && (
                                    <div className="col-span-full space-y-3">
                                       <label className="text-[9px] font-black text-text-silver uppercase tracking-[0.5em] ml-4">Filter Algorithm (Category)</label>
                                       <select className="w-full bg-slate-50 p-6 rounded-3xl font-black text-text-main border border-slate-100 outline-none focus:bg-white transition-all text-xs tracking-widest uppercase cursor-pointer appearance-none" value={section.category} onChange={e => handleSectionChange(index, 'category', e.target.value)}>
                                          {categories.map(c => <option key={c}>{c}</option>)}
                                       </select>
                                    </div>
                                  )}

                                  {section.type === 'text' && (
                                    <div className="col-span-full space-y-3">
                                       <label className="text-[9px] font-black text-text-silver uppercase tracking-[0.5em] ml-4">Body Stream (Markdown)</label>
                                       <textarea rows="4" className="w-full bg-slate-50 p-8 rounded-[32px] font-bold text-text-main border border-slate-100 outline-none focus:bg-white focus:shadow-unicorn transition-all text-sm resize-none tracking-tight leading-relaxed" value={section.content} onChange={e => handleSectionChange(index, 'content', e.target.value)} placeholder="ENTER CORE CONTENT STREAM..."></textarea>
                                    </div>
                                  )}
                               </div>
                            </motion.div>
                          ))}
                          {formData.sections.length === 0 && (
                            <div className="py-40 border-4 border-dashed border-white/20 rounded-[64px] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000">
                               <div className="w-24 h-24 bg-white/40 rounded-[40px] flex items-center justify-center border border-white/20 shadow-soft">
                                  <Layout size={40} className="text-text-silver opacity-20" />
                                </div>
                               <div className="space-y-3">
                                  <p className="text-[11px] font-black text-text-silver uppercase tracking-[0.5em]">Blueprint Fragmented</p>
                                  <p className="text-[9px] font-black text-text-silver opacity-40 uppercase tracking-widest italic">Select a construction tool from the panel above to begin node synthesis.</p>
                               </div>
                            </div>
                          )}
                       </div>
                    </div>
                 </form>
              </div>

              <div className="p-16 border-t border-white/20 shrink-0 bg-white/60 backdrop-blur-md relative z-10">
                 <button onClick={handleSubmit} className="w-full bg-text-main py-10 rounded-[40px] font-black uppercase tracking-[0.6em] text-white shadow-premium flex items-center justify-center gap-6 active:scale-95 transition-all text-[11px] hover:bg-black group">
                    <Save className="w-6 h-6 group-hover:scale-125 transition-transform" /> Commit Architecture to Web Node
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PagesCMS;

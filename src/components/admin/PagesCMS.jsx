/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Plus, Edit, Trash2, Save, X, 
  ChevronDown, ChevronUp, Layout, 
  Database, Zap, AlignLeft, Eye 
} from 'lucide-react';

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

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchPages();
    fetchCategories();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://ayuom-backend.vercel.app/api/pages/admin/all', config);
      setPages(res.data);
    } catch (err) {
      console.error('Fetch pages error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://ayuom-backend.vercel.app/api/categories');
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
    e.preventDefault();
    if (!formData.slug) {
        alert('Slug is required');
        return;
    }
    try {
      if (modalMode === 'add') {
        await axios.post('https://ayuom-backend.vercel.app/api/pages', formData, config);
        alert('Dynamic page created successfully!');
      } else {
        await axios.put(`https://ayuom-backend.vercel.app/api/pages/${currentPageId}`, formData, config);
        alert('Dynamic page updated successfully!');
      }
      setShowModal(false);
      fetchPages();
    } catch (err) {
      alert('Error saving page: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dynamic page?')) return;
    try {
      await axios.delete(`https://ayuom-backend.vercel.app/api/pages/${id}`, config);
      setPages(pages.filter(p => p._id !== id));
    } catch (err) {
      alert('Error deleting page.');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none underline decoration-primary-600 underline-offset-8">Page Builder Hub</h2>
          <p className="text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] text-[10px]">Create & Manage Dynamic Landing Pages sitewide</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="bg-primary-600 hover:bg-primary-500 text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl shadow-primary-500/30 flex items-center gap-2 active:scale-95 transition-all">
          <Plus className="w-5 h-5" /> Construct New Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Page Nodes...</div>
        ) : pages.map(page => (
          <div key={page._id} className="bg-white p-8 rounded-[40px] border border-surface-border hover:border-primary-600/30 transition-all shadow-premium group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                <FileText size={24} />
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={() => handleOpenModal('edit', page)} className="p-2.5 bg-surface-light hover:bg-primary-600 rounded-xl text-slate-400 hover:text-white transition-all"><Edit size={18} /></button>
                 <button onClick={() => handleDelete(page._id)} className="p-2.5 bg-surface-light hover:bg-rose-500 rounded-xl text-slate-400 hover:text-white transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 uppercase italic leading-none">{page.title}</h3>
            <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest opacity-60 mb-6">/page/{page.slug}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-surface-border">
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${page.active ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className="text-[9px] font-black uppercase text-slate-400">{page.active ? 'Active Node' : 'Suspended'}</span>
               </div>
               <a href={`/page/${page.slug}`} target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase text-primary-600 hover:underline flex items-center gap-1">
                  Preview <Eye size={12} />
               </a>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white rounded-[56px] w-full max-w-4xl overflow-hidden shadow-3xl border border-white/20 animate-in zoom-in-95 duration-300 h-[90vh] flex flex-col">
              <div className="p-10 border-b border-surface-border flex justify-between items-center bg-surface-light shrink-0">
                 <div className="space-y-1">
                    <h2 className="text-3xl font-black text-primary-600 italic uppercase tracking-tighter leading-none">{modalMode === 'add' ? 'Construct Dynamic Page' : 'Modify Existing Page'}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Page Architect</p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-4 bg-white rounded-2xl hover:bg-rose-500 hover:text-white transition-all text-slate-300 shadow-premium group">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-grow overflow-y-auto p-10 custom-scrollbar">
                 <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Page Designation (Title)</label>
                          <input required type="text" placeholder="e.g. SPECIAL CLEARANCE OFFERS" className="w-full bg-surface-light p-5 rounded-2xl font-black text-slate-900 border border-surface-border outline-none focus:bg-white focus:border-primary-500 transition-all uppercase text-sm tracking-tight" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Reference (Slug)</label>
                          <div className="relative">
                             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">/page/</span>
                             <input required type="text" placeholder="discount-hub" className="w-full bg-surface-light p-5 pl-16 rounded-2xl font-black text-primary-600 border border-surface-border outline-none focus:bg-white focus:border-primary-500 transition-all text-sm tracking-tight" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.replace(/\s+/g, '-').toLowerCase()})} />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between border-b border-surface-border pb-4">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><div className="w-1.5 h-4 bg-primary-600 rounded-full"></div> Section Blueprint</h3>
                          <div className="flex gap-2">
                             {[
                               { id: 'hero', label: 'Add Hero', icon: Layout },
                               { id: 'products', label: 'Add Products', icon: Database },
                               { id: 'schemes', label: 'Add Schemes', icon: Zap },
                               { id: 'text', label: 'Add Text', icon: AlignLeft }
                             ].map((tool) => (
                               <button 
                                 key={tool.id}
                                 type="button" 
                                 onClick={() => handleAddSection(tool.id)}
                                 className="px-4 py-2.5 bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-primary-100 flex items-center gap-2"
                               >
                                  <tool.icon size={12} /> {tool.label}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-6">
                          {formData.sections.map((section, index) => (
                            <div key={index} className="bg-surface-light border border-surface-border rounded-3xl p-8 relative group/section animate-in slide-in-from-top-2 duration-300">
                               <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
                                  <button type="button" onClick={() => moveSection(index, 'up')} className="p-1 bg-white border border-surface-border rounded-lg hover:text-primary-600 transition-all shadow-sm"><ChevronUp size={14} /></button>
                                  <button type="button" onClick={() => moveSection(index, 'down')} className="p-1 bg-white border border-surface-border rounded-lg hover:text-primary-600 transition-all shadow-sm"><ChevronDown size={14} /></button>
                               </div>

                               <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-3">
                                     <div className={`p-2 rounded-lg ${section.type === 'hero' ? 'bg-blue-100 text-blue-600' : section.type === 'products' ? 'bg-amber-100 text-amber-600' : section.type === 'schemes' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                                        {section.type === 'hero' && <Layout size={16} />}
                                        {section.type === 'products' && <Database size={16} />}
                                        {section.type === 'schemes' && <Zap size={16} />}
                                        {section.type === 'text' && <AlignLeft size={16} />}
                                     </div>
                                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Type: <span className="text-slate-900">{section.type}</span></span>
                                  </div>
                                  <button type="button" onClick={() => handleRemoveSection(index)} className="text-rose-400 hover:text-rose-600 font-bold text-[9px] uppercase tracking-widest">Remove Block</button>
                               </div>

                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-1">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Title</label>
                                     <input type="text" placeholder="Main Heading..." className="w-full bg-white p-3 rounded-xl font-bold text-slate-900 border border-surface-border outline-none transition-all text-xs" value={section.title} onChange={e => handleSectionChange(index, 'title', e.target.value)} />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Subsection / Caption</label>
                                     <input type="text" placeholder="Additional details..." className="w-full bg-white p-3 rounded-xl font-bold text-slate-700 border border-surface-border outline-none transition-all text-xs" value={section.subtitle} onChange={e => handleSectionChange(index, 'subtitle', e.target.value)} />
                                  </div>

                                  {section.type === 'products' && (
                                    <div className="col-span-2 space-y-1">
                                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter by Product Category</label>
                                       <select className="w-full bg-white p-3 rounded-xl font-bold text-slate-900 border border-surface-border outline-none transition-all text-xs" value={section.category} onChange={e => handleSectionChange(index, 'category', e.target.value)}>
                                          {categories.map(c => <option key={c}>{c}</option>)}
                                       </select>
                                    </div>
                                  )}

                                  {section.type === 'text' && (
                                    <div className="col-span-2 space-y-1">
                                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Body Content</label>
                                       <textarea rows="4" className="w-full bg-white p-4 rounded-xl font-bold text-slate-900 border border-surface-border outline-none transition-all text-xs resize-none" value={section.content} onChange={e => handleSectionChange(index, 'content', e.target.value)}></textarea>
                                    </div>
                                  )}
                               </div>
                            </div>
                          ))}
                          {formData.sections.length === 0 && (
                            <div className="py-20 border-2 border-dashed border-surface-border rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
                               <Layout size={32} className="text-slate-200" />
                               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Empty Blueprint: Select a section tool above to begin construction</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </form>
              </div>

              <div className="p-10 border-t border-surface-border shrink-0 bg-white">
                 <button onClick={handleSubmit} className="w-full bg-slate-900 py-6 rounded-[28px] font-black uppercase tracking-widest text-white shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all text-sm hover:bg-primary-600 group">
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> Commit Architecture to Web Node
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PagesCMS;

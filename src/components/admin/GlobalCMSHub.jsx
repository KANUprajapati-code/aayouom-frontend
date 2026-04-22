import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Save, Layout, ShieldCheck, Zap, Mail, Phone, 
  MapPin, Globe, Instagram, PhoneCall, Sparkles, 
  Upload, Trash2, Plus, Wand2, Info, Image as ImageIcon,
  Package
} from 'lucide-react';
import API_BASE_URL from '../../config/api';

const GlobalCMSHub = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('home');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/content/homepage`);
      setFormData(data || {});
    } catch (error) {
      console.error('Failed to fetch content', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/content/homepage`, formData, getAuthConfig());
      alert('Global CMS Hub Synchronized Successfully!');
    } catch (error) {
      console.error('Failed to save content', error);
      alert('Error updating content.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
        
        try {
          const { data } = await axios.post(`${API_BASE_URL}/upload`, 
            { base64: compressedBase64 }, getAuthConfig()
          );
          
          const updated = [...formData.heroBanners];
          updated[index].imageUrl = data.url;
          setFormData(prev => ({ ...prev, heroBanners: updated }));
        } catch (error) {
           console.error("Error uploading image:", error);
           alert(error.response?.data?.message || "Failed to upload image.");
        } finally {
           setUploading(false);
        }
      };
    };
  };

  if (loading) {
    return (
      <div className="py-60 flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in duration-700">
         <div className="w-24 h-24 border-[6px] border-unicorn-cyan/20 border-t-unicorn-cyan rounded-full animate-spin shadow-unicorn relative">
            <div className="absolute inset-0 border-[6px] border-unicorn-magenta/20 border-b-unicorn-magenta rounded-full animate-spin-reverse opacity-40"></div>
         </div>
         <p className="font-black text-text-silver uppercase tracking-[0.5em] text-[10px]">Scanning Global Ether... Node 01 Syncing</p>
      </div>
    );
  }

  const subTabs = [
    { id: 'home', label: 'Ethereal Home', icon: Layout, color: 'text-unicorn-cyan', bg: 'bg-unicorn-cyan/10' },
    { id: 'about', label: 'Mission Data', icon: Globe, color: 'text-unicorn-purple', bg: 'bg-unicorn-purple/10' },
    { id: 'contact', label: 'Communication', icon: Mail, color: 'text-unicorn-magenta', bg: 'bg-unicorn-magenta/10' },
    { id: 'settings', label: 'Core Manifest', icon: ShieldCheck, color: 'text-secondary-500', bg: 'bg-secondary-500/10' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-12 pb-24">
      {/* Header section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-white/40 shadow-soft relative overflow-hidden group">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-unicorn-cyan/5 rounded-full blur-[100px] group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-unicorn-indigo via-unicorn-purple to-unicorn-magenta rounded-3xl shadow-unicorn">
               <Wand2 size={32} className="text-white" />
            </div>
            Global CMS Hub
          </h2>
          <p className="text-text-silver mt-4 font-black uppercase tracking-[0.4em] text-[11px] opacity-60">Architectural Command Node • v4.0 Quantum</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-text-main hover:scale-105 active:scale-95 text-white font-black px-16 py-7 rounded-[40px] text-[12px] uppercase tracking-[0.4em] shadow-premium flex items-center gap-5 transition-all group relative z-10"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <><Save className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Commit Changes</>
          )}
        </button>
      </div>

      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-4 p-4 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/40 shadow-soft w-fit">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-10 py-5 rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 relative overflow-hidden group ${activeSubTab === tab.id ? 'text-white' : 'text-text-silver hover:text-text-main hover:bg-white/40'}`}
          >
            {activeSubTab === tab.id && (
              <div className="absolute inset-0 bg-text-main group-hover:bg-black transition-colors z-0"></div>
            )}
            <tab.icon size={18} className={`relative z-10 ${activeSubTab === tab.id ? 'text-white' : tab.color}`} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-16">
        {activeSubTab === 'home' && (
          <div className="grid grid-cols-1 gap-12 animate-in slide-in-from-bottom-8 duration-700">
             {/* HERO SLIDER SECTION */}
             <div className="bg-white/40 backdrop-blur-md rounded-[64px] border border-white/40 shadow-soft p-16 space-y-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-unicorn-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="flex justify-between items-center relative z-10">
                   <div className="space-y-4">
                      <h3 className="text-2xl font-black text-text-main uppercase italic tracking-tighter flex items-center gap-5 leading-none">
                         <div className="w-12 h-12 bg-unicorn-cyan/10 rounded-2xl flex items-center justify-center text-unicorn-cyan shadow-inner">
                            <Layout size={24} />
                         </div> 
                         Visual Core Deployment
                      </h3>
                      <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.3em] opacity-60">Landing Page Rotator Grid Node</p>
                   </div>
                   <button 
                     onClick={() => {
                       const newBanner = {
                         imageUrl: "",
                         badge: "Verified Protocol Hub",
                         title1: "Quantum Medicine",
                         title2: "Sourcing Excellence",
                         description: "Executing global pharmaceuticals delivery with sub-zero latency...",
                         btn1Text: "Initiate Order",
                         btn1Link: "/products",
                         btn2Text: "Quick Scan",
                         btn2Link: "/quick-order"
                       };
                       setFormData(prev => ({
                         ...prev,
                         heroBanners: [...(prev.heroBanners || []), newBanner]
                       }));
                     }} 
                     className="px-10 py-5 bg-white border border-white/40 text-text-main rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-unicorn-cyan hover:text-white transition-all shadow-soft active:scale-95 flex items-center gap-3 group"
                   >
                     <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Instantiate Slide
                   </button>
                </div>
                
                <div className="space-y-10 relative z-10">
                  {(formData?.heroBanners || []).map((banner, index) => (
                    <div key={index} className="p-12 bg-white/50 backdrop-blur-sm rounded-[48px] border border-white shadow-soft relative group hover:bg-white transition-all duration-500 border-l-[12px] border-l-unicorn-cyan/20 hover:border-l-unicorn-cyan">
                       <button 
                         onClick={() => {
                           const updated = formData.heroBanners.filter((_, i) => i !== index);
                           setFormData(prev => ({ ...prev, heroBanners: updated }));
                         }} 
                         className="absolute -top-4 -right-4 p-5 bg-white text-rose-500 rounded-3xl border border-rose-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-xl hover:rotate-6"
                       >
                          <Trash2 size={20} />
                       </button>
                       
                       <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                         <div className="space-y-4 col-span-full">
                            <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Neural Buffer Image Asset</label>
                            <div className="flex flex-col xl:flex-row gap-6 xl:items-center">
                               <div className="flex-grow relative">
                                  <input 
                                     value={banner.imageUrl || ''} 
                                     onChange={(e) => {
                                        const updated = [...formData.heroBanners];
                                        updated[index].imageUrl = e.target.value;
                                        setFormData(prev => ({ ...prev, heroBanners: updated }));
                                     }}
                                     className="w-full bg-slate-50 p-6 rounded-[28px] font-black text-text-main border border-slate-100 outline-none focus:bg-white focus:shadow-unicorn transition-all pl-14" 
                                     placeholder="ENTER ASSET URI..."
                                  />
                                  <ImageIcon size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-silver" />
                               </div>
                               <label className={`cursor-pointer px-10 py-6 bg-text-main text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center shrink-0 shadow-lg active:scale-95 gap-3 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                 {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload size={18} />}
                                 <input type="file" accept="image/*" className="hidden" onChange={(e) => { e.target.files[0] && handleImageUpload(index, e.target.files[0]) }} />
                                 Sync Local Archive
                               </label>

                               <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                  {banner.imageUrl ? <img loading="lazy" src={banner.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <Layout className="text-slate-100" size={32} />}
                               </div>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Protocol Tag</label>
                            <input 
                               value={banner.badge || ''} 
                               onChange={(e) => {
                                  const updated = [...formData.heroBanners];
                                  updated[index].badge = e.target.value;
                                  setFormData(prev => ({ ...prev, heroBanners: updated }));
                               }}
                               className="w-full bg-slate-50 p-6 rounded-[28px] font-black text-text-main border border-slate-100 outline-none focus:bg-white focus:shadow-unicorn transition-all italic text-base tracking-tighter" 
                            />
                         </div>
                         <div className="space-y-4 text-unicorn-cyan">
                            <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Primary Matrix Directive</label>
                            <input 
                               value={banner.title1 || ''} 
                               onChange={(e) => {
                                  const updated = [...formData.heroBanners];
                                  updated[index].title1 = e.target.value;
                                  setFormData(prev => ({ ...prev, heroBanners: updated }));
                               }}
                               className="w-full bg-unicorn-cyan/5 p-6 rounded-[28px] font-black text-unicorn-cyan border border-unicorn-cyan/10 outline-none focus:bg-white focus:shadow-unicorn transition-all text-xl tracking-tighter italic uppercase" 
                            />
                         </div>
                         <div className="space-y-4 text-unicorn-magenta">
                            <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Accent Variant Title</label>
                            <input 
                               value={banner.title2 || ''} 
                               onChange={(e) => {
                                  const updated = [...formData.heroBanners];
                                  updated[index].title2 = e.target.value;
                                  setFormData(prev => ({ ...prev, heroBanners: updated }));
                               }}
                               className="w-full bg-unicorn-magenta/5 p-6 rounded-[28px] font-black text-unicorn-magenta border border-unicorn-magenta/10 outline-none focus:bg-white focus:shadow-unicorn transition-all text-xl tracking-tighter italic uppercase" 
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Extended Context Stream</label>
                            <textarea 
                               rows="2"
                               value={banner.description || ''} 
                               onChange={(e) => {
                                  const updated = [...formData.heroBanners];
                                  updated[index].description = e.target.value;
                                  setFormData(prev => ({ ...prev, heroBanners: updated }));
                               }}
                               className="w-full bg-slate-50 p-6 rounded-[28px] font-bold text-text-main border border-slate-100 outline-none focus:bg-white focus:shadow-unicorn transition-all resize-none text-sm tracking-tight" 
                            ></textarea>
                         </div>
                         <div className="grid grid-cols-2 gap-8 col-span-full pt-10 border-t border-slate-50 mt-4">
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-text-silver uppercase tracking-[0.5em] ml-2">ALPHA CTRL TXT</label>
                               <input value={banner.btn1Text || ''} onChange={(e) => {
                                  const updated = [...formData.heroBanners];
                                  updated[index].btn1Text = e.target.value;
                                  setFormData(prev => ({ ...prev, heroBanners: updated }));
                               }} className="w-full bg-white p-5 rounded-2xl border border-slate-100 text-[11px] font-black tracking-widest uppercase hover:border-unicorn-cyan transition-colors" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-text-silver uppercase tracking-[0.5em] ml-2">ALPHA CTRL LNK</label>
                               <input value={banner.btn1Link || ''} onChange={(e) => {
                                  const updated = [...formData.heroBanners];
                                  updated[index].btn1Link = e.target.value;
                                  setFormData(prev => ({ ...prev, heroBanners: updated }));
                               }} className="w-full bg-white p-5 rounded-2xl border border-slate-100 text-[11px] font-black text-text-silver font-mono" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-text-silver uppercase tracking-[0.5em] ml-2">BETA CTRL TXT</label>
                               <input value={banner.btn2Text || ''} onChange={(e) => {
                                  const updated = [...formData.heroBanners];
                                  updated[index].btn2Text = e.target.value;
                                  setFormData(prev => ({ ...prev, heroBanners: updated }));
                               }} className="w-full bg-white p-5 rounded-2xl border border-slate-100 text-[11px] font-black tracking-widest uppercase hover:border-unicorn-magenta transition-colors" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-text-silver uppercase tracking-[0.5em] ml-2">BETA CTRL LNK</label>
                               <input value={banner.btn2Link || ''} onChange={(e) => {
                                  const updated = [...formData.heroBanners];
                                  updated[index].btn2Link = e.target.value;
                                  setFormData(prev => ({ ...prev, heroBanners: updated }));
                               }} className="w-full bg-white p-5 rounded-2xl border border-slate-100 text-[11px] font-black text-text-silver font-mono" />
                            </div>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white/40 backdrop-blur-md rounded-[64px] border border-white/40 shadow-soft p-16 space-y-12 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-unicorn-magenta/5 rounded-full blur-[120px] pointer-events-none"></div>
                <h3 className="text-2xl font-black text-text-main uppercase italic tracking-tighter flex items-center gap-5 leading-none relative z-10">
                   <div className="w-12 h-12 bg-unicorn-magenta/10 rounded-2xl flex items-center justify-center text-unicorn-magenta shadow-inner">
                      <Sparkles size={24} />
                   </div> 
                   Flux Allocations
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-6 italic">Promotional Core Label</label>
                      <input name="schemesTitle" value={formData?.schemesTitle || ''} onChange={handleChange} className="w-full bg-white/60 p-7 rounded-[32px] font-black text-text-main border border-white focus:bg-white focus:shadow-unicorn focus:border-unicorn-magenta hover:border-unicorn-magenta/40 outline-none transition-all text-lg tracking-tighter uppercase italic" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-6 italic">Sector Description Data</label>
                      <input name="schemesSubtitle" value={formData?.schemesSubtitle || ''} onChange={handleChange} className="w-full bg-white/60 p-7 rounded-[32px] font-black text-text-main border border-white focus:bg-white focus:shadow-unicorn focus:border-unicorn-magenta hover:border-unicorn-magenta/40 outline-none transition-all text-xs tracking-widest uppercase" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'about' && (
          <div className="grid grid-cols-1 gap-12 animate-in slide-in-from-bottom-8 duration-700">
             <div className="bg-white/40 backdrop-blur-md rounded-[64px] border border-white/40 shadow-soft p-16 space-y-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-unicorn-indigo/5 rounded-full blur-[120px] pointer-events-none"></div>
                <h3 className="text-2xl font-black text-text-main uppercase italic tracking-tighter flex items-center gap-5 leading-none relative z-10">
                   <div className="w-12 h-12 bg-unicorn-indigo/10 rounded-2xl flex items-center justify-center text-unicorn-indigo shadow-inner">
                      <Info size={24} />
                   </div> 
                   Core Identity Protocol
                </h3>
                <div className="space-y-10 relative z-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.5em] ml-6">Universal Declaration Title</label>
                      <input name="aboutMissionTitle" value={formData?.aboutMissionTitle || ''} onChange={handleChange} className="w-full bg-white/60 p-7 rounded-[32px] font-black text-text-main border border-white focus:bg-white focus:shadow-unicorn outline-none transition-all text-lg tracking-tighter uppercase italic" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.5em] ml-6">Architectural Overview [Markdown Ready]</label>
                      <textarea rows="6" name="aboutMissionDesc" value={formData?.aboutMissionDesc || ''} onChange={handleChange} className="w-full bg-white/60 p-10 rounded-[48px] font-bold text-text-main border border-white focus:bg-white focus:shadow-unicorn outline-none transition-all resize-none text-base tracking-tight leading-relaxed"></textarea>
                   </div>
                </div>
             </div>

             <div className="bg-white/40 backdrop-blur-md rounded-[64px] border border-white/40 shadow-soft p-16 space-y-12 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-unicorn-cyan/5 rounded-full blur-[150px] pointer-events-none"></div>
                <h3 className="text-2xl font-black text-text-main uppercase italic tracking-tighter flex items-center gap-5 leading-none relative z-10">
                   <div className="w-12 h-12 bg-unicorn-cyan/10 rounded-2xl flex items-center justify-center text-unicorn-cyan shadow-inner">
                      <ShieldCheck size={24} />
                   </div> 
                   Value Multi-Nodes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="p-10 bg-white/50 backdrop-blur-sm rounded-[48px] border border-white space-y-8 hover:bg-white hover:shadow-premium transition-all duration-500 group">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.5em] ml-4 group-hover:text-unicorn-cyan transition-colors">NODE 0{i} LABEL</label>
                           <input name={`aboutValue${i}Title`} value={formData?.[`aboutValue${i}Title`] || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-[28px] font-black text-text-main border border-slate-100 text-base outline-none focus:bg-white focus:shadow-unicorn transition-all uppercase tracking-tighter italic" />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.5em] ml-4">NODE 0{i} ENCODING</label>
                           <textarea rows="3" name={`aboutValue${i}Desc`} value={formData?.[`aboutValue${i}Desc`] || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-[28px] font-bold text-text-main border border-slate-100 text-sm outline-none resize-none focus:bg-white focus:shadow-unicorn transition-all tracking-tight" ></textarea>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'contact' && (
          <div className="grid grid-cols-1 gap-12 animate-in slide-in-from-bottom-8 duration-700">
             <div className="bg-white/40 backdrop-blur-md rounded-[64px] border border-white/40 shadow-soft p-16 space-y-16 relative overflow-hidden font-sans">
                <div className="absolute top-0 right-0 w-80 h-80 bg-unicorn-magenta/5 rounded-full blur-[100px] pointer-events-none"></div>
                <h3 className="text-2xl font-black text-text-main uppercase italic tracking-tighter flex items-center gap-5 leading-none relative z-10">
                   <div className="w-12 h-12 bg-unicorn-magenta/10 rounded-2xl flex items-center justify-center text-unicorn-magenta shadow-inner">
                      <PhoneCall size={24} />
                   </div> 
                   Gateway Protocols
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 relative z-10">
                   <div className="space-y-6">
                      <div className="flex items-center gap-5 text-text-silver mb-2 ml-4">
                        <Phone size={24} className="text-unicorn-cyan" />
                        <span className="text-[11px] font-black uppercase tracking-[0.5em]">Primary Comms Link</span>
                      </div>
                      <input name="contactPhone" value={formData?.contactPhone || ''} onChange={handleChange} className="w-full bg-white/60 p-8 rounded-[32px] font-black text-3xl text-text-main border border-white outline-none focus:bg-white focus:shadow-unicorn transition-all tracking-tighter italic" placeholder="+91 XXXX XXXX" />
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center gap-5 text-text-silver mb-2 ml-4">
                        <Mail size={24} className="text-unicorn-purple" />
                        <span className="text-[11px] font-black uppercase tracking-[0.5em]">Master Support Node</span>
                      </div>
                      <input name="contactEmail" value={formData?.contactEmail || ''} onChange={handleChange} className="w-full bg-white/60 p-8 rounded-[32px] font-black text-2xl text-text-main border border-white outline-none focus:bg-white focus:shadow-unicorn transition-all tracking-tighter" placeholder="office@domain.com" />
                   </div>
                   <div className="space-y-6 col-span-full">
                      <div className="flex items-center gap-5 text-text-silver mb-2 ml-4">
                        <MapPin size={24} className="text-unicorn-magenta" />
                        <span className="text-[11px] font-black uppercase tracking-[0.5em]">Global Physical Locus</span>
                      </div>
                      <textarea rows="3" name="contactAddress" value={formData?.contactAddress || ''} onChange={handleChange} className="w-full bg-white/60 p-10 rounded-[48px] font-black text-xl text-text-main border border-white outline-none resize-none focus:bg-white focus:shadow-unicorn transition-all tracking-tight leading-relaxed uppercase italic"></textarea>
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center gap-5 text-text-silver mb-2 ml-4">
                        <Zap size={24} className="text-secondary-500" />
                        <span className="text-[11px] font-black uppercase tracking-[0.5em]">Uptime Window</span>
                      </div>
                      <input name="contactHours" value={formData?.contactHours || ''} onChange={handleChange} className="w-full bg-white/60 p-8 rounded-[32px] font-black text-lg text-text-main border border-white outline-none focus:bg-white focus:shadow-unicorn transition-all uppercase tracking-widest" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="grid grid-cols-1 gap-12 animate-in slide-in-from-bottom-8 duration-700">
             <div className="bg-white/40 backdrop-blur-md rounded-[64px] border border-white/40 shadow-soft p-16 space-y-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-unicorn-cyan/5 via-unicorn-purple/5 to-unicorn-magenta/5 opacity-40"></div>
                <h3 className="text-2xl font-black text-text-main uppercase italic tracking-tighter flex items-center gap-5 leading-none relative z-10">
                   <div className="w-12 h-12 bg-text-main rounded-2xl flex items-center justify-center text-white shadow-premium">
                      <ShieldCheck size={24} />
                   </div> 
                   Core Site Manifest
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 relative z-10">
                   <div className="space-y-6">
                      <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.5em] flex items-center gap-4 ml-6"><Globe size={18} className="text-unicorn-cyan" /> Principal Emblem URI</label>
                      <input name="siteLogoUrl" value={formData?.siteLogoUrl || ''} onChange={handleChange} className="w-full bg-white/60 p-8 rounded-[32px] font-black border border-white outline-none focus:bg-white focus:shadow-unicorn transition-all text-text-main text-xs uppercase" />
                   </div>
                   <div className="space-y-6">
                      <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.5em] flex items-center gap-4 ml-6"><Instagram size={18} className="text-unicorn-magenta" /> Instagram Portal Link</label>
                      <input name="instagramLink" value={formData?.instagramLink || ''} onChange={handleChange} className="w-full bg-white/60 p-8 rounded-[32px] font-black border border-white outline-none focus:bg-white focus:shadow-unicorn transition-all text-text-main text-xs" />
                   </div>
                   <div className="space-y-6">
                      <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.5em] flex items-center gap-4 ml-6"><PhoneCall size={18} className="text-unicorn-purple" /> Primary Encrypted Channel [WA]</label>
                      <input name="whatsappLink" value={formData?.whatsappLink || ''} onChange={handleChange} className="w-full bg-white/60 p-8 rounded-[32px] font-black border border-white outline-none focus:bg-white focus:shadow-unicorn transition-all text-xl text-text-main tracking-widest" placeholder="91XXXXXXXXXX" />
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalCMSHub;

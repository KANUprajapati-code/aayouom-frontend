import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Layout, ShieldCheck, Zap, Mail, Phone, MapPin, Globe, Instagram, PhoneCall } from 'lucide-react';

const GlobalCMSHub = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('home');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get('https://ayuom-backend.vercel.app/api/content/homepage');
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://ayuom-backend.vercel.app/api/content/homepage', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Global CMS updated successfully!');
    } catch (error) {
      console.error('Failed to save content', error);
      alert('Error updating content.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;

    // We must compress the image heavily to avoid Vercel's strict 4.5MB Serverless Payload Limits!
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        // Compress using Canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Export heavily compressed webp (size will be < 500KB)
        const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
        
        try {
          const token = localStorage.getItem('token');
          const { data } = await axios.post('https://ayuom-backend.vercel.app/api/upload', 
            { base64: compressedBase64 }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          const updated = [...formData.heroBanners];
          updated[index].imageUrl = data.url;
          setFormData(prev => ({ ...prev, heroBanners: updated }));
        } catch (error) {
           console.error("Error uploading image:", error);
           alert(error.response?.data?.message || "Failed to upload image. Vercel connection error.");
        }
      };
    };
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-center space-y-6">
         <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
         <p className="font-black text-slate-300 uppercase tracking-widest text-xs">Synchronizing Global Master Hub...</p>
      </div>
    );
  }

  const subTabs = [
    { id: 'home', label: 'Home Page', icon: Layout },
    { id: 'about', label: 'About Us', icon: Globe },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'settings', label: 'Global Settings', icon: ShieldCheck }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-10">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Global CMS Hub</h2>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Command Center for site-wide content and aesthetics</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-black text-white font-black px-12 py-5 rounded-[28px] text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all active:scale-95">
          {saving ? 'Synchronizing...' : <><Save className="w-5 h-5" /> Commit Changes</>}
        </button>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-4 p-2 bg-white rounded-3xl border border-slate-100 shadow-sm w-fit">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSubTab === tab.id ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {activeSubTab === 'home' && (
          <div className="grid grid-cols-1 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* HERO SLIDER SECTION */}
             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-primary-600 uppercase tracking-widest flex items-center gap-3 leading-none"><div className="w-1.5 h-4 bg-primary-600 rounded-full"></div> Hero Slider Management</h3>
                  <button 
                    onClick={() => {
                      const newBanner = {
                        imageUrl: "",
                        badge: "Verified B2B Medical Hub",
                        title1: "Premium Medicine",
                        title2: "Sourcing for Doctors",
                        description: "Accelerate your clinic's supply chain...",
                        btn1Text: "Start Ordering",
                        btn1Link: "/products",
                        btn2Text: "Quick Order",
                        btn2Link: "/quick-order"
                      };
                      setFormData(prev => ({
                        ...prev,
                        heroBanners: [...(prev.heroBanners || []), newBanner]
                      }));
                    }} 
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                  >
                    Add New Slide
                  </button>
                </div>
                
                <div className="space-y-8">
                  {(formData?.heroBanners || []).map((banner, index) => (
                    <div key={index} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 relative group">
                      <button 
                        onClick={() => {
                          const updated = formData.heroBanners.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, heroBanners: updated }));
                        }} 
                        className="absolute top-4 right-4 p-2 bg-white text-rose-500 rounded-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50"
                      >
                         Delete Slide
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2 col-span-full">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Promotional Image URL</label>
                           <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                              <input 
                                 value={banner.imageUrl || ''} 
                                 onChange={(e) => {
                                    const updated = [...formData.heroBanners];
                                    updated[index].imageUrl = e.target.value;
                                    setFormData(prev => ({ ...prev, heroBanners: updated }));
                                 }}
                                 className="flex-grow bg-white p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 outline-none focus:border-primary-500 transition-all" 
                                 placeholder="https://... OR Upload File ->"
                              />
                              <label className="cursor-pointer px-6 py-4 bg-primary-50 text-primary-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-100 transition-all flex items-center justify-center shrink-0 border border-primary-100">
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { e.target.files[0] && handleImageUpload(index, e.target.files[0]) }} />
                                Select File
                              </label>

                              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 hidden sm:flex">
                                 {banner.imageUrl ? <img loading="lazy" src={banner.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <Layout className="text-slate-200" />}
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Badge Text</label>
                           <input 
                              value={banner.badge || ''} 
                              onChange={(e) => {
                                 const updated = [...formData.heroBanners];
                                 updated[index].badge = e.target.value;
                                 setFormData(prev => ({ ...prev, heroBanners: updated }));
                              }}
                              className="w-full bg-white p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 outline-none focus:border-primary-500 transition-all" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title Line 1</label>
                           <input 
                              value={banner.title1 || ''} 
                              onChange={(e) => {
                                 const updated = [...formData.heroBanners];
                                 updated[index].title1 = e.target.value;
                                 setFormData(prev => ({ ...prev, heroBanners: updated }));
                              }}
                              className="w-full bg-white p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 outline-none focus:border-primary-500 transition-all" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title Line 2 (Accent)</label>
                           <input 
                              value={banner.title2 || ''} 
                              onChange={(e) => {
                                 const updated = [...formData.heroBanners];
                                 updated[index].title2 = e.target.value;
                                 setFormData(prev => ({ ...prev, heroBanners: updated }));
                              }}
                              className="w-full bg-white p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 outline-none focus:border-primary-500 transition-all" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slide Description</label>
                           <textarea 
                              rows="2"
                              value={banner.description || ''} 
                              onChange={(e) => {
                                 const updated = [...formData.heroBanners];
                                 updated[index].description = e.target.value;
                                 setFormData(prev => ({ ...prev, heroBanners: updated }));
                              }}
                              className="w-full bg-white p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 outline-none focus:border-primary-500 transition-all resize-none" 
                           ></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4 col-span-full pt-4 border-t border-slate-100">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Button 1 Text</label>
                              <input value={banner.btn1Text || ''} onChange={(e) => {
                                 const updated = [...formData.heroBanners];
                                 updated[index].btn1Text = e.target.value;
                                 setFormData(prev => ({ ...prev, heroBanners: updated }));
                              }} className="w-full bg-white p-3 rounded-xl border border-slate-100 text-xs font-bold" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Button 1 Link</label>
                              <input value={banner.btn1Link || ''} onChange={(e) => {
                                 const updated = [...formData.heroBanners];
                                 updated[index].btn1Link = e.target.value;
                                 setFormData(prev => ({ ...prev, heroBanners: updated }));
                              }} className="w-full bg-white p-3 rounded-xl border border-slate-100 text-xs font-bold" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Button 2 Text</label>
                              <input value={banner.btn2Text || ''} onChange={(e) => {
                                 const updated = [...formData.heroBanners];
                                 updated[index].btn2Text = e.target.value;
                                 setFormData(prev => ({ ...prev, heroBanners: updated }));
                              }} className="w-full bg-white p-3 rounded-xl border border-slate-100 text-xs font-bold" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Button 2 Link</label>
                              <input value={banner.btn2Link || ''} onChange={(e) => {
                                 const updated = [...formData.heroBanners];
                                 updated[index].btn2Link = e.target.value;
                                 setFormData(prev => ({ ...prev, heroBanners: updated }));
                              }} className="w-full bg-white p-3 rounded-xl border border-slate-100 text-xs font-bold" />
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
                <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-emerald-600 rounded-full"></div> Promotions & Sections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schemes Block Title</label>
                      <input name="schemesTitle" value={formData?.schemesTitle || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schemes Block Subtitle</label>
                      <input name="schemesSubtitle" value={formData?.schemesSubtitle || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'about' && (
          <div className="grid grid-cols-1 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
                <h3 className="text-sm font-black text-primary-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-primary-600 rounded-full"></div> Our Mission</h3>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Statement Title</label>
                      <input name="aboutMissionTitle" value={formData?.aboutMissionTitle || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Long-form Description</label>
                      <textarea rows="4" name="aboutMissionDesc" value={formData?.aboutMissionDesc || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white outline-none transition-all resize-none"></textarea>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
                <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-blue-600 rounded-full"></div> Core Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Value {i} Title</label>
                           <input name={`aboutValue${i}Title`} value={formData?.[`aboutValue${i}Title`] || ''} onChange={handleChange} className="w-full bg-white p-4 rounded-xl font-black text-slate-800 border border-slate-200 text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Value {i} Brief</label>
                           <textarea rows="2" name={`aboutValue${i}Desc`} value={formData?.[`aboutValue${i}Desc`] || ''} onChange={handleChange} className="w-full bg-white p-4 rounded-xl font-bold text-slate-600 border border-slate-200 text-xs outline-none resize-none"></textarea>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'contact' && (
          <div className="grid grid-cols-1 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-10">
                <h3 className="text-sm font-black text-primary-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-primary-600 rounded-full"></div> Communication Nodes</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 mb-2">
                        <Phone size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Primary Contact Terminal</span>
                      </div>
                      <input name="contactPhone" value={formData?.contactPhone || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-2xl font-black text-xl text-slate-900 border border-slate-100 outline-none" placeholder="+91 XXXX XXXX" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 mb-2">
                        <Mail size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Master Support Email</span>
                      </div>
                      <input name="contactEmail" value={formData?.contactEmail || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-2xl font-black text-xl text-slate-900 border border-slate-100 outline-none" placeholder="office@domain.com" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 mb-2">
                        <MapPin size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Physical Headquaters</span>
                      </div>
                      <textarea rows="2" name="contactAddress" value={formData?.contactAddress || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none resize-none"></textarea>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 mb-2">
                        <PhoneCall size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Operational Hours</span>
                      </div>
                      <input name="contactHours" value={formData?.contactHours || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="grid grid-cols-1 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-10">
                <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-rose-600 rounded-full"></div> Global Identity & Socials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14} /> Brand Logo URI</label>
                      <input name="siteLogoUrl" value={formData?.siteLogoUrl || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border border-slate-100 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Instagram size={14} /> Instagram Profile Link</label>
                      <input name="instagramLink" value={formData?.instagramLink || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border border-slate-100 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><PhoneCall size={14} /> Primary WhatsApp Number</label>
                      <input name="whatsappLink" value={formData?.whatsappLink || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border border-slate-100 outline-none" placeholder="e.g. 919999988888" />
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

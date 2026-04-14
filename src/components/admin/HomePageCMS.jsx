import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Layout, ShieldCheck, Zap, Plus, Trash2, Image as ImageIcon, ArrowRight, ArrowLeft } from 'lucide-react';

const HomePageCMS = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get('https://ayuom-backend.vercel.app/api/content/homepage');
      // Initialize heroBanners if empty
      if (!data.heroBanners || data.heroBanners.length === 0) {
        data.heroBanners = [{
          imageUrl: "",
          linkUrl: "/products"
        }];
      }
      setFormData(data || {});
    } catch (error) {
      console.error('Failed to fetch home page content', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (index, field, value) => {
    const updatedBanners = [...formData.heroBanners];
    updatedBanners[index] = { ...updatedBanners[index], [field]: value };
    setFormData((prev) => ({ ...prev, heroBanners: updatedBanners }));
  };

  const addBanner = () => {
    const newBanner = {
      imageUrl: "",
      linkUrl: ""
    };
    setFormData((prev) => ({ ...prev, heroBanners: [...prev.heroBanners, newBanner] }));
  };

  const removeBanner = (index) => {
    if (formData.heroBanners.length <= 1) {
      alert("At least one banner is required.");
      return;
    }
    const updatedBanners = formData.heroBanners.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, heroBanners: updatedBanners }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://ayuom-backend.vercel.app/api/content/homepage', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Home page content updated successfully!');
    } catch (error) {
      console.error('Failed to save home page content', error);
      alert('Error updating content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400 font-bold uppercase tracking-widest text-sm flex items-center gap-4"><div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div> Loading CMS...</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Home Overhaul CMS</h2>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Manage Slider Banners, Info Cards, and Landing Content</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-black text-white font-black px-10 py-5 rounded-3xl text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/30 flex items-center gap-3 active:scale-95 transition-all outline-none">
          {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Commit to Database</>}
        </button>
      </div>

      <div className="space-y-12">
        {/* HERO SLIDER SECTION */}
        <div className="bg-white rounded-[40px] border border-surface-border shadow-soft p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-primary-600 uppercase tracking-widest flex items-center gap-3"><Layout size={20} /> Hero Slider Management</h3>
            <button onClick={addBanner} className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
              <Plus size={16} /> Add New Slide
            </button>
          </div>
          
          <div className="space-y-10">
            {formData.heroBanners.map((banner, index) => (
              <div key={index} className="p-8 bg-surface-light rounded-[32px] border border-surface-border relative group">
                <button onClick={() => removeBanner(index)} className="absolute top-4 right-4 p-3 bg-white text-rose-500 rounded-xl border border-surface-border opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 shadow-sm">
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center gap-2 mb-6 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[8px]">{index + 1}</span> 
                  Slide Content
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  {/* Image URL with Preview */}
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Promotional Image URL</label>
                    <div className="flex gap-4">
                       <input value={banner.imageUrl} onChange={(e) => handleBannerChange(index, 'imageUrl', e.target.value)} placeholder="https://..." className="flex-grow bg-white p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-primary-500 text-sm" />
                       <div className="w-14 h-14 rounded-2xl bg-white border border-surface-border flex items-center justify-center overflow-hidden shrink-0">
                          {banner.imageUrl ? <img loading="lazy" src={banner.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-200" />}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">On-Click Redirect URL (Optional)</label>
                    <input value={banner.linkUrl} onChange={(e) => handleBannerChange(index, 'linkUrl', e.target.value)} placeholder="/products?category=cardiac" className="w-full bg-white p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-primary-500 text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Existing Sections for Titles/Subtitle */}
        <div className="bg-white rounded-[40px] border border-surface-border shadow-soft p-10">
          <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-3"><ImageIcon size={20} /> Other Page Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Schemes */}
             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-surface-border pb-2">Schemes Titles</p>
                <input name="schemesTitle" value={formData?.schemesTitle || ''} onChange={handleChange} placeholder="Schemes Title" className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border text-sm" />
                <textarea rows="2" name="schemesSubtitle" value={formData?.schemesSubtitle || ''} onChange={handleChange} placeholder="Schemes Subtitle" className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-600 border border-surface-border text-sm resize-none"></textarea>
             </div>
             {/* Categories */}
             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-surface-border pb-2">Category Titles</p>
                <input name="categoryTitle" value={formData?.categoryTitle || ''} onChange={handleChange} placeholder="Category Title" className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border text-sm" />
                <textarea rows="2" name="categorySubtitle" value={formData?.categorySubtitle || ''} onChange={handleChange} placeholder="Category Subtitle" className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-600 border border-surface-border text-sm resize-none"></textarea>
             </div>
          </div>
        </div>

        {/* Trust settings */}
        <div className="bg-white rounded-[40px] border border-surface-border shadow-soft p-10">
          <h3 className="text-xl font-black text-blue-600 mb-6 uppercase tracking-widest flex items-center gap-3"><ShieldCheck size={20} /> Trust Section Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Trust Title (HTML supported)</label>
                <input name="trustTitle" value={formData?.trustTitle || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-blue-500 text-sm" />
             </div>
             
             {[1, 2, 3].map(i => (
               <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Trust Point {i}</p>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Image/Icon URL</label>
                  <input name={`trustItem${i}Img`} value={formData?.[`trustItem${i}Img`] || ''} onChange={handleChange} placeholder="Image URL" className="w-full bg-white p-3 rounded-xl font-bold text-slate-900 border border-slate-200 text-xs mb-2" />
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Title</label>
                  <input name={`trustItem${i}Title`} value={formData?.[`trustItem${i}Title`] || ''} onChange={handleChange} placeholder="Point Title" className="w-full bg-white p-3 rounded-xl font-bold text-slate-900 border border-slate-200 text-xs" />
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                  <textarea rows="2" name={`trustItem${i}Desc`} value={formData?.[`trustItem${i}Desc`] || ''} onChange={handleChange} placeholder="Point Description" className="w-full bg-white p-3 rounded-xl font-bold text-slate-600 border border-slate-200 text-xs resize-none"></textarea>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageCMS;

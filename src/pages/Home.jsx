import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  TrendingDown, 
  Search, 
  ChevronRight,
  ArrowRight,
  Plus,
  Briefcase
} from 'lucide-react';
import MedicineCard from '../components/common/MedicineCard';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();
  const [homeProducts, setHomeProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cms, setCms] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, cmsRes, catRes] = await Promise.all([
          axios.get('https://ayuom-backend.vercel.app/api/products?placement=home'),
          axios.get('https://ayuom-backend.vercel.app/api/content/homepage').catch(() => ({ data: {} })),
          axios.get('https://ayuom-backend.vercel.app/api/categories').catch(() => ({ data: [] }))
        ]);
        setHomeProducts(prodRes.data);
        setCms(cmsRes.data || {});
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Create highlights based on actual categories from DB
  const categoryHighlights = categories.map(cat => {
    // Find a product from this category that is marked for home display
    const featuredProduct = homeProducts.find(p => p.category === cat.name);
    return {
      category: cat.name,
      product: featuredProduct // might be undefined if no home product in this category
    };
  }).filter(h => h.product); // only show categories that have at least one featured product

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white rounded-[40px] border border-surface-border p-8 lg:p-20 shadow-soft">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary-50 rounded-full blur-[100px] opacity-60 -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-secondary-50 rounded-full blur-[80px] opacity-60 -z-10"></div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 border border-primary-100 shadow-sm">
              <ShieldCheck size={18} className="text-primary-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{cms.heroBadge || "Verified B2B Medical Hub"}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
              {cms.heroTitleLine1 || "Premium Medicine"} <br />
              <span className="text-primary-600">{cms.heroTitleLine2 || "Sourcing for Doctors"}</span>
            </h1>
            
            <p className="text-xl text-text-muted max-w-lg leading-relaxed">
              {cms.heroDescription || "Accelerate your clinic's supply chain with direct access to top-tier pharmaceuticals, transparent volume schemes, and lightning-fast logistics."}
            </p>
            
            <div className="flex flex-wrap gap-5 pt-4">
              <Link to={cms.primaryButtonLink || "/products"} className="btn-primary h-14 px-10 text-lg shadow-premium">
                {cms.primaryButtonText || "Start Ordering"}
                <ArrowRight size={22} />
              </Link>
              <Link to={cms.secondaryButtonLink || "/quick-order"} className="btn-outline h-14 px-10 text-lg">
                {cms.secondaryButtonText || "Quick Order Mode"}
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-6 relative">
             <div className="space-y-6 pt-16">
                <div className="card !p-6 bg-white shadow-premium border-primary-50 transform -rotate-2 hover:rotate-0 transition-all duration-500 scale-105">
                   <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
                      <TrendingDown size={24} />
                   </div>
                   <p className="text-sm font-black text-slate-900">Professional Savings</p>
                   <p className="text-xs text-text-muted mt-1">Save up to 25% on bulk cardiac orders.</p>
                </div>
                <div className="card !p-6 bg-white shadow-premium border-secondary-50 transform rotate-1 hover:rotate-0 transition-all duration-500">
                   <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
                      <Zap size={24} strokeWidth={2.5} />
                   </div>
                   <p className="text-sm font-black text-slate-900">Instant Schemes</p>
                   <p className="text-xs text-text-muted mt-1">10+2 and 15% OFF applied in real-time.</p>
                </div>
             </div>
             <div className="space-y-6">
                <div className="bg-primary-600 p-8 rounded-3xl shadow-premium text-white transform -rotate-1 hover:rotate-0 transition-all duration-500 min-h-[220px] flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">New Arrival</div>
                      <Plus size={20} className="text-white/40" />
                   </div>
                   <p className="text-2xl font-black mb-2">Amox-Clav 625</p>
                   <p className="text-sm opacity-80 mb-6">Restocked for clinical high-demand.</p>
                   <button className="mt-auto w-full py-3 bg-white text-primary-600 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-primary-50 transition-all">
                      Check Stock <ChevronRight size={16} />
                   </button>
                </div>
                <div className="card !p-6 bg-slate-900 text-white border-none shadow-premium transform rotate-2 hover:rotate-0 transition-all duration-500">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-2">Live Status</p>
                   <p className="text-sm font-bold">14 Doctors active</p>
                   <div className="flex -space-x-2 mt-3 block">
                      {[1,2,3,4].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-300">D{i}</div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-primary-600 flex items-center justify-center text-[10px] font-black text-white">+8</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes Slider/Grid */}
      <section className="space-y-8">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{cms.schemesTitle || "Top Schemes Today"}</h2>
            <p className="text-text-muted mt-2 text-lg">{cms.schemesSubtitle || "Specially curated high-margin offers for your practice."}</p>
          </div>
          <Link to="/products" className="text-primary-600 font-black flex items-center gap-2 hover:gap-3 transition-all">
            Browse All Schemes <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {homeProducts.length === 0 && <p className="text-slate-400">Loading home products...</p>}
          {homeProducts.map((p, i) => (
            <MedicineCard key={p._id} medicine={p} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Category Highlights: One from each category */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900">{cms.categoryTitle || "Explore by Category"}</h2>
          <p className="text-text-muted text-lg">{cms.categorySubtitle || "We stock over 5000+ medicines across all major therapeutic segments."}</p>
        </div>

        <div className="space-y-16">
          {categoryHighlights.map((highlight, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
               <div className="lg:w-1/2 space-y-6">
                 <div className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-black uppercase tracking-widest border border-primary-100">
                    {highlight.category}
                 </div>
                 <h3 className="text-4xl font-black text-slate-900 leading-tight">
                    Top Trending in <br />
                    <span className="text-primary-600">{highlight.category}</span>
                 </h3>
                 <p className="text-lg text-text-muted leading-relaxed">
                    {(cms.categoryDescriptionTemplate || "Our {category} segment features verified products with consistent multi-strip schemes and reliable supply chains for clinics.").replace('{category}', highlight.category)}
                 </p>
                 <div className="pt-4">
                    <Link to={`/products?category=${highlight.category}`} className="btn-outline px-8 py-3.5 flex w-fit">
                       View All {highlight.category}
                       <ChevronRight size={20} />
                    </Link>
                 </div>
               </div>
               
               <div className="lg:w-1/2 w-full max-w-md">
                  <div className="relative group">
                     <div className="absolute inset-0 bg-primary-600 rounded-[40px] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                     <div className="relative transform group-hover:scale-[1.02] transition-transform duration-500">
                        <MedicineCard medicine={highlight.product} onAddToCart={addToCart} />
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Quality Section */}
      <section className="bg-slate-900 rounded-[48px] p-12 lg:p-24 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500 opacity-5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black leading-tight tracking-tight" dangerouslySetInnerHTML={{__html: cms.trustTitle || "The Trusted Hub for <br />Healthcare Procurement"}}></h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {cms.trustSubtitle || "We provide a secure, professional-grade platform for hospitals and independent clinics to source authentic pharmaceuticals at scale."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400 mx-auto border border-white/10 backdrop-blur-md">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-black">{cms.trustItem1Title || "Quality Assured"}</h4>
              <p className="text-slate-500 text-sm">{cms.trustItem1Desc || "Every batch verified for authenticity and storage standards."}</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400 mx-auto border border-white/10 backdrop-blur-md">
                <Zap size={32} />
              </div>
              <h4 className="text-xl font-black">{cms.trustItem2Title || "Express Delivery"}</h4>
              <p className="text-slate-500 text-sm">{cms.trustItem2Desc || "Priority shipping for clinics within 24-48 hours nationwide."}</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400 mx-auto border border-white/10 backdrop-blur-md">
                <Briefcase size={32} />
              </div>
              <h4 className="text-xl font-black">{cms.trustItem3Title || "B2B Compliance"}</h4>
              <p className="text-slate-500 text-sm">{cms.trustItem3Desc || "Optimized for VAT/GST invoices and professional record-keeping."}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

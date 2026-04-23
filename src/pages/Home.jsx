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
  Briefcase,
  Image as ImageIcon,
  Building2,
  Filter
} from 'lucide-react';
import MedicineCard from '../components/common/MedicineCard';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { addToCart } = useCart();
  const [homeProducts, setHomeProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [cms, setCms] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, cmsRes, catRes, brandsRes] = await Promise.all([
          axios.get(`https://ayuom-backend.vercel.app/api/products?placement=home${selectedBrand ? `&brand=${selectedBrand}` : ''}`),
          axios.get('https://ayuom-backend.vercel.app/api/content/homepage').catch(() => ({ data: {} })),
          axios.get('https://ayuom-backend.vercel.app/api/categories').catch(() => ({ data: [] })),
          axios.get('https://ayuom-backend.vercel.app/api/brands').catch(() => ({ data: [] }))
        ]);
        setHomeProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        setCms(cmsRes.data || {});
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setBrands(Array.isArray(brandsRes.data) ? brandsRes.data : []);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedBrand]);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider
  useEffect(() => {
    if (cms?.heroBanners?.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % cms.heroBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [cms?.heroBanners]);

  const activeBanners = cms?.heroBanners?.length > 0
    ? cms.heroBanners
    : [{
      imageUrl: "https://via.placeholder.com/1600x500?text=Upload+Promotional+Banner+From+Admin",
      linkUrl: "/products",
      title1: "Premium Healthcare Matrix",
      title2: "Institutional Scale Supply",
      description: "Direct procurement platform for registered medical practitioners."
    }];

  if (loading && homeProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Hub Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-28 pb-20 lg:pb-32 font-sans overflow-x-hidden">
      {/* 1. Hero Slider Section */}
      <section className="relative overflow-hidden bg-slate-900 lg:rounded-[48px] h-[55vh] md:h-[65vh] lg:h-[75vh] w-full group shadow-2xl">
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute inset-0 z-0">
                {activeBanners[currentSlide].imageUrl ? (
                  <img src={activeBanners[currentSlide].imageUrl} alt="" className="w-full h-full object-cover opacity-40" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <ImageIcon size={64} className="text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 max-w-4xl space-y-6 md:space-y-8">
                {activeBanners[currentSlide].badge && (
                   <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-blue-400 font-black tracking-[0.3em] uppercase text-[10px] bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-400/20 w-fit">{activeBanners[currentSlide].badge}</motion.span>
                )}
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[20px] font-black text-white italic leading-[1.05] tracking-tighter">
                  {activeBanners[currentSlide].title1} <br />
                  <span className="text-blue-500">{activeBanners[currentSlide].title2}</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[20px] text-slate-300 font-medium max-w-xl leading-relaxed">
                  {activeBanners[currentSlide].description}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Link to={activeBanners[currentSlide].btn1Link || "/products"} className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[20px] tracking-[0.2em] shadow-2xl shadow-blue-600/30 transition-all active:scale-95">
                    {activeBanners[currentSlide].btn1Text || 'Enter Marketplace'} <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Navigation */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-10 inset-x-0 flex justify-center gap-3 z-20">
              {activeBanners.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-blue-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}></button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Top Schemes Product Grid */}
      <section className="space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
          <div className="space-y-3">
             <div className="w-12 h-1.5 bg-blue-600 rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-950 italic tracking-tighter">PREMIUM SCHEMES</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Direct institutional supply for verified partners</p>
          </div>
          <Link to="/products" className="px-8 py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all">Full Catalog &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {homeProducts.map((p) => (
            <MedicineCard key={p._id} medicine={p} onAddToCart={addToCart} />
          ))}
          {homeProducts.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 uppercase font-bold tracking-widest text-xs border-2 border-dashed border-slate-100 rounded-[40px]">No products match the active filter pipeline.</div>}
        </div>
      </section>

      {/* 3. Therapeutic Matrix (Category Explorer) */}
      <section className="space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
          <div className="space-y-3">
             <div className="w-12 h-1.5 bg-emerald-500 rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-950 italic tracking-tighter uppercase">Clinical Segments</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Browse our specialized therapeutic matrix for hospital-grade supplies</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <Link 
               key={cat._id || index}
               to={`/products?category=${cat.name}`}
               className="relative aspect-[3/4] group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft transition-all duration-500 hover:shadow-2xl hover:shadow-blue-600/10 hover:border-blue-600/30"
            >
               <div className="absolute inset-0 z-0">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                       <Zap size={64} />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent"></div>
               </div>
               <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">{cat.name === 'Medicines' ? 'Critical Care' : 'Specialized'}</span>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{cat.name}</h3>
                  <div className="h-1 w-8 bg-blue-600 mt-4 group-hover:w-full transition-all duration-500 rounded-full"></div>
               </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Brand Category Shortner (Moved BELOW Categories) */}
      <section className="space-y-12 py-20 bg-slate-50 rounded-[64px] px-8 sm:px-12 border border-slate-100 shadow-sm mx-4 sm:mx-8">
         <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">
               <Building2 size={16} /> Partner Ecosystem
            </div>
            <h2 className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase">Marketplace Key Nodes (Brands)</h2>
            <p className="text-slate-500 text-sm font-semibold max-w-2xl leading-relaxed">Direct institutional supply from the world's leading pharmaceutical brands. Click a brand node to view their dedicated medicine matrix.</p>
         </div>

         <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            <button 
               onClick={() => setSelectedBrand(null)}
               className={`group flex flex-col items-center gap-5 transition-all ${!selectedBrand ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
            >
               <div className={`w-24 h-24 rounded-[32px] border-2 flex items-center justify-center transition-all duration-500 ${!selectedBrand ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-400'}`}>
                  <Filter size={28} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Entire Fleet</span>
            </button>

            {brands.map((brand) => (
               <button 
                  key={brand._id}
                  onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)}
                  className={`group flex flex-col items-center gap-5 transition-all ${selectedBrand === brand.name ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
               >
                  <div className={`w-24 h-24 rounded-[32px] border-2 flex items-center justify-center transition-all duration-500 overflow-hidden ${selectedBrand === brand.name ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'bg-white border-slate-200 text-slate-900'}`}>
                     {brand.logoUrl ? (
                         <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                         <span className="text-2xl font-black italic uppercase tracking-tighter">{brand.name.charAt(0)}</span>
                     )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selectedBrand === brand.name ? 'text-blue-600 font-black italic' : 'text-slate-400'}`}>{brand.name}</span>
               </button>
            ))}
         </div>
      </section>

      {/* 5. Trust & Information Section */}
      <section className="bg-slate-950 lg:rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden mx-4 sm:mx-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-7xl font-black text-white italic tracking-tighter leading-[1.1] uppercase" dangerouslySetInnerHTML={{ __html: cms.trustTitle || "Trusted Infrastructure for <br /> Medical Procurement" }}></h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed italic">
              {cms.trustSubtitle || "Providing a secure, high-focus platform for hospitals and independent clinics to source authentic pharmaceuticals at institutional scale."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4 flex flex-col items-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 backdrop-blur-md overflow-hidden group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
                   {cms?.[`trustItem${i}Img`] ? <img src={cms[`trustItem${i}Img`]} alt="" className="w-full h-full object-cover" /> : <ShieldCheck size={32} />}
                </div>
                <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{cms[`trustItem${i}Title`] || "Service Node"}</h4>
                <p className="text-slate-500 text-sm font-semibold leading-relaxed">{cms[`trustItem${i}Desc`] || "Optimized logistics and authenticated supply chain protocols."}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

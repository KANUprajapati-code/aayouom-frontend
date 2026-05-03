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
  const [homeProducts, setHomeProducts] = useState(() => {
    const cached = localStorage.getItem('home_products_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [categories, setCategories] = useState(() => {
    const cached = localStorage.getItem('home_categories_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [brands, setBrands] = useState(() => {
    const cached = localStorage.getItem('home_brands_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [cms, setCms] = useState(() => {
    const cached = localStorage.getItem('home_cms_cache');
    return cached ? JSON.parse(cached) : {};
  });
  const [loading, setLoading] = useState(homeProducts.length === 0);

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

        // Cache the data if no brand is selected
        if (!selectedBrand) {
           localStorage.setItem('home_products_cache', JSON.stringify(Array.isArray(prodRes.data) ? prodRes.data : []));
           localStorage.setItem('home_cms_cache', JSON.stringify(cmsRes.data || {}));
           localStorage.setItem('home_categories_cache', JSON.stringify(Array.isArray(catRes.data) ? catRes.data : []));
           localStorage.setItem('home_brands_cache', JSON.stringify(Array.isArray(brandsRes.data) ? brandsRes.data : []));
        }
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
      title1: "Ayuone Premium Healthcare",
      title2: "Bulk Medical Procurement",
      description: "A professional procurement platform for registered medical practitioners and clinics."
    }];

  if (loading && homeProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 animate-pulse">Loading Ayuone Marketplace...</p>
      </div>
    );
  }

  // Ensure default categories
  const displayCategories = [...categories];
  ['Ayurvedic', 'Allopathy'].forEach(cat => {
    if (!displayCategories.find(c => c.name.toLowerCase() === cat.toLowerCase())) {
      displayCategories.unshift({ _id: cat, name: cat, imageUrl: '' });
    }
  });

  return (
    <div className="space-y-16 lg:space-y-28 pb-20 lg:pb-32 font-sans overflow-x-hidden bg-white">
      {/* 1. Hero Slider Section */}
      <section className="relative overflow-hidden bg-slate-900 lg:rounded-[40px] w-full group shadow-xl mx-auto max-w-[1400px]">
        <div className="w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full"
            >
              <div className="w-full relative z-0">
                {activeBanners[currentSlide].imageUrl ? (
                  <Link to={activeBanners[currentSlide].linkUrl || "/products"} className="block w-full">
                    <img src={activeBanners[currentSlide].imageUrl} alt="" className="w-full h-auto min-h-[300px] object-cover block" />
                  </Link>
                ) : (
                  <div className="w-full aspect-[21/9] bg-slate-100 flex items-center justify-center">
                    <ImageIcon size={64} className="text-slate-300" />
                  </div>
                )}
                
                {(activeBanners[currentSlide].title1 || activeBanners[currentSlide].title2) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-4xl space-y-4 md:space-y-6 pointer-events-none text-white">
                      {activeBanners[currentSlide].badge && (
                         <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-brand-green font-bold tracking-widest uppercase text-[10px] bg-white px-4 py-2 rounded-full w-fit pointer-events-auto shadow-lg">{activeBanners[currentSlide].badge}</motion.span>
                      )}
                      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                        {activeBanners[currentSlide].title1} <br />
                        <span className="text-brand-green">{activeBanners[currentSlide].title2}</span>
                      </motion.h1>
                      {activeBanners[currentSlide].description && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg text-white/80 font-medium max-w-xl leading-relaxed">
                          {activeBanners[currentSlide].description}
                        </motion.p>
                      )}
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pointer-events-auto pt-4">
                        <Link to={activeBanners[currentSlide].btn1Link || "/products"} className="btn-primary w-fit !py-4 !px-10 !text-base">
                          {activeBanners[currentSlide].btn1Text || 'Shop Now'} <ArrowRight size={20} />
                        </Link>
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {activeBanners.length > 1 && (
            <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3 z-20">
              {activeBanners.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}></button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Shop By Category (MOVED UP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
          <p className="text-slate-500 font-medium text-sm">Browse our specialized therapeutic matrix</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { id: 'Ayurveda', name: 'Ayurveda', available: true, color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-100' },
            { id: 'Surgical/Panchkarma equipment', name: 'Surgical/Panchkarma Equipment', available: true, color: 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-100' },
            { id: 'Homeopathic', name: 'Homeopathic', available: false, color: 'bg-slate-50 text-slate-400 border-slate-100' },
            { id: 'Allopathic', name: 'Allopathic', available: false, color: 'bg-slate-50 text-slate-400 border-slate-100' }
          ].map((cat, index) => {
            const content = (
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className={`text-xl font-bold leading-tight ${cat.available ? 'text-slate-900' : 'text-slate-500'}`}>{cat.name}</h3>
                  {!cat.available && <span className="inline-block mt-2 px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold uppercase rounded-full tracking-widest">Coming Soon</span>}
                </div>
                {cat.available && (
                  <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity self-end mt-4 shadow-sm">
                    <ArrowRight size={20} className="text-slate-900" />
                  </div>
                )}
              </div>
            );

            if (cat.available) {
              return (
                <Link 
                  key={cat.id}
                  to={`/products?mainCategory=${encodeURIComponent(cat.id)}`}
                  className={`relative group overflow-hidden rounded-3xl p-6 h-48 border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${cat.color}`}
                >
                  {content}
                </Link>
              );
            } else {
              return (
                <div key={cat.id} className={`relative overflow-hidden rounded-3xl p-6 h-48 border opacity-70 cursor-not-allowed ${cat.color}`}>
                  {content}
                </div>
              );
            }
          })}
        </div>
      </section>

      {/* 3. Featured Products (MOVED DOWN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-end justify-between border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Featured Products</h2>
            <p className="text-slate-500 font-medium text-sm">Direct institutional supply for verified partners</p>
          </div>
          <Link to="/products" className="text-brand-green font-bold text-sm hover:underline flex items-center gap-1">View All <ChevronRight size={16} /></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {homeProducts.slice(0, 4).map((p) => (
            <MedicineCard key={p._id} medicine={p} onAddToCart={addToCart} />
          ))}
          {homeProducts.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-3xl">No products found.</div>}
        </div>
      </section>

      {/* 4. Top Trending Products (NEW SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-end justify-between border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Top Trending Prescriptions</h2>
            <p className="text-slate-500 font-medium text-sm">High-demand medical supplies across our network</p>
          </div>
          <Link to="/products?sort=trending" className="text-brand-green font-bold text-sm hover:underline flex items-center gap-1">View All <ChevronRight size={16} /></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {homeProducts.slice(0, 8).reverse().slice(0, 4).map((p) => (
            <MedicineCard key={p._id + '_trending'} medicine={p} onAddToCart={addToCart} />
          ))}
          {homeProducts.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-3xl">No products found.</div>}
        </div>
      </section>

      {/* 5. Partner Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-12">
         <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Trusted Brands</h2>
            <p className="text-slate-500 font-medium text-sm max-w-2xl mx-auto">Direct institutional supply from the world's leading pharmaceutical brands.</p>
         </div>

         <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {brands.map((brand) => (
               <button 
                  key={brand._id}
                  onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)}
                  className={`group flex flex-col items-center gap-3 transition-all ${selectedBrand === brand.name ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
               >
                  <div className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl border flex items-center justify-center transition-all duration-300 overflow-hidden ${selectedBrand === brand.name ? 'bg-brand-green/5 border-brand-green shadow-lg' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                     {brand.logoUrl ? (
                         <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300" />
                     ) : (
                         <span className="text-2xl font-bold text-slate-300">{brand.name.charAt(0)}</span>
                     )}
                  </div>
                  <span className={`text-xs font-bold transition-colors ${selectedBrand === brand.name ? 'text-brand-green' : 'text-slate-500'}`}>{brand.name}</span>
               </button>
            ))}
         </div>
      </section>

      {/* 6. Trust Section */}
      <section className="bg-slate-50 rounded-[48px] py-20 px-8 mx-4 sm:mx-8">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight" dangerouslySetInnerHTML={{ __html: cms.trustTitle || "Authentic Healthcare <br /> Solutions" }}></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              {cms.trustSubtitle || "Providing a secure, high-focus platform for hospitals and independent clinics to source authentic pharmaceuticals at institutional scale."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4 flex flex-col items-center group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                   {cms?.[`trustItem${i}Img`] ? <img src={cms[`trustItem${i}Img`]} alt="" className="w-full h-full object-contain" /> : <ShieldCheck size={32} />}
                </div>
                <h4 className="text-xl font-bold text-slate-900">{cms[`trustItem${i}Title`] || "Secure Supply Chain"}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{cms[`trustItem${i}Desc`] || "Optimized logistics and authenticated supply chain protocols."}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

  );
};

export default Home;

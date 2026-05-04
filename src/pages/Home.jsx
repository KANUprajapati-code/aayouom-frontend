import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  TrendingDown,
  Search,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Plus,
  Briefcase,
  Image as ImageIcon,
  Building2,
  Filter
} from 'lucide-react';
import MedicineCard from '../components/common/MedicineCard';
import SEO from '../components/common/SEO';
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
          axios.get(`https://ayuone-backend.vercel.app/api/products?placement=home${selectedBrand ? `&brand=${selectedBrand}` : ''}`),
          axios.get('https://ayuone-backend.vercel.app/api/content/homepage').catch(() => ({ data: {} })),
          axios.get('https://ayuone-backend.vercel.app/api/categories').catch(() => ({ data: [] })),
          axios.get('https://ayuone-backend.vercel.app/api/brands').catch(() => ({ data: [] }))
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

  const nextSlide = useCallback(() => setCurrentSlide(prev => (prev + 1) % (activeBanners?.length || 1)), [activeBanners]);
  const prevSlide = useCallback(() => setCurrentSlide(prev => (prev - 1 + (activeBanners?.length || 1)) % (activeBanners?.length || 1)), [activeBanners]);

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

  // Calculate specific product displays with fallback to legacy slicing
  const featured = homeProducts.filter(p => p.isFeatured);
  const displayFeatured = featured.length > 0 ? featured : homeProducts.slice(0, 4);

  const trending = homeProducts.filter(p => p.isTrending);
  const displayTrending = trending.length > 0 ? trending : homeProducts.slice(0, 8).reverse().slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-28 pb-20 lg:pb-32 font-sans overflow-x-hidden bg-white">
      <SEO 
        title="Home" 
        description="Ayuone B2B Marketplace - Premium pharmaceuticals, healthcare essentials, and wellness products. Buy in bulk with verified quality and instant delivery across India."
        keywords="Healthcare B2B, Medicine Wholesale, Ayuone Home, Pharma Supply India"
      />
      {/* 1. Hero Slider Section */}
      <section className="relative w-full rounded-[32px] md:rounded-[48px] overflow-hidden bg-slate-900 group shadow-2xl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
        <div className="w-full relative rounded-[32px] md:rounded-[48px] overflow-hidden">
          <AnimatePresence mode="wait">
            {activeBanners.length > 0 && (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full"
              >
                <div className="w-full relative z-0">
                  {activeBanners[currentSlide].imageUrl ? (
                    <img src={activeBanners[currentSlide].imageUrl} alt="" className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] object-cover md:object-contain block" />
                  ) : (
                    <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] bg-slate-800 flex items-center justify-center">
                      <Sparkles size={48} className="text-slate-700 md:w-16 md:h-16" />
                    </div>
                  )}

                  {(activeBanners[currentSlide].title1 || activeBanners[currentSlide].title2 || activeBanners[currentSlide].description) && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent pointer-events-none"></div>
                      <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-16 lg:px-20 max-w-3xl space-y-2 md:space-y-4 pointer-events-none">
                        {activeBanners[currentSlide].badge && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1 md:py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest w-fit pointer-events-auto"
                          >
                            <Sparkles size={12} className="animate-pulse md:w-3.5 md:h-3.5" /> {activeBanners[currentSlide].badge}
                          </motion.div>
                        )}

                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-[22px] sm:text-3xl md:text-5xl lg:text-6xl font-black text-white italic leading-[1.1] tracking-tighter"
                        >
                          {activeBanners[currentSlide].title1} <br />
                          <span className="text-blue-500">{activeBanners[currentSlide].title2}</span>
                        </motion.h1>

                        {activeBanners[currentSlide].description && (
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-[12px] md:text-[16px] text-blue-100/70 font-medium max-w-lg leading-relaxed line-clamp-2 md:line-clamp-none"
                          >
                            {activeBanners[currentSlide].description}
                          </motion.p>
                        )}

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-wrap gap-4 md:gap-6 pt-2 md:pt-4 pointer-events-auto"
                        >
                          <Link
                            to={activeBanners[currentSlide].btn1Link || "/products"}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-10 py-2.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all flex items-center gap-2 md:gap-3 group shadow-xl shadow-blue-600/30 active:scale-95"
                          >
                            {activeBanners[currentSlide].btn1Text || 'Explore Active Matrix'} <ArrowRight size={14} className="md:w-[18px] md:h-[18px] group-hover:translate-x-2 transition-transform" />
                          </Link>
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Arrows */}
          {activeBanners.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-10 z-20 pointer-events-none">
              <button onClick={prevSlide} className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all pointer-events-auto active:scale-90">
                <ChevronLeft size={14} className="md:w-6 md:h-6" />
              </button>
              <button onClick={nextSlide} className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all pointer-events-auto active:scale-90">
                <ChevronRight size={14} className="md:w-6 md:h-6" />
              </button>
            </div>
          )}

          {/* Dots Navigation */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-4 md:bottom-10 inset-x-0 z-20 flex justify-center gap-2 md:gap-3">
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 md:w-10 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {[
            { id: 'Ayurveda', name: 'Ayurveda', available: true, color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-100' },
            { id: 'Surgical/Panchkarma equipment', name: 'Surgical/Panchkarma Equipment', available: true, color: 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-100' },
            { id: 'Homeopathic', name: 'Homeopathic', available: false, color: 'bg-slate-50 text-slate-400 border-slate-100' },
            { id: 'Allopathic', name: 'Allopathic', available: false, color: 'bg-slate-50 text-slate-400 border-slate-100' }
          ].map((cat, index) => {
            const content = (
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className={`text-sm sm:text-lg md:text-xl font-bold leading-tight ${cat.available ? 'text-slate-900' : 'text-slate-500'}`}>{cat.name}</h3>
                  {!cat.available && <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[8px] md:text-[9px] font-bold uppercase rounded-full tracking-widest">Soon</span>}
                </div>
                {cat.available && (
                  <div className="w-7 h-7 md:w-10 md:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity self-end mt-2 shadow-sm">
                    <ArrowRight size={14} className="md:w-5 md:h-5 text-slate-900" />
                  </div>
                )}
              </div>
            );
 
            if (cat.available) {
              return (
                <Link
                  key={cat.id}
                  to={`/products?mainCategory=${encodeURIComponent(cat.id)}`}
                  className={`relative group overflow-hidden rounded-xl md:rounded-3xl p-3 md:p-6 h-32 sm:h-40 md:h-48 border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${cat.color}`}
                >
                  {content}
                </Link>
              );
            } else {
              return (
                <div key={cat.id} className={`relative overflow-hidden rounded-xl md:rounded-3xl p-3 md:p-6 h-32 sm:h-40 md:h-48 border opacity-70 cursor-not-allowed ${cat.color}`}>
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

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {displayFeatured.map((p) => (
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

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {displayTrending.map((p) => (
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

        <div className="flex flex-wrap justify-center gap-4 md:gap-10">
          {brands.map((brand) => (
            <button
              key={brand._id}
              onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)}
              className={`group flex flex-col items-center gap-2 md:gap-3 transition-all ${selectedBrand === brand.name ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
            >
              <div className={`w-16 h-16 md:w-28 md:h-28 rounded-xl md:rounded-2xl border flex items-center justify-center transition-all duration-300 overflow-hidden ${selectedBrand === brand.name ? 'bg-brand-green/5 border-brand-green shadow-lg' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <span className="text-xl md:text-2xl font-bold text-slate-300">{brand.name.charAt(0)}</span>
                )}
              </div>
              <span className={`text-[10px] md:text-xs font-bold transition-colors ${selectedBrand === brand.name ? 'text-brand-green' : 'text-slate-500'}`}>{brand.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Trust Section */}
      <section className="bg-slate-50 rounded-[32px] md:rounded-[48px] py-12 md:py-20 px-6 md:px-8 mx-4 md:mx-8">
        <div className="max-w-6xl mx-auto text-center space-y-10 md:space-y-16">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-2xl md:text-5xl font-bold text-slate-900 tracking-tight" dangerouslySetInnerHTML={{ __html: cms.trustTitle || "Authentic Healthcare <br /> Solutions" }}></h2>
            <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              {cms.trustSubtitle || "Providing a secure, high-focus platform for hospitals and independent clinics to source authentic pharmaceuticals at institutional scale."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3 md:space-y-4 flex flex-col items-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-brand-green shadow-sm group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                  {cms?.[`trustItem${i}Img`] ? <img src={cms[`trustItem${i}Img`]} alt="" className="w-full h-full object-contain" /> : <ShieldCheck size={28} className="md:w-8 md:h-8" />}
                </div>
                <h4 className="text-lg md:text-xl font-bold text-slate-900">{cms[`trustItem${i}Title`] || "Secure Supply Chain"}</h4>
                <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">{cms[`trustItem${i}Desc`] || "Optimized logistics and authenticated supply chain protocols."}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

  );
};

export default Home;

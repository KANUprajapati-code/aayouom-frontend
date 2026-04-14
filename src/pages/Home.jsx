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
import { motion } from 'framer-motion';

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
        setHomeProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        setCms(cmsRes.data || {});
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryHighlights = (Array.isArray(categories) ? categories : []).map(cat => {
    const featuredProduct = homeProducts.find(p => p.category === cat.name);
    return {
      category: cat.name,
      product: featuredProduct
    };
  }).filter(h => h.product);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
        badge: "Verified B2B Medical Hub",
        title1: "Premium Medicine",
        title2: "Sourcing for Doctors",
        description: "Accelerate your clinic's supply chain with direct access to top-tier pharmaceuticals, transparent volume schemes, and lightning-fast logistics.",
        btn1Text: "Start Ordering",
        btn1Link: "/products",
        btn2Text: "Quick Order Mode",
        btn2Link: "/quick-order"
      }];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 lg:pb-28">
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden bg-white rounded-3xl lg:rounded-[40px] border border-surface-border shadow-soft">
        <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex flex-col justify-center p-6 sm:p-10 lg:p-20">
          {/* Slider Backgrounds */}
          {activeBanners.map((banner, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0 }}
               animate={{ opacity: currentSlide === idx ? 1 : 0 }}
               transition={{ duration: 1 }}
               className="absolute inset-0 z-0"
             >
                {banner.imageUrl ? (
                  <div className="absolute inset-0">
                    <img src={banner.imageUrl} alt="" className="w-full h-full object-cover opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[120px] opacity-60"></div>
                )}
             </motion.div>
          ))}
          
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full relative z-10">
            {/* Content Side */}
            <div className="relative overflow-hidden min-h-[400px]">
              {activeBanners.map((banner, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: currentSlide === idx ? 1 : 0,
                    x: currentSlide === idx ? 0 : 20,
                    display: currentSlide === idx ? 'block' : 'none'
                  }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200 shadow-sm backdrop-blur-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{banner.badge || "Verified B2B Medical Hub"}</span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight"
                  >
                    {banner.title1} <br />
                    <span className="text-primary-600 italic block mt-2">{banner.title2}</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg sm:text-xl text-slate-500 max-w-lg leading-relaxed font-medium"
                  >
                    {banner.description}
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4"
                  >
                    <Link to={banner.btn1Link || "/products"} className="btn-primary h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg shadow-xl shadow-primary-600/20 group w-full sm:w-auto">
                      {banner.btn1Text || "Start Ordering"}
                      <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                    <Link to={banner.btn2Link || "/quick-order"} className="btn-outline h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg hover:bg-slate-50 w-full sm:w-auto">
                      {banner.btn2Text || "Quick Order"}
                    </Link>
                  </motion.div>
                </motion.div>
              ))}

              {/* Slider Dots */}
              {activeBanners.length > 1 && (
                <div className="flex gap-2 mt-12">
                   {activeBanners.map((_, i) => (
                     <button 
                       key={i} 
                       onClick={() => setCurrentSlide(i)}
                       className={`h-1.5 transition-all duration-300 rounded-full ${currentSlide === i ? 'w-8 bg-primary-600' : 'w-2 bg-slate-200'}`}
                     />
                   ))}
                </div>
              )}
            </div>
            
            {/* Info Cards Side */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:grid grid-cols-2 gap-6 relative"
            >
               <div className="space-y-6 pt-16">
                  <div className="card !p-6 bg-white shadow-premium border-primary-50 transform -rotate-2 hover:rotate-0 transition-all duration-500 scale-105">
                     <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
                        <TrendingDown size={24} />
                     </div>
                     <p className="text-sm font-black text-slate-900">{cms.card1Title || "Professional Savings"}</p>
                     <p className="text-xs text-text-muted mt-1">{cms.card1Desc || "Save up to 25% on bulk cardiac orders."}</p>
                  </div>
                  <div className="card !p-6 bg-white shadow-premium border-secondary-50 transform rotate-1 hover:rotate-0 transition-all duration-500">
                     <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
                        <Zap size={24} strokeWidth={2.5} />
                     </div>
                     <p className="text-sm font-black text-slate-900">{cms.card2Title || "Instant Schemes"}</p>
                     <p className="text-xs text-text-muted mt-1">{cms.card2Desc || "10+2 and 15% OFF applied in real-time."}</p>
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
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute bottom-10 right-10 flex gap-4 z-20">
             <button 
               onClick={() => setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length)}
               className="w-14 h-14 rounded-full bg-white shadow-premium border border-surface-border flex items-center justify-center text-slate-400 hover:text-primary-600 hover:scale-110 transition-all active:scale-95 transition-all"
             >
                <ArrowRight size={24} className="rotate-180" />
             </button>
             <button 
               onClick={() => setCurrentSlide(prev => (prev + 1) % activeBanners.length)}
               className="w-14 h-14 rounded-full bg-white shadow-premium border border-surface-border flex items-center justify-center text-slate-400 hover:text-primary-600 hover:scale-110 transition-all active:scale-95 transition-all"
             >
                <ArrowRight size={24} />
             </button>
          </div>
        </div>
      </section>

      {/* Featured Schemes Slider/Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
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
      </motion.section>

      {/* Category Explorer Grid */}
      <section className="space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-4">
             <div className="px-4 py-1.5 bg-secondary-50 text-secondary-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary-100 w-fit">Clinical Segments</div>
             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">{cms.categoryTitle || "Explore Therapeutic Matrix"}</h2>
             <p className="text-slate-500 text-base sm:text-lg max-w-xl">{cms.categorySubtitle || "Browse our specialized medicinal segments verified for quality and supply consistency."}</p>
          </div>
          <Link to="/products" className="group flex items-center gap-3 text-sm font-black text-primary-600 uppercase tracking-widest">
             See Full Catalog <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all"><ArrowRight size={18} /></div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.length === 0 && [1,2,3,4].map(i => (
             <div key={i} className="aspect-[4/5] bg-slate-100 animate-pulse rounded-[32px]"></div>
          ))}
          {categories.map((cat, index) => (
            <motion.div 
              key={cat._id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-[3/4] group overflow-hidden rounded-[32px] border border-surface-border bg-white shadow-soft cursor-pointer"
            >
               {/* Background Image / Placeholder */}
               <div className="absolute inset-0 z-0">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-primary-50 flex items-center justify-center text-primary-200">
                       <Zap size={80} />
                    </div>
                  )}
                  {/* Subtle Overlays */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
               </div>

               {/* Content */}
               <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                  <div className="space-y-3 transform lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-500">
                     <p className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">{cat.brands?.length || 0} Brands Syncing</p>
                     <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{cat.name}</h3>
                     <div className="h-0.5 w-12 bg-primary-500 group-hover:w-full transition-all duration-700"></div>
                     <Link to={`/products?category=${cat.name}`} className="block">
                        <span className="inline-flex py-3 text-[10px] font-black text-white uppercase tracking-widest opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center gap-2">
                           Enter Segment <ChevronRight size={14} />
                        </span>
                     </Link>
                  </div>
               </div>
               
               {/* Absolute Link Layer for whole card */}
               <Link to={`/products?category=${cat.name}`} className="absolute inset-0 z-20" aria-label={`View ${cat.name}`}></Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Quality Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-slate-900 rounded-3xl lg:rounded-[48px] p-8 sm:p-12 lg:p-24 text-center text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500 opacity-5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <motion.h2 variants={itemVariants} className="text-4xl lg:text-6xl font-black leading-tight tracking-tight" dangerouslySetInnerHTML={{__html: cms.trustTitle || "The Trusted Hub for <br />Healthcare Procurement"}}></motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {cms.trustSubtitle || "We provide a secure, professional-grade platform for hospitals and independent clinics to source authentic pharmaceuticals at scale."}
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12 lg:gap-20"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400 mx-auto border border-white/10 backdrop-blur-md overflow-hidden">
                {cms?.trustItem1Img ? (
                  <img src={cms.trustItem1Img} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ShieldCheck size={32} />
                )}
              </div>
              <h4 className="text-xl font-black">{cms.trustItem1Title || "Quality Assured"}</h4>
              <p className="text-slate-500 text-sm">{cms.trustItem1Desc || "Every batch verified for authenticity and storage standards."}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400 mx-auto border border-white/10 backdrop-blur-md overflow-hidden">
                {cms?.trustItem2Img ? (
                  <img src={cms.trustItem2Img} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Zap size={32} />
                )}
              </div>
              <h4 className="text-xl font-black">{cms.trustItem2Title || "Express Delivery"}</h4>
              <p className="text-slate-500 text-sm">{cms.trustItem2Desc || "Priority shipping for clinics within 24-48 hours nationwide."}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400 mx-auto border border-white/10 backdrop-blur-md overflow-hidden">
                {cms?.trustItem3Img ? (
                  <img src={cms.trustItem3Img} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Briefcase size={32} />
                )}
              </div>
              <h4 className="text-xl font-black">{cms.trustItem3Title || "B2B Compliance"}</h4>
              <p className="text-slate-500 text-sm">{cms.trustItem3Desc || "Optimized for VAT/GST invoices and professional record-keeping."}</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TrendingDown, Zap, ShieldCheck, ArrowRight, Package, ShoppingCart, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Schemes = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [schemesData, setSchemesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const IconMap = {
    TrendingDown,
    Zap,
    ShieldCheck
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, productsRes, schemesRes] = await Promise.all([
          axios.get('https://ayuom-backend.vercel.app/api/content/schemes').catch(() => ({ data: null })),
          axios.get('https://ayuom-backend.vercel.app/api/products?placement=schemes').catch(() => ({ data: [] })),
          axios.get('https://ayuom-backend.vercel.app/api/schemesData').catch(() => ({ data: [] }))
        ]);
        
        if (contentRes.data) {
          const data = contentRes.data;
          const heroBanners = data.heroBanners || (data.title ? [{
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            imageUrl: data.imageUrl,
            btnText: 'Explore Active Matrix',
            btnLink: '/products'
          }] : []);
          setBanners(heroBanners);
        }
        if (productsRes.data && productsRes.data.length > 0) setProducts(productsRes.data);
        if (schemesRes.data && schemesRes.data.length > 0) setSchemesData(schemesRes.data.filter(s => s.status === 'Active'));

      } catch (err) {
        console.error('Error fetching schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-play Slider
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  const nextSlide = useCallback(() => setCurrentSlide(prev => (prev + 1) % banners.length), [banners]);
  const prevSlide = useCallback(() => setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length), [banners]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Scheme Nodes...</p>
    </div>
  );

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-16 pb-24 font-sans px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Dynamic Multi-Banner Slider */}
      <section className="relative h-[450px] md:h-[550px] lg:h-[600px] rounded-[32px] md:rounded-[48px] overflow-hidden bg-slate-900 group">
        <AnimatePresence mode="wait">
           {banners.length > 0 && (
             <motion.div
               key={currentSlide}
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -50 }}
               transition={{ duration: 0.8, ease: "easeInOut" }}
               className="absolute inset-0"
             >
                <div className="absolute inset-0 z-0">
                   <img src={banners[currentSlide].imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000'} alt="" className="w-full h-full object-cover opacity-30" />
                   <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-20 max-w-4xl space-y-6 md:space-y-8">
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2 }}
                     className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest w-fit"
                   >
                     <Sparkles size={14} className="animate-pulse" /> {banners[currentSlide].subtitle || 'Registered Partner Exclusive'}
                   </motion.div>
                   
                   <motion.h1 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3 }}
                     className="text-4xl md:text-6xl lg:text-7xl font-black text-white italic leading-[1.1] tracking-tighter"
                   >
                     {banners[currentSlide].title}
                   </motion.h1>
                   
                   <motion.p 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 }}
                     className="text-lg md:text-xl text-blue-100/70 font-medium max-w-2xl leading-relaxed"
                   >
                     {banners[currentSlide].description}
                   </motion.p>
                   
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 }}
                     className="flex flex-wrap gap-6 pt-4"
                   >
                     <button 
                       onClick={() => navigate(banners[currentSlide].btnLink || '/products')}
                       className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 md:py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3 group shadow-2xl shadow-blue-600/30 active:scale-95"
                     >
                       {banners[currentSlide].btnText || 'Explore Active Matrix'} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                     </button>
                   </motion.div>
                </div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 md:px-10 z-20 pointer-events-none">
             <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all pointer-events-auto active:scale-90">
                <ChevronLeft size={24} />
             </button>
             <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all pointer-events-auto active:scale-90">
                <ChevronRight size={24} />
             </button>
          </div>
        )}

        {/* Dots Navigation */}
        {banners.length > 1 && (
          <div className="absolute bottom-10 inset-x-0 z-20 flex justify-center gap-3">
             {banners.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-10 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
             ))}
          </div>
        )}
      </section>

      {/* Schemes Matrix Grid */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
             <div className="w-12 h-1.5 bg-blue-600 rounded-full"></div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-950 italic tracking-tighter">PROMOTION MATRIX</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Real-time clinical yield opportunities</p>
          </div>
          <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200 shadow-sm w-fit">
            <button className="px-6 py-2.5 bg-white text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">Current Node</button>
            <button className="px-6 py-2.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-slate-900 transition-colors">Future Pipeline</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schemesData.map((scheme) => {
            const Icon = IconMap[scheme.icon] || Zap;
            return (
              <div key={scheme._id} className="bg-white rounded-[32px] p-8 border border-slate-200 hover:border-blue-600/30 hover:shadow-xl transition-all duration-300 flex flex-col group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-blue-600 flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{scheme.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-semibold">{scheme.description}</p>
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">{scheme.category}</span>
                  <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scheme Products */}
      {products.length > 0 && (
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
               <div className="w-12 h-1.5 bg-emerald-500 rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-950 italic tracking-tighter uppercase">Active Clinical Inventory</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Direct institutional supply benefits</p>
            </div>
            <button onClick={() => navigate('/products')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-black transition-all">Full Inventory Access &rarr;</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product, idx) => {
              const hasFreeScheme = product.freeUnitsScheme && product.freeUnitsScheme.buy && product.freeUnitsScheme.free;
              const hasRules = product.schemeRules && product.schemeRules.length > 0;
              const schemeText = hasFreeScheme 
                ? `BUY ${product.freeUnitsScheme.buy} GET ${product.freeUnitsScheme.free} FREE`
                : hasRules 
                  ? `${Math.max(...product.schemeRules.map(r => r.discountPercentage))}% BULK OFF`
                  : 'LIMITED SCHEME';

              return (
                <div 
                  key={product._id} 
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 border border-slate-200 hover:border-blue-600/30 hover:shadow-lg transition-all duration-300 flex flex-col group relative cursor-pointer"
                >
                  <div className={`absolute top-4 left-4 z-20 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg ${hasFreeScheme ? 'bg-orange-500' : 'bg-blue-600'}`}>
                    {schemeText}
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-6 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-all duration-500">
                    <img src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5e4b2dcd9?w=300&q=80'} alt={product.name} className="w-4/5 h-4/5 object-contain" />
                  </div>
                  <div className="space-y-1 mb-6">
                     <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest italic">{product.brand || 'General Pharma'}</p>
                     <h3 className="text-sm font-bold text-slate-900 leading-tight uppercase tracking-tight truncate">{product.name}</h3>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                     <div className="text-lg font-black text-slate-900">₹{product.price}</div>
                     <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <ShoppingCart size={18} />
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="relative bg-slate-950 rounded-[32px] md:rounded-[40px] p-8 md:p-12 lg:p-24 overflow-hidden text-center group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-tight">Secure Professional <br /> <span className="text-blue-500">Bulk Validations?</span></h3>
            <p className="text-slate-400 text-lg font-semibold leading-relaxed">Our institutional matrix provides direct integration for large clinics and hospitals requiring scale supply.</p>
            <button onClick={() => navigate('/contact')} className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-blue-50 transition-all active:scale-95">
               Contact Institutional Head
            </button>
         </div>
      </section>
    </motion.div>
  );
};

export default Schemes;

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
  Image as ImageIcon
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
        imageUrl: "https://via.placeholder.com/1600x500?text=Upload+Promotional+Banner+From+Admin",
        linkUrl: "/products"
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
      <section className="relative overflow-hidden bg-slate-50 border border-surface-border lg:rounded-3xl shadow-soft h-[60vh] lg:h-[70vh] min-h-[500px] max-h-[800px] w-full group font-sans">
        <div className="absolute inset-0 w-full h-full">
           {activeBanners.map((banner, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0 }}
               animate={{ opacity: currentSlide === idx ? 1 : 0 }}
               transition={{ duration: 1 }}
               className="absolute inset-0 z-0 w-full h-full"
             >
                 {/* Background Layer */}
                 <div className="absolute inset-0 z-0">
                    {banner.imageUrl ? (
                      <img loading="lazy" src={banner.imageUrl} alt={`Promotional Banner ${idx + 1}`} className="w-full h-full object-cover lg:object-fill" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-300">
                         <ImageIcon size={64} />
                         <span className="mt-4 font-black tracking-widest uppercase text-xs sm:text-sm">Admin: Upload Image Banner</span>
                      </div>
                    )}
                 </div>
                 
                 {/* Gradient overlay for readability */}
                 <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>

                 {/* Text Layer */}
                 <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24">
                    {banner.badge && <span className="text-secondary-400 font-black tracking-widest uppercase text-xs md:text-sm mb-2">{banner.badge}</span>}
                    {banner.title1 && <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">{banner.title1}</h1>}
                    {banner.title2 && <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-primary-400 leading-tight mb-4">{banner.title2}</h1>}
                    {banner.description && <p className="text-slate-200 text-sm md:text-lg max-w-lg mb-8 line-clamp-3 md:line-clamp-none">{banner.description}</p>}
                    
                    <div className="flex flex-wrap gap-4">
                       {(banner.btn1Text || banner.linkUrl) && (
                         <Link to={banner.btn1Link || banner.linkUrl || '/products'} className="bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-500 transition-colors shadow-lg">
                            {banner.btn1Text || 'Shop Now'}
                         </Link>
                       )}
                       {banner.btn2Text && (
                         <Link to={banner.btn2Link || '/products'} className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors shadow-lg">
                            {banner.btn2Text}
                         </Link>
                       )}
                    </div>
                 </div>
                 {/* Make whole slide clickable if linkUrl is present but no specific buttons */}
                 {banner.linkUrl && !banner.btn1Text && !banner.btn2Text && (
                   <Link to={banner.linkUrl} className="absolute inset-0 z-20"></Link>
                 )}
             </motion.div>
           ))}

           {/* Navigation Arrows */}
           <div className="absolute inset-y-0 left-4 md:left-8 flex items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={() => setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length)}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-sm shadow-premium border border-white flex items-center justify-center text-slate-700 hover:text-primary-600 hover:scale-110 active:scale-95 transition-all"
              >
                 <ArrowRight size={24} className="rotate-180" />
              </button>
           </div>

           <div className="absolute inset-y-0 right-4 md:right-8 flex items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={() => setCurrentSlide(prev => (prev + 1) % activeBanners.length)}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-sm shadow-premium border border-white flex items-center justify-center text-slate-700 hover:text-primary-600 hover:scale-110 active:scale-95 transition-all"
              >
                 <ArrowRight size={24} />
              </button>
           </div>

           {/* Slider Dots */}
           {activeBanners.length > 1 && (
             <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-20">
                {activeBanners.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 transition-all duration-300 rounded-full ${currentSlide === i ? 'w-10 bg-white shadow-lg' : 'w-2 bg-white/50 hover:bg-white'} border border-black/10`}
                  />
                ))}
             </div>
           )}
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
                    <img loading="lazy" src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                  <img loading="lazy" src={cms.trustItem1Img} alt="" className="w-full h-full object-cover" />
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
                  <img loading="lazy" src={cms.trustItem2Img} alt="" className="w-full h-full object-cover" />
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
                  <img loading="lazy" src={cms.trustItem3Img} alt="" className="w-full h-full object-cover" />
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

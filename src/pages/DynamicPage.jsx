import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  TrendingDown,
  Zap,
  Plus
} from 'lucide-react';
import MedicineCard from '../components/common/MedicineCard';
import { useCart } from '../context/CartContext';

const DynamicPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchPageData();
    fetchProducts();
  }, [slug]);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://ayuom-backend.vercel.app/api/pages/${slug}`);
      setPage(data);
    } catch (err) {
      console.error('Failed to fetch dynamic page:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('https://ayuom-backend.vercel.app/api/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products for dynamic page:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
         <h1 className="text-4xl font-black text-slate-900 italic">404: ARCHIVE NOT FOUND</h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">The requested configuration does not exist on this node.</p>
         <Link to="/" className="btn-primary px-8">Return to Hub</Link>
      </div>
    );
  }

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={index} className="relative overflow-hidden bg-white rounded-[48px] border border-surface-border p-12 lg:p-24 shadow-soft mb-20">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[120px] opacity-60 -z-10"></div>
            <div className="max-w-3xl space-y-8 relative z-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 border border-primary-100 italic">
                  <ShieldCheck size={18} className="text-primary-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure Node</span>
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight uppercase italic">{section.title}</h1>
               <p className="text-xl text-text-muted leading-relaxed max-w-2xl">{section.subtitle}</p>
               <div className="pt-4">
                  <button className="btn-primary h-14 px-10 text-lg shadow-premium">Initialize Session <ArrowRight size={22} /></button>
               </div>
            </div>
          </section>
        );

      case 'products':
        const filteredProducts = products.filter(p => p.category === section.category);
        return (
          <section key={index} className="space-y-12 mb-24">
             <div className="flex items-end justify-between px-4">
                <div>
                   <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">{section.title || section.category}</h2>
                   <p className="text-text-muted mt-2 text-lg">{section.subtitle || `Access full inventory of ${section.category} clinical solutions.`}</p>
                </div>
                <Link to="/products" className="text-primary-600 font-black flex items-center gap-2 hover:gap-3 transition-all">Explore Entire Grid <ArrowRight size={20} /></Link>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((p, i) => <MedicineCard key={p._id} medicine={p} onAddToCart={addToCart} />)}
                {filteredProducts.length === 0 && <p className="col-span-full py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active records found in this category segment.</p>}
             </div>
          </section>
        );

      case 'schemes':
        return (
          <section key={index} className="bg-slate-900 rounded-[56px] p-12 lg:p-24 text-white mb-24 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
             <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                   <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">{section.title || "Promotional Hub Active"}</h2>
                   <p className="text-xl text-slate-400 leading-relaxed">{section.subtitle || "Real-time volume schemes and clinical discounts applied at checkout."}</p>
                   <Link to="/schemes" className="btn-primary bg-white text-primary-600 hover:bg-primary-50 h-14 px-10">Access Optimizer Hub <Zap size={20} /></Link>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   {[1, 2].map(i => (
                     <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                        <TrendingDown size={32} className="text-primary-400 mb-4" />
                        <h4 className="text-xl font-black mb-2">Scheme Tier {i}</h4>
                        <p className="text-sm text-slate-500 font-bold">10+2 Clinical Bonus active on all bulk orders.</p>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        );

      case 'text':
        return (
          <section key={index} className="max-w-4xl mx-auto mb-24 space-y-8 px-4">
             <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">{section.title}</h2>
             {section.subtitle && <p className="text-xl text-primary-600 font-black uppercase tracking-widest opacity-80">{section.subtitle}</p>}
             <div className="prose prose-lg text-text-muted leading-loose font-medium">
                {section.content.split('\n').map((para, i) => <p key={i} className="mb-6">{para}</p>)}
             </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
         {page.sections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );
};

export default DynamicPage;

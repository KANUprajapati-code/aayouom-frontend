import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingDown, 
  Package, 
  Truck, 
  History, 
  ChevronRight,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Info,
  ShoppingCart,
  MessageCircle
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SchemeBadge from '../components/common/SchemeBadge';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://ayuom-backend.vercel.app/api/products/${id}`);
        setMedicine(data);
        if (data) {
           setMainImage(data.images?.length > 0 ? data.images[0] : (data.image || 'https://via.placeholder.com/400'));
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInquiry = () => {
    if (!medicine) return;
    const whatsappNumber = "917990411390"; // Updated from USER_REQUEST
    const message = `Hi, I am interested in *${medicine.name}* (Price: ₹${medicine.price}). Can you provide more details? 
Link: ${window.location.origin}/product/${medicine._id}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-black text-slate-800 mb-4">Product Node Not Found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary">Back to Marketplace</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto px-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary-600 font-bold transition-all group"
      >
        <div className="w-8 h-8 rounded-full border border-surface-border flex items-center justify-center group-hover:border-primary-200">
          <ArrowLeft size={18} />
        </div>
        Back to Results
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Section (Amazon Style Gallery) */}
        <div className="space-y-4">
          <div className="card !p-8 bg-white aspect-square flex items-center justify-center relative rounded-[40px] border border-surface-border shadow-soft group">
             <div className="absolute top-6 left-6 z-10">
               {medicine.scheme && <SchemeBadge scheme={medicine.scheme} />}
             </div>
             <img loading="lazy" src={mainImage} 
               alt={medicine.name} 
               className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out" 
             />
          </div>
          
          {/* Thumbnails Row */}
          {medicine.images && medicine.images.length > 1 && (
             <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar justify-center">
                {medicine.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    className={`shrink-0 w-20 h-20 bg-white rounded-2xl border-2 p-2 flex items-center justify-center transition-all ${
                       mainImage === img 
                         ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                         : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-primary-300'
                    }`}
                  >
                     <img src={img} alt={`Thumbnail ${idx+1}`} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
             </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-8">
           <div className="space-y-2">
             <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">{medicine.brand || "Verified Brand"}</p>
             <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">{medicine.name}</h1>
             <p className="text-sm text-text-muted font-medium italic">{medicine.category}</p>
           </div>

           <div className="p-8 bg-surface-light rounded-[40px] border border-surface-border space-y-8 shadow-soft">
              <div className="flex items-end justify-between">
                <div>
                   {medicine.mrp && <p className="text-xs text-text-muted line-through mb-1">MRP ₹{medicine.mrp}</p>}
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-slate-900">₹{medicine.price}</span>
                     {medicine.discount && <span className="text-sm font-bold text-secondary-600">({medicine.discount}% OFF)</span>}
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Availability</p>
                   {medicine.stock > 0 ? (
                     <p className="text-sm font-bold text-secondary-600 flex items-center gap-2 justify-end">
                       <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse"></span>
                       In Stock ({medicine.stock})
                     </p>
                   ) : (
                     <p className="text-sm font-bold text-rose-500 flex items-center gap-2 justify-end">
                       <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                       Out of Stock
                     </p>
                   )}
                </div>
              </div>

              {medicine.scheme && (
                <div className="p-5 bg-white rounded-2xl border border-primary-100 flex items-center justify-between shadow-premium">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                        <TrendingDown size={24} />
                     </div>
                     <div>
                       <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{medicine.scheme}</p>
                       <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Applied on Clinical Bulk Checkout</p>
                     </div>
                   </div>
                   <Info size={18} className="text-slate-300" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <div className="flex items-center gap-6 bg-white border border-surface-border rounded-2xl p-4 shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-primary-600 hover:bg-primary-50 p-1 rounded-lg transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-xl font-black w-8 text-center text-slate-800">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-primary-600 hover:bg-primary-50 p-1 rounded-lg transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                 </div>
                 <button 
                   onClick={() => addToCart(medicine, quantity)}
                   className="btn-primary flex-grow py-5 text-sm uppercase tracking-[0.2em] shadow-premium"
                 >
                    Add to Clinic Cart
                    <ShoppingCart size={20} />
                 </button>
              </div>

              <button 
                onClick={handleInquiry}
                className="w-full py-4 border-2 border-emerald-500/20 bg-emerald-50 text-emerald-700 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-soft"
              >
                 <MessageCircle size={18} /> Inquire about this medicine
              </button>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-surface-border space-y-2 shadow-soft">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Package size={14} className="text-primary-500" /> Logistics Info
                 </p>
                 <p className="text-sm font-black text-slate-800">Sealed Pack Delivery</p>
                 <p className="text-xs text-text-muted">Standard clinical packaging maintained.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-surface-border space-y-2 shadow-soft">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Truck size={14} className="text-primary-500" /> Fast Delivery
                 </p>
                 <p className="text-sm font-black text-slate-800">24-48 Hours Express</p>
                 <p className="text-xs text-text-muted">Priority fulfillment for medical hubs.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Description / Medical Info */}
      <section className="bg-white rounded-[40px] border border-surface-border p-8 lg:p-14 shadow-premium space-y-8 mt-12">
         <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-primary-600 rounded-full"></div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 italic uppercase">Clinical Information</h2>
         </div>
         
         <div className="grid md:grid-cols-2 gap-12 text-sm leading-relaxed">
            <div className="space-y-6">
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic font-medium text-slate-600 leading-relaxed shadow-inner">
                  "{medicine.description || "Detailed clinical description and therapeutic usage guidelines are available upon purchase or professional inquiry."}"
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-light border border-surface-border">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                     <p className="font-bold text-slate-800">{medicine.category}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-light border border-surface-border">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Storage</p>
                     <p className="font-bold text-slate-800">Cool & Dry Place</p>
                  </div>
               </div>
            </div>
            <div className="space-y-6">
               <div className="p-6 bg-primary-50/50 rounded-[32px] border border-primary-100 flex gap-5">
                  <ShieldCheck className="text-primary-600 shrink-0" size={28} />
                  <div>
                     <p className="text-lg font-black text-primary-900 leading-none">Professional-Grade</p>
                     <p className="text-primary-700 text-xs mt-2 leading-relaxed font-bold opacity-70 italic">Ensure correct medical supervision and patient history review before administration.</p>
                  </div>
               </div>
               <div className="p-6 bg-slate-900 rounded-[32px] text-white flex gap-5 shadow-2xl">
                  <History className="text-primary-400 shrink-0" size={28} />
                  <div>
                     <p className="text-lg font-black italic">Supply Reliability</p>
                     <p className="text-slate-400 text-xs mt-2 leading-relaxed font-medium">consistent stock availability tracked directly from warehouse nodes.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ProductDetail;

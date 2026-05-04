import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Info, TrendingUp, Tag, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const MedicineCard = ({ medicine, onAddToCart }) => {
  if (!medicine) return null;
  const {
    _id,
    name,
    brand,
    originalPrice,
    price,
    scheme,
    image,
    stock,
    discount,
    isBestDeal = false
  } = medicine;
  
  const numPrice = Number(price) || 0;
  const numOriginalPrice = Number(medicine.originalPrice) || Number(medicine.mrp) || 0;
  const availableStock = stock !== undefined ? stock : Infinity;

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello Ayuone! I'm interested in buying bulk quantities of: *${name}* (Brand: ${brand}). Could you share the best negotiated price and availability?`;
    window.open(`https://wa.me/919265401508?text=${encodeURIComponent(message)}`, '_blank');
  };

  const calculatedDiscount = discount || (numOriginalPrice > numPrice ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100) : 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`group flex flex-col relative bg-white rounded-2xl md:rounded-3xl border-2 border-slate-200 p-3 md:p-4 transition-all duration-500 hover:shadow-xl hover:border-brand-green/40 h-full overflow-hidden ${isBestDeal ? 'ring-2 ring-brand-green/20 ring-offset-2' : ''}`}
    >
      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 flex flex-col gap-1 md:gap-2 pointer-events-none">
        {isBestDeal && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-green text-white text-[8px] md:text-[9px] font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-lg shadow-lg flex items-center gap-1 md:gap-1.5 uppercase tracking-wider"
          >
            <TrendingUp size={10} className="md:w-3 md:h-3 animate-pulse" />
            Top Deal
          </motion.div>
        )}
        
        {scheme && (
          <div className="bg-emerald-500 text-white text-[8px] md:text-[9px] font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-lg shadow-lg flex items-center gap-1 md:gap-1.5 uppercase tracking-wider border border-emerald-400">
            <Tag size={10} className="md:w-3 md:h-3" />
            {scheme}
          </div>
        )}
      </div>

      {/* Image Block */}
      <Link to={`/product/${_id}`} className="block relative h-40 md:h-56 mb-3 md:mb-4 bg-slate-50 rounded-xl md:rounded-2xl overflow-hidden group-hover:bg-brand-green/5 transition-colors duration-500 flex items-center justify-center p-2">
        <img loading="lazy" src={image || 'https://via.placeholder.com/300'} 
          alt={name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-2 right-2 p-1.5 md:p-2 bg-white/80 backdrop-blur-md rounded-lg md:rounded-xl text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
          <Info size={14} className="md:w-4 md:h-4" />
        </div>
      </Link>

      {/* Details Area */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1 md:mb-2">
          <span className="text-[8px] md:text-[10px] font-bold text-brand-green uppercase tracking-wider bg-brand-green/5 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">
            {brand || "Ayuone"}
          </span>
          <div className="flex items-center gap-1 text-slate-400">
             <ShieldCheck size={10} className="md:w-3.5 md:h-3.5 text-brand-green" />
             <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-tighter">Safe</span>
          </div>
        </div>

        <Link to={`/product/${_id}`} className="block mb-1.5 md:mb-3">
          <h3 className="text-[13px] md:text-base font-bold text-slate-800 line-clamp-2 group-hover:text-brand-green transition-colors tracking-tight leading-tight">
            {name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-2 md:pt-4 border-t border-slate-100 border-dashed">
            {/* Pricing Matrix */}
            <div className="flex items-baseline gap-1 md:gap-2 mb-2 md:mb-4 flex-wrap">
              <span className="text-base md:text-xl font-bold text-slate-900">₹{price}</span>
              {numOriginalPrice > 0 && numOriginalPrice > numPrice && (
                <span className="text-[10px] md:text-sm text-slate-400 line-through">₹{numOriginalPrice}</span>
              )}
              {calculatedDiscount > 0 && (
                <span className="text-[9px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto sm:ml-0">
                  {calculatedDiscount}% OFF
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-1 md:gap-2">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if(onAddToCart) onAddToCart(medicine);
                }}
                className="py-1.5 md:py-2.5 bg-brand-green hover:bg-brand-dark text-white rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-1 md:gap-2"
              >
                <ShoppingCart size={12} className="md:w-4 md:h-4" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase">Add</span>
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsApp}
                className="py-1.5 md:py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-1 md:gap-2"
              >
                <MessageCircle size={12} className="md:w-4 md:h-4" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase">Query</span>
              </motion.button>
            </div>
        </div>
      </div>
      
      {/* Out of Stock Overlay */}
      {availableStock <= 0 && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl flex items-center justify-center z-20">
          <div className="bg-slate-900 text-white text-[10px] md:text-[11px] font-bold px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl uppercase tracking-wider">
            Out of Stock
          </div>
        </div>
      )}
    </motion.div>

  );
};

export default MedicineCard;

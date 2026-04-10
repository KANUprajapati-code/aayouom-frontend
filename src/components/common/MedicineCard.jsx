import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Info, TrendingUp } from 'lucide-react';
import SchemeBadge from './SchemeBadge';
import { motion } from 'framer-motion';

const MedicineCard = ({ medicine, onAddToCart }) => {
  const {
    _id,
    name,
    brand,
    mrp,
    price,
    discount,
    scheme,
    image,
    stock = true,
    isBestDeal = false
  } = medicine;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`group relative bg-white rounded-2xl border border-surface-border p-4 transition-all duration-300 hover:shadow-medium hover:border-primary-200 ${isBestDeal ? 'ring-1 ring-primary-500/20' : ''}`}
    >
      {isBestDeal && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-3 left-4 bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10"
        >
          <TrendingUp size={12} />
          BEST DEAL
        </motion.div>
      )}

      <Link to={`/product/${_id}`} className="block relative aspect-square mb-4 bg-surface-light rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
        <img 
          src={image || 'https://via.placeholder.com/200'} 
          alt={name} 
          className="w-full h-full object-contain p-4"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-lg text-text-muted hover:text-primary-600 border border-surface-border opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Info size={16} />
        </div>
      </Link>

      <div className="space-y-2">
        <div>
          <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest leading-none mb-1">
            {brand}
          </p>
          <Link to={`/product/${_id}`}>
            <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {scheme && <SchemeBadge scheme={scheme} />}
          {discount && <span className="text-[10px] font-bold text-secondary-600 bg-secondary-50 px-1.5 py-0.5 rounded">{discount}% OFF</span>}
          {stock > 0 && stock < 15 && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded animate-pulse">
              ONLY {stock} LEFT
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-slate-50">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-text-muted line-through leading-none mb-1">MRP ₹{mrp}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900">₹{price}</span>
                <span className="text-[10px] text-text-muted font-medium">/ unit</span>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if(onAddToCart) onAddToCart(medicine);
              }}
              className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all group/btn"
            >
              <Plus size={20} className="group-hover/btn:rotate-90 transition-transform duration-300" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {stock <= 0 && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-20">
          <span className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest leading-none shadow-premium">OUT OF STOCK</span>
        </div>
      )}
    </motion.div>
  );
};

export default MedicineCard;

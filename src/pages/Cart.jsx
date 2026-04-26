import React, { useState } from 'react';
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SchemeBadge from '../components/common/SchemeBadge';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const totalMRP = cart.reduce((acc, item) => acc + (item.mrp * item.quantity), 0);
  const savings = totalMRP - subtotal;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-surface-light rounded-full flex items-center justify-center mx-auto text-slate-300">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Your cart is empty</h1>
          <p className="text-text-muted">Looks like you haven't added any professional medical supplies yet.</p>
        </div>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-8">
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-end justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">Payload Matrix</h1>
          <p className="text-text-muted mt-1 font-bold uppercase tracking-widest text-[10px] ml-1">Review your clinical order deployment</p>
        </div>
        <Link to="/products" className="text-primary-600 font-bold hover:underline mb-1 flex items-center gap-1 text-sm">
          <Plus size={18} /> Add More
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Cart Items */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-premium overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:grid grid-cols-12 gap-4">
              <div className="col-span-6">Medicine Details</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-slate-50">
              {cart.map(item => (
                <div key={item._cartId} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group relative">
                  <div className="col-span-1 md:col-span-6 flex gap-4 w-full pr-8 md:pr-0">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 p-2">
                      <img loading="lazy" src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">{item.brand || 'Institutional'}</p>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 uppercase italic tracking-tighter">{item.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 pt-1 font-bold">
                        {item.selectedVariant && (
                           <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-600">{item.selectedVariant.name}</span>
                        )}
                        <span className="text-[10px] text-emerald-600">₹{item.price} / unit</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center">
                    <div className="inline-flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item._cartId, item.quantity - 1)}
                        className="text-slate-400 hover:text-black transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-lg font-black text-slate-900 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._cartId, item.quantity + 1)}
                        className="text-slate-400 hover:text-black transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:block md:text-right">
                    <p className="text-xs text-slate-300 line-through md:block inline mr-2 italic">₹{(item.mrp * item.quantity).toLocaleString()}</p>
                    <p className="text-xl font-black text-slate-950 inline md:block tracking-tighter italic">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <div className="absolute top-6 right-6 md:static md:col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeFromCart(item._cartId)}
                      className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Summary */}
          <div className="p-8 bg-slate-950 rounded-[40px] text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  <TrendingDown size={14} /> Matrix Discount Applied
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter">Yield Saved: <span className="text-emerald-400">₹{savings.toLocaleString()}</span></h2>
                <p className="text-slate-400 text-sm font-semibold max-w-sm">Institutional batch pricing and multi-unit schemes have been validated for this deployment payload.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl backdrop-blur-xl border border-white/10 text-center min-w-[200px]">
                <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400 mb-2">Clinic Points</p>
                <p className="text-3xl font-black italic tracking-tighter text-white">+ {Math.floor(subtotal / 10)} PTS</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 space-y-10 sticky top-24 shadow-premium">
            <h2 className="text-2xl font-black text-slate-950 italic uppercase tracking-tighter border-b border-slate-50 pb-6 ml-1">Summary Matrix</h2>
            
            <div className="space-y-6">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> SHIPMENT NODE
                  </p>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                    <p className="text-sm font-black text-slate-950 uppercase italic tracking-tight">{user?.clinicName || 'Operational Hub'}</p>
                    <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">{user?.address || 'Mumbai Cluster, Maharashtra'}</p>
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-slate-50 space-y-4">
              <div className="flex justify-between text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <span>Base Load Value</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <span>Node Logistics</span>
                <span className="text-emerald-600 italic">SECURE & FREE</span>
              </div>
              <div className="h-px bg-slate-50 w-full"></div>
              <div className="flex justify-between text-3xl font-black italic text-slate-950 tracking-tighter">
                <span>TOTAL</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 transition-all active:scale-95"
            >
              PROCEED TO PAYLOAD
              <ArrowRight size={20} />
            </button>
            
            <div className="flex items-center justify-center gap-3 opacity-30 grayscale">
               <ShieldCheck size={20} />
               <Package size={20} />
               <Truck size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

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
  MessageCircle,
  Truck,
  Tag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SchemeBadge from '../components/common/SchemeBadge';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, getFinalItemPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  const totalMRP = cart.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = totalMRP - subtotal;

  const handleCheckout = () => {
    navigate('/checkout', { state: { orderNote } });
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
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-green tracking-tight">Ayuone Cart</h1>
        <Link to="/products" className="text-brand-green font-bold hover:underline flex items-center gap-1 text-sm">
          <Plus size={18} /> Add Medicines
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden md:grid grid-cols-12 gap-4">
              <div className="col-span-6">Medicine Details</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            <div className="divide-y divide-slate-50">
              {cart.map(item => (
                <div key={item._cartId} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group relative">
                  <div className="col-span-1 md:col-span-6 flex gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-slate-50 p-1 md:p-2">
                      <img loading="lazy" src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      <p className="text-[8px] md:text-[10px] font-bold text-brand-green uppercase tracking-wider">{item.brand || 'Ayuone'}</p>
                      <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-2 tracking-tight leading-tight">{item.name}</h3>
                      <p className="text-[10px] md:text-xs text-slate-400 font-medium">₹{item.price} / unit</p>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
                    <div className="inline-flex items-center gap-3 px-2 md:px-3 py-1 md:py-1.5 bg-slate-50 rounded-lg md:rounded-xl border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item._cartId, item.quantity - 1)}
                        className="p-1 text-slate-400 hover:text-brand-green transition-all"
                      >
                        <Minus size={12} className="md:w-3.5 md:h-3.5" />
                      </button>
                      <span className="text-sm md:text-base font-bold text-slate-900 w-5 md:w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._cartId, item.quantity + 1)}
                        className="p-1 text-slate-400 hover:text-brand-green transition-all"
                      >
                        <Plus size={12} className="md:w-3.5 md:h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end gap-2 md:gap-4">
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                    <div className="text-right">
                       <p className="text-base md:text-lg font-bold text-slate-900 tracking-tight">₹{(getFinalItemPrice(item) * item.quantity).toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._cartId)}
                      className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Section - From Image */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-4 md:p-6 flex flex-col md:flex-row gap-3 md:gap-4 items-center">
             <div className="relative flex-grow w-full">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Enter Coupon Code" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:outline-none focus:border-brand-green/30 font-bold text-sm"
                />
             </div>
             <button className="w-full md:w-auto btn-primary !bg-brand-green !px-10 !py-3">Apply Coupon</button>
          </div>

          {/* User Request Note Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
             <div className="flex items-center gap-2 text-slate-900 font-bold">
                <MessageCircle size={20} className="text-brand-green" />
                <h3>Add a Request / Note (Optional)</h3>
             </div>
             <textarea 
               placeholder="Write any special requests, delivery instructions, or SMS message here..." 
               value={orderNote}
               onChange={(e) => setOrderNote(e.target.value)}
               className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-brand-green/30 resize-none h-24"
             ></textarea>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-8 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Order Summary</h2>
            
            <div className="space-y-4">
               <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Savings</span>
                  <span className="text-emerald-600">- ₹{savings.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
               </div>
               <div className="h-px bg-slate-50 w-full"></div>
               <div className="flex justify-between text-2xl font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString()}</span>
               </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn-primary !bg-brand-green !py-4 !rounded-2xl !text-sm"
            >
              Proceed to Checkout
              <ArrowRight size={20} className="ml-2" />
            </button>
            
            <div className="flex items-center justify-center gap-4 py-2">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-brand-green" /> Secure
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Truck size={14} className="text-brand-green" /> Fast Delivery
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Cart;

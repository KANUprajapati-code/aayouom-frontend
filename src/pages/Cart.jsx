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

  const handleWhatsAppCheckout = () => {
    const whatsappNumber = "917990411390"; // Updated from USER_REQUEST
    let message = `*New Order from ${user?.clinicName || 'Clinic'}*\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Grand Total: ₹${subtotal.toLocaleString()}*`;
    message += `\n\nAddress: ${user?.address || 'Mumbai, Maharashtra'}`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
          <p className="text-text-muted mt-1">Review your professional order and savings before checkout.</p>
        </div>
        <Link to="/products" className="text-primary-600 font-bold hover:underline mb-1 flex items-center gap-1">
          <Plus size={18} /> Add More
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          <div className="card !p-0 overflow-hidden">
            <div className="p-4 bg-surface-light border-b border-surface-border text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:grid grid-cols-12 gap-4">
              <div className="col-span-6">Medicine Details</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-slate-50">
              {cart.map(item => (
                <div key={item._id} className="p-4 md:p-6 grid md:grid-cols-12 gap-6 items-center group">
                  <div className="col-span-6 flex gap-4">
                    <div className="w-20 h-20 bg-surface-light rounded-xl overflow-hidden shrink-0">
                      <img loading="lazy" src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{item.brand}</p>
                      <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <SchemeBadge scheme={item.scheme} type='green' />
                        <span className="text-[10px] font-bold text-secondary-600">₹{item.price} / unit</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 flex justify-center">
                    <div className="inline-flex items-center gap-3 p-1 bg-surface-light rounded-xl border border-surface-border">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white hover:text-red-600 rounded-lg transition-all shadow-sm"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-bold text-slate-900 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white hover:text-primary-600 rounded-lg transition-all shadow-sm"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <p className="text-[10px] text-text-muted line-through">₹{(item.mrp * item.quantity).toLocaleString()}</p>
                    <p className="text-base font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="p-6 bg-secondary-900 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl -u-translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-500/20 border border-secondary-500/30 text-[10px] font-bold uppercase tracking-widest">
                  <TrendingDown size={14} />
                  Professional Savings
                </div>
                <h2 className="text-2xl font-bold">You're saving ₹{savings.toLocaleString()} on this order</h2>
                <p className="text-secondary-200 text-sm">Bulk schemes and doctor-exclusive discounts applied automatically.</p>
              </div>
              <div className="w-full md:w-auto p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 text-center">
                <p className="text-[10px] uppercase font-bold tracking-widest text-secondary-300 mb-1">Clinic Wallet Points</p>
                <p className="text-2xl font-black">+ {Math.floor(subtotal / 10)} pts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card !p-8 space-y-8 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 border-b border-surface-border pb-4">Checkout Details</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MapPin size={14} /> Delivery Address
                </p>
                <div className="p-3 bg-surface-light rounded-2xl border border-surface-border group cursor-pointer hover:border-primary-200 transition-all">
                  <p className="text-sm font-bold text-slate-800">{user?.clinicName || 'Your Clinic'}</p>
                  <p className="text-xs text-text-muted mt-1">{user?.address || 'Mumbai, Maharashtra, India'}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CreditCard size={14} /> Payment Method
                </p>
                <div className="p-3 bg-surface-light rounded-2xl border border-surface-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-slate-200 rounded-md"></div>
                    <span className="text-sm font-bold text-slate-800">Cash on Delivery</span>
                  </div>
                  <button className="text-[10px] font-bold text-primary-600 hover:underline">Change</button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-surface-border space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-text-muted">Total Points Earned</span>
                <span className="font-bold text-secondary-600">{Math.floor(subtotal / 10)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-slate-900">
                <span>Grand Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppCheckout}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-premium transition-all active:scale-95"
            >
              Order on WhatsApp
              <MessageCircle size={20} />
            </button>
            
            <p className="text-[10px] text-center text-text-muted leading-relaxed">
              Standard professional delivery (24-48 hours) applied for verified medical licenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

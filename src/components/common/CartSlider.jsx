import React from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartSlider = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, isCartSliderOpen, setIsCartSliderOpen } = useCart();
  const navigate = useNavigate();

  if (!isCartSliderOpen) return null;

  return (
    <>
      {/* Dark Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={() => setIsCartSliderOpen(false)}
      ></div>

      {/* Slider Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-surface-border flex items-center justify-between bg-surface-light">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                 <ShoppingCart size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Your Cart</h2>
           </div>
           <button 
             onClick={() => setIsCartSliderOpen(false)}
             className="p-3 bg-white hover:bg-rose-500 hover:text-white transition-all rounded-xl text-slate-400 group border border-slate-100 shadow-sm"
           >
             <X size={20} className="group-hover:rotate-90 transition-transform" />
           </button>
        </div>

        {/* Cart Items Mapping */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-slate-100 shadow-sm text-slate-300">
                <ShoppingCart size={40} />
              </div>
              <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Your Cart is Empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-3xl border border-surface-border shadow-sm flex gap-4 items-center">
                 <div className="w-20 h-20 bg-surface-light rounded-2xl flex items-center justify-center p-2 shrink-0 border border-slate-50">
                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary-600 truncate">{item.category}</p>
                    <p className="text-sm font-black text-slate-800 leading-tight truncate mt-0.5">{item.name}</p>
                    <div className="flex items-center justify-between mt-3">
                       <p className="font-black text-emerald-600 text-lg">₹{item.price * item.quantity}</p>
                       <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1, item.stock)}
                            className="p-1.5 text-slate-400 hover:bg-white hover:text-primary-600 rounded-lg transition-all shadow-sm"
                          ><Minus size={14} /></button>
                          <span className="text-xs font-black w-6 text-center text-slate-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1, item.stock)}
                            className="p-1.5 text-slate-400 hover:bg-white hover:text-primary-600 rounded-lg transition-all shadow-sm"
                          ><Plus size={14} /></button>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => removeFromCart(item._id)}
                   className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors shrink-0"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-surface-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
             <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                <span className="text-3xl font-black text-slate-900">₹{subtotal.toFixed(2)}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setIsCartSliderOpen(false);
                  }}
                  className="py-4 border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                >
                   Continue Shopping
                </button>
                <button 
                  onClick={() => {
                    setIsCartSliderOpen(false);
                    navigate('/cart');
                  }}
                  className="py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20"
                >
                   Checkout Direct
                </button>
             </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSlider;

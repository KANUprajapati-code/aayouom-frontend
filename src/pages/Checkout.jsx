import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  CreditCard, 
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ChevronLeft,
  Smartphone,
  Info,
  Clock,
  Circle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD or Prepaid

  const [shippingData, setShippingData] = useState({
    customerName: user?.clinicName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cart, orderSuccess, navigate]);

  const handlePlaceOrder = async () => {
    if (!shippingData.customerName || !shippingData.phone || !shippingData.address) {
      alert("Please fill all shipping details.");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerName: shippingData.customerName,
        phone: shippingData.phone,
        address: shippingData.address,
        products: cart.map(item => ({
          productId: item._id,
          name: item.name,
          variantName: item.selectedVariant?.name || '',
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: subtotal,
        paymentMethod: paymentMethod,
        status: 'Pending'
      };

      const { data } = await axios.post('https://ayuom-backend.vercel.app/api/orders', orderPayload, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-10">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <div className="space-y-4">
           <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">Mission Success!</h1>
           <p className="text-slate-500 font-bold leading-relaxed">Your professional order has been registered in the AYUOM matrix. Our logistics node will contact you shortly for dispatch verification.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <button onClick={() => navigate('/orders')} className="py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">Track Order</button>
           <button onClick={() => navigate('/products')} className="py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">Continue Hub</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
         <div className="space-y-1">
            <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all mb-4">
               <ChevronLeft size={14} /> Back to Payload
            </button>
            <h1 className="text-4xl font-black text-slate-950 italic tracking-tighter uppercase">Final Validation</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] ml-1">Secure Institutional Checkout</p>
         </div>
         <div className="flex items-center gap-3 bg-blue-50 px-6 py-4 rounded-[28px] border border-blue-100">
            <ShieldCheck className="text-blue-600" size={24} />
            <div>
               <p className="text-xs font-black text-slate-900 leading-none">Encrypted Matrix</p>
               <p className="text-[10px] text-blue-600/60 mt-1 font-bold">256-BIT SSL PROTECTED</p>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-10">
          
          {/* Shipping Node */}
          <section className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-10 space-y-8 shadow-premium">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100">
                   <MapPin size={24} />
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-tight">Deployment Node (Shipping)</h2>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinic / Customer Name</label>
                   <input 
                     type="text" 
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-black text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                     placeholder="Enter clinic name..."
                     value={shippingData.customerName}
                     onChange={e => setShippingData({...shippingData, customerName: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Channel (Phone)</label>
                   <input 
                     type="text" 
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-black text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                     placeholder="+91 XXXXXXXXXX"
                     value={shippingData.phone}
                     onChange={e => setShippingData({...shippingData, phone: e.target.value})}
                   />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Node (Detailed Address)</label>
                   <textarea 
                     rows="3"
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-black text-sm focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                     placeholder="Complete clinical address for delivery..."
                     value={shippingData.address}
                     onChange={e => setShippingData({...shippingData, address: e.target.value})}
                   />
                </div>
             </div>
          </section>

          {/* Payment Matrix */}
          <section className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-10 space-y-8 shadow-premium">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100">
                   <CreditCard size={24} />
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-tight">Settlement Matrix (Payment)</h2>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <button 
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-6 rounded-[32px] border-2 text-left transition-all relative group overflow-hidden ${
                    paymentMethod === 'COD' ? 'border-slate-900 bg-slate-900 text-white shadow-2xl' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                   <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                      <div className="flex items-center justify-between">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                            <Smartphone size={20} />
                         </div>
                         {paymentMethod === 'COD' ? <CheckCircle2 size={20} className="text-blue-400" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>}
                      </div>
                      <div>
                         <p className="font-black italic uppercase text-sm tracking-tight">Cash on Delivery</p>
                         <p className={`text-[10px] font-bold mt-1 ${paymentMethod === 'COD' ? 'text-slate-400' : 'text-slate-400'}`}>SETTLE UPON RECEIPT</p>
                      </div>
                   </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('Prepaid')}
                  className={`p-6 rounded-[32px] border-2 text-left transition-all relative group overflow-hidden ${
                    paymentMethod === 'Prepaid' ? 'border-blue-600 bg-blue-600 text-white shadow-2xl' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                   <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                      <div className="flex items-center justify-between">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'Prepaid' ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                            <Zap size={20} />
                         </div>
                         {paymentMethod === 'Prepaid' ? <CheckCircle2 size={20} className="text-white" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>}
                      </div>
                      <div>
                         <p className="font-black italic uppercase text-sm tracking-tight">Prepaid (Institutional)</p>
                         <p className={`text-[10px] font-bold mt-1 ${paymentMethod === 'Prepaid' ? 'text-blue-100' : 'text-slate-400'}`}>FASTER DISPATCH NODE</p>
                      </div>
                   </div>
                </button>
             </div>

             <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-4">
                <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 font-bold leading-relaxed italic">
                   Note: Institutional prepaid orders receive priority allocation in high-demand cycles. COD validation involves a mandatory confirmation ping from our node admins.
                </p>
             </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-premium sticky top-24 space-y-8">
              <h2 className="text-xl font-black italic uppercase tracking-tight pb-6 border-b border-slate-50">Payload Summary</h2>
              
              <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar pr-2">
                 {cart.map(item => (
                   <div key={item._cartId} className="flex justify-between gap-4">
                      <div className="flex gap-3">
                         <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 p-2">
                            <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs font-black text-slate-900 leading-tight line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.quantity} units</p>
                         </div>
                      </div>
                      <div className="text-sm font-black text-slate-900 tracking-tight">₹{(item.price * item.quantity).toLocaleString()}</div>
                   </div>
                 ))}
              </div>

              <div className="pt-8 space-y-4 border-t border-slate-50 text-sm">
                 <div className="flex justify-between text-slate-400 font-bold">
                    <span>Base Value</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-slate-400 font-bold">
                    <span>Node Logistics</span>
                    <span className="text-emerald-600 uppercase">FREE</span>
                 </div>
                 <div className="h-px bg-slate-50 w-full"></div>
                 <div className="flex justify-between text-2xl font-black italic text-slate-950 tracking-tighter">
                    <span>GRAND TOTAL</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <button 
                   onClick={handlePlaceOrder}
                   disabled={loading}
                   className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                 >
                    {loading ? 'VALIDATING...' : 'EXECUTE ORDER'}
                    {!loading && <ArrowRight size={18} />}
                 </button>
                 <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock size={12} /> PROCESSING IN <span className="text-blue-600">~24 HOURS</span>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 opacity-20 rounded-full blur-2xl translate-y-1/2 translate-x-1/2"></div>
              <div className="flex items-center gap-3">
                 <Truck size={24} className="text-blue-400" />
                 <h4 className="font-black italic uppercase italic">Last Mile Protocol</h4>
              </div>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">Orders are fulfilled via our specialized medical logistics nodes. Temperature control and clinical integrity maintained throughout transit.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

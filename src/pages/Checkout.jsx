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
  Plus,
  Home,
  Briefcase,
  ChevronRight,
  Check,
  CreditCard as PaymentIcon,
  Trash2,
  Gift
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const SHIPPING_CHARGE = 50;
const COD_CHARGE = 50;

const Checkout = () => {
  const { cart, subtotal, clearCart, getFinalItemPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const orderNote = location.state?.orderNote || '';
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Prepaid'); // Default to Prepaid
  const [userProfile, setUserProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [useWalletPoints, setUseWalletPoints] = useState(false);
  
  const finalCodCharge = paymentMethod === 'COD' ? COD_CHARGE : 0;
  const rawTotal = subtotal + SHIPPING_CHARGE + finalCodCharge;
  const walletDiscount = useWalletPoints ? Math.min(wallet?.points || 0, rawTotal) : 0;
  const finalPayableAmount = rawTotal - walletDiscount;
  
  const [newAddress, setNewAddress] = useState({
    customerName: '',
    doctorName: '',
    patientName: '',
    phone: '',
    fullAddress: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [profileRes, walletRes] = await Promise.all([
          axios.get('https://ayuone-backend.vercel.app/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('https://ayuone-backend.vercel.app/api/wallet/my-wallet', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { points: 0 } }))
        ]);

        setUserProfile(profileRes.data);
        setWallet(walletRes.data);

        if (profileRes.data.addresses && profileRes.data.addresses.length > 0) {
          const defaultAddr = profileRes.data.addresses.find(a => a.isDefault) || profileRes.data.addresses[0];
          setSelectedAddress(defaultAddr);
        } else {
          setShowAddressForm(true);
        }
      } catch (err) {
        console.error('Error fetching checkout data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cart, orderSuccess, navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.customerName || !newAddress.phone || !newAddress.fullAddress) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://ayuone-backend.vercel.app/api/auth/address', newAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile({ ...userProfile, addresses: response.data });
      setSelectedAddress(response.data[response.data.length - 1]);
      setShowAddressForm(false);
      setNewAddress({ customerName: '', phone: '', fullAddress: '', city: '', state: '', pincode: '', isDefault: false });
    } catch (err) {
      console.error('Failed to add address:', err);
      alert('Failed to save address.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (e, addressId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`https://ayuone-backend.vercel.app/api/auth/address/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile({ ...userProfile, addresses: response.data });
      if (selectedAddress?._id === addressId) {
         setSelectedAddress(response.data.length > 0 ? response.data[0] : null);
      }
    } catch (err) {
      console.error('Failed to delete address:', err);
      alert('Failed to delete address. Please try again.');
    }
  };

  const calculateTotal = () => {
    let total = subtotal + SHIPPING_CHARGE;
    if (paymentMethod === 'COD') {
      total += COD_CHARGE;
    }
    return total;
  };

  const [orderRole, setOrderRole] = useState('Patient'); // 'Patient' or 'Doctor'

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select or add a shipping address.");
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerName: selectedAddress.customerName,
        phone: selectedAddress.phone,
        address: `${selectedAddress.fullAddress}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode} (Doctor: ${selectedAddress.doctorName || 'N/A'}, Patient: ${selectedAddress.patientName || 'N/A'})`,
        products: cart.map(item => ({
          productId: item._id,
          name: item.name,
          variantName: item.selectedVariant?.name || '',
          quantity: item.quantity,
          price: getFinalItemPrice(item)
        })),
        totalAmount: finalPayableAmount,
        shippingCharge: SHIPPING_CHARGE,
        codCharge: finalCodCharge,
        paymentMethod: paymentMethod,
        pointsUsed: walletDiscount,
        orderNote: orderNote,
        orderRole: orderRole, // New field
        status: 'Pending'
      };

      // 1. Save to Database
      await axios.post('https://ayuone-backend.vercel.app/api/orders', orderPayload, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // 2. Construct WhatsApp Message
      const whatsappNumber = "919265401508"; 
      let message = `*📦 New Order from Ayuone*\n`;
      message += `--------------------------\n`;
      message += `*Order For:* ${orderRole.toUpperCase()}\n`; // Added Role
      message += `*Customer:* ${selectedAddress.customerName}\n`;
      message += `*Phone:* ${selectedAddress.phone}\n`;
      message += `*Address:* ${selectedAddress.fullAddress}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}\n`;
      if (selectedAddress.doctorName) message += `*Doctor:* ${selectedAddress.doctorName}\n`;
      message += `\n*Items:*\n`;
      
      cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.selectedVariant?.name || 'Standard'}) x ${item.quantity} = ₹${(getFinalItemPrice(item) * item.quantity).toLocaleString()}\n`;
      });

      message += `\n*Summary:*\n`;
      message += `Subtotal: ₹${subtotal.toLocaleString()}\n`;
      message += `Shipping: ₹${SHIPPING_CHARGE}\n`;
      if (paymentMethod === 'COD') message += `COD Fee: ₹${COD_CHARGE}\n`;
      if (walletDiscount > 0) message += `Wallet Discount: -₹${walletDiscount}\n`;
      message += `*Total Payable: ₹${finalPayableAmount.toLocaleString()}*\n`;
      message += `\n*Payment Method:* ${paymentMethod}\n`;
      if (orderNote) message += `*Note:* ${orderNote}\n`;
      message += `--------------------------\n`;
      message += `_Sent from Ayuone Marketplace_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // 3. Clear Cart and Update State
      setOrderSuccess(true);
      clearCart();

      // 4. Redirect to WhatsApp (wait slightly for state update)
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);

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
           <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Order Confirmed!</h1>
           <p className="text-slate-500 font-bold leading-relaxed text-base md:text-lg">Thank you for your order. We've received it and will start processing it right away.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <button onClick={() => navigate('/orders')} className="py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-black transition-all">Track Order</button>
           <button onClick={() => navigate('/products')} className="py-3 md:py-4 bg-white text-slate-900 border border-slate-200 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-slate-50 transition-all">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Step Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/cart')} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <ChevronLeft size={24} className="text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-900">Checkout</h1>
                <p className="md:hidden text-[10px] font-bold text-primary-600 uppercase tracking-widest">Step {currentStep} of 3</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    currentStep >= step ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-200 text-slate-400'
                  }`}>
                    {currentStep > step ? <Check size={16} /> : step}
                  </div>
                  <span className={`text-sm font-bold ${currentStep >= step ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step === 1 ? 'Address' : step === 2 ? 'Payment' : 'Review'}
                  </span>
                  {step < 3 && <ChevronRight size={16} className="text-slate-300" />}
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               <ShieldCheck className="text-emerald-600" size={16} />
               <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 px-4 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Address */}
          <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm transition-all overflow-hidden ${currentStep !== 1 ? 'opacity-80' : ''}`}>
             <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <h2 className="text-lg font-black text-slate-900">1. Delivery Address</h2>
                      {currentStep > 1 && selectedAddress && (
                        <p className="text-xs text-slate-500 font-medium truncate max-w-xs">{selectedAddress.customerName}, {selectedAddress.fullAddress}</p>
                      )}
                   </div>
                </div>
                {currentStep > 1 && (
                  <button onClick={() => setCurrentStep(1)} className="text-sm font-bold text-primary-600 hover:underline">Change</button>
                )}
             </div>

             <AnimatePresence>
               {currentStep === 1 && (
                 <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="p-6 md:p-8 space-y-6">
                    {userProfile?.addresses?.length > 0 && !showAddressForm && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {userProfile.addresses.map((addr, i) => (
                          <div 
                            key={i}
                            onClick={() => setSelectedAddress(addr)}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                              selectedAddress === addr ? 'border-primary-600 bg-primary-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                          >
                             {selectedAddress === addr && (
                               <div className="absolute top-4 right-4 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white">
                                 <Check size={12} strokeWidth={4} />
                               </div>
                             )}
                             <div className="flex items-start gap-3 mb-3">
                                {addr.fullAddress.toLowerCase().includes('office') ? <Briefcase size={16} className="text-slate-400 mt-1" /> : <Home size={16} className="text-slate-400 mt-1" />}
                                <div>
                                   <p className="font-bold text-slate-900">{addr.customerName}</p>
                                   <p className="text-[10px] text-brand-green font-bold uppercase tracking-wider">Doc: {addr.doctorName || 'N/A'} | Pat: {addr.patientName || 'N/A'}</p>
                                </div>
                             </div>
                             <p className="text-xs text-slate-500 leading-relaxed mb-4">{addr.fullAddress}, {addr.city}, {addr.state} - {addr.pincode}</p>
                             <div className="flex items-center justify-between mt-2">
                               <p className="text-xs font-bold text-slate-900">Phone: {addr.phone}</p>
                               <button 
                                 onClick={(e) => handleDeleteAddress(e, addr._id)}
                                 className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                 title="Delete Address"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => setShowAddressForm(true)}
                          className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50/20 transition-all text-slate-400 hover:text-primary-600 group"
                        >
                           <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                           <span className="text-sm font-bold">Add New Address</span>
                        </button>
                      </div>
                    )}

                    {showAddressForm && (
                      <form onSubmit={handleAddAddress} className="space-y-4">
                         <div className="grid md:grid-cols-2 gap-4">
                            <input 
                              type="text" 
                              placeholder="Receiver's Name *" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                              value={newAddress.customerName}
                              onChange={e => setNewAddress({...newAddress, customerName: e.target.value})}
                              required
                            />
                            <input 
                              type="tel" 
                              placeholder="Phone Number *" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                              value={newAddress.phone}
                              onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                              required
                            />
                            <input 
                              type="text" 
                              placeholder="Doctor's Name" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                              value={newAddress.doctorName}
                              onChange={e => setNewAddress({...newAddress, doctorName: e.target.value})}
                            />
                            <input 
                              type="text" 
                              placeholder="Patient's Name" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                              value={newAddress.patientName}
                              onChange={e => setNewAddress({...newAddress, patientName: e.target.value})}
                            />
                         </div>
                         <textarea 
                           placeholder="Detailed Address (House No, Building, Street) *" 
                           rows="3"
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                           value={newAddress.fullAddress}
                           onChange={e => setNewAddress({...newAddress, fullAddress: e.target.value})}
                           required
                         />
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <input 
                              type="text" 
                              placeholder="City *" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                              value={newAddress.city}
                              onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                            />
                            <input 
                              type="text" 
                              placeholder="State *" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                              value={newAddress.state}
                              onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                            />
                            <input 
                              type="text" 
                              placeholder="Pincode *" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                              value={newAddress.pincode}
                              onChange={e => setNewAddress({...newAddress, pincode: e.target.value})}
                            />
                         </div>
                         <div className="flex gap-3 pt-2">
                            <button 
                              type="button" 
                              onClick={() => setShowAddressForm(false)}
                              className="px-6 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              disabled={loading}
                              className="px-8 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 disabled:opacity-50"
                            >
                              {loading ? 'Saving...' : 'Save & Deliver Here'}
                            </button>
                         </div>
                      </form>
                    )}

                    {!showAddressForm && (
                      <div className="pt-4 flex justify-end">
                         <button 
                           onClick={() => {
                             if (!selectedAddress) alert('Please select an address');
                             else setCurrentStep(2);
                           }}
                           className="btn-primary px-10 py-3 rounded-2xl flex items-center gap-2 group"
                         >
                            Continue to Payment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    )}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Step 2: Payment */}
          <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm transition-all overflow-hidden ${currentStep < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                      <PaymentIcon size={20} />
                   </div>
                   <div>
                      <h2 className="text-lg font-black text-slate-900">2. Payment Method</h2>
                      {currentStep > 2 && (
                        <p className="text-xs text-slate-500 font-medium">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid Payment'}</p>
                      )}
                   </div>
                </div>
                {currentStep > 2 && (
                  <button onClick={() => setCurrentStep(2)} className="text-sm font-bold text-primary-600 hover:underline">Change</button>
                )}
             </div>

             <AnimatePresence>
               {currentStep === 2 && (
                 <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="p-6 md:p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <button 
                         onClick={() => setPaymentMethod('COD')}
                         className={`p-6 rounded-3xl border-2 text-left transition-all relative ${
                           paymentMethod === 'COD' ? 'border-primary-600 bg-primary-50/50' : 'border-slate-100 bg-white hover:border-slate-200'
                         }`}
                       >
                          <div className="flex items-center justify-between mb-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <Smartphone size={24} />
                             </div>
                             {paymentMethod === 'COD' && <CheckCircle2 size={24} className="text-primary-600" />}
                          </div>
                          <h3 className="font-black text-slate-900 mb-1">Cash on Delivery</h3>
                          <p className="text-xs text-slate-500 font-medium">Extra ₹{COD_CHARGE} handling fee applies</p>
                          {paymentMethod === 'COD' && (
                            <div className="mt-4 p-3 bg-white border border-primary-100 rounded-xl text-[10px] font-bold text-primary-700 uppercase tracking-wider flex items-center gap-2">
                               <Info size={14} /> PAY WHEN YOU RECEIVE
                            </div>
                          )}
                       </button>

                       <button 
                         onClick={() => setPaymentMethod('Prepaid')}
                         className={`p-6 rounded-3xl border-2 text-left transition-all relative ${
                           paymentMethod === 'Prepaid' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-100 bg-white hover:border-slate-200'
                         }`}
                       >
                          <div className="flex items-center justify-between mb-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'Prepaid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <CreditCard size={24} />
                             </div>
                             {paymentMethod === 'Prepaid' && <CheckCircle2 size={24} className="text-emerald-600" />}
                          </div>
                          <h3 className="font-black text-slate-900 mb-1">Online Payment</h3>
                          <p className="text-xs text-slate-500 font-medium">Faster processing & no extra fees</p>
                          {paymentMethod === 'Prepaid' && (
                            <div className="mt-4 p-3 bg-white border border-emerald-100 rounded-xl text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                               <CheckCircle2 size={14} /> ₹{COD_CHARGE} SAVED!
                            </div>
                          )}
                       </button>
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                       <button onClick={() => setCurrentStep(1)} className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2">
                          <ChevronLeft size={18} /> Back to Address
                       </button>
                       <button 
                         onClick={() => setCurrentStep(3)}
                         className="btn-primary px-10 py-3 rounded-2xl flex items-center gap-2 group"
                       >
                          Review Order <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Step 3: Review */}
          <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm transition-all overflow-hidden ${currentStep < 3 ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="p-6 md:p-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <Package size={20} />
                   </div>
                   <h2 className="text-lg font-black text-slate-900">3. Review Items</h2>
                </div>
             </div>

             <AnimatePresence>
               {currentStep === 3 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="p-6 md:p-8 space-y-8">
                     {/* Order Role Toggle */}
                     <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Who is this order for?</p>
                        <div className="flex p-1 bg-white border border-slate-200 rounded-2xl w-full max-w-sm">
                           <button 
                             onClick={() => setOrderRole('Patient')}
                             className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                               orderRole === 'Patient' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:text-slate-600'
                             }`}
                           >
                             Patient
                           </button>
                           <button 
                             onClick={() => setOrderRole('Doctor')}
                             className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                               orderRole === 'Doctor' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-600'
                             }`}
                           >
                             Doctor
                           </button>
                        </div>
                     </div>

                     <div className="space-y-4">
                       {cart.map((item, idx) => (
                         <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-20 h-20 bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                               <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-grow space-y-1">
                               <h4 className="text-sm font-black text-slate-900 leading-tight">{item.name}</h4>
                               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.selectedVariant?.name} • {item.quantity} Units</p>
                               <div className="pt-2 flex items-center justify-between">
                                  <p className="text-sm font-black text-slate-900">₹{(getFinalItemPrice(item) * item.quantity).toLocaleString()}</p>
                                  <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                     SECURE PACKING
                                  </div>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start">
                       <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-2xl border border-primary-100 max-w-md">
                          <Truck className="text-primary-600 shrink-0 mt-1" size={24} />
                          <div>
                             <p className="text-xs font-black text-primary-900 uppercase tracking-widest mb-1">Estimated Delivery</p>
                             <p className="text-sm font-bold text-primary-700">Expect delivery between <span className="underline">3-5 business days</span> at your selected node.</p>
                          </div>
                       </div>
                       
                       <div className="w-full md:w-auto flex flex-col gap-3">
                          <button onClick={() => setCurrentStep(2)} className="text-center text-sm font-bold text-slate-500 hover:text-slate-900">
                             Go Back to Payment
                          </button>
                          <button 
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full md:w-64 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                          >
                             {loading ? 'CONFIRMING...' : 'CONFIRM ORDER'}
                             {!loading && <ArrowRight size={20} />}
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* Price Sidebar */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-xl shadow-slate-200/50 sticky top-24 space-y-8">
              <h3 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase border-b border-slate-50 pb-4">Price Breakdown</h3>
              
              <div className="space-y-4">
                 <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>Order Subtotal</span>
                    <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span className="flex items-center gap-2">Logistics Fee <Info size={14} className="text-slate-300" /></span>
                    <span className="text-slate-900">₹{SHIPPING_CHARGE}</span>
                 </div>
                 {paymentMethod === 'COD' && (
                   <div className="flex justify-between text-sm font-bold text-slate-500 animate-in fade-in slide-in-from-right-2 duration-300">
                      <span className="flex items-center gap-2 text-amber-600">COD Handling Fee <Smartphone size={14} /></span>
                      <span className="text-amber-600">₹{COD_CHARGE}</span>
                   </div>
                 )}
                  {wallet && (
                    <div className="flex flex-col gap-3 mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-1.5">
                            <Gift size={14} className="text-amber-500" /> Loyalty Points
                          </span>
                          <span className="text-xs font-black text-slate-900 mt-0.5">
                            {wallet.points || 0} Pts Available
                          </span>
                        </div>
                        {(wallet.points || 0) > 0 ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={useWalletPoints} 
                              onChange={() => setUseWalletPoints(!useWalletPoints)} 
                            />
                            <div className="w-11 h-6 bg-emerald-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                          </label>
                        ) : (
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white/60 px-2 py-1 rounded-md border border-slate-100">Zero</span>
                        )}
                      </div>
                      
                      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                         <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-tighter">1 Point = ₹1 Discount</span>
                         {wallet.balance > 0 && (
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                               Cash: ₹{wallet.balance}
                            </span>
                         )}
                      </div>
                    </div>
                  )}
                 {useWalletPoints && walletDiscount > 0 && (
                   <div className="flex justify-between text-sm font-bold text-emerald-600 animate-in fade-in slide-in-from-right-2 duration-300">
                      <span>Wallet Discount Used</span>
                      <span>-₹{walletDiscount}</span>
                   </div>
                 )}
                 <div className="h-px bg-slate-100 w-full my-2"></div>
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payable Amount</p>
                       <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{finalPayableAmount.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                          TOTAL SAVINGS: ₹{Math.floor(subtotal * 0.15 + walletDiscount).toLocaleString()}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Secure Checkout Badge */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                       <ShieldCheck size={18} />
                    </div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Ayuone Secure Shield</p>
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Your professional credentials and payment data are encrypted using 256-bit institutional protocols.</p>
              </div>

              {/* Dynamic Action Button based on step */}
              {currentStep < 3 && (
                <button 
                  onClick={() => {
                    if (currentStep === 1 && !selectedAddress) alert('Please select an address');
                    else setCurrentStep(currentStep + 1);
                  }}
                  className="w-full py-5 bg-slate-900 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 transition-all hover:bg-black"
                >
                   NEXT STEP: {currentStep === 1 ? 'PAYMENT' : 'REVIEW'}
                   <ArrowRight size={18} />
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

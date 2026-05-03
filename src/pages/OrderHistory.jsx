import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Search,
  History,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState(() => {
    const cached = localStorage.getItem('orders_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(orders.length === 0);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://ayuom-backend.vercel.app/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
        localStorage.setItem('orders_cache', JSON.stringify(response.data));
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeStatusFilter === 'All' || order.status === activeStatusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Orders</h1>
          <p className="text-slate-500 font-medium mt-1">Track and manage your medical procurement history.</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Search your orders..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-green/30 focus:ring-4 focus:ring-brand-green/5 text-sm font-medium shadow-sm transition-all"
           />
        </div>
      </div>

      {/* Status Filters - As seen in image */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
         {['All', 'Pending', 'Delivered', 'Cancelled', 'Returned'].map(status => (
           <button 
             key={status}
             onClick={() => setActiveStatusFilter(status)}
             className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${status === activeStatusFilter ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}
           >
             {status}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all duration-500 group">
               {/* Product Image Section */}
               <div className="w-full md:w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-2 shrink-0 border border-slate-50">
                  {order.products?.[0]?.image ? (
                    <img src={order.products[0].image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Package size={40} className="text-slate-200" />
                  )}
               </div>

               {/* Order Info Section */}
               <div className="flex-grow space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">Order ID: #{order._id.slice(-6).toUpperCase()}</h3>
                      <p className="text-xs text-slate-400 font-medium">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-green/5 text-brand-green'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total:</p>
                      <p className="text-2xl font-bold text-slate-900 leading-none">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => toggleOrderDetails(order._id)}
                         className="btn-primary !py-2 !px-4 !text-[10px] !rounded-lg"
                       >
                          {expandedOrderId === order._id ? 'Close Details' : 'Track Order'}
                       </button>
                       <button 
                         onClick={() => toggleOrderDetails(order._id)}
                         className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                       >
                         {expandedOrderId === order._id ? <Clock size={18} className="text-brand-green" /> : <ChevronRight size={18} />}
                       </button>
                    </div>
                  </div>
               </div>

               {/* Expanded Details - Quick Overlay */}
               {expandedOrderId === order._id && (
                 <div className="w-full pt-6 border-t border-slate-100 mt-4 animate-in slide-in-from-top-2 space-y-6 md:col-span-2">
                    {/* Status Tracking Timeline */}
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Tracking</p>
                       <div className="flex items-center justify-between relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
                          
                          {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                             const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                             const currentIndex = statuses.indexOf(order.status || 'Pending');
                             const stepIndex = statuses.indexOf(step);
                             const isCompleted = stepIndex <= currentIndex;
                             const isCancelled = order.status === 'Cancelled';
                             
                             return (
                               <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all ${
                                    isCancelled ? 'bg-rose-500' : (isCompleted ? 'bg-brand-green' : 'bg-slate-200')
                                  }`}>
                                     {isCompleted && !isCancelled ? <CheckCircle2 size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-white"></div>}
                                  </div>
                                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>{isCancelled && idx === 3 ? 'Cancelled' : step}</span>
                               </div>
                             );
                          })}
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12}/> Shipping Details</p>
                          <p className="text-xs font-bold text-slate-900">{order.customerName}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{order.address}</p>
                          <p className="text-xs font-bold text-brand-green">Phone: {order.phone}</p>
                       </div>
                       
                       <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Package size={12}/> Order Items</p>
                          <div className="space-y-2">
                             {order.products?.map((item, i) => (
                               <div key={i} className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-slate-100">
                                  <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
                                       <img src={item.image || 'https://via.placeholder.com/50'} className="max-w-full max-h-full object-contain" alt=""/>
                                     </div>
                                     <span className="font-bold text-slate-700">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                                  </div>
                                  <span className="font-bold text-brand-green">₹{(item.price * item.quantity).toLocaleString()}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-[40px] border border-slate-100 text-center p-20 space-y-6">
             <Package className="mx-auto text-slate-100" size={80} />
             <div>
               <h3 className="text-2xl font-bold text-slate-900">No Orders Placed</h3>
               <p className="text-slate-500 font-medium mt-1">Start your procurement journey with Ayuone.</p>
             </div>
             <Link to="/products" className="btn-primary inline-flex items-center gap-2 mx-auto">
               Shop Marketplace <ArrowRight size={18} />
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

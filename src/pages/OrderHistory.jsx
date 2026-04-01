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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://ayuom-backend.vercel.app/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
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

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <History className="text-primary-600" size={32} />
            Order History
          </h1>
          <p className="text-text-muted mt-1">Manage and track your previous medical supplies orders.</p>
        </div>
        <div className="relative group">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600" size={18} />
           <input 
             type="text" 
             placeholder="Search by Order ID..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10 pr-4 py-2 bg-white border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
           />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order._id} className="card !p-0 overflow-hidden group hover:shadow-premium transition-all">
               <div className="p-4 md:p-6 bg-surface-light border-b border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex flex-wrap items-center gap-4 md:gap-8">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Order ID</p>
                     <p className="text-sm font-bold text-slate-900">{order._id.slice(-8).toUpperCase()}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Date</p>
                     <p className="text-sm font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Items</p>
                     <p className="text-sm font-bold text-slate-900">{order.products?.length || 0} Products</p>
                   </div>
                   <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
                   <div>
                     <p className="text-[10px] font-bold text-secondary-600 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
                        <TrendingDown size={10} /> Total Savings
                     </p>
                     <p className="text-sm font-black text-secondary-600">₹{Math.floor(order.totalAmount * 0.15).toLocaleString()}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${
                      order.status === 'Delivered' 
                        ? 'bg-secondary-50 text-secondary-600 border-secondary-100' 
                        : 'bg-primary-50 text-primary-600 border-primary-100'
                    }`}>
                      {order.status === 'Delivered' ? <CheckCircle2 size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                      {order.status}
                   </span>
                   <button className="btn-ghost p-2 rounded-xl">
                     <ChevronRight size={20} />
                   </button>
                 </div>
               </div>
               
               <div className="p-4 md:p-6 grid md:grid-cols-2 gap-6 items-start">
                  <div className="flex items-start gap-3">
                     <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                       <MapPin size={20} />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shipping To</p>
                       <p className="text-xs text-slate-900 font-medium">{order.address}</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-3">
                     <div className="text-right">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grand Total</p>
                       <p className="text-2xl font-black text-slate-900 leading-none">₹{order.totalAmount.toLocaleString()}</p>
                     </div>
                     <div className="flex gap-2 w-full md:w-auto">
                        <button className="btn-outline text-xs px-4 py-2 flex-grow">Track Order</button>
                        <button className="btn-primary text-xs px-4 py-2 flex-grow">Order Details</button>
                     </div>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="card text-center p-20 space-y-4">
             <Package className="mx-auto text-slate-200" size={64} />
             <div>
               <h3 className="text-xl font-bold text-slate-900">No Orders Found</h3>
               <p className="text-text-muted mt-1">You haven't placed any orders yet.</p>
             </div>
             <Link to="/products" className="btn-primary inline-flex items-center gap-2">
               Show Products <ArrowRight size={18} />
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

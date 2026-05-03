import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, Search, Clock, CheckCircle2, Truck, 
  MapPin, XCircle, RefreshCw, ChevronDown
} from 'lucide-react';
import API_BASE_URL from '../../config/api';

const OrdersCMS = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updating, setUpdating] = useState(null);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Assuming a generic GET /api/orders route for admin to fetch all orders
      const { data } = await axios.get(`${API_BASE_URL}/orders`, getAuthConfig());
      // Sort by newest first
      const sortedData = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedData);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status: newStatus }, getAuthConfig());
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.phone && order.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-blue-600" /> Order Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">Update order tracking status manually.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ID, Name, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button onClick={fetchOrders} className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', ...statuses].map(s => (
          <button 
            key={s} 
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-900">Order Info</th>
              <th className="p-4 font-bold text-slate-900">Customer</th>
              <th className="p-4 font-bold text-slate-900">Items & Total</th>
              <th className="p-4 font-bold text-slate-900">Tracking Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map(order => (
              <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase">Method: <span className="font-bold text-slate-600">{order.paymentMethod}</span></p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-900">{order.customerName}</p>
                  <p className="text-xs text-slate-500">{order.phone}</p>
                  <div className="flex items-start gap-1 mt-1">
                     <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                     <p className="text-[10px] text-slate-500 truncate max-w-[200px]" title={order.address}>{order.address}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-2 mb-2 max-h-32 overflow-y-auto pr-1">
                    {order.products?.map((item, idx) => {
                      const imageSrc = item.productId?.image || 'https://via.placeholder.com/50';
                      return (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center shrink-0 border border-slate-100">
                             <img src={imageSrc} alt="" className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 leading-tight truncate">{item.name || item.productId?.name}</p>
                            <div className="flex gap-2 items-center">
                              <p className="text-[10px] text-slate-500">Qty: <span className="font-bold">{item.quantity}</span></p>
                              <p className="text-[10px] text-brand-green font-bold">₹{item.price}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="font-bold text-slate-900 mt-2 border-t border-slate-100 pt-2">Total: ₹{(order.totalAmount || 0).toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <div className="relative inline-block w-40">
                    <select
                      disabled={updating === order._id}
                      value={order.status || 'Pending'}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`w-full appearance-none px-3 py-2 pr-8 rounded-lg text-xs font-bold uppercase tracking-wider border outline-none cursor-pointer disabled:opacity-50 transition-all ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        order.status === 'Shipped' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {updating === order._id && (
                    <span className="text-[9px] text-blue-600 block mt-1 animate-pulse font-bold">Updating...</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-500 font-medium">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersCMS;

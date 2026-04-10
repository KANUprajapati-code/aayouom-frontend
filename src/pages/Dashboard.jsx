import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  ArrowRight,
  ShieldCheck,
  Wallet,
  Gift,
  IndianRupee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MedicineCard from '../components/common/MedicineCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [ordersRes, walletRes] = await Promise.all([
          axios.get('https://ayuom-backend.vercel.app/api/orders/my-orders', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
          axios.get('http://localhost:5000/api/wallet/my-wallet', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: null }))
        ]);
        setOrders(ordersRes.data || []);
        setWallet(walletRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Calculate stats
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalSavings = Math.floor(totalAmount * 0.15); // Hypothetical 15% savings

  const stats = [
    { label: 'Total Orders', value: totalOrders.toString(), icon: Package, color: 'primary', trend: '+12%', trendUp: true },
    { label: 'Total Value', value: `₹${totalAmount.toLocaleString()}`, icon: TrendingUp, color: 'secondary', trend: '+8%', trendUp: true },
    { label: 'Est. Savings', value: `₹${totalSavings.toLocaleString()}`, icon: History, color: 'accent-orange', trend: '15%', trendUp: true },
  ];

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Good morning, Dr. {user?.name?.split(' ')[0] || 'Member'}</h1>
          <p className="text-text-muted mt-1">Here is what's happening with your practice today.</p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Link to="/admin/dashboard" className="btn-secondary border-emerald-500 text-emerald-600 hover:bg-emerald-50">
              <ShieldCheck size={20} />
              Admin Panel
            </Link>
          )}
          <Link to="/quick-order" className="btn-secondary">
            <Plus size={20} />
            Quick Order
          </Link>
          <Link to="/products" className="btn-primary">
            Browse All
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}-500 group-hover:w-2 transition-all duration-300`}></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`inline-flex items-center text-xs font-bold ${stat.trendUp ? 'text-secondary-600' : 'text-red-600'}`}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </span>
              <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Since last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
            <Link to="/orders" className="text-sm font-bold text-primary-600 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
            {orders.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-light text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-surface-border">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="group hover:bg-primary-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{order._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          order.status === 'Delivered' 
                            ? 'bg-secondary-50 text-secondary-600 border-secondary-100' 
                            : 'bg-primary-50 text-primary-600 border-primary-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <Package className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-medium">No orders found yet.</p>
                <Link to="/products" className="text-primary-600 font-bold text-sm mt-2 inline-block">Start Ordering</Link>
              </div>
            )}
          </div>
        </div>

        {/* Wallet & Rewards Widget */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">My Wallet</h2>
            <Link to="/wallet" className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              Dashboard <ArrowRight size={16} />
            </Link>
          </div>
          
          {/* Wallet Balance Card */}
          <div className="bg-emerald-600 rounded-[32px] p-6 text-white relative overflow-hidden shadow-2xl shadow-emerald-100">
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                   <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest">Available Balance</p>
                   <Wallet className="text-emerald-200 opacity-50" size={20} />
                </div>
                <h3 className="text-4xl font-black tracking-tighter flex items-center gap-1">
                   <IndianRupee size={32} strokeWidth={3} />
                   {wallet?.balance || 0}
                </h3>
                
                <div className="mt-6 flex gap-2">
                   <Link to="/wallet" className="flex-1 bg-white text-emerald-600 px-4 py-3 text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-colors">
                      Withdraw
                   </Link>
                   <Link to="/wallet" className="flex-1 bg-emerald-700 text-white px-4 py-3 text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-colors border border-emerald-500">
                      Redeem
                   </Link>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full -mr-16 -mt-16 blur-xl opacity-50" />
          </div>

          {/* Loyalty Points Card */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
             <div className="flex justify-between items-center mb-2">
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loyalty Points</p>
               <Gift className="text-amber-500" size={20} />
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
               {wallet?.points || 0} <span className="text-sm text-slate-400 font-bold uppercase tracking-widest ml-1">Pts</span>
             </h3>
             <p className="text-xs font-bold text-slate-500 mt-2">Earn points on every purchase!</p>
             <Link to="/refer" className="block mt-4 text-center py-3 bg-slate-50 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
               Refer & Earn More
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

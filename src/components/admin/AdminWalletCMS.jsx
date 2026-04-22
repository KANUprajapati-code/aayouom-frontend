import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, Plus, Trash2, Save, X, Search, Activity, ArrowUpRight, TrendingUp, CreditCard } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AdminWalletCMS = () => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ totalBalance: 0, activeUsers: 0 });

    const getAuthConfig = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/wallets`, getAuthConfig());
            setWallets(res.data);
            const total = res.data.reduce((acc, curr) => acc + (curr.balance || 0), 0);
            setStats({ totalBalance: total, activeUsers: res.data.length });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBalance = async (userId, amount) => {
        try {
            await axios.put(`${API_BASE_URL}/admin/wallet/update`, { userId, amount }, getAuthConfig());
            fetchData();
        } catch (err) {
            alert('Update failed');
        }
    };

    const filteredWallets = wallets.filter(w => 
        w.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        w.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs font-sans">Scanning Ledger Buffer...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-8">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><Wallet className="text-blue-600" /> Credit Allocation Hub</h2>
                   <p className="text-slate-500 text-sm mt-1">Manage practitioner credits and transactional balances.</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Liquidity</p>
                      <h4 className="text-xl font-black text-slate-900 tracking-tighter">₹{stats.totalBalance}</h4>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Nodes</p>
                      <h4 className="text-xl font-black text-slate-900 tracking-tighter">{stats.activeUsers}</h4>
                   </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <Search className="text-slate-400" size={18} />
                <input placeholder="Search ledger by practitioner name or email..." className="flex-grow bg-transparent outline-none font-bold text-slate-900" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Practitioner / Node</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Balance</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Rapid Allocation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredWallets.map(w => (
                            <tr key={w._id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">{w.user?.name?.[0]}</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{w.user?.name || 'Anonymous Node'}</p>
                                            <p className="text-[10px] text-slate-400 font-semibold">{w.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="text-sm font-black text-slate-900">₹{w.balance}</span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleUpdateBalance(w.user?._id, 100)} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all">+₹100</button>
                                        <button onClick={() => handleUpdateBalance(w.user?._id, 500)} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all">+₹500</button>
                                        <button onClick={() => handleUpdateBalance(w.user?._id, -100)} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-[10px] font-bold hover:bg-rose-600 hover:text-white transition-all">-₹100</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredWallets.length === 0 && <div className="py-20 text-center text-slate-400 uppercase tracking-widest text-xs font-bold opacity-40 italic">Buffer Empty • No Match Records</div>}
            </div>
        </div>
    );
};

export default AdminWalletCMS;

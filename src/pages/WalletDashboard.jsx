import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Copy, 
  Plus, 
  CreditCard,
  ChevronRight,
  TrendingUp,
  History,
  IndianRupee
} from 'lucide-react';
import axios from 'axios';

const WalletDashboard = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [convertPoints, setConvertPoints] = useState('');

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/wallet/my-wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWalletData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/wallet/withdraw', {
        amount: Number(withdrawAmount),
        method: 'UPI',
        details: withdrawDetails
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowWithdrawModal(false);
      fetchWalletData();
    } catch (err) {
      alert(err.response?.data?.message || 'Withdrawal failed');
    }
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/wallet/convert-points', {
        points: Number(convertPoints)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowConvertModal(false);
      fetchWalletData();
    } catch (err) {
      alert(err.response?.data?.message || 'Conversion failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-emerald-600"
      >
        <RefreshCcw size={40} />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-32 pb-32 md:pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My <span className="text-emerald-600">Wallet</span></h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Loyalty points and withdrawal center</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
            >
              Withdraw Cash
            </button>
            <button 
              onClick={() => setShowConvertModal(true)}
              className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-200 transition-all"
            >
              Redeem Points
            </button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-600 rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-100"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest">Available Balance</p>
                <Wallet className="text-emerald-200 opacity-50" size={24} />
              </div>
              <h2 className="text-5xl font-black tracking-tighter flex items-center gap-2">
                <IndianRupee size={40} strokeWidth={3} />
                {walletData?.balance || 0}
              </h2>
              <div className="mt-8 pt-6 border-t border-emerald-500/50 flex justify-between items-center">
                <p className="text-[10px] font-bold text-emerald-100">Updated just now</p>
                <TrendingUp size={16} className="text-emerald-200" />
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-400 rounded-full -ml-12 -mb-12 blur-2xl opacity-30" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loyalty Points</p>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                <Plus size={20} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              {walletData?.points || 0}
              <span className="text-slate-400 text-lg ml-2 font-bold uppercase">Points</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-bold mt-4 leading-relaxed">
              Earn points on every purchase. <br />
              100 Points = ₹100
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
          >
            <div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-4">Your Referral Code</p>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 group-hover:bg-white transition-all">
                <span className="font-black text-xl tracking-widest text-slate-900">{walletData?.referralCode}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(walletData?.referralCode);
                    alert('Copied to clipboard!');
                  }}
                  className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-emerald-600"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <Link to="/refer" className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mt-4">
              View Referral Dashboard <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-900">
                <History size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Track your rewards and spendings</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {walletData?.transactions?.length > 0 ? (
              walletData.transactions.map((tx, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={tx._id} 
                  className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.amount > 0 ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm tracking-tight">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                          {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                          tx.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-xl font-black tracking-tighter ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <Clock size={40} />
                </div>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No transactions found</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] p-6 md:p-10 max-w-md w-full relative z-[110] shadow-2xl mx-4 md:mx-0"
            >
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Request Withdrawal</h3>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-8">Funds will be credited to your account</p>
              
              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Amount (₹)</label>
                  <input 
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">UPI ID / Account Details</label>
                  <input 
                    type="text"
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                    placeholder="example@upi"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-rose-600 uppercase leading-relaxed tracking-wider">
                        Note: Withdrawals may take up to 24-48 hours to process by our admin team.
                    </p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowWithdrawModal(false)} className="flex-1 px-4 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Submit Request</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Convert Points Modal */}
      <AnimatePresence>
        {showConvertModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConvertModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] p-6 md:p-10 max-w-md w-full relative z-[110] shadow-2xl mx-4 md:mx-0"
            >
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Redeem Points</h3>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-8">Convert loyalty points to wallet balance</p>
              
              <div className="bg-amber-50 p-6 rounded-3xl mb-8 border border-amber-100 flex justify-between items-center">
                <div>
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Available Points</p>
                   <p className="text-2xl font-black text-slate-900 mt-1">{walletData?.points || 0}</p>
                </div>
                <RefreshCcw className="text-amber-200" size={32} />
              </div>

              <form onSubmit={handleConvert} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Points to Convert</label>
                  <input 
                    type="number"
                    value={convertPoints}
                    onChange={(e) => setConvertPoints(e.target.value)}
                    placeholder="Enter points (e.g. 100)"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-amber-500 transition-all"
                    required
                  />
                  <p className="text-[9px] font-bold text-slate-400 mt-2 italic px-2">You will receive ₹{convertPoints || 0} in your wallet</p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowConvertModal(false)} className="flex-1 px-4 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all">Redeem Now</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default WalletDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Users, 
  Share2, 
  Copy, 
  CheckCircle2, 
  ArrowRight,
  UserPlus,
  Coins,
  ShieldCheck,
  Facebook,
  Twitter,
  MessageCircle,
  Mail
} from 'lucide-react';
import axios from 'axios';

const ReferAndEarn = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/wallet/my-wallet', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWalletData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletData?.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = `${window.location.origin}/register?ref=${walletData?.referralCode}`;

  const steps = [
    {
      icon: UserPlus,
      title: "Invite Friends",
      desc: "Share your unique referral code with your colleagues and friends.",
      color: "blue"
    },
    {
      icon: ShieldCheck,
      title: "Friend Joins",
      desc: "They register on Wedome using your code and get verified.",
      color: "emerald"
    },
    {
      icon: Coins,
      title: "Earn Rewards",
      desc: "Both of you receive 50 Loyalty Points instantly in your wallets!",
      color: "amber"
    }
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        
        {/* Background Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-secondary-50 rounded-full blur-3xl opacity-50 z-0" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <Gift size={14} /> Referral Program 2.0
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Spread the word, <br />
                <span className="text-emerald-600 italic">Earn Rewards.</span>
              </h1>
              <p className="text-lg text-slate-500 font-bold max-w-md leading-relaxed">
                Invite your medical community to Wedome and earn loyalty points for every successful referral. 
                They get a welcome bonus too!
              </p>
            </motion.div>

            {/* Referral Code Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden group"
            >
              <div className="relative z-10">
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-6">Your Personal Invite Code</p>
                <div className="flex flex-col md:flex-row gap-4">
                   <div className="flex-grow flex items-center justify-between px-8 py-6 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md">
                      <span className="text-3xl font-black text-white tracking-widest">{walletData?.referralCode}</span>
                      <button 
                        onClick={handleCopy}
                        className="p-3 bg-white text-slate-900 rounded-xl hover:scale-110 transition-transform active:scale-95 shadow-lg"
                      >
                        {copied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                      </button>
                   </div>
                   <button 
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Join Wedome!',
                                text: `Use my referral code ${walletData?.referralCode} to get 50 bonus points on Wedome healthcare marketplace.`,
                                url: shareLink,
                            });
                        } else {
                            handleCopy();
                            alert('Referral link copied to clipboard!');
                        }
                    }}
                    className="md:px-10 py-6 bg-emerald-500 text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                   >
                     <Share2 size={18} /> Share Focus
                   </button>
                </div>
                
                {/* Social Share Icons */}
                <div className="mt-8 flex gap-4">
                  {[Facebook, Twitter, MessageCircle, Mail].map((Icon, i) => (
                    <button key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white hover:text-slate-900 transition-all">
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Decorative circle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
            </motion.div>
          </div>

          {/* Right Column: Visual Steps */}
          <div className="grid gap-6">
            {steps.map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                key={step.title}
                className="bg-slate-50 border border-slate-100 p-8 rounded-[40px] flex items-start gap-6 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
              >
                <div className={`w-16 h-16 shrink-0 rounded-3xl flex items-center justify-center bg-white shadow-sm group-hover:scale-110 transition-transform ${
                  step.color === 'blue' ? 'text-blue-500' : 
                  step.color === 'emerald' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  <step.icon size={28} />
                </div>
                <div className="space-y-1">
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">{step.title}</h3>
                   <p className="text-sm text-slate-500 font-bold leading-relaxed">{step.desc}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="text-slate-300" />
                </div>
              </motion.div>
            ))}

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.7 }}
               className="mt-4 p-8 bg-emerald-600 rounded-[40px] text-white flex justify-between items-center"
            >
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-emerald-400 flex items-center justify-center text-[10px] font-black">
                        {String.fromCharCode(64+i)}
                    </div>
                  ))}
               </div>
               <p className="font-bold text-[10px] uppercase tracking-widest">
                 <span className="font-black text-emerald-200">2,400+</span> Doctors <br /> already earning
               </p>
               <Users className="text-emerald-400" size={32} />
            </motion.div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Terms & conditions apply • Verification required</p>
           <div className="flex gap-8 text-[11px] font-black text-slate-900 uppercase tracking-widest">
              <span className="cursor-pointer hover:text-emerald-600 transition-colors">How it works</span>
              <span className="cursor-pointer hover:text-emerald-600 transition-colors">Reward breakdown</span>
              <span className="cursor-pointer hover:text-emerald-600 transition-colors">FAQ</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ReferAndEarn;

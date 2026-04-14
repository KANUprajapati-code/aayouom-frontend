import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, ChevronDown, HelpCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      desc: "Mon-Sat from 9am to 6pm",
      action: "+91 98765 43210",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      href: "tel:+919876543210"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Chat",
      desc: "Fastest response time",
      action: "Message Support",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      href: "https://wa.me/919876543210"
    },
    {
      icon: Mail,
      title: "Email Support",
      desc: "Expect reply in 24 hrs",
      action: "care@wedomedoctors.com",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      href: "mailto:care@wedomedoctors.com"
    }
  ];

  const faqs = [
    {
      q: "How to apply bulk order schemes?",
      a: "Schemes such as 10+2 are automatically calculated inside your cart once the minimum quantity threshold is met. Ensure your active promo codes are verified at checkout."
    },
    {
      q: "What is your delivery timeframe?",
      a: "Standard delivery time is 24-48 hours across major operational pin codes. You can track exact status using the live status in the Order History section."
    },
    {
      q: "How can I update my clinic registration?",
      a: "Navigate to 'Account Settings' from the main dashboard to resubmit your medical license and billing credentials for an automatic reverification."
    },
    {
      q: "My wallet balance isn't updating.",
      a: "Wallet balances synchronize every 15 minutes. If it hasn't updated after a successful referral or refund, please shoot us a WhatsApp message with your transaction ID."
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section className="bg-slate-900 rounded-3xl lg:rounded-[40px] p-8 sm:p-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary-600 opacity-20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-500 opacity-10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-white/10 flex items-center justify-center rounded-2xl mx-auto backdrop-blur-md border border-white/20">
            <HelpCircle size={32} className="text-primary-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            How can we <span className="text-primary-400 italic">help you?</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-medium">
            Find answers to commonly asked questions or connect with our support agents instantly for critical business assistance.
          </p>
        </div>
      </section>

      {/* Contact Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((method, idx) => (
          <a key={idx} href={method.href} target="_blank" rel="noreferrer" className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 sm:p-8 rounded-3xl border border-surface-border bg-white shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-between h-full space-y-4`}
            >
              <div className={`w-14 h-14 ${method.bg} ${method.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <method.icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{method.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{method.desc}</p>
              </div>
              <div className={`px-5 py-2.5 rounded-xl font-black tracking-wide text-sm ${method.bg} ${method.color} border ${method.border} group-hover:bg-opacity-80`}>
                {method.action}
              </div>
            </motion.div>
          </a>
        ))}
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-lg">Quick answers to standard operational inquiries.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-surface-border bg-white rounded-2xl overflow-hidden shadow-sm hover:border-primary-200 transition-colors">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:bg-surface-light"
              >
                <span className="text-lg font-bold text-slate-800 pr-4">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full bg-surface-light flex items-center justify-center text-slate-400 shrink-0 transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180 bg-primary-50 text-primary-600' : ''}`}>
                  <ChevronDown size={18} />
                </div>
              </button>
              
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed border-t border-surface-border/50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Documentation Footer Let */}
      <section className="bg-primary-50 border border-primary-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-inner">
        <div className="flex items-center gap-4 flex-col md:flex-row">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-primary-200">
            <FileText size={28} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-primary-900">Need specific documentation?</h4>
            <p className="text-primary-700 font-medium">Download our API manuals and scheme rules.</p>
          </div>
        </div>
        <button className="btn-primary hover:scale-105 transition-transform bg-primary-600 shrink-0">
          Downloads Hub
        </button>
      </section>
    </div>
  );
};

export default Support;

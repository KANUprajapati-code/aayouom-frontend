import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-green text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-light/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="Ayuone Logo" 
                className="h-24 lg:h-40 object-contain brightness-0 invert scale-110 origin-left" 
              />
            </Link>
            <p className="text-white/70 font-medium leading-relaxed text-base">
              Ayuone is a premium B2B marketplace for pharmaceuticals, supplying verified healthcare essentials and wellness products across India with institutional-grade reliability.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10 group">
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-white/90">Institutional Supply</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-white/60 hover:text-white transition-colors text-sm font-medium">B2B Procurement</Link></li>
              <li><Link to="/products?cat=Wellness" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Wellness Solutions</Link></li>
              <li><Link to="/products?cat=Devices" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Clinical Devices</Link></li>
              <li><Link to="/bulk-inquiry" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Bulk Inquiries</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-white/90">Support Center</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-white/60 hover:text-white transition-colors text-sm font-medium">About Ayuone</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Contact Logistics</Link></li>
              <li><Link to="/terms" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Help & FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white/90">Contact Details</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <MapPin className="w-5 h-5 text-white/70" />
                </div>
                <span className="text-sm text-white/70 font-medium leading-relaxed">Tech District, North Bangalore,<br />Karnataka 560001, India</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <Phone className="w-5 h-5 text-white/70" />
                </div>
                <span className="text-sm text-white/70 font-bold tracking-tight">+91 92654 01508</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <Mail className="w-5 h-5 text-white/70" />
                </div>
                <span className="text-sm text-white/70 font-medium">partners@ayuone.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">
              © 2026 Ayuone B2B. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-white/30 hover:text-white/60 text-[10px] font-bold uppercase tracking-widest">Privacy</Link>
              <Link to="/terms" className="text-white/30 hover:text-white/60 text-[10px] font-bold uppercase tracking-widest">Terms</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Marketplace</span>
             </div>
             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">ISO 9001:2015</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-600 text-white pt-32 pb-16 relative overflow-hidden lg:rounded-t-[100px]">
      {/* Abstract Globs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-[150px] opacity-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-500 rounded-full blur-[150px] opacity-10" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20 mb-24 relative z-10">
        <div className="space-y-10">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-12 object-contain" />
          </Link>
          <p className="text-white/70 font-bold leading-relaxed text-lg">
            Supplying premium healthcare essentials and wellness products across India. Trusted quality, delivered instantly.
          </p>
          <div className="flex gap-5">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-14 h-14 bg-primary-700/50 rounded-2xl flex items-center justify-center text-white/50 hover:text-white hover:bg-primary-500 transition-all border border-white/10 shadow-xl">
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-xs text-white">Shop Catalog</h4>
          <ul className="space-y-6 font-black text-white/60 text-sm">
            <li><Link to="/products" className="hover:text-white transition-colors">Medicines</Link></li>
            <li><Link to="/products?cat=Wellness" className="hover:text-white transition-colors">Wellness</Link></li>
            <li><Link to="/products?cat=Devices" className="hover:text-white transition-colors">Devices</Link></li>
            <li><Link to="/products?cat=PersonalCare" className="hover:text-white transition-colors">Personal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-xs text-white">Quick Support</h4>
          <ul className="space-y-6 font-black text-white/60 text-sm">
            <li><Link to="/about" className="hover:text-white transition-colors">About Wedome</Link></li>
            <li><Link to="/bulk-inquiry" className="hover:text-white transition-colors">Bulk Procurement</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact US</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-xs text-white">Contact</h4>
          <ul className="space-y-8 font-black text-white/60 text-sm">
            <li className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-secondary-500 shrink-0" />
              <span className="leading-relaxed text-white/80">123 Wellness Blvd, Tech District, Bangalore 560001</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-secondary-500 shrink-0" />
              <span className="text-white/80">+91 12345 67890</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-secondary-500 shrink-0" />
              <span className="text-white/80">care@wedome.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em]">
          © 2026 Wedome. Designed for Excellence.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-3 text-white text-xs font-black bg-primary-700/50 px-6 py-3 rounded-2xl border border-white/10">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>ISO Certified</span>
          </div>
          <div className="flex items-center gap-3 text-white text-xs font-black bg-primary-700/50 px-6 py-3 rounded-2xl border border-white/10">
            <HeartPulse className="w-5 h-5 text-secondary-500" />
            <span>Ayush Trusted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

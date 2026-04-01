import React from 'react';
import { 
  ShieldCheck, 
  TrendingDown, 
  Package, 
  Truck, 
  History, 
  ChevronRight,
  Plus,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SchemeBadge from '../components/common/SchemeBadge';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy medicine data
  const medicine = {
    name: "Augmentin 625 Duo Tablet",
    brand: "GlaxoSmithKline Pharmaceuticals Ltd",
    salt: "Amoxycillin (500mg) + Clavulanic Acid (125mg)",
    mrp: 223.50,
    price: 185.00,
    discount: 17,
    scheme: "Buy 10 Get 2 Free",
    packSize: "10 Tablets in 1 Strip",
    category: "Antibiotics",
    description: "Augmentin 625 Duo Tablet is an antibiotic that helps your body fight infections caused by bacteria. It is used to treat infections of the lungs (e.g., pneumonia), ear, nasal sinus, urinary tract, skin, and soft tissue.",
    stock: "In Stock (120 Strips)",
    storage: "Store below 25°C",
    isBestDeal: true,
    image: "https://via.placeholder.com/400"
  };

  const comparisons = [
    { brand: "Moxikind-CV 625", mrp: 210, price: 170, scheme: "Buy 10 Get 1" },
    { brand: "Advent 625", mrp: 215, price: 175, scheme: "Extra 5% OFF" },
    { brand: "Amoxyclav 625", mrp: 195, price: 160, scheme: "Buy 20 Get 5" }
  ];

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary-600 font-bold transition-all group"
      >
        <div className="w-8 h-8 rounded-full border border-surface-border flex items-center justify-center group-hover:border-primary-200">
          <ArrowLeft size={18} />
        </div>
        Back to Results
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-6">
          <div className="card !p-8 bg-white aspect-square flex items-center justify-center relative">
             <div className="absolute top-6 left-6">
               <SchemeBadge scheme={medicine.scheme} />
             </div>
             <img src={medicine.image} alt={medicine.name} className="w-full h-full object-contain" />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-square bg-white rounded-2xl border border-surface-border p-2 cursor-pointer hover:border-primary-500 transition-all">
                 <img src={medicine.image} alt="" className="w-full h-full object-contain opacity-50 hover:opacity-100" />
               </div>
             ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
           <div className="space-y-2">
             <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">{medicine.brand}</p>
             <h1 className="text-3xl font-black text-slate-900">{medicine.name}</h1>
             <p className="text-sm text-text-muted font-medium italic">{medicine.salt}</p>
           </div>

           <div className="p-6 bg-surface-light rounded-3xl border border-surface-border space-y-6">
              <div className="flex items-end justify-between">
                <div>
                   <p className="text-xs text-text-muted line-through mb-1">MRP ₹{medicine.mrp.toFixed(2)}</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-slate-900">₹{medicine.price.toFixed(2)}</span>
                     <span className="text-sm font-bold text-secondary-600">({medicine.discount}% OFF)</span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock Status</p>
                   <p className="text-sm font-bold text-secondary-600 flex items-center gap-1">
                     <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse"></div>
                     {medicine.stock}
                   </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-primary-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                      <TrendingDown size={22} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-900">{medicine.scheme}</p>
                     <p className="text-[10px] text-text-muted">Applied automatically on clinic checkout</p>
                   </div>
                 </div>
                 <Info size={18} className="text-slate-300" />
              </div>

              <div className="flex gap-4">
                 <div className="flex items-center gap-4 bg-white border border-surface-border rounded-xl p-2 px-4">
                    <button className="text-primary-600 font-black"><Minus size={18} /></button>
                    <span className="text-lg font-bold w-6 text-center">10</span>
                    <button className="text-primary-600 font-black"><Plus size={18} /></button>
                 </div>
                 <button className="btn-primary flex-grow py-4">
                    Add to Clinic Cart
                    <ShoppingCart size={20} />
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-surface-border space-y-1">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Package size={12} /> Pack Size
                 </p>
                 <p className="text-sm font-bold text-slate-800">{medicine.packSize}</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-surface-border space-y-1">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Truck size={12} /> Fast Delivery
                 </p>
                 <p className="text-sm font-bold text-slate-800">24 Hours Guaranteed</p>
              </div>
           </div>
        </div>
      </div>

      {/* Comparison Section */}
      <section className="space-y-6 pt-12">
         <div className="flex items-end justify-between">
           <div>
             <h2 className="text-2xl font-bold text-slate-900">Compare Alternatives</h2>
             <p className="text-text-muted mt-1">Check same salt medicines from different reputable brands</p>
           </div>
         </div>
         
         <div className="bg-white rounded-[32px] border border-surface-border overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-surface-light text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-surface-border">
                    <th className="px-8 py-5">Alternative Brand</th>
                    <th className="px-8 py-5">Professional Price</th>
                    <th className="px-8 py-5">Active Scheme</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {comparisons.map((item, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-all">
                       <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-800">{item.brand}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">Verified Alternative</p>
                       </td>
                       <td className="px-8 py-5">
                          <p className="text-lg font-black text-slate-900 leading-none">₹{item.price.toFixed(2)}</p>
                          <p className="text-[10px] text-text-muted line-through">MRP {item.mrp}</p>
                       </td>
                       <td className="px-8 py-5">
                          <SchemeBadge scheme={item.scheme} type={i === 2 ? 'green' : 'blue'} />
                       </td>
                       <td className="px-8 py-5 text-right">
                          <button className="btn-outline text-xs px-4 py-2">Quick Add</button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* Description */}
      <section className="card !p-12 space-y-6">
         <h2 className="text-2xl font-bold text-slate-900">Medical Information</h2>
         <div className="grid md:grid-cols-2 gap-12 text-sm leading-relaxed text-text-muted">
            <div className="space-y-4">
               <p>{medicine.description}</p>
               <div className="space-y-2">
                  <p className="font-bold text-slate-800">Therapeutic Class:</p>
                  <p>{medicine.category}</p>
               </div>
            </div>
            <div className="space-y-6">
               <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                  <ShieldCheck className="text-blue-600 shrink-0" size={24} />
                  <div>
                     <p className="font-bold text-blue-900">For Professional Use</p>
                     <p className="text-blue-800 text-xs mt-1">Ensure correct medical supervision and patient history review before prescribing.</p>
                  </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-surface-border flex gap-4">
                  <History className="text-slate-400 shrink-0" size={24} />
                  <div>
                     <p className="font-bold text-slate-900 italic">Storage Requirements</p>
                     <p className="text-slate-600 text-xs mt-1">{medicine.storage}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ProductDetail;

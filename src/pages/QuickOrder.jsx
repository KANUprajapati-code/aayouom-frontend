import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  ShoppingCart, 
  ChevronRight, 
  Zap,
  Package,
  ArrowRight
} from 'lucide-react';
import SchemeBadge from '../components/common/SchemeBadge';

const QuickOrder = () => {
  const [items, setItems] = useState([
    { id: 1, name: '', qty: 1, brand: '', price: 0, scheme: '' },
    { id: 2, name: '', qty: 1, brand: '', price: 0, scheme: '' },
    { id: 3, name: '', qty: 1, brand: '', price: 0, scheme: '' },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', qty: 1, brand: '', price: 0, scheme: '' }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalItems = items.reduce((acc, current) => acc + (current.qty || 0), 0);
  const estimatedTotal = items.reduce((acc, current) => acc + ((current.qty || 0) * (current.price || 0)), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Zap className="text-primary-600 fill-primary-600" size={32} />
            Quick Order Mode
          </h1>
          <p className="text-text-muted mt-1">Bulk entry for fast medicine restock and clinic supplies.</p>
        </div>
        <div className="flex gap-2">
           <button className="btn-ghost text-xs">Clear Form</button>
           <button className="btn-secondary">Import Excel</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Entry Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-surface-border shadow-soft overflow-hidden">
             <div className="grid grid-cols-12 gap-4 p-4 bg-surface-light border-b border-surface-border text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <div className="col-span-1 text-center">#</div>
               <div className="col-span-6">Medicine Name / Brand</div>
               <div className="col-span-2 text-center">Qty</div>
               <div className="col-span-2 text-right">Estimate</div>
               <div className="col-span-1"></div>
             </div>

             <div className="divide-y divide-slate-50">
               {items.map((item, index) => (
                 <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center group transition-colors hover:bg-primary-50/20">
                   <div className="col-span-1 text-center text-xs font-bold text-slate-400">
                     {index + 1}
                   </div>
                   <div className="col-span-6">
                     <div className="relative">
                       <input 
                         type="text" 
                         placeholder="Start typing medicine name..."
                         className="w-full bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-normal"
                       />
                       {item.scheme && (
                         <div className="absolute -top-1 -right-2">
                           <SchemeBadge scheme={item.scheme} />
                         </div>
                       )}
                     </div>
                   </div>
                   <div className="col-span-2">
                     <input 
                       type="number" 
                       min="1"
                       value={item.qty}
                       onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value))}
                       className="w-full text-center bg-slate-50 border border-surface-border rounded-lg py-1.5 text-sm font-bold text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                     />
                   </div>
                   <div className="col-span-2 text-right">
                     <span className="text-sm font-bold text-slate-900 tracking-tight">
                       ₹{(item.qty * (item.price || 0)).toLocaleString()}
                     </span>
                   </div>
                   <div className="col-span-1 flex justify-end">
                     <button 
                       onClick={() => removeItem(item.id)}
                       className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </div>
               ))}
             </div>

             <button 
                onClick={addItem}
                className="w-full py-4 border-t border-dashed border-surface-border flex items-center justify-center gap-2 text-sm font-bold text-primary-600 hover:bg-primary-50 transition-all bg-white"
             >
               <Plus size={18} />
               Add Another Row
             </button>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
             <div className="p-2 bg-white rounded-xl text-orange-600 shadow-sm">
               <Zap size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-orange-800">Smart Suggestions Active</p>
               <p className="text-xs text-orange-700 mt-1">We'll automatically suggest schemes as you add medicines based on your order history.</p>
             </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <div className="card !p-8 space-y-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 border-b border-surface-border pb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Total Unique Items</span>
                <span className="font-bold text-slate-800">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Total Units</span>
                <span className="font-bold text-slate-800">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Estimated Subtotal</span>
                <span className="font-bold text-slate-800">₹{estimatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-secondary-50 border border-secondary-100 rounded-2xl">
              <div className="flex items-center gap-2 text-secondary-700 mb-1">
                <Package size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Unlock Free Delivery</span>
              </div>
              <p className="text-[10px] text-secondary-600">Add medicines worth ₹2,450 more to get zero shipping charges.</p>
            </div>

            <button className="btn-primary w-full py-4 text-base">
              Proceed to Review
              <ArrowRight size={20} />
            </button>
            
            <p className="text-[10px] text-center text-text-muted px-4 leading-relaxed">
              By proceeding, you agree to our professional terms for bulk drug ordering and distribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickOrder;

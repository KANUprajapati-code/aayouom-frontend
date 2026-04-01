import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  Package, 
  List, 
  LayoutGrid, 
  Trash2, 
  Edit, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  AlertCircle
} from 'lucide-react';
import MedicineCard from '../components/common/MedicineCard';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products?placement=shop');
        setMedicines(data);
      } catch (err) {
        console.error('Failed to fetch Shop products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Compute categories dynamically from database products
  const dynamicCategories = [...new Set(medicines.map(m => m.category).filter(Boolean))];
  const categories = ['All', ...dynamicCategories];

  const filteredMedicines = medicines.filter(med => {
    const nameMatch = med.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const brandMatch = (med.brand || 'Generic').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || brandMatch;
    
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Healthcare Marketplace</h1>
          <p className="text-text-muted mt-1">Direct clinic access to {medicines.length}+ verified pharmaceuticals.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group min-w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by salt, brand, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-surface-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800 placeholder:font-normal"
            />
          </div>
          <button className="btn-secondary h-[52px] px-5 rounded-2xl">
            <Filter size={20} />
            <span className="hidden md:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 shrink-0 space-y-6">
          <div className="card !p-0 overflow-hidden">
            <div className="p-5 bg-surface-light border-b border-surface-border flex items-center justify-between">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Categories</h3>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
            <div className="p-2 space-y-1">
              {categories.map(cat => (
                <div key={cat} className="space-y-1">
                  <button 
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                      selectedCategory === cat 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                        : 'text-text-muted hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat !== 'All' && selectedCategory === cat && <ChevronRight size={14} className="animate-in slide-in-from-left-2" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-primary-600 rounded-[32px] text-white relative overflow-hidden group cursor-pointer shadow-premium">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -u-translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>
             <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                   <Zap size={20} className="fill-white" />
                </div>
                <div>
                   <h4 className="font-black text-lg">Bulk Unlock</h4>
                   <p className="text-xs opacity-80 leading-relaxed">Orders over ₹50,000 qualify for flat 5% extra discount.</p>
                </div>
                <button className="w-full py-2.5 bg-white text-primary-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary-50 transition-all">
                   Check Details
                </button>
             </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Showing {filteredMedicines.length} Medicines
            </p>
            <div className="flex items-center gap-1 p-1 bg-surface-light rounded-xl border border-surface-border">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-soft text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-soft text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {filteredMedicines.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredMedicines.map(med => (
                <MedicineCard key={med.id} medicine={med} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No medicines found</h3>
              <p className="text-text-muted">We couldn't find any results for your search. Try searching for a different brand or salt.</p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                className="btn-primary w-full"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

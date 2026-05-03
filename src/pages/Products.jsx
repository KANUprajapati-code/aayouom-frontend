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
  AlertCircle,
  Stethoscope,
  Leaf,
  Dna,
  Percent,
  X,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import MedicineCard from '../components/common/MedicineCard';
import { useCart } from '../context/CartContext';

const Products = () => {
  const { addToCart } = useCart();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialMainCategory = queryParams.get('mainCategory') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [medicines, setMedicines] = useState(() => {
    const cached = localStorage.getItem('products_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [brands, setBrands] = useState(() => {
    const cached = localStorage.getItem('brands_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(medicines.length === 0);

  // Hierarchical Filter States
  const [selectedMainCategory, setSelectedMainCategory] = useState(initialMainCategory); // Homeopathy, Ayurveda, Others
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All'); // Clinical Segment
  const [minDiscount, setMinDiscount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, brandRes] = await Promise.all([
          axios.get('https://ayuom-backend.vercel.app/api/products?placement=shop'),
          axios.get('https://ayuom-backend.vercel.app/api/brands')
        ]);
        setMedicines(prodRes.data);
        setBrands(brandRes.data);
        localStorage.setItem('products_cache', JSON.stringify(prodRes.data));
        localStorage.setItem('brands_cache', JSON.stringify(brandRes.data));
      } catch (err) {
        console.error('Failed to fetch marketplace data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const newMainCategory = currentParams.get('mainCategory');
    if (newMainCategory && newMainCategory !== selectedMainCategory) {
      setSelectedMainCategory(newMainCategory);
      setSelectedBrand('All');
      setSelectedCategory('All');
    }
  }, [location.search]);

  // Filter Logic
  const filteredMedicines = medicines.filter(med => {
    // 1. Search Query
    const nameMatch = med.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const brandMatch = (med.brand || 'Generic').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || brandMatch;

    // 2. Main Category Filter (via Brand mapping)
    let matchesMainCategory = true;
    if (selectedMainCategory !== 'All') {
      const brandData = brands.find(b => b.name === med.brand);
      matchesMainCategory = 
        (med.mainCategory && med.mainCategory === selectedMainCategory) || 
        (!med.mainCategory && brandData?.mainCategory === selectedMainCategory) || 
        (selectedMainCategory === 'Others' && !med.mainCategory && !brandData?.mainCategory);
    }

    // 3. Brand Filter
    const matchesBrand = selectedBrand === 'All' || med.brand === selectedBrand;

    // 4. Clinical Segment / Category Filter
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;

    // 5. Discount Filter
    let discount = 0;
    if (med.originalPrice && med.originalPrice > med.price) {
      discount = ((med.originalPrice - med.price) / med.originalPrice) * 100;
    }
    const matchesDiscount = discount >= minDiscount;

    return matchesSearch && matchesMainCategory && matchesBrand && matchesCategory && matchesDiscount;
  });

  // Derived Data for UI
  const availableBrands = selectedMainCategory === 'All' 
    ? brands 
    : brands.filter(b => b.mainCategory === selectedMainCategory || (selectedMainCategory === 'Others' && !b.mainCategory));

  const dynamicCategories = [...new Set(medicines
    .filter(m => (selectedMainCategory === 'All' || brands.find(b => b.name === m.brand)?.mainCategory === selectedMainCategory))
    .filter(m => (selectedBrand === 'All' || m.brand === selectedBrand))
    .map(m => m.category)
    .filter(Boolean)
  )];

  const resetFilters = () => {
    setSelectedMainCategory('All');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setMinDiscount(0);
    setSearchQuery('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Marketplace...</p>
    </div>
  );

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-8 pb-20"
    >
      {/* Header & Search */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Healthcare Marketplace</h1>
          <p className="text-text-muted mt-1 font-medium italic">Direct clinical access to {medicines.length}+ verified pharmaceuticals.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group min-w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by salt, brand, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-surface-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800 placeholder:font-normal shadow-sm"
            />
          </div>
          <button 
             onClick={resetFilters}
             className="h-[56px] px-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-900/10"
          >
            <X size={18} />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Hierarchical Filters */}
        <motion.aside variants={itemVariants} className="lg:w-80 shrink-0 space-y-8">
          
          {/* Main Category Tree */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-premium overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Medical Divisions</h3>
              <Stethoscope size={14} className="text-slate-400" />
            </div>
            <div className="p-3 space-y-1">
              {[
                { id: 'All', label: 'Entire Matrix', icon: <Dna size={16} />, available: true },
                { id: 'Ayurveda', label: 'Ayurveda', icon: <Leaf size={16} className="text-emerald-500" />, available: true },
                { id: 'Surgical/Panchkarma equipment', label: 'Surgical/Panchkarma Equipment', icon: <Stethoscope size={16} className="text-blue-500" />, available: true },
                { id: 'Homeopathic', label: 'Homeopathic', icon: <Package size={16} className="text-purple-500" />, available: false },
                { id: 'Allopathic', label: 'Allopathic', icon: <ShieldCheck size={16} className="text-rose-500" />, available: false }
              ].map(group => (
                <button 
                  key={group.id}
                  onClick={() => {
                    if (group.available) {
                      setSelectedMainCategory(group.id);
                      setSelectedBrand('All');
                      setSelectedCategory('All');
                    }
                  }}
                  disabled={!group.available}
                  className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black italic tracking-tight transition-all flex items-center justify-between group ${
                    !group.available 
                      ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' 
                      : selectedMainCategory === group.id 
                        ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' 
                        : 'text-slate-500 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`${selectedMainCategory === group.id ? 'text-white' : 'text-slate-400 group-hover:text-primary-600'}`}>
                      {group.icon}
                    </span>
                    <span>{group.label}</span>
                  </div>
                  {!group.available && <span className="text-[8px] uppercase tracking-widest bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full not-italic">Soon</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Tree: Brands */}
          <AnimatePresence mode="wait">
            {selectedMainCategory !== 'All' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-[32px] border border-slate-100 shadow-premium overflow-hidden"
              >
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Brand Nodes</h3>
                  <div className="text-[8px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">{availableBrands.length} FOUND</div>
                </div>
                <div className="p-3 space-y-1 max-h-64 overflow-y-auto no-scrollbar">
                  <button 
                    onClick={() => setSelectedBrand('All')}
                    className={`w-full text-left px-5 py-3 rounded-xl text-xs font-bold transition-all ${selectedBrand === 'All' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    All Brands
                  </button>
                  {availableBrands.map(brand => (
                    <button 
                      key={brand._id}
                      onClick={() => setSelectedBrand(brand.name)}
                      className={`w-full text-left px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                        selectedBrand === brand.name 
                          ? 'bg-primary-50 text-primary-600 border border-primary-100' 
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{brand.name}</span>
                      {selectedBrand === brand.name && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sub-Tree: Clinical Segments */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-premium overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Therapy Segments</h3>
              <Package size={14} className="text-slate-400" />
            </div>
            <div className="p-3 space-y-1 max-h-64 overflow-y-auto no-scrollbar">
              {['All', ...dynamicCategories].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-5 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-tight ${
                    selectedCategory === cat 
                      ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* New: Percentage Discount Filter */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-premium overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Supply Margin</h3>
               <Percent size={14} className="text-primary-600" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black italic text-slate-400 uppercase tracking-widest">
                <span>Min: 0%</span>
                <span className="text-primary-600">{minDiscount}%+ OFF</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="5"
                value={minDiscount}
                onChange={(e) => setMinDiscount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="grid grid-cols-4 gap-2">
                {[0, 10, 20, 30].map(val => (
                  <button 
                    key={val}
                    onClick={() => setMinDiscount(val)}
                    className={`py-2 rounded-lg text-[9px] font-black transition-all ${minDiscount === val ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Matrix Ad */}
          <div className="p-8 bg-primary-600 rounded-[40px] text-white relative overflow-hidden group cursor-pointer shadow-2xl shadow-primary-600/30">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
             <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                   <Zap size={28} className="fill-white" />
                </div>
                <div className="space-y-2">
                   <h4 className="font-black text-2xl tracking-tighter italic">Bulk Matrix</h4>
                   <p className="text-sm text-primary-50/80 leading-relaxed font-medium">Orders over ₹50,000 qualify for flat 5% extra discount.</p>
                </div>
                <button className="w-full py-4 bg-white text-primary-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-primary-50 transition-all shadow-xl">
                   Deploy Now
                </button>
             </div>
          </div>
        </motion.aside>

        {/* Product Grid Area */}
        <div className="flex-grow space-y-8">
          <motion.div variants={itemVariants} className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-50 shadow-sm">
            <div className="flex items-center gap-3 pl-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                 {selectedMainCategory !== 'All' && selectedBrand === 'All' ? `Available Brands: ${availableBrands.length}` : `Matrix Capacity: ${filteredMedicines.length} NODES`}
               </p>
               {selectedMainCategory !== 'All' && (
                 <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[9px] font-black uppercase rounded-full border border-primary-100 animate-in zoom-in">
                   {selectedMainCategory}
                 </span>
               )}
               {selectedBrand !== 'All' && (
                 <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-full border border-blue-100 animate-in zoom-in flex items-center gap-1">
                   <Building2 size={10} /> {selectedBrand}
                 </span>
               )}
            </div>
            {!(selectedMainCategory !== 'All' && selectedBrand === 'All') && (
              <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-soft text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-soft text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            )}
          </motion.div>

          {selectedMainCategory !== 'All' && selectedBrand === 'All' ? (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {availableBrands.map(brand => (
                <button 
                  key={brand._id}
                  onClick={() => setSelectedBrand(brand.name)}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col items-center justify-center text-center h-48 active:scale-95"
                >
                  <div className="w-20 h-20 mb-4 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white overflow-hidden transition-all shadow-sm">
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Building2 size={32} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">{brand.name}</h3>
                </button>
              ))}
              {availableBrands.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                    <Building2 size={32} />
                  </div>
                  <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">No brands found in this category.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredMedicines.length > 0 ? (
                <motion.div 
                  layout
                  className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                >
                  {filteredMedicines.map(med => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={med._id}
                    >
                      <MedicineCard medicine={med} onAddToCart={addToCart} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center space-y-6 max-w-sm mx-auto"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto animate-pulse">
                  <AlertCircle size={48} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">No Nodes Found</h3>
                   <p className="text-slate-400 font-medium leading-relaxed">System could not locate medicines matching your current filter matrix.</p>
                </div>
                <button 
                  onClick={resetFilters}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all"
                >
                  Reset Registry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Products;


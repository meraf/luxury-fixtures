'use client';
import React, { useState, useEffect } from 'react';
import { PackagePlus, RefreshCw, Upload, Sparkles, Layers, Layers3, CheckCircle2, AlertCircle, Loader2, X, Bookmark } from 'lucide-react';

interface store {
  id: number;
  sku: string;
  name: string;
  shopStock: number;
  warehouseStock: number;
}

interface Category {
  id: number;
  name: string;
}

export default function StockView() {
  const [mode, setMode] = useState<'create' | 'restock'>('create');
  const [products, setProducts] = useState<store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  console.log("DEBUG - Cloud Name Loaded:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

  // Modal State
  const [labelModalData, setLabelModalData] = useState<{ id: number; name: string; sku: string } | null>(null);

  // Form State
  const [newProduct, setNewProduct] = useState({
    sku: '', name: '', description: '', 
    costPrice: '', sellingPrice: '', shopStock: '0', categoryId: ''
  });
  
  // Image states separated for direct upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [restock, setRestock] = useState({ productId: '', quantityToAdd: '' });

  // --- DATA FETCHING ---
  const fetchInventoryData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/store').then(res => res.ok ? res.json() : []),
        fetch('/api/categories').then(res => res.ok ? res.json() : [])
      ]);
      setProducts(Array.isArray(productsRes) ? productsRes : []);
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
    } catch (err) {
      console.error("Data syncing malfunction:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // --- IMAGE HANDLING ---
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); 
  };

  // --- DIRECT CLOUDINARY UPLOAD FUNCTION ---
  const uploadDirectToCloudinary = async (file: File): Promise<string> => {
    const cloudName = "dlwphwzqm";
    const uploadPreset = "luxury_fixtures";

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  };

  // --- CREATE PRODUCT SUBMISSION ---
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.sku || !newProduct.name || !imageFile || !newProduct.categoryId) {
      setStatusMsg({ type: 'error', text: 'All starred configuration fields are strictly required.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const cloudinaryUrl = await uploadDirectToCloudinary(imageFile);

      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, image: cloudinaryUrl })
      });

      const data = await res.json();

      if (res.ok && data.product) {
        setLabelModalData({
          id: data.product.id,
          name: data.product.name,
          sku: data.product.sku
        });

        setNewProduct({
          sku: '', name: '', description: '',
          costPrice: '', sellingPrice: '', shopStock: '0', categoryId: ''
        });
        setImageFile(null);
        setImagePreview(null);
        fetchInventoryData();
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'System rejected this entry.' });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'Network failure detected.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RESTOCK SUBMISSION ---
  const handleRestockStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restock.productId || !restock.quantityToAdd) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/store', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(restock.productId),
          quantityToAdd: Number(restock.quantityToAdd)
        })
      });

      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Stock parameters adjusted safely on database records.' });
        setRestock({ productId: '', quantityToAdd: '' });
        fetchInventoryData();
      } else {
        const data = await res.json();
        setStatusMsg({ type: 'error', text: data.error || 'Failed to apply stock.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Patch routine communication error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-900 font-sans relative">
      {statusMsg && (
        <div className={`p-4 rounded-xl flex items-center justify-between border shadow-sm animate-fadeIn
          ${statusMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          <div className="flex items-center space-x-3">
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
            <p className="text-sm font-semibold">{statusMsg.text}</p>
          </div>
          <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm flex space-x-2 max-w-md">
        <button
          type="button" onClick={() => setMode('create')}
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center transition-all
            ${mode === 'create' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <PackagePlus className="w-4 h-4 mr-2" /> Add Product
        </button>
        <button
          type="button" onClick={() => setMode('restock')}
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center transition-all
            ${mode === 'restock' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Stock Store
        </button>
      </div>

      {mode === 'create' && (
        <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black flex items-center"><Sparkles className="w-5 h-5 mr-2 text-slate-700" /> Master Directory Initialization</h2>
            <p className="text-xs font-medium text-slate-400">Deploy fresh profiles directly into the core inventory network.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unique Stock Keeping Unit (SKU) *</label>
                <input 
                  type="text" required placeholder="e.g. FINE-FAU-902"
                  value={newProduct.sku} onChange={e => setNewProduct(p => ({ ...p, sku: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Commercial Item Name *</label>
                <input 
                  type="text" required placeholder="e.g. Brushed Brass Mixer Tap"
                  value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category Link Allocation *</label>
                <select
                  required value={newProduct.categoryId}
                  onChange={e => setNewProduct(p => ({ ...p, categoryId: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="">Select Catalog Placement Group...</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost Valuation ($) *</label>
                  <input 
                    type="number" step="0.01" min="0" required placeholder="0.00"
                    value={newProduct.costPrice} onChange={e => setNewProduct(p => ({ ...p, costPrice: e.target.value }))}
                    className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Retail Selling ($) *</label>
                  <input 
                    type="number" step="0.01" min="0" required placeholder="0.00"
                    value={newProduct.sellingPrice} onChange={e => setNewProduct(p => ({ ...p, sellingPrice: e.target.value }))}
                    className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Opening Shop Inventory Count</label>
                <input 
                  type="number" min="0" placeholder="0"
                  value={newProduct.shopStock} onChange={e => setNewProduct(p => ({ ...p, shopStock: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Specifications Profile</label>
                <textarea 
                  rows={2} placeholder="Dimensions, composition parameters..."
                  value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Media Asset Preview *</label>
                <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-4 text-center hover:bg-slate-100 relative flex flex-col items-center justify-center min-h-[110px] overflow-hidden">
                  {imagePreview ? (
                    <div className="flex items-center space-x-3 w-full px-2 z-10">
                      <img src={imagePreview} alt="Upload Preview" className="w-14 h-14 object-cover rounded-lg border shadow-sm bg-white" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-blue-600">✓ Image Loaded Locally</p>
                        <p className="text-[10px] text-slate-400">Ready for secure Cloudinary push</p>
                      </div>
                    </div>
                  ) : (
                    <div className="z-10">
                      <Upload className="w-5 h-5 text-slate-400 mb-1 mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">Click to select asset file binary</p>
                    </div>
                  )}
                  <input type="file" required accept="image/*" onChange={handleImageSelection} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center shadow-md transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Pushing Assets & Compiling Ledger...</span>
            ) : (
              <span className="flex items-center"><Layers className="w-4 h-4 mr-2" /> Compile Asset & Push to Core Ledger</span>
            )}
          </button>
        </form>
      )}

      {mode === 'restock' && (
        <form onSubmit={handleRestockStore} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black flex items-center"><Layers3 className="w-5 h-5 mr-2 text-slate-700" /> Incoming Shipment Logistics Allocation</h2>
            <p className="text-xs font-medium text-slate-400">Increment storage capacity data using safe backend transactions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Inventory Product Item *</label>
              <select
                required value={restock.productId}
                onChange={e => setRestock(r => ({ ...r, productId: e.target.value }))}
                className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="">Identify profile item using SKU...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} [{p.sku}] — (In Shop: {p.shopStock})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Additional Units Received *</label>
              <input 
                type="number" min="1" required placeholder="e.g. 100"
                value={restock.quantityToAdd} onChange={e => setRestock(r => ({ ...r, quantityToAdd: e.target.value }))}
                className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center transition-all"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
             Restock Store
          </button>
        </form>
      )}

      {labelModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-md animate-fadeIn" />
          
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-900 w-full max-w-md p-6 z-10 transform text-center relative animate-scaleUp">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg shadow-slate-200">
              <Bookmark className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">Labeling Workspace Required</h3>
            <p className="text-xs font-medium text-slate-400 mt-1 max-w-xs mx-auto">
              Write the matching ID tracking tag directly onto the package using a physical permanent marker.
            </p>

            <div className="my-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 select-all cursor-pointer group hover:bg-slate-100/50 transition-colors" title="Click to copy block text">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Physical Tracking ID</span>
              <div className="text-6xl font-black text-slate-950 tracking-wider tabular-nums font-mono">
                #{labelModalData.id}
              </div>
            </div>

            <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 mb-6">
              <div className="flex justify-between"><span className="text-slate-400 font-bold uppercase tracking-wider">Asset Name:</span> <span className="text-slate-800 font-extrabold truncate max-w-[220px]">{labelModalData.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold uppercase tracking-wider">Identifier SKU:</span> <span className="text-slate-700 font-mono font-bold">{labelModalData.sku}</span></div>
            </div>

            <button
              type="button"
              onClick={() => setLabelModalData(null)}
              className="w-full bg-slate-950 text-white text-sm font-bold py-3.5 rounded-xl hover:bg-slate-800 shadow-md shadow-slate-200 active:scale-98 transition-all"
            >
              Confirm Marked & Clear Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
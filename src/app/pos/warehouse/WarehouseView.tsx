'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { PackagePlus, RefreshCw, Upload, Sparkles, Layers, Layers3, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// --- TYPES & INTERFACES ---
interface Product {
  id: number;
  sku: string;
  name: string;
  warehouseStock: number;
  shopStock: number;
  sellingPrice: any;
}

interface Category {
  id: number;
  name: string;
}

export default function WarehouseView() {
  // Navigation & UI States
  const [mode, setMode] = useState<'create' | 'restock'>('create');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Feedback Notification States
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    description: '',
    image: '',
    costPrice: '',
    sellingPrice: '',
    warehouseStock: '0',
    categoryId: ''
  });

  const [restock, setRestock] = useState({
    productId: '',
    quantityToAdd: ''
  });

  // --- INITIAL DATA FETCHING ---
  // Pulling products and categories so dropdown menus are fully populated dynamically
  const fetchInventoryData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/product'), // Assumes GET returns your product list
        fetch('/api/categories') // Replace with your actual category fetch route if different
      ]);
      
      if (productsRes.ok) {
        const prodData = await productsRes.json();
        setProducts(Array.isArray(prodData) ? prodData : prodData.products || []);
      }
      if (categoriesRes.ok) {
        const catData = await categoriesRes.json();
        setCategories(catData);
      }
    } catch (err) {
      console.error("Failed to sync structural stock records:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // --- UTILITY: IMAGE FILE TO BASE64 DATA STREAM ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) { // 8MB limit check
      triggerNotification('error', 'Image size exceeds safety parameters (Max 8MB).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // --- NOTIFICATION HELPER ---
  const triggerNotification = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // --- HANDLER: CREATE NEW PRODUCT (POST) ---
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.sku || !newProduct.name || !newProduct.image || !newProduct.categoryId) {
      triggerNotification('error', 'Please fill out all required attributes, including the product image.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      const data = await res.json();

      if (res.ok) {
        triggerNotification('success', `Product ${newProduct.name} successfully committed to system database.`);
        setNewProduct({
          sku: '', name: '', description: '', image: '',
          costPrice: '', sellingPrice: '', warehouseStock: '0', categoryId: ''
        });
        fetchInventoryData(); // Refresh list to reflect updates
      } else {
        triggerNotification('error', data.error || 'Pipeline creation rejection.');
      }
    } catch (err) {
      triggerNotification('error', 'Network failure communicating with ledger endpoints.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLER: RESTOCK WAREHOUSE QUANTITY (PATCH) ---
  const handleRestockWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restock.productId || !restock.quantityToAdd || Number(restock.quantityToAdd) <= 0) {
      triggerNotification('error', 'Select an inventory target and provide a valid absolute quantity.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/product', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(restock.productId),
          quantityToAdd: Number(restock.quantityToAdd)
        })
      });

      const data = await res.json();

      if (res.ok) {
        const targetProduct = products.find(p => p.id === Number(restock.productId));
        triggerNotification('success', `Warehouse allocation adjusted successfully.`);
        setRestock({ productId: '', quantityToAdd: '' });
        fetchInventoryData(); // Refresh list
      } else {
        triggerNotification('error', data.error || 'Failed to apply inventory patch adjustment.');
      }
    } catch (err) {
      triggerNotification('error', 'Database connectivity timeout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-900 font-sans">
      
      {/* Dynamic Status Notifications Toast */}
      {statusMsg && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 shadow-md animate-fadeIn transition-all
          ${statusMsg.type === 'success' ? 'bg-green-50 border-l-4 border-green-600 text-green-900' : 'bg-red-50 border-l-4 border-red-500 text-red-900'}`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          <p className="text-sm font-semibold">{statusMsg.text}</p>
        </div>
      )}

      {/* Styled Work Desk Pill Controls */}
      <div className="bg-white p-2 border border-slate-200 rounded-2xl shadow-sm flex space-x-2 max-w-md">
        <button
          onClick={() => setMode('create')}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200
            ${mode === 'create' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          <PackagePlus className="w-4 h-4 mr-2" />
          Add New Product
        </button>
        <button
          onClick={() => setMode('restock')}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200
            ${mode === 'restock' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Stock Warehouse
        </button>
      </div>

      {/* --- WORKSPACE BLOCK A: REGISTER PRODUCT --- */}
      {mode === 'create' && (
        <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl font-black flex items-center"><Sparkles className="w-5 h-5 mr-2 text-slate-600" /> Master Directory Initialization</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Introduce a unique item file profile with automatic image processing infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input Columns Left */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Unique Identification SKU *</label>
                <input 
                  type="text" required placeholder="e.g. LX-FIXT-009"
                  value={newProduct.sku} onChange={e => setNewProduct(p => ({ ...p, sku: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Product Display Name *</label>
                <input 
                  type="text" required placeholder="e.g. Matte Black Waterfall Faucet"
                  value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">System Directory Category ID *</label>
                <select
                  required value={newProduct.categoryId}
                  onChange={e => setNewProduct(p => ({ ...p, categoryId: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">Choose Catalog Section...</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  {/* Fallback option if your categories API is empty/still building out */}
                  {categories.length === 0 && <option value="1">Default Category (ID: 1)</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cost Price ($) *</label>
                  <input 
                    type="number" step="0.01" required placeholder="0.00"
                    value={newProduct.costPrice} onChange={e => setNewProduct(p => ({ ...p, costPrice: e.target.value }))}
                    className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Retail Selling Price ($) *</label>
                  <input 
                    type="number" step="0.01" required placeholder="0.00"
                    value={newProduct.sellingPrice} onChange={e => setNewProduct(p => ({ ...p, sellingPrice: e.target.value }))}
                    className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Input Columns Right */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Initial Base Warehouse Stock Allocation</label>
                <input 
                  type="number" placeholder="0"
                  value={newProduct.warehouseStock} onChange={e => setNewProduct(p => ({ ...p, warehouseStock: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Asset Description Profile</label>
                <textarea 
                  rows={2} placeholder="Enter item specifications..."
                  value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                  className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Secure Cloudinary Image Stream Processing Box */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Display Media File Asset *</label>
                <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-4 text-center hover:bg-slate-100 transition-colors relative flex flex-col items-center justify-center min-h-[110px]">
                  {newProduct.image ? (
                    <div className="flex items-center space-x-3 w-full px-2">
                      <img src={newProduct.image} alt="Preview" className="w-14 h-14 object-cover rounded-lg border shadow-sm bg-white" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-green-600 flex items-center">✓ Stream Ready</p>
                        <label htmlFor="img-file-reset" className="text-[10px] font-bold text-slate-400 underline hover:text-slate-600 cursor-pointer">Change Image</label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <p className="text-xs text-slate-500 font-medium">Click to upload raw image binary data stream</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Cloudinary folder mapping applies instantly</p>
                    </>
                  )}
                  <input 
                    id="img-file-reset" type="file" accept="image/*" 
                    onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center shadow-md disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Layers className="w-4 h-4 mr-2" />}
            Compile Asset & Deploy to Core Ledger
          </button>
        </form>
      )}

      {/* --- WORKSPACE BLOCK B: WAREHOUSE PATCH RESTOCK --- */}
      {mode === 'restock' && (
        <form onSubmit={handleRestockWarehouse} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl font-black flex items-center"><Layers3 className="w-5 h-5 mr-2 text-slate-600" /> Incoming Shipment Logistics Allocation</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Increment existing database warehouse metrics safely using server-side ACID transaction modifiers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Target Directory Product Item *</label>
              <select
                required value={restock.productId}
                onChange={e => setRestock(r => ({ ...r, productId: e.target.value }))}
                className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">Identify profile item using SKU...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.sku}] — (Current Warehouse Stock: {p.warehouseStock})
                  </option>
                ))}
              </select>
              {loadingData && <p className="text-[10px] text-slate-400 mt-1 animate-pulse">Syncing master active inventory channels...</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">New Volume Quantity Received *</label>
              <input 
                type="number" min="1" required placeholder="e.g. 50"
                value={restock.quantityToAdd} onChange={e => setRestock(r => ({ ...r, quantityToAdd: e.target.value }))}
                className="w-full text-sm text-slate-900 px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center shadow-md disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Authorize Patch Allocation & Restock Warehouse
          </button>
        </form>
      )}

    </div>
  );
}
'use client';
import DashboardView from './DashboardView';
import StockView from './stock/StockView';
import WarehouseView from './warehouse/WarehouseView';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, LogOut, Home, Store, Layers, Warehouse, 
  X, Trash2, CheckCircle, Loader2, Tag, AlertTriangle, Save
} from 'lucide-react';

// --- TYPES ---
interface Product {
  id: number;
  sku: string;
  name: string;
  costPrice: number;
  defaultPrice: number;
  shopStock: number;
  warehouseStock: number;
  image: string;
  createdAt?: string;
  alertThreshold?: number; // Added for the new alert feature
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  stockSource: 'SHOP' | 'WAREHOUSE';
}

// --- MOCK DATA FALLBACK ---
const mockProducts: Product[] = [];

export default function POSSystem() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id?: number; name: string } | null>(null);

  const [activeTab, setActiveTab] = useState('sell');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutStatus, setCheckoutStatus] = useState<'processing' | 'success' | null>(null);
  
  // --- SEARCH AND SORT STATES ---
  const [searchId, setSearchId] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'name_asc' | 'name_desc' | 'id_asc' | 'id_desc' | 'date_new' | 'date_old'>('none');

  // --- AUTHENTICATION CHECK ---
  useEffect(() => {
    const rawUserData = localStorage.getItem('luxury_user');
    if (!rawUserData) {
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(rawUserData);
      if (!user || !user.name || user.name.trim() === "") {
        localStorage.removeItem('luxury_user');
        router.push('/login');
      } else {
        setCurrentUser(user);
      }
    } catch (error) {
      localStorage.removeItem('luxury_user');
      router.push('/login');
    }
  }, [router]);

  // --- DATABASE FETCH ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          // Initialize mock alert thresholds if not provided by backend
          const enhancedData = data.map((p: Product) => ({
            ...p,
            alertThreshold: p.alertThreshold || 5 // Default low-stock alert is 5
          }));
          setProducts(enhancedData);
        } else {
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error("Error fetching Prisma data:", error);
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product, quantity: number, customPrice: number, stockSource: 'SHOP' | 'WAREHOUSE') => {
    if (quantity <= 0) return;
    if (customPrice <= 0) {
      alert("Please enter a valid selling price.");
      return;
    }
    
    const availableStock = stockSource === 'SHOP' ? product.shopStock : product.warehouseStock;
    if (availableStock < 1) {
      alert("This item is out of stock in the selected location.");
      return;
    }

    setCart(prev => {
      const existingItemIndex = prev.findIndex(item => item.product.id === product.id && item.stockSource === stockSource);
      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        const newTotalQty = newCart[existingItemIndex].quantity + quantity;
        
        if (newTotalQty > availableStock) {
           alert(`Cannot add more. Limit reached: ${availableStock} available.`);
           return prev;
        }
        
        newCart[existingItemIndex].quantity = newTotalQty;
        newCart[existingItemIndex].price = customPrice;
        return newCart;
      }
      return [...prev, { product, quantity, price: customPrice, stockSource }];
    });
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    let userName = currentUser?.name;

    if (!userName) {
        const raw = localStorage.getItem('luxury_user');
        if (raw) {
            const parsed = JSON.parse(raw);
            userName = parsed?.name;
        }
    }

    if (!userName || userName.trim() === '') {
      console.error("Checkout failed: No valid user logged in.");
      alert("Session error: Please refresh the page and try logging in again.");
      setCheckoutStatus(null);
      return; 
    }
    
    setIsCartOpen(false);
    setCheckoutStatus('processing');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ cart, cashierName: userName }), 
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Checkout failed');

      const updatedProducts = await fetch('/api/products').then(res => res.json());
      setProducts(updatedProducts);
      
      clearCart();
      setCheckoutStatus('success');
      setTimeout(() => setCheckoutStatus(null), 2000);
    } catch (error) {
      console.error(error);
      alert("Transaction failed.");
      setCheckoutStatus(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('luxury_user');
    router.push('/login');
  };

  // --- UI COMPONENTS ---
  const Navigation = () => (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Home },
              { id: 'sell', name: 'Sell', icon: Store },
              { id: 'stock', name: 'Shop', icon: Layers },
              { id: 'warehouse', name: 'Warehouse', icon: Warehouse },
              { id: 'price-alerts', name: 'Price & Alerts', icon: Tag }, // New Tab
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center whitespace-nowrap px-3 py-2 rounded-full text-sm font-bold transition-all
                  ${activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <tab.icon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3 ml-4">
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              {currentUser?.name || "Loading..."}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const ProductCard = ({ product }: { product: Product }) => {
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(product.defaultPrice || 0);
    const [source, setSource] = useState<'SHOP' | 'WAREHOUSE'>('SHOP');
    
    const isPriceInvalid = price <= 0;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-md">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold">
              {product.id.toString().padStart(3, '0')}
            </span>
            <span className="text-sm font-medium text-slate-500">Cost: ${product.costPrice.toFixed(2)}</span>
          </div>

          <div className="bg-slate-50 rounded-xl mb-4 h-32 flex items-center justify-center text-6xl shadow-inner border border-slate-100 overflow-hidden">
            {product.image && (product.image.startsWith('http') || product.image.includes('cloudinary') || product.image.startsWith('/')) ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              product.image
            )}
          </div>

          <h3 className="font-bold text-slate-900 leading-tight mb-4">{product.name}</h3>
          
          <div className="bg-slate-100 p-1 rounded-lg flex mb-4 border border-slate-200">
            <button 
              onClick={() => setSource('SHOP')}
              className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${source === 'SHOP' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Shop ({product.shopStock})
            </button>
            <button 
              onClick={() => setSource('WAREHOUSE')}
              className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${source === 'WAREHOUSE' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Warehouse ({product.warehouseStock})
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Qty</label>
              <input 
                type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))}
                className="w-full bg-white text-slate-900 font-medium border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Sell Price ($)</label>
              <input 
                type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                className={`w-full bg-white text-slate-900 font-medium border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${isPriceInvalid ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:ring-slate-800'}`}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto">
          <button 
            onClick={() => addToCart(product, qty, price, source)}
            disabled={(source === 'SHOP' ? product.shopStock : product.warehouseStock) < 1 || isPriceInvalid}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex justify-center items-center"
          >
            {isPriceInvalid ? 'Invalid Price' : (source === 'SHOP' ? product.shopStock : product.warehouseStock) < 1 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  };

  // --- NEW: PRICE & ALERTS COMPONENT ---
  const PriceAlertsView = () => {
    const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
    const [alertInputs, setAlertInputs] = useState<Record<number, string>>({});

    const handleUpdatePrice = async (id: number) => {
      const newPrice = Number(priceInputs[id]);
      if (isNaN(newPrice) || newPrice <= 0) return;
      
      // Update local state (in a real app, you would make an API call here)
      setProducts(prev => prev.map(p => p.id === id ? { ...p, defaultPrice: newPrice } : p));
      setPriceInputs(prev => ({ ...prev, [id]: '' }));
    };

    const handleUpdateAlert = async (id: number) => {
      const newAlert = Number(alertInputs[id]);
      if (isNaN(newAlert) || newAlert < 0) return;
      
      // Update local state (in a real app, you would make an API call here)
      setProducts(prev => prev.map(p => p.id === id ? { ...p, alertThreshold: newAlert } : p));
      setAlertInputs(prev => ({ ...prev, [id]: '' }));
    };

    // Calculate low stock items (Shop + Warehouse combined)
    const lowStockItems = products.filter(p => {
      const threshold = p.alertThreshold !== undefined ? p.alertThreshold : 5;
      const totalStock = p.shopStock + p.warehouseStock;
      return totalStock <= threshold;
    });

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* TOP ROW: Two Grid Columns for Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SECTION 1: PRICE MANAGEMENT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center mb-6 text-slate-900">
              <Tag className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-bold">Update Prices</h2>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto no-scrollbar border border-slate-100 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-100 text-slate-600">
                  <tr>
                    <th className="p-3 font-semibold">Item</th>
                    <th className="p-3 font-semibold">Current Price</th>
                    <th className="p-3 font-semibold text-right">New Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-900">
                        {p.name} <span className="text-slate-400 text-xs ml-1">#{p.id}</span>
                      </td>
                      <td className="p-3 text-slate-600">${p.defaultPrice.toFixed(2)}</td>
                      <td className="p-3 flex justify-end">
                        <div className="flex w-32">
                          <input 
                            type="number" 
                            placeholder="0.00"
                            value={priceInputs[p.id] || ''}
                            onChange={(e) => setPriceInputs({ ...priceInputs, [p.id]: e.target.value })}
                            className="w-full border border-slate-300 rounded-l-lg px-2 py-1.5 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                          />
                          <button 
                            onClick={() => handleUpdatePrice(p.id)}
                            disabled={!priceInputs[p.id]}
                            className="bg-slate-900 text-white px-3 py-1.5 rounded-r-lg hover:bg-slate-800 disabled:bg-slate-300 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: ALERT MANAGEMENT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center mb-6 text-slate-900">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-bold">Set Low Stock Alerts</h2>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto no-scrollbar border border-slate-100 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-100 text-slate-600">
                  <tr>
                    <th className="p-3 font-semibold">Item</th>
                    <th className="p-3 font-semibold">Current Alert</th>
                    <th className="p-3 font-semibold text-right">New Alert Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-900">
                        {p.name} <span className="text-slate-400 text-xs ml-1">#{p.id}</span>
                      </td>
                      <td className="p-3 text-slate-600">{p.alertThreshold || 5} units</td>
                      <td className="p-3 flex justify-end">
                        <div className="flex w-32">
                          <input 
                            type="number" 
                            placeholder="Qty"
                            value={alertInputs[p.id] || ''}
                            onChange={(e) => setAlertInputs({ ...alertInputs, [p.id]: e.target.value })}
                            className="w-full border border-slate-300 rounded-l-lg px-2 py-1.5 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                          />
                          <button 
                            onClick={() => handleUpdateAlert(p.id)}
                            disabled={!alertInputs[p.id]}
                            className="bg-slate-900 text-white px-3 py-1.5 rounded-r-lg hover:bg-slate-800 disabled:bg-slate-300 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* SECTION 3: LOW STOCK DISPLAY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
          <div className="flex items-center mb-6 text-red-600">
            <AlertTriangle className="w-6 h-6 mr-2 animate-pulse" />
            <h2 className="text-xl font-bold">Low Stock Dashboard</h2>
            <span className="ml-4 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
              {lowStockItems.length} items need attention
            </span>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400 opacity-50" />
              <p className="font-medium">All items are sufficiently stocked.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map(item => {
                const total = item.shopStock + item.warehouseStock;
                const threshold = item.alertThreshold || 5;
                const percentage = Math.max(0, (total / threshold) * 100);
                
                return (
                  <div key={item.id} className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <span className="text-xs font-mono bg-white text-slate-500 px-2 py-1 rounded shadow-sm border border-slate-100">
                        #{item.id}
                      </span>
                    </div>
                    
                    <div className="mt-auto pt-4 flex justify-between items-end">
                      <div>
                        <div className="text-sm font-semibold text-red-600">
                          {total} Left (Alert at {threshold})
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Shop: {item.shopStock} | Warehouse: {item.warehouseStock}
                        </div>
                      </div>
                      <div className="w-12 bg-red-200 h-2 rounded-full overflow-hidden flex self-center ml-2">
                        <div 
                          className="bg-red-500 h-full rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    );
  };

  const CartModal = () => {
    if (!isCartOpen) return null;

    return (
      <>
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
        
        <div className="fixed inset-0 sm:inset-y-4 sm:right-4 w-full sm:w-[420px] bg-white shadow-2xl z-50 sm:rounded-2xl rounded-none overflow-hidden border border-slate-200 flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white pt-8 sm:pt-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-slate-600" />
              Current Sale
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
            {cart.length === 0 ? (
              <div className="text-center text-slate-400 mt-10">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">The cart is currently empty.</p>
              </div>
            ) : (
              cart.map((item, idx) => {
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 0;
                const itemTotal = price * quantity;

                return (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group">
                    <div className="flex-1 pr-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.product.name}</h4>
                      <div className="text-xs text-slate-600 mt-2 flex items-center flex-wrap gap-2">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{quantity}x</span> 
                        <span>@ ${price.toFixed(2)}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.stockSource === 'SHOP' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {item.stockSource}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="text-sm font-black text-slate-900 mb-2">${itemTotal.toFixed(2)}</div>
                      <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-8 sm:pb-6">
            <div className="flex justify-between items-center mb-6 text-lg">
              <span className="text-slate-600 font-bold">Total Amount</span>
              <span className="font-black text-2xl text-slate-900">${Number(cartTotal).toFixed(2)}</span>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={clearCart}
                disabled={cart.length === 0}
                className="px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkoutStatus === 'processing'}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold py-3 shadow-lg shadow-slate-200 disabled:opacity-50 transition-all flex justify-center items-center"
              >
                {checkoutStatus === 'processing' ? 'Processing...' : checkoutStatus === 'success' ? <><CheckCircle className="w-5 h-5 mr-2"/> Complete</> : 'Complete Sale'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />
      
      <div className="fixed bottom-6 right-4 sm:right-6 z-[45] pointer-events-auto">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="p-4 bg-slate-900 text-white rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] animate-bounce hover:animate-none transition-all hover:scale-110 active:scale-95 border-2 border-white"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8">
        
        {/* --- SELL TAB --- */}
        {activeTab === 'sell' && (
           isLoading ? 
           <div className="flex justify-center items-center h-64">
             <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
           </div> : (
             <>
               <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                 <div className="flex-1">
                   <input 
                     type="text"
                     placeholder="Search by ID..."
                     value={searchId}
                     onChange={(e) => setSearchId(e.target.value)}
                     className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                   />
                 </div>
                 <div className="sm:w-48">
                   <select
                     value={sortOrder}
                     onChange={(e) => setSortOrder(e.target.value as 'none' | 'name_asc' | 'name_desc' | 'id_asc' | 'id_desc' | 'date_new' | 'date_old')}
                     className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-800 focus:outline-none font-medium"
                   >
                     <option value="none">Sort: Default</option>
                     <option value="name_asc">Name (A-Z)</option>
                     <option value="name_desc">Name (Z-A)</option>
                     <option value="id_asc">ID (Low-High)</option>
                     <option value="id_desc">ID (High-Low)</option>
                     <option value="date_new">Date Added (New-Old)</option>
                     <option value="date_old">Date Added (Old-New)</option>
                   </select>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {products
                   .filter(p => searchId === '' || p.id.toString().includes(searchId))
                   .sort((a, b) => {
                     if (sortOrder === 'name_asc') return a.name.localeCompare(b.name);
                     if (sortOrder === 'name_desc') return b.name.localeCompare(a.name);
                     if (sortOrder === 'id_asc') return a.id - b.id;
                     if (sortOrder === 'id_desc') return b.id - a.id;
                     if (sortOrder === 'date_new') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                     if (sortOrder === 'date_old') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                     return 0;
                   })
                   .map(p => <ProductCard key={p.id} product={p} />)}
               </div>
             </>
           )
        )}

        {checkoutStatus && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl transform transition-all">
              {checkoutStatus === 'processing' ? (
                <div className="animate-spin text-slate-900 mx-auto mb-4 w-16 h-16 flex justify-center items-center">
                  <Loader2 className="w-12 h-12" />
                </div>
              ) : (
                <div className="text-green-500 mb-4">
                  <CheckCircle className="w-16 h-16 mx-auto" />
                </div>
              )}
              <h2 className="text-xl font-bold text-slate-900">
                {checkoutStatus === 'processing' ? 'Processing Sale...' : 'Transaction Successful!'}
              </h2>
              <p className="text-slate-500 mt-2">
                {checkoutStatus === 'processing' ? 'Please wait while we update stock.' : 'All items recorded and stock updated.'}
              </p>
            </div>
          </div>
        )}

        {/* --- TABS RENDERING --- */}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'stock' && <StockView />}
        {activeTab === 'warehouse' && <WarehouseView />}
        {activeTab === 'price-alerts' && <PriceAlertsView />}
        
      </main>
      
      <CartModal />
    </div>
  );
}

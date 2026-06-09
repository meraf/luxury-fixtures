'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, LogOut, Home, Store, Layers, Warehouse, 
  X, Trash2, CheckCircle, AlertCircle 
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
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  stockSource: 'SHOP' | 'WAREHOUSE';
}

// --- MOCK DATA FALLBACK ---
const mockProducts: Product[] = [
  { id: 1, sku: 'FIX-001', name: 'Matte Black Rainfall Shower', costPrice: 120.00, defaultPrice: 299.99, shopStock: 5, warehouseStock: 24, image: '🚿' },
  { id: 2, sku: 'FIX-002', name: 'Gold Kitchen Faucet', costPrice: 85.50, defaultPrice: 195.00, shopStock: 2, warehouseStock: 10, image: '🚰' },
  { id: 3, sku: 'FIX-003', name: 'Freestanding Stone Tub', costPrice: 800.00, defaultPrice: 2400.00, shopStock: 0, warehouseStock: 3, image: '🛁' },
];

export default function POSSystem() {
  const [activeTab, setActiveTab] = useState('sell');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutStatus, setCheckoutStatus] = useState<'processing' | 'success' | null>(null);

  // --- DATABASE FETCH ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
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
    setCheckoutStatus('processing');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(cart),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Checkout failed');

      const updatedProducts = await fetch('/api/products').then(res => res.json());
      setProducts(updatedProducts);
      
      clearCart();
      setCheckoutStatus('success');
      setTimeout(() => setCheckoutStatus(null), 2000);
    } catch (error) {
      alert("Transaction failed. Please try again.");
      setCheckoutStatus(null);
    }
  };

  // --- UI COMPONENTS ---
  const Navigation = () => (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Home },
              { id: 'sell', name: 'Sell', icon: Store },
              { id: 'stock', name: 'Shop', icon: Layers },
              { id: 'warehouse', name: 'Warehouse', icon: Warehouse },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-2 ml-4 text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 rounded-full shrink-0"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );

  const ProductCard = ({ product }: { product: Product }) => {
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(product.defaultPrice);
    const [source, setSource] = useState<'SHOP' | 'WAREHOUSE'>('SHOP');

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-md">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold">
              {product.id.toString().padStart(3, '0')}
            </span>
            <span className="text-sm font-medium text-slate-500">Cost: ${product.costPrice.toFixed(2)}</span>
          </div>

          <div className="bg-slate-50 rounded-xl mb-4 h-32 flex items-center justify-center text-6xl shadow-inner border border-slate-100">
            {product.image}
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
                className="w-full bg-white text-slate-900 font-medium border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto">
          <button 
            onClick={() => addToCart(product, qty, price, source)}
            disabled={(source === 'SHOP' ? product.shopStock : product.warehouseStock) < 1}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex justify-center items-center"
          >
            {(source === 'SHOP' ? product.shopStock : product.warehouseStock) < 1 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  };

  const CartModal = () => (
    <>
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-4 right-4 w-[calc(100%-2rem)] sm:w-[400px] bg-white shadow-2xl z-50 rounded-2xl overflow-hidden border border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-slate-600" />
            Current Sale
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
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
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{item.product.name}</h4>
                    <div className="text-xs text-slate-600 mt-1 flex items-center">
                      <span className="font-bold text-slate-800">{quantity}x</span> @ ${price.toFixed(2)}
                      <span className="mx-2 text-slate-300">•</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.stockSource === 'SHOP' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {item.stockSource}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-black text-slate-900 mb-1">${itemTotal.toFixed(2)}</div>
                    <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-700 p-1 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 capitalize">{activeTab} Point of Sale</h1>
          <p className="text-slate-600 font-medium text-sm mt-1">
            {activeTab === 'sell' && 'Select items, set prices, and complete transactions.'}
          </p>
        </div>

        {activeTab === 'sell' && (
          isLoading ? (
            <div className="text-center py-20 text-slate-500 font-medium">Loading products from database...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        )}

        {activeTab !== 'sell' && (
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Module Under Construction</h3>
            <p className="text-slate-600 font-medium mt-2">The {activeTab} view will be connected to the Prisma database soon.</p>
          </div>
        )}

      </main>
      
      <CartModal />
    </div>
  );
}
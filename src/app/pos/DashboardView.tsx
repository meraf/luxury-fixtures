'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ArrowUpDown, FolderPlus, TrendingUp, 
  DollarSign, ShoppingBag, Percent, X, CheckCircle2, Loader2 
} from 'lucide-react';
import UserManagement from './dashboard/UserManagement';
import SalesReport from './dashboard/SalesReport';
import TransactionList from './dashboard/TransactionList';

// --- TYPES & INTERFACES ---
// FIX 1: Renamed 'Sale' to 'Transaction' to avoid Prisma namespace collision
// FIX 2: Added 'cashierName' to match what TransactionList.tsx expects
export interface Transaction {
  id: number;
  createdAt: string | Date;
  cashier?: { name: string }; // What the API might return
  cashierName: string;        // The mapped value TransactionList requires
  total: number;
  profit: number;
  items: any[]; 
}

interface StockAlert {
  id: number;
  name: string;
  sku: string;
  shopStock: number;
}

export default function DashboardView() {
  // --- STATES ---
  const [subTab, setSubTab] = useState<'overview' | 'users' | 'transactions'>('overview');
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  
  // FIX 3: Update state to use the new Transaction interface
  const [sales, setSales] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Category Creation Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, alertsRes] = await Promise.all([
          fetch('/api/reports'),
          fetch('/api/dashboard/alerts')
        ]);
        
        const salesData = await salesRes.json();
        const alertsData = await alertsRes.json();
        
        // FIX 4: Map the incoming database array to ensure 'cashierName' exists 
        // before passing it into state and down to the TransactionList component
        const formattedSales = (salesData.recentSales || []).map((sale: any) => ({
          ...sale,
          cashierName: sale.cashier?.name || sale.cashierName || 'Unknown'
        }));

        setSales(formattedSales);
        setAlerts(alertsData || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        loading && setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- FILTERING & SORTING LOGIC ---
  
  // 1. Filter Sales by Time Period (Daily, Monthly, Yearly)
  const periodFilteredSales = useMemo(() => {
    const now = new Date();
    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      
      if (period === 'daily') {
        return saleDate.toDateString() === now.toDateString();
      }
      if (period === 'monthly') {
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      }
      if (period === 'yearly') {
        return saleDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [sales, period]);

  // 2. Compute dynamic operational overview metrics based on selected period
  const metricsSummary = useMemo(() => {
    return periodFilteredSales.reduce((acc, sale) => {
      acc.revenue += Number(sale.total) || 0;
      acc.profit += Number(sale.profit) || 0;
      acc.itemCount += sale.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      return acc;
    }, { revenue: 0, profit: 0, itemCount: 0 });
  }, [periodFilteredSales]);

  const averageTransactionValue = useMemo(() => {
    return periodFilteredSales.length > 0 ? metricsSummary.revenue / periodFilteredSales.length : 0;
  }, [periodFilteredSales, metricsSummary.revenue]);

  // 3. Apply Search query filter and Date sorting configurations for Transactions Tab
  const processedTransactions = useMemo(() => {
    let output = [...sales];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      output = output.filter(sale => 
        sale.id.toString().includes(query) || 
        // FIX 5: Use the new cashierName property for searching
        sale.cashierName.toLowerCase().includes(query)
      );
    }

    output.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return output;
  }, [sales, searchQuery, sortOrder]);

  // --- CATEGORY FORM SUBMISSION HANDLER ---
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    
    setIsSubmittingCategory(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        setIsCategoryModalOpen(false);
        setIsSuccessModalOpen(true);
        setCategoryForm({ name: '' });
        setTimeout(() => setIsSuccessModalOpen(false), 2200);
      } else {
        alert("Failed to record category entry.");
      }
    } catch (err) {
      console.error("Category submission pipeline error:", err);
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen text-slate-900 font-sans">
      
      {/* Low Stock Alert Banner */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm flex items-start space-x-3">
          <div className="mt-0.5">⚠️</div>
          <div>
            <h3 className="text-red-900 font-bold text-sm">Critical Inventory Alerts</h3>
            <ul className="text-xs text-red-700 mt-1 space-y-1 list-disc list-inside">
              {alerts.map((item) => (
                <li key={item.id}>
                  <span className="font-semibold">{item.name}</span> ({item.sku}) has fallen low: 
                  <span className="font-extrabold ml-1 bg-red-100 px-1.5 py-0.5 rounded text-red-900">{item.shopStock} units remaining</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Modern Sub-Navigation Tabs Wrapper */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="bg-slate-100 p-1.5 rounded-xl flex space-x-1 w-full sm:w-auto">
          {(['overview', 'transactions', 'users'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setSubTab(tab)} 
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200
                ${subTab === tab 
                  ? 'bg-slate-900 text-white shadow-md scale-102' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'}`}
            >
              {tab === 'users' ? 'users' : tab}
            </button>
          ))}
        </div>

        {/* Dynamic Action Anchors dependent on context */}
        {subTab === 'overview' && (
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Metrics Scope:</span>
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="daily">Today (Daily)</option>
              <option value="monthly">This Month (Monthly)</option>
              <option value="yearly">This Year (Yearly)</option>
            </select>
          </div>
        )}

        {subTab === 'users' && (
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Add Category
          </button>
        )}
      </div>

      {/* --- OVERVIEW COMPONENT VIEW --- */}
      {subTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Dynamic Rich Dashboard Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">${metricsSummary.revenue.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><DollarSign className="w-6 h-6" /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit Margins</p>
                <h3 className="text-2xl font-black text-green-600 mt-1">${metricsSummary.profit.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Ticket</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">${averageTransactionValue.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Percent className="w-6 h-6" /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Units Dispensed</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{metricsSummary.itemCount} Items</h3>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><ShoppingBag className="w-6 h-6" /></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4">Historical Performance Report Breakdown</h3>
            <SalesReport />
          </div>
        </div>
      )}

      {/* --- TRANSACTIONS COMPONENT VIEW --- */}
      {subTab === 'transactions' && (
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Historical Archives</h2>
              <p className="text-xs font-medium text-slate-400">Search, evaluate, and verify structural system checkouts.</p>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search Invoice ID or Cashier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex items-center px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs hover:bg-slate-100 active:scale-95 transition-all"
                title="Toggle Date Direction"
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-slate-500" />
                Date: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-slate-400">Loading ledger data streams...</div>
          ) : (
            <TransactionList sales={processedTransactions} />
          )}
        </div>
      )}

      {/* --- USER MANAGEMENT MODULE --- */}
      {subTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
          <UserManagement />
        </div>
      )}

      {/* --- SUB-COMPONENT: CATEGORY CREATION POPUP MODAL --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 z-10 transform transition-all animate-scaleUp">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center">
                <FolderPlus className="w-5 h-5 mr-2 text-slate-500" /> Add Inventory Category
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category Label Name</label>
                <input 
                  type="text" required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ name: e.target.value })}
                  placeholder="e.g. Bathroom, Kitchen, Lighting"
                  className="w-full text-slate-900 text-sm px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-3 flex space-x-3">
                <button 
                  type="button" onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 border border-slate-200 text-slate-700 font-bold text-sm py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={isSubmittingCategory}
                  className="flex-1 bg-slate-900 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center shadow-md"
                >
                  {isSubmittingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SUB-COMPONENT: SYSTEM FEEDBACK TRANSACTION MODAL --- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center max-w-xs w-full border border-slate-100 flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce mb-3" />
            <h3 className="text-base font-black text-slate-900">Database Synchronized</h3>
            <p className="text-xs text-slate-400 mt-1">New inventory metrics and classifications updated successfully.</p>
          </div>
        </div>
      )}

    </div>
  );
}

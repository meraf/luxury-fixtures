'use client';
import React, { useState, useEffect } from 'react';
import UserManagement from './dashboard/UserManagement';
import SalesReport from './dashboard/SalesReport';
import TransactionList from './dashboard/TransactionList';

// Define the Sale interface locally or import it
interface Sale {
  id: number;
  createdAt: string | Date;
  cashier: { name: string };
  total: number;
  profit: number;
  items: any[]; 
}

export default function DashboardView() {
  const [subTab, setSubTab] = useState<'overview' | 'users' | 'transactions'>('overview');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the sales data when the component mounts
  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch('/api/reports'); // Your API endpoint
        const data = await res.json();
        setSales(data.recentSales || []);
      } catch (error) {
        console.error("Failed to fetch sales:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  return (
    <div className="space-y-6">
      {/* Dashboard Sub-Navigation */}
      <div className="flex space-x-4 border-b border-slate-200 pb-4">
        <button onClick={() => setSubTab('overview')} className={`font-bold ${subTab === 'overview' ? 'text-slate-900' : 'text-slate-500'}`}>Overview</button>
        <button onClick={() => setSubTab('transactions')} className={`font-bold ${subTab === 'transactions' ? 'text-slate-900' : 'text-slate-500'}`}>Transactions</button>
        <button onClick={() => setSubTab('users')} className={`font-bold ${subTab === 'users' ? 'text-slate-900' : 'text-slate-500'}`}>Manage Users</button>
      </div>

      {subTab === 'overview' && <SalesReport />}
      
      {/* PASSED THE SALES PROP HERE TO FIX THE ERROR */}
      {subTab === 'transactions' && (
        loading ? <div>Loading transactions...</div> : <TransactionList sales={sales} />
      )}
      
      {subTab === 'users' && <UserManagement />}
    </div>
  );
}
'use client';
import { useState } from 'react';

// Use interfaces that mirror your Prisma schema
interface Product {
  name: string;
}

interface SaleItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

interface Sale {
  id: number;
  createdAt: string | Date;
  cashier: { name: string };
  total: number;
  profit: number;
  items: SaleItem[];
}

// 1. Explicitly type the component props
export default function TransactionList({ sales }: { sales: Sale[] }) {
  // 2. Explicitly type the state as Sale | null
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-slate-500 text-sm">
            <th className="pb-3">Date</th>
            <th className="pb-3">Cashier</th>
            <th className="pb-3">Total</th>
            <th className="pb-3">Profit</th>
          </tr>
        </thead>
        <tbody>
          {/* 3. 'sale' is now typed as Sale */}
          {sales.map((sale: Sale) => (
            <tr 
              key={sale.id} 
              onClick={() => setSelectedSale(sale)}
              className="border-b hover:bg-slate-50 cursor-pointer transition"
            >
              <td className="py-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
              <td className="py-4">{sale.cashier.name}</td>
              <td className="py-4 font-bold">${sale.total.toFixed(2)}</td>
              <td className="py-4 text-green-600 font-bold">${sale.profit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Sale Details</h3>
            <div className="space-y-2 mb-6">
              {/* 4. 'item' is now typed as SaleItem */}
              {selectedSale.items.map((item: SaleItem) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setSelectedSale(null)}
              className="w-full bg-slate-900 text-white py-2 rounded font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
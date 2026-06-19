'use client';
import { useState } from 'react';

// Interfaces matching your Prisma schema
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
  cashierName: string; // FIX 1: Updated TypeScript definition to match the new backend payload
  total: number;
  profit: number;
  items: SaleItem[];
}

export default function TransactionList({ sales }: { sales: Sale[] }) {
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
          {sales.map((sale: Sale) => (
            <tr 
              key={sale.id} 
              onClick={() => setSelectedSale(sale)}
              className="border-b hover:bg-slate-50 cursor-pointer transition"
            >
              <td className="py-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
              <td className="py-4">{sale.cashierName || 'Unknown'}</td>
              <td className="py-4 font-bold">${sale.total.toFixed(2)}</td>
              <td className="py-4 text-green-600 font-bold">${sale.profit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Unified Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Sale Details</h3>
            
            <div className="text-sm text-slate-600 mb-4">
              {/* FIX 2: Read directly from cashierName string instead of cashier.name */}
              <p><strong>Sold by:</strong> {selectedSale.cashierName || 'Unknown'}</p>
              <p><strong>Date:</strong> {new Date(selectedSale.createdAt).toLocaleString()}</p>
            </div>
            
            <div className="space-y-2 mb-6 border-t pt-4">
              {selectedSale.items.map((item: SaleItem) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 font-bold flex justify-between text-lg">
              <span>Total: ${selectedSale.total.toFixed(2)}</span>
              <span className="text-green-600">Profit: ${selectedSale.profit.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => setSelectedSale(null)}
              className="mt-6 w-full bg-slate-900 text-white py-2 rounded font-bold hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
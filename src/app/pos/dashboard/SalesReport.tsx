// src/app/pos/dashboard/dashboard/SalesReport.tsx
'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SalesReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // You should create an endpoint that returns data grouped by day
    fetch('/api/reports/daily')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">Daily Sales Performance</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" name="Total Sales" />
            <Bar dataKey="profit" fill="#10b981" name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
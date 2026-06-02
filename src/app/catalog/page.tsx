"use client";
import { useState } from 'react';

const catalogItems = [
  { 
    id: "L-101", 
    category: "Light", 
    name: "Grand Chandelier", 
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80", 
    desc: "Hand-blown glass with brass finish." 
  },
  { 
    id: "L-102", 
    category: "Light", 
    name: "Wall Sconce", 
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80", 
    desc: "Minimalist geometric wall lighting." 
  },
  { 
    id: "K-201", 
    category: "Kitchen", 
    name: "Deep Basin Sink", 
    image: "https://images.unsplash.com/photo-1595515106878-92b81ac417d8?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=sanibell-bv-7nLG1HDJW2k-unsplash.jpg"  },
  { 
    id: "B-301", 
    category: "Bathroom", 
    name: "Floating Vanity", 
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", 
    desc: "Oak finish, soft-close drawers." 
  },
];

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState("Light");
  const categories = ["Light", "Kitchen", "Bathroom"];

  const filteredItems = catalogItems.filter(item => item.category === activeTab);

  return (
    <main className="w-full bg-[#FAFAFA] text-slate-900 min-h-screen py-16">
      
      {/* 1. HEADER */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-center">Collections</h1>
        
        {/* CENTERED TABS */}
        <div className="flex justify-center space-x-8 border-b border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`pb-4 text-sm uppercase tracking-[0.2em] transition-all px-2 ${
                activeTab === cat 
                ? "text-blue-600 border-b-2 border-blue-600 font-medium" 
                : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 2. GRID */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* IMAGE CONTAINER */}
              <div className="w-full h-64 bg-slate-100 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover object-center" 
                  loading="lazy"
                />
              </div>

              {/* DETAILS */}
              <div className="p-8">
                <span className="text-[10px] font-mono text-slate-400 mb-2 block">#{item.id}</span>
                <h3 className="text-xl font-serif mb-2 text-slate-800">{item.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6"> {item.desc} </p>
                
                <button className="w-full py-3 border border-slate-200 rounded-lg text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
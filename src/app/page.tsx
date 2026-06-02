"use client";

import { useState } from "react";

export default function SuperUIPage() {
  const [activeTab, setActiveTab] = useState("lighting");

  const categories = [
    { id: "lighting", name: "Light Fixtures" },
    { id: "bathroom", name: "Bathroom Appliances" },
    { id: "kitchen", name: "Kitchen Appliances" }
  ];

  const products = {
    lighting: [
      { 
        name: "Kemi Halo Cascade", 
        desc: "Multi-axis interlocking warm-LED ring system.",
        image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80"
      },
      { 
        name: "Halo Crystal Linear", 
        desc: "Multi-axis ceiling luminaire channel grid.",
        image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80"
      },
      { 
        name: "Cradle Brass Sconce", 
        desc: "Hand-finished patinated wall lighting node.",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"
      }
    ],
    bathroom: [
      { 
        name: "Thermostatic Cascade Unit", 
        desc: "Digital multi-zone smart flow control cluster.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
      },
      { 
        name: "Aero Matte Basins", 
        desc: "Custom cast-stone wash architecture elements.",
        image: "https://images.unsplash.com/photo-1595515106878-92b81ac417d8?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=sanibell-bv-7nLG1HDJW2k-unsplash.jpg"     },
      { 
        name: "Hydro-Massage Column", 
        desc: "Recessed high-pressure environmental mist tower.",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80"
      }
    ],
    kitchen: [
      { 
        name: "Pro-induction Core Matrix", 
        desc: "Seamless flush-mount multi-zone cooking deck.",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
      },
      { 
        name: "Linear Extraction Plane", 
        desc: "High-volume concealed perimeter ceiling hood.",
        image: "https://images.unsplash.com/photo-1593853761096-d0423b545cf9?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=julia-i3NR1cnwqUo-unsplash.jpg"   },
      { 
        name: "Crystalline Cold Vault", 
        desc: "Integrated smart-climate preservation system.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
      }
    ]
  };

  return (
    <div className="w-full bg-[#f9f8f6]">
      
      {/* 1. HERO BLOCK: Seamless Shared Environment Canvas */}
      <section className="relative min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 bg-[#141619] overflow-hidden border-b border-black/20">
        
        {/* LEFT BRAND TEXT COLUMN */}
        <div className="lg:col-span-5 flex flex-col justify-center px-8 sm:px-16 z-10 pt-28 pb-16 space-y-6 bg-transparent">
          <div className="text-[11px] font-mono tracking-[0.4em] text-[#d4a373] uppercase select-none">
            LUXURY FIXTURES
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.1]">
            Luxury Chandeliers & Fixtures 
          </h1>
          
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md leading-relaxed">
            An architectural statement defined by fluid geometry. This piece features cascading interlocking halos embedded with continuous low-voltage luminaires, casting a warm ambient wash over modern spaces.
          </p>
          
          <div className="pt-4">
            <button className="bg-white/5 hover:bg-white text-white hover:text-black font-medium tracking-widest text-[10px] uppercase py-3.5 px-8 rounded-full border border-white/10 shadow-xl transition-all duration-300">
              Explore Piece
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: High-End Minimal Backlighting Layout */}
        <div className="lg:col-span-7 relative w-full h-[500px] lg:h-auto flex items-center justify-center lg:items-start lg:justify-start bg-transparent select-none lg:pt-20 lg:pl-10">
          
          {/* ASSET CLUSTER: Kept high to clear the bottom fading barrier */}
          <div className="relative w-full h-full flex items-center justify-center lg:inset-auto lg:w-auto lg:h-auto lg:transform lg:-translate-y-10">
            
            {/* Photographic Asset Isolator Container */}
            <div className="relative w-full h-full max-w-[840px] max-h-[480px] flex items-center justify-center p-4 z-10 [mask-image:radial-gradient(ellipse_at_center,white_55%,transparent_70%)] [webkit-mask-image:radial-gradient(ellipse_at_center,white_35%,transparent_70%)]">
              <img 
                src="https://images.unsplash.com/photo-1598155038124-0ae4d7300461?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=wesley-shen-2h36PYpcUkg-unsplash.jpg&w=2400" 
                alt="White and Gold Premium Luxury Chandelier"
                className="w-full h-full object-contain opacity-95 filter brightness-105 contrast-115 drop-shadow-[0_0_25px_rgba(212,163,115,0.2)]"
              />
            </div>
          </div>

        </div>

        {/* Smooth transitional gradient pouring cleanly into the section below */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f9f8f6] to-transparent pointer-events-none z-20" />
      </section>

      {/* 2. REASSURANCE CONTEXT BANNER */}
      <section className="max-w-7xl mx-auto py-12 px-6 sm:px-12 text-center border-b border-neutral-200">
        <h3 className="text-xl sm:text-2xl font-serif text-[#2c2e33] tracking-tight">
          Choosing luxury fixtures <span className="italic text-neutral-500">shouldn’t feel risky.</span>
        </h3>
        <p className="text-xs text-neutral-500 mt-2 font-light">
          We eliminate the worry — clear sizing metrics, transparent material breakdown, and flawless installation engineering.
        </p>
      </section>

      {/* 3. PRODUCT CATALOGUE TRACKS */}
      <section className="w-full py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 bg-neutral-100 p-2 rounded-2xl max-w-2xl mx-auto border border-neutral-200 shadow-inner">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full sm:w-auto flex-1 text-center text-[11px] uppercase tracking-widest font-bold py-3 px-6 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#2c2e33] text-white shadow-md"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products[activeTab as keyof typeof products].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#d4a373]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-full h-48 bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200/60 transition-all duration-300">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-[#2c2e33] tracking-tight">{item.name}</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">{item.desc}</p>
                </div>
                
                <div className="flex justify-end items-center pt-6 mt-6 border-t border-neutral-100">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-600 bg-neutral-100 px-4 py-2 rounded-md group-hover:bg-[#d4a373] group-hover:text-white transition-all cursor-pointer">
                    View Blueprint
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. TECHNICAL EXECUTION WING */}
      <section className="bg-neutral-900 text-white py-24 px-6 sm:px-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#d4a373] uppercase block">
              Site Execution Wing
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight">
              Full House Turnkey <br />
              <span className="italic text-neutral-400 font-normal">Installation Services.</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              We deploy an independent, certified network of engineers and masters to wire, pipe, and position your hardware safely.
            </p>

            <div className="bg-white/[0.03] border-l-2 border-[#d4a373] p-5 rounded-r-xl">
              <span className="text-[9px] font-mono tracking-widest text-[#d4a373] font-bold block mb-1">
                SEPARATE SERVICE TERMS //
              </span>
              <p className="text-xs text-neutral-300 font-light leading-normal">
                Installation contracts are completely separated from product distribution invoicing and require standalone site surveying.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl space-y-2">
              <h4 className="text-sm font-bold text-[#d4a373] uppercase tracking-wider">01 / Full-House Plumbing</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Manifold building, back-end pressure loops, and structural drainage execution for vanished bath appliances.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl space-y-2">
              <h4 className="text-sm font-bold text-[#d4a373] uppercase tracking-wider">02 / Electrical Networks</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Low-voltage lighting controller links, automated home panel pairings, and dedicated main power distributions.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl space-y-2 sm:col-span-2">
              <h4 className="text-sm font-bold text-[#d4a373] uppercase tracking-wider">03 / Architectural Light Positioning</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Laser-aligned track systems, heavy chandeliers, and master wet-zone ambient luminaire integration.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Catalog", href: "/catalog" },
  ];

  return (
    <>
      {/* DESKTOP NAV (Hidden on mobile) */}
      <div className="hidden lg:flex items-center gap-10">
        <nav className="flex items-center gap-10 text-sm uppercase tracking-[0.2em] font-bold text-neutral-400">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors duration-300 ${
                pathname === link.href ? "text-[#d99b62]" : "hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Optional Desktop Login to match */}
        <Link 
          href="/login"
          className="text-sm uppercase tracking-[0.2em] font-bold text-neutral-400 hover:text-white transition-colors duration-300 ml-4 border-l border-neutral-800 pl-10"
        >
          Login
        </Link>
      </div>

      {/* MOBILE TOGGLE BUTTON */}
      <button 
        className="lg:hidden flex flex-col gap-1.5 p-2 text-white z-50 relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* MOBILE MODAL NAVIGATION DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-50 lg:hidden flex">
          
          {/* Backdrop Scrim */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Solid Drawer Body */}
          <div className="relative w-[300px] sm:w-[340px] h-full bg-[#0d0e11] text-white p-6 flex flex-col justify-between shadow-2xl border-r border-neutral-800/50 animate-slide-in">
            <div>
              
              {/* Header inside the drawer */}
              <div className="flex items-center justify-between pb-6 pt-4 border-b border-neutral-800/60">
                <span className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
                  Luxury Fixtures
                </span>
                
                {/* Minimalist Top Actions Group */}
                <div className="flex items-center gap-6">
                  <Link 
                    href="/login" 
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-bold tracking-[0.2em] text-neutral-400 hover:text-[#d99b62] transition-colors uppercase"
                  >
                    Login
                  </Link>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-400 hover:text-white text-lg p-1 transition-colors relative -top-[1px]"
                    aria-label="Close Menu"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Navigation Links Stack */}
              <nav className="flex flex-col gap-3 mt-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center h-14 px-6 rounded-full text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-200 ${
                        isActive
                          ? "bg-[#d99b62] text-[#0a0b0d] font-bold shadow-lg shadow-[#d99b62]/10"
                          : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="text-[10px] text-neutral-600 tracking-widest uppercase border-t border-neutral-800/40 pt-4">
              © Luxury Fixtures
            </div>
          </div>
        </div>
      )}
    </>
  );
}
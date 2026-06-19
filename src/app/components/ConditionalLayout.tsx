'use client';

import { usePathname } from 'next/navigation';
import Navbar from "./Navbar";
import Footer from "./Footer";
import Link from "next/link";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPos = pathname.startsWith('/pos');

  return (
    <>
      {!isPos && (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 mt-6 flex justify-center">
          <header className="w-full max-w-5xl bg-[#0a0b0d]/80 backdrop-blur-xl border border-white/10 rounded-full px-8 h-20 flex items-center justify-between shadow-2xl shadow-black/50">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 flex items-center justify-center border border-white/20 rounded-md bg-[#0d0e12] group-hover:border-[#d99b62] transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-white group-hover:text-[#d99b62] transition-colors duration-300 stroke-[1.5]">
                  <path d="M12 2L2 12h20L12 2z" />
                  <path d="M12 22L2 12h20L12 22z" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" className="text-[#d99b62]" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-[0.25em] text-white uppercase leading-none group-hover:text-[#d99b62] transition-colors duration-300">Luxury</span>
                <span className="text-[9px] font-mono tracking-[0.4em] text-neutral-400 uppercase font-light mt-0.5">Fixtures</span>
              </div>
            </Link>

            <Navbar />

            <Link href="/login" className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-300 hover:text-[#d99b62] transition-all px-5 py-2.5 border border-white/10 rounded-full hover:border-[#d99b62]/30">
              Login
            </Link>
          </header>
        </div>
      )}

      {/* The main content rendered regardless */}
      <main className={!isPos ? "pt-32" : ""}>
        {children}
      </main>

      {!isPos && <Footer />}
    </>
  );
}
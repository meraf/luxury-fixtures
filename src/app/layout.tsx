import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUXURY FIXTURES | Exceptional Hardware & Lighting Systems",
  description: "Bespoke architectural lighting arrays and structural hardware.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0b0d] text-[#f4ebd9] antialiased min-h-screen flex flex-col justify-between">
        
        {/* PILL NAVIGATION LAYER */}
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

            {/* DYNAMIC NAVBAR COMPONENT */}
            <Navbar />

            {/* LOGIN */}
            <Link href="/login" className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-300 hover:text-[#d99b62] transition-all px-5 py-2.5 border border-white/10 rounded-full hover:border-[#d99b62]/30">
              Login
            </Link>
            
          </header>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-grow pt-32">
          {children}
        </main>

        {/* FOOTER COMPONENT */}
        <Footer /> 

      </body>
    </html>
  );
}
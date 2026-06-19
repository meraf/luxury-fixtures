'use client';

import { useAuth } from "@/components/context/AuthContext";

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    // 'w-full' ensures we take the full width without screen-size glitches
    // 'overflow-hidden' on the root ensures the app doesn't scroll globally
    <div className="flex h-screen w-full bg-white text-slate-900 overflow-hidden">
      
      {/* Sidebar: flex-shrink-0 prevents it from being squished */}
      <div className="flex-shrink-0">

      </div>

      {/* Main Content Area */}
      {/* 
        1. flex-1: Takes up remaining space
        2. flex flex-col: Stacks children vertically
        3. min-w-0: THIS IS THE FIX. It prevents flex children from expanding past their bounds 
           and solves the cutoff issue seen in image_4925e4.png
      */}
      <div className="flex-1 flex flex-col h-full min-w-0"> 
        
        {/* 
          main: overflow-y-auto allows internal scrolling.
          overflow-x-hidden ensures no side-to-side scrolling. 
        */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
          <div className="max-w-full">
             {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
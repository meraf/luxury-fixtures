'use client';
import POSSidebar from "../components/POSSidebar";
import { useAuth } from "@//components/context/AuthContext";

export default function POSLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex bg-[#121419] min-h-screen text-white">

      <div className="flex-1 flex flex-col">
        {/* Your header/navbar content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
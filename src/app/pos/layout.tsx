import POSSidebar from "../components/POSSidebar";

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[#121419] min-h-screen text-white">
     
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
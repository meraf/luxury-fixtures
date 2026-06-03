export default function SellingPage() {
  return (
    <div className="flex h-[calc(100vh-64px)] gap-6">
      <div className="flex-1 bg-[#0a0b0d] p-6 rounded border border-white/10 overflow-y-auto">
        <h1 className="text-2xl mb-6 font-serif">Catalog</h1>
        {/* Product grid goes here */}
      </div>
      <div className="w-80 bg-[#0a0b0d] p-6 rounded border border-white/10 flex flex-col">
        <h2 className="text-xl mb-4 font-serif">Cart</h2>
        <div className="flex-1"></div>
        <button className="w-full bg-[#d99b62] text-black py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors">
          Complete Sale
        </button>
      </div>
    </div>
  );
}
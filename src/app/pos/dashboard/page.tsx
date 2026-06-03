export default function DashboardPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#0a0b0d] p-6 border border-white/10 rounded">
          <p className="text-neutral-500 uppercase text-xs tracking-widest">Revenue</p>
          <p className="text-2xl mt-2">$12,400</p>
        </div>
      </div>
    </div>
  );
}

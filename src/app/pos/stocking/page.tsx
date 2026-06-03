export default function StockingPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
      <div className="bg-[#0a0b0d] p-6 border border-white/10 rounded">
        <table className="w-full text-left">
          <thead>
            <tr className="text-neutral-500 border-b border-white/10 uppercase text-xs tracking-widest">
              <th className="pb-4">Product</th>
              <th className="pb-4">Stock</th>
              <th className="pb-4">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5 hover:bg-white/5">
              <td className="py-4">Luxury Fixture A</td>
              <td className="py-4">12</td>
              <td className="py-4">$299.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
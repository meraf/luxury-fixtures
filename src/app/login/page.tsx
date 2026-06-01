export default function LuxuryAdminLogin() {
  return (
    <main className="min-h-screen flex w-full bg-white">
      
      {/* LEFT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-sm space-y-10">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-serif text-slate-900">Admin Portal</h2>
            <p className="text-slate-500 text-sm">Welcome back. Please authenticate to manage your inventory.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Email Address</label>
              <input 
                type="email" 
                className="w-full border-b border-slate-300 py-3 focus:border-slate-900 outline-none transition-colors text-sm text-slate-900 placeholder-gray-600" 
                placeholder="admin@luxuryfixtures.com" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Password</label>
              <input 
                type="password" 
                className="w-full border-b border-slate-300 py-3 focus:border-slate-900 outline-none transition-colors text-sm text-slate-900 placeholder-black" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-4 rounded font-medium hover:bg-black transition-all shadow-lg mt-4"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Light Lifestyle Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-50 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('/image_f22615.jpg')" }}
        />
        {/* Soft white overlay to keep the image feeling 'light' and airy */}
        <div className="absolute inset-0 bg-white/20" />
      </div>
      
    </main>
  );
}
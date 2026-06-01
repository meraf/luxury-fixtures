export default function ContactPage() {
  return (
    <main className="w-full bg-[#FAFAFA] text-slate-900 min-h-screen py-16">
      
      {/* 1. HERO */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <h1 className="text-5xl md:text-7xl font-serif leading-[0.9] tracking-tight mb-6">
          Let’s <span className="italic text-slate-400">collaborate.</span>
        </h1>
        <p className="text-slate-500 font-sans tracking-wide uppercase text-sm">
          Precision, fabrication, and design.
        </p>
      </section>

      {/* 2. GRID LAYOUT */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-10 md:p-12 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl font-serif mb-8 text-slate-800">Send a request</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Your Name" />
                <input type="email" className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Email Address" />
              </div>
              <textarea rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Tell us about your project..." />
              <button className="w-full bg-slate-900 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Info + Map */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Contact Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            <h2 className="text-xl font-serif">Connect</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-slate-600">
                <div className="bg-slate-100 p-2 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <span className="font-sans">+251 11 123 4567</span>
              </div>
              <div className="flex items-center space-x-4 text-slate-600">
                <div className="bg-slate-100 p-2 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span className="font-sans">hello@yourstudio.com</span>
              </div>
            </div>

            <a 
              href="https://t.me/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="animate-bounce inline-flex items-center space-x-3 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.24-1.51-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.15-.04-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.4-1.08.39-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.07 5.8-2.4 2.76-.95 3.32-1.15 3.7-1.15.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06 0 .12 0 .19z"/></svg>
              <span className="text-sm font-medium">Chat on Telegram</span>
            </a>
          </div>

          {/* Map Card */}
          <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=8.785137,38.912950" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full h-[200px] rounded-xl overflow-hidden relative group"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d985.7528698652003!2d38.912950!3d8.785137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDcnMDYuNSJOIDM4wrA1NCc0Ni42IkU!5e0!3m2!1sen!2set!4v1780319749313!5m2!1sen!2set"
                width="100%" 
                height="100%" 
                style={{ border: 0, pointerEvents: 'none' }} 
                loading="lazy" 
                title="Studio Location"
              ></iframe>
              <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white bg-blue-600 px-6 py-2 rounded-full text-xs uppercase tracking-widest font-medium">Navigate</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
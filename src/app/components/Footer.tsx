export default function Footer() {
  return (
    <footer className="bg-[#050607] border-t border-white/10 py-16 px-8 text-[10px] uppercase tracking-widest text-neutral-500">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP SECTION: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Column 1: Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-serif text-lg normal-case tracking-normal mb-2">Contact & Location</h3>
            <p>Addis Ababa, Ethiopia</p>
            <p>+251 900 000 000</p>
            <p>concierge@luxury-fixtures.com</p>
          </div>

          {/* Column 2: Expertise */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-serif text-lg normal-case tracking-normal mb-2">Our Expertise</h3>
            <p>Bespoke Architectural Lighting Arrays</p>
            <p>Premium Bathroom Appliance Solutions</p>
            <p>Custom Hardware Engineering</p>
          </div>

          {/* Column 3: Map */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-serif text-lg normal-case tracking-normal mb-2">Our Location</h3>
            <div className="w-full h-32 border border-white/10 rounded overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126117.8466635234!2d38.68361546738593!3d9.005546205727937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b03ce024d6!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2set!4v1717244300000!5m2!1sen!2set" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                title="Addis Ababa Location Map"
              />
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Branding */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-center gap-4">
          <span className="text-white font-bold tracking-[0.2em] w-full md:w-auto text-left">Luxury Fixtures</span>
          <span className="text-neutral-700 font-mono w-full md:w-auto text-center">2026</span>
          <span className="text-neutral-400 font-medium w-full md:w-auto text-right">Powered by Mafi Technologies</span>
        </div>

      </div>
    </footer>
  );
}
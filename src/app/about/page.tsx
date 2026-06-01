export default function AboutPage() {
  const services = [
    {
      title: "Grand Chandeliers",
      desc: "Light is the architecture of the room. We specialize in grand chandeliers and bespoke lighting arrays that define the scale and mood of your interior.",
      // Direct CDN link for the circular light fixture
      image: "https://images.unsplash.com/photo-1715948882565-ddc1ba98c3b9?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=omar-hakeem-wcz270oykcA-unsplash.jpg"
    },
    {
      title: "Sanctuary Elements",
      desc: "Our bathroom collections transform utility into serenity. From sculptural soaking tubs and minimalist washbasins to refined WCs, we select pieces that prioritize form and comfort.",
      // Direct CDN link for the bathroom
      image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=backbone-L4iRkKL5dng-unsplash.jpg"
    },
    {
      title: "Culinary Systems",
      desc: "The heart of the kitchen is the sink. We source high-capacity, deep-basin dishwashing systems that handle the demands of a modern kitchen without compromising on aesthetic finish.",
      // Direct CDN link for the kitchen sink
      image: "https://images.unsplash.com/photo-1769763828411-eb09bb05d97f?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=morzze-india-E9wk7TE7tVI-unsplash.jpg"
    },
    {
      title: "End-to-End Installation",
      desc: "We take full ownership of your project. From the foundational wiring and plumbing to the surgical final installation, our team ensures every component functions perfectly before we leave your site.",
      // Direct CDN link for the installation/tool visual
      image: "https://images.unsplash.com/photo-1620653713380-7a34b773fef8?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=marian-florinel-condruz-C-oYJoIfgCs-unsplash.jpg"
    }
  ];

  return (
    <main className="w-full bg-[#FAFAFA] text-black py-20 min-h-screen">
      
      {/* 1. HERO */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tighter mb-10">
          Precision <br/> <span className="italic text-stone-400">curated for you.</span>
        </h1>
        <p className="max-w-lg text-lg font-light leading-relaxed">
          From the glow of a chandelier to the final plumbing connection, we bring an architectural mindset to your home. We supply, we install, we perfect.
        </p>
      </section>

      {/* 2. SERVICES FLOW */}
      <div className="max-w-7xl mx-auto px-6 space-y-40">
        {services.map((service, index) => (
          <section key={index} className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            {/* Text Block */}
            <div className={`md:col-span-5 space-y-6 ${index % 2 !== 0 ? "md:order-2" : ""}`}>
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400">0{index + 1} //</span>
              <h2 className="text-4xl font-serif">{service.title}</h2>
              <p className="text-stone-600 font-light leading-relaxed">
                {service.desc}
              </p>
            </div>

            {/* Image Block */}
            <div className={`md:col-span-7 ${index % 2 !== 0 ? "md:order-1" : ""}`}>
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-auto shadow-2xl transition-transform duration-700 hover:scale-[1.02] bg-stone-200" 
              />
            </div>
          </section>
        ))}
      </div>

      {/* 3. FINAL STATEMENT */}
      <section className="max-w-4xl mx-auto mt-48 px-6 text-center">
        <div className="w-16 h-[1px] bg-black mx-auto mb-12"></div>
        <p className="text-2xl font-serif italic mb-8">
          "The blend of technical capability and aesthetic vision is unmatched. They handled the wiring, the fabrication, and the installation seamlessly."
        </p>
        <p className="text-xs uppercase tracking-[0.3em] font-medium">— Fasika Masersha, Addis Ababa</p>
      </section>
      
    </main>
  );
}
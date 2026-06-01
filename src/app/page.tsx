export default function HomePage() {
  return (
    <div style={{ 
      backgroundColor: "#0a0a0a", 
      color: "#f5f5f7", 
      minHeight: "100vh", 
      fontFamily: "serif, system-ui",
      padding: "60px 20px"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Luxury Brand Header */}
        <header style={{ 
          textAlign: "center", 
          marginBottom: "80px", 
          borderBottom: "1px solid #262626", 
          paddingBottom: "40px" 
        }}>
          <span style={{ 
            color: "#d4af37", 
            textTransform: "uppercase", 
            letterSpacing: "0.3em", 
            fontSize: "13px",
            display: "block",
            marginBottom: "12px"
          }}>
            Maison des Luminaires & Bain
          </span>
          <h1 style={{ 
            color: "#ffffff", 
            fontSize: "48px", 
            fontWeight: "300", 
            margin: 0,
            letterSpacing: "-0.02em"
          }}>
            Luxury Fixtures & Cabinetry
          </h1>
          <p style={{ 
            color: "#a3a3a3", 
            marginTop: "12px", 
            fontSize: "16px", 
            fontStyle: "italic",
            fontFamily: "sans-serif" 
          }}>
            Bespoke Architectural Light, Crystal Chandeliers & Haute Bath Appliances
          </p>
        </header>

        {/* Exclusive Collection Mockup Showcase */}
        <main>
          <h2 style={{ 
            fontSize: "14px", 
            textTransform: "uppercase", 
            letterSpacing: "0.2em", 
            color: "#d4af37", 
            marginBottom: "32px",
            textAlign: "center",
            fontFamily: "sans-serif"
          }}>
            Curated Showroom Status
          </h2>

          {/* Luxury Card Grid */}
          <div style={{ 
            display: "grid", 
            gap: "32px", 
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" 
          }}>
            
            {/* Showroom Status Card */}
            <div style={{ 
              background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)", 
              padding: "40px", 
              borderRadius: "0px", // Sharp, elegant corners for luxury feel
              border: "1px solid #262626", 
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
            }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#d4af37", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "sans-serif" }}>
                Vault Integration
              </h3>
              <p style={{ fontSize: "24px", fontWeight: "300", color: "#ffffff", margin: "0 0 12px 0" }}>
                Standby Mode
              </p>
              <p style={{ fontSize: "14px", color: "#737373", margin: 0, fontFamily: "sans-serif", lineHeight: "1.6" }}>
                The core catalog network is insulated. Ready to synchronize premium crystal tiering and custom metal hardware metrics.
              </p>
            </div>

            {/* Chandelier & Lighting Counter */}
            <div style={{ 
              background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)", 
              padding: "40px", 
              borderRadius: "0px", 
              border: "1px solid #262626", 
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
            }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#d4af37", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "sans-serif" }}>
                Luminaires Catalog
              </h3>
              <p style={{ fontSize: "56px", fontWeight: "200", color: "#ffffff", margin: "0 0 8px 0", lineHeight: "1" }}>
                —
              </p>
              <p style={{ fontSize: "14px", color: "#737373", margin: 0, fontFamily: "sans-serif", lineHeight: "1.6" }}>
                Cascading crystal masterpieces, modern minimalist ring lights, and recessed solid-brass gallery spotlights awaiting deploy.
              </p>
            </div>

            {/* Haute Bath Appliances Counter */}
            <div style={{ 
              background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)", 
              padding: "40px", 
              borderRadius: "0px", 
              border: "1px solid #262626", 
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
            }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#d4af37", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "sans-serif" }}>
                Sanitary Atelier
              </h3>
              <p style={{ fontSize: "56px", fontWeight: "200", color: "#ffffff", margin: "0 0 8px 0", lineHeight: "1" }}>
                0
              </p>
              <p style={{ fontSize: "14px", color: "#737373", margin: 0, fontFamily: "sans-serif", lineHeight: "1.6" }}>
                Matte black smart rain-showers, monolithic stone basins, and thermostatic gold-plated wash fixtures offline.
              </p>
            </div>

          </div>

          {/* Elegant Footer Placeholder */}
          <footer style={{ marginTop: "100px", textAlign: "center", color: "#404040", fontFamily: "sans-serif", fontSize: "13px", letterSpacing: "0.1em" }}>
            © 2026 MAISON DESIGN INTERNATIONAL • ALL RIGHTS RESERVED
          </footer>
        </main>

      </div>
    </div>
  );
}
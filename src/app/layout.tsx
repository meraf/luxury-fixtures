export default function HomePage() {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header Section */}
      <header style={{ marginBottom: "32px", borderBottom: "2px solid #e2e8f0", paddingBottom: "16px" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", margin: 0, fontWeight: "700" }}>
          ✨ Luxury Fixtures & Cabinetry
        </h1>
        <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "16px" }}>
          Management POS & Inventory Workspace (Offline Mode)
        </p>
      </header>

      {/* Grid Stats Cards */}
      <main style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        
        {/* Card 1 */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            System Status
          </h3>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b", margin: 0 }}>
            🟡 Interface Mockup
          </p>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Disconnected from database streams</span>
        </div>

        {/* Card 2 */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Total Catalog Products
          </h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
            --
          </p>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Awaiting schema initialization</span>
        </div>

        {/* Card 3 */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Active Showrooms
          </h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#3b82f6", margin: 0 }}>
            0
          </p>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>No active outlet connections</span>
        </div>

      </main>
    </div>
  );
}
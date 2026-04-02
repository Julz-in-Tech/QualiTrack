function AppShell({ children }) {
  return (
    <main className="app-shell">
      <section className="hero">
        <article className="hero-card">
          <span className="eyebrow">QualiTrack MVP</span>
          <h1>Incoming Quality Control</h1>
          <p>
            Capture supplier inspections, keep failed stock visible, and raise an NCR in the
            same workflow. This scaffold is designed to grow into a multi-module quality
            management platform.
          </p>
        </article>

        <div className="hero-grid">
          <article className="hero-card metric-card">
            <strong>Traceability first</strong>
            <span>PO number, part number, supplier, and inspector stay linked from day one.</span>
          </article>
          <article className="hero-card metric-card">
            <strong>Enterprise-ready flow</strong>
            <span>Validation, PostgreSQL constraints, and NCR automation are already planned in.</span>
          </article>
        </div>
      </section>

      {children}
    </main>
  );
}

export default AppShell;

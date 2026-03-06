import "../CSS/snapshot.css";

export default function FinancialSnapshot() {
  return (
    <section className="lp-snapshot" id="pricing">
      <div className="lp-snapshot__inner">
        <div className="lp-snapshot__header">
          <h2>Your Financial Snapshot</h2>
          <span className="lp-snapshot__menu">⋮</span>
        </div>

        <div className="lp-snapshot__body">
          <article className="lp-snapshot__stat">
            <p>This Month</p>
            <strong>$3570</strong>
            <span className="lp-snapshot__trend">↗</span>
          </article>

          <p className="lp-snapshot__copy">
            Our platform helps you manage, track, and optimize your finances.
          </p>
        </div>
      </div>
    </section>
  );
}

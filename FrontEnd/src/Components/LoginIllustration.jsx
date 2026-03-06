import "../CSS/illustration.css";

const orbitItems = [
  { label: "Mobile App", className: "orbit-mobile", icon: "📱" },
  { label: "Web Dashboard", className: "orbit-dashboard", icon: "🖥" },
  { label: "Bank Sync", className: "orbit-bank", icon: "🏦" },
  { label: "Analytics", className: "orbit-analytics", icon: "📈" },
  { label: "Reports", className: "orbit-reports", icon: "🧾" },
  { label: "Budget Planning", className: "orbit-budget", icon: "💰" },
];

export default function LoginIllustration() {
  return (
    <section className="et-illustration">
      <div className="et-illustration__panel">
        <h2>
          Track Your Expenses <span>Anywhere</span>
        </h2>

        <div className="et-orbit">
          <div className="et-orbit__ring et-orbit__ring--outer" />
          <div className="et-orbit__ring et-orbit__ring--middle" />
          <div className="et-orbit__ring et-orbit__ring--inner" />

          <div className="et-orbit__center">
            <span>ET</span>
          </div>

          {orbitItems.map((item) => (
            <div
              key={item.label}
              className={`et-orbit__node ${item.className}`}
              aria-label={item.label}
              title={item.label}
            >
              <span>{item.icon}</span>
            </div>
          ))}
        </div>

        <p className="et-illustration__text">
          Compatible with mobile devices, web dashboards, and financial tools to
          help you manage your expenses anytime, anywhere.
        </p>

        <div className="et-illustration__pager" aria-hidden="true">
          <span className="active" />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

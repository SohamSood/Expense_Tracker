import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/dashboard.css";
import "../CSS/viewBills.css";

const sideItems = [
  { label: "Dashboard", icon: "◫", path: "/dashboard" },
  { label: "Add Bill", icon: "↔", path: "/add-bill" },
  { label: "View Bills", icon: "▤", path: "/view_Bills", active: true },
  { label: "Cards", icon: "▣" },
  { label: "Settings", icon: "⚙" },
];

function Brand() {
  return (
    <div className="db-brand">
      <span className="db-brand__mark">
        <span />
      </span>
      <span className="db-brand__text">Expense Tracker</span>
    </div>
  );
}

export default function ViewBills() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    async function fetchBills() {
      try {
        const res = await fetch("http://localhost:5001/api/bills");
        const data = await res.json();
        setBills(Array.isArray(data) ? data : data.bills ?? []);
      } catch (err) {
        console.error(err);
        setBills([]);
      }
    }

    fetchBills();
  }, []);

  return (
    <main className="db-page">
      <div className="db-shell">
        <aside className="db-sidebar">
          <Brand />
          <nav className="db-sidebar__nav">
            {sideItems.map((item) => (
              <button
                type="button"
                key={item.label}
                className={`db-sideitem ${item.active ? "is-active" : ""}`}
                aria-label={item.label}
                title={item.label}
                onClick={item.path ? () => navigate(item.path) : undefined}
              >
                <span>{item.icon}</span>
              </button>
            ))}
          </nav>
          <button type="button" className="db-sideitem db-sideitem--bottom">
            <span>?</span>
          </button>
        </aside>

        <section className="db-main">
          <header className="db-topbar">
            <div className="db-tabs">
              <button type="button" className="is-active">
                Overview
              </button>
              <button type="button">Activity</button>
              <button type="button">Manage</button>
              <button type="button">Program</button>
              <button type="button">Account</button>
              <button type="button">Reports</button>
            </div>

            <div className="db-topbar__right">
              <div className="db-topbar__icons">
                <button type="button">⌕</button>
                <button type="button">◌</button>
                <button type="button">!</button>
              </div>

              <div className={`db-profile ${dropdownOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="db-profile__button"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <span className="db-profile__avatar">SS</span>
                  <span className="db-profile__meta">
                    <strong>Sunaina Sharma</strong>
                    <small>sunaina.sharma@expense.app</small>
                  </span>
                  <span className="db-profile__chevron">⌄</span>
                </button>

                <div className="db-profile__menu">
                  <button type="button">Account</button>
                  <button type="button">Settings</button>
                  <button type="button">Logout</button>
                </div>
              </div>
            </div>
          </header>

          <div className="db-content">
            <section className="view-bills-page">
              <div className="view-bills-page__header">
                <p className="db-welcome__eyebrow">Expense records</p>
                <h1>View Bills</h1>
              </div>

              <div className="view-bills-card db-card">
                {bills.length === 0 ? (
                  <p className="view-bills-empty">No bills recorded yet.</p>
                ) : (
                  <div className="bills-table">
                    <div className="table-header">
                      <span>Bill ID</span>
                      <span>Type</span>
                      <span>Amount</span>
                      <span>Status</span>
                      <span>Date</span>
                      <span>Time</span>
                    </div>

                    {bills.map((bill) => (
                      <div className="table-row" key={bill.id}>
                        <span>{bill.id}</span>
                        <div className="bill-type-cell">
                          <span>{bill.type}</span>
                          {bill.items?.length ? (
                            <small>
                              {bill.items
                                .map((item) => `${item.name} (₹${item.price})`)
                                .join(", ")}
                            </small>
                          ) : null}
                        </div>
                        <span>₹{bill.amount}</span>
                        <span
                          className={`bill-status ${
                            bill.status?.toLowerCase() === "paid"
                              ? "is-paid"
                              : "is-pending"
                          }`}
                        >
                          {bill.status}
                        </span>
                        <span>{bill.date}</span>
                        <span>{bill.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

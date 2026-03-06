import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BillForm from "../Components/BillForm";
import "../CSS/addbill.css";
import "../CSS/dashboard.css";

const sideItems = [
  { label: "Dashboard", icon: "◫", path: "/dashboard" },
  { label: "Add Bill", icon: "↔", path: "/add-bill", active: true },
  { label: "View Bills", icon: "▤", path: "/view_Bills" },
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

export default function AddBill() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submittedBill, setSubmittedBill] = useState(null);

  const handleAddBill = (billData) => {
    setSubmittedBill(billData);
  };

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
            <section className="add-bill-page">
              <div className="add-bill-page__header">
                <p className="db-welcome__eyebrow">Expense management</p>
                <h1>Add Bills</h1>
                <p>Track a new bill and review the latest submitted details.</p>
              </div>

              <div className="add-bill-card db-card">
                <BillForm onSubmit={handleAddBill} />
              </div>

              {submittedBill ? (
                <div className="add-bill-card db-card">
                  <h3>Latest Submission</h3>
                  <p>ID: {submittedBill.id}</p>
                  <p>Type: {submittedBill.type}</p>
                  <p>Amount: ₹{submittedBill.amount}</p>
                  <p>Date: {submittedBill.date}</p>
                  <p>Time: {submittedBill.time}</p>
                  <p>Status: {submittedBill.status}</p>
                </div>
              ) : null}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

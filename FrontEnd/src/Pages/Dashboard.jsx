import { useMemo, useState } from "react";
import "../CSS/dashboard.css";

const stats = [
  { title: "Total Balance", value: "₹689,372.00", change: "+5%", tone: "wide" },
  { title: "Total Earnings", value: "₹950", change: "+7%", tone: "accent" },
  { title: "Total Spending", value: "₹700", change: "-5%", tone: "light" },
  { title: "Total Income", value: "₹1050", change: "+8%", tone: "light" },
  { title: "Total Revenue", value: "₹850", change: "+4%", tone: "light" },
];

const chartData = [
  { month: "Jan", profit: 28, loss: 19 },
  { month: "Feb", profit: 34, loss: 16 },
  { month: "Mar", profit: 26, loss: 13 },
  { month: "Apr", profit: 31, loss: 18 },
  { month: "May", profit: 35, loss: 16 },
  { month: "Jun", profit: 41, loss: 24 },
  { month: "Jul", profit: 33, loss: 18 },
  { month: "Aug", profit: 27, loss: 14 },
];

const activities = [
  {
    id: "INV_000076",
    activity: "Mobile App Purchase",
    price: "₹25,500",
    status: "Completed",
    date: "17 Apr, 2026 03:45 PM",
  },
  {
    id: "INV_000075",
    activity: "Hotel Booking",
    price: "₹32,750",
    status: "Pending",
    date: "15 Apr, 2026 11:30 AM",
  },
  {
    id: "INV_000074",
    activity: "Flight Ticket Booking",
    price: "₹40,200",
    status: "Completed",
    date: "15 Apr, 2026 12:00 PM",
  },
  {
    id: "INV_000073",
    activity: "Grocery Purchase",
    price: "₹50,200",
    status: "In Progress",
    date: "14 Apr, 2026 09:15 PM",
  },
];

const sideItems = [
  { label: "Dashboard", icon: "◫", active: true },
  { label: "Transactions", icon: "↔" },
  { label: "Reports", icon: "▤" },
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

function AnalyticsChart() {
  return (
    <div className="db-chart">
      <div className="db-chart__header">
        <div>
          <h3>Total Income</h3>
          <p>View your income in a certain period of time</p>
        </div>
        <div className="db-chart__legend">
          <span>
            <i className="profit" />
            Profit
          </span>
          <span>
            <i className="loss" />
            Loss
          </span>
        </div>
      </div>

      <div className="db-chart__body">
        {chartData.map((item) => (
          <div key={item.month} className="db-chart__group">
            <div className="db-chart__bars">
              <span
                className="profit"
                style={{ height: `${item.profit * 1.7}px` }}
              />
              <span
                className="loss"
                style={{ height: `${item.loss * 1.7}px` }}
              />
            </div>
            <small>{item.month}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const featuredStats = useMemo(() => stats.slice(1), []);

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

          <div className="db-welcome">
            <div>
              <p className="db-welcome__eyebrow">Expense overview</p>
              <h1>Good morning, Sunaina</h1>
              <p>
                Stay on top of your spending, savings, and account activity.
              </p>
            </div>
          </div>

          <section className="db-grid">
            <div className="db-column db-column--primary">
              <article className="db-card db-balance-card">
                <div className="db-card__row">
                  <div>
                    <p>Total Balance</p>
                    <h2>{stats[0].value}</h2>
                  </div>
                  <div className="db-chip">INR</div>
                </div>
                <span className="db-growth">
                  {stats[0].change} than last month
                </span>

                <div className="db-balance-actions">
                  <button type="button" className="is-dark">
                    Transfer
                  </button>
                  <button type="button">Request</button>
                </div>

                <div className="db-wallets">
                  <div className="db-wallet">
                    <strong>₹22,678.00</strong>
                    <span>Wallet 01</span>
                    <small>Active</small>
                  </div>
                  <div className="db-wallet">
                    <strong>₹18,345.00</strong>
                    <span>Wallet 02</span>
                    <small>Active</small>
                  </div>
                  <div className="db-wallet">
                    <strong>₹15,000.00</strong>
                    <span>Wallet 03</span>
                    <small>Active</small>
                  </div>
                </div>
              </article>

              <article className="db-card db-limit-card">
                <h3>Monthly Spending Limit</h3>
                <div className="db-progress">
                  <span />
                </div>
                <div className="db-progress__labels">
                  <strong>₹1,400.00 spent</strong>
                  <span>of ₹5,500.00</span>
                </div>
              </article>

              <article className="db-card db-cards-card">
                <div className="db-card__row">
                  <h3>My Cards</h3>
                  <button type="button" className="db-add-btn">
                    + Add new
                  </button>
                </div>
                <div className="db-card-stack">
                  <div className="db-bank-card db-bank-card--dark">
                    <span>Expense Prime</span>
                    <strong>₹ 98,500</strong>
                    <small>Active</small>
                  </div>
                  <div className="db-bank-card db-bank-card--blue">
                    <span>Expense Plus</span>
                    <strong>₹ 42,000</strong>
                    <small>Active</small>
                  </div>
                </div>
              </article>
            </div>

            <div className="db-column db-column--secondary">
              <div className="db-stat-grid">
                {featuredStats.map((item) => (
                  <article
                    key={item.title}
                    className={`db-card db-stat-card ${item.tone === "accent" ? "is-accent" : ""}`}
                  >
                    <p>{item.title}</p>
                    <h3>{item.value}</h3>
                    <span>{item.change} This month</span>
                  </article>
                ))}
              </div>

              <AnalyticsChart />
            </div>
          </section>

          <section className="db-card db-activity-card">
            <div className="db-card__row">
              <h3>Recent Activities</h3>
              <div className="db-table-tools">
                <input type="text" placeholder="Search" />
                <button type="button">Filter</button>
              </div>
            </div>

            <div className="db-table">
              <div className="db-table__head">
                <span>Order ID</span>
                <span>Activity</span>
                <span>Price</span>
                <span>Status</span>
                <span>Date</span>
              </div>

              {activities.map((item) => (
                <div key={item.id} className="db-table__row">
                  <span>{item.id}</span>
                  <span>{item.activity}</span>
                  <span>{item.price}</span>
                  <span
                    className={`db-status ${item.status.toLowerCase().replace(" ", "-")}`}
                  >
                    {item.status}
                  </span>
                  <span>{item.date}</span>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

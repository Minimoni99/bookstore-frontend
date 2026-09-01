"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import AdminNav from "../components/AdminNav";
import RequireAdmin from "../components/RequireAdmin";

const PERIODS = [
  { key: "day", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "all", label: "All Time" },
];

const CHART_TITLES = {
  day: "Income today (hourly)",
  week: "Income this week (daily)",
  month: "Income this month (daily)",
  all: "Income since launch (monthly)",
};

function money(cents) {
  return "$" + (cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Chart({ values }) {
  const w = 600, h = 200, pad = 10;
  const max = Math.max(...values, 1);
  const stepX = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `${points} ${w - pad},${h - pad} ${pad},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: 220, display: "block" }}>
      <defs>
        <linearGradient id="goldFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0c374" />
          <stop offset="100%" stopColor="#f0c374" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#goldFade)" opacity="0.35" />
      <polyline points={points} fill="none" stroke="#f0c374" strokeWidth="2.5" />
    </svg>
  );
}

function Dashboard() {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/admin/dashboard?period=${period}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [period]);

  return (
    <div className="admin-main">
      <div className="section-title"><h2>Dashboard</h2></div>

      <div className="timeline-picker">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            className={period === p.key ? "active" : ""}
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <div className="error">{error}</div>}
      {!data && !error && <p style={{ color: "var(--ink-soft)" }}>Loading…</p>}

      {data && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="label">Total Users</div>
              <div className="value">{data.totalUsers}</div>
              <div className="sub">{data.regularCount} regular · {data.premiumCount} premium</div>
            </div>
            <div className="stat-card">
              <div className="label">Income (selected period)</div>
              <div className="value">{money(data.incomeCents)}</div>
            </div>
            <div className="stat-card">
              <div className="label">Books Sold</div>
              <div className="value">{data.booksSold}</div>
              <div className="sub">across {data.distinctTitlesSold} titles</div>
            </div>
            <div className="stat-card">
              <div className="label">New Users</div>
              <div className="value">{data.newUsers}</div>
              <div className="sub">{data.newRegular} regular · {data.newPremium} premium</div>
            </div>
          </div>

          <div className="card chart-card">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>{CHART_TITLES[period]}</h3>
            <Chart values={data.chart} />
          </div>

          <div className="two-col">
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 14 }}>Top books this period</h3>
              <table>
                <thead><tr><th>Title</th><th>Sold</th><th>Revenue</th></tr></thead>
                <tbody>
                  {data.topBooks.length === 0 && <tr><td colSpan={3}>No sales in this period yet.</td></tr>}
                  {data.topBooks.map((b, i) => (
                    <tr key={i}><td>{b.title}</td><td>{b.sold}</td><td>{money(b.revenueCents)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 14 }}>User breakdown</h3>
              <table>
                <thead><tr><th>Type</th><th>Count</th></tr></thead>
                <tbody>
                  <tr><td>Regular users</td><td>{data.regularCount}</td></tr>
                  <tr><td>Premium subscribers</td><td>{data.premiumCount}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RequireAdmin>
      <div className="admin-shell">
        <AdminNav />
        <Dashboard />
      </div>
    </RequireAdmin>
  );
}

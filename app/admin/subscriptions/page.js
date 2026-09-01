"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminNav from "../../components/AdminNav";
import RequireAdmin from "../../components/RequireAdmin";

function AdminSubscriptions() {
  const [subs, setSubs] = useState([]);
  useEffect(() => { api("/api/admin/subscriptions").then((d) => setSubs(d.subscriptions)); }, []);

  return (
    <div className="admin-main">
      <h2>Subscriptions</h2>
      <table style={{ marginTop: 20 }}>
        <thead><tr><th>Subscriber</th><th>Status</th><th>Since</th></tr></thead>
        <tbody>
          {subs.length === 0 && <tr><td colSpan={3}>No subscriptions yet.</td></tr>}
          {subs.map((s) => (
            <tr key={s.id}>
              <td>{s.userEmail || s.userId}</td>
              <td><span className={`tag ${s.status === "active" ? "paid" : "pending"}`}>{s.status}</span></td>
              <td>{new Date(s.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  return (
    <RequireAdmin>
      <div className="admin-shell">
        <AdminNav />
        <AdminSubscriptions />
      </div>
    </RequireAdmin>
  );
}

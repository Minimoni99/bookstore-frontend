"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminNav from "../../components/AdminNav";
import RequireAdmin from "../../components/RequireAdmin";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api("/api/admin/orders").then((d) => setOrders(d.orders)); }, []);

  return (
    <div className="admin-main">
      <h2>Orders</h2>
      <table style={{ marginTop: 20 }}>
        <thead><tr><th>Buyer</th><th>Book</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {orders.length === 0 && <tr><td colSpan={6}>No orders yet.</td></tr>}
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.userEmail || o.userId}</td>
              <td>{o.bookTitle || o.bookId}</td>
              <td>${(o.amount / 100).toFixed(2)}</td>
              <td>{o.method}</td>
              <td><span className={`tag ${o.status === "paid" ? "paid" : "pending"}`}>{o.status}</span></td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <RequireAdmin>
      <div className="admin-shell">
        <AdminNav />
        <AdminOrders />
      </div>
    </RequireAdmin>
  );
}

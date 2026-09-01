"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminNav from "../../components/AdminNav";
import RequireAdmin from "../../components/RequireAdmin";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  async function load() { const { users } = await api("/api/admin/users"); setUsers(users); }
  useEffect(() => { load(); }, []);

  async function setRole(id, role) {
    await api(`/api/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) });
    load();
  }

  return (
    <div className="admin-main">
      <h2>Users</h2>
      <table style={{ marginTop: 20 }}>
        <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Joined</th><th></th></tr></thead>
        <tbody>
          {users.length === 0 && <tr><td colSpan={5}>No users yet.</td></tr>}
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td><td>{u.name}</td><td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                {u.role === "admin"
                  ? <a href="#" onClick={(e) => { e.preventDefault(); setRole(u.id, "customer"); }}>Remove admin</a>
                  : <a href="#" onClick={(e) => { e.preventDefault(); setRole(u.id, "admin"); }}>Make admin</a>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <RequireAdmin>
      <div className="admin-shell">
        <AdminNav />
        <AdminUsers />
      </div>
    </RequireAdmin>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, setSession, logout } from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const [view, setView] = useState("account"); // "account" | "settings"
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.push("/login?next=/account");
      return;
    }
    api("/api/auth/me").then((d) => {
      setData(d);
      setProfileForm({ name: d.user.name || "", email: d.user.email });
    }).catch((e) => setError(e.message));
  }, [router]);

  async function download(bookId) {
    try {
      const { downloadUrl } = await api(`/api/downloads/${bookId}`);
      window.open(downloadUrl, "_blank");
    } catch (e) {
      alert(e.message);
    }
  }

  async function saveProfile() {
    setProfileErr(""); setProfileMsg("");
    try {
      const { user, token } = await api("/api/auth/me", { method: "PUT", body: JSON.stringify(profileForm) });
      setSession(token, user);
      setData((d) => ({ ...d, user }));
      setProfileMsg("Saved.");
      setTimeout(() => setProfileMsg(""), 2500);
    } catch (e) {
      setProfileErr(e.message);
    }
  }

  async function savePassword() {
    setPwErr(""); setPwMsg("");
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwErr("New passwords don't match.");
      return;
    }
    try {
      await api("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwMsg("Password updated.");
      setTimeout(() => setPwMsg(""), 2500);
    } catch (e) {
      setPwErr(e.message);
    }
  }

  if (error) return <div className="wrap" style={{ padding: 50 }}><div className="error">{error}</div></div>;
  if (!data) return <div className="wrap" style={{ padding: 50 }}>Loading…</div>;

  const { user, orders, subscriptions } = data;

  return (
    <div className="wrap" style={{ padding: "50px 24px", maxWidth: 800 }}>

      {view === "account" && (
        <>
          <div className="section-title">
            <h1>My account</h1>
            <button className="btn btn-outline btn-sm" onClick={() => setView("settings")}>Profile Settings</button>
          </div>

          <div className="card" style={{ margin: "24px 0" }}>
            <strong>{user.name || user.email}</strong><br />
            <span style={{ color: "var(--ink-soft)", fontSize: 14 }}>{user.email}</span>
          </div>

          <h3>Orders</h3>
          <table>
            <thead><tr><th>Book</th><th>Amount</th><th>Method</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={5}>No orders yet.</td></tr>}
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.bookId || "Premium membership"}</td>
                  <td>${(o.amount / 100).toFixed(2)}</td>
                  <td>{o.method}</td>
                  <td><span className={`tag ${o.status === "paid" ? "paid" : "pending"}`}>{o.status}</span></td>
                  <td>{o.status === "paid" && o.bookId ? <a href="#" onClick={(e) => { e.preventDefault(); download(o.bookId); }}>Download</a> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 30 }}>Subscription</h3>
          <table>
            <thead><tr><th>Status</th><th>Since</th></tr></thead>
            <tbody>
              {subscriptions.length === 0 && <tr><td colSpan={2}>No active subscription.</td></tr>}
              {subscriptions.map((s) => (
                <tr key={s.id}><td>{s.status}</td><td>{s.createdAt}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {view === "settings" && (
        <>
          <div className="section-title">
            <h1>Profile Settings</h1>
            <button className="btn btn-outline btn-sm" onClick={() => setView("account")}>Back to Account</button>
          </div>

          <div className="card" style={{ margin: "24px 0" }}>
            <strong>{user.name || user.email}</strong><br />
            <span style={{ color: "var(--ink-soft)", fontSize: 14 }}>{user.email}</span>
          </div>

          <h3>Profile settings</h3>
          <div className="card" style={{ marginTop: 12, marginBottom: 30, maxWidth: 460 }}>
            <label>Name</label>
            <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
            <label>Email</label>
            <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
            {profileErr && <div className="error">{profileErr}</div>}
            {profileMsg && <div className="success">{profileMsg}</div>}
            <button className="btn btn-primary btn-sm" onClick={saveProfile}>Save profile</button>
          </div>

          <h3>Change password</h3>
          <div className="card" style={{ marginTop: 12, maxWidth: 460 }}>
            <label>Current password</label>
            <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
            <label>New password</label>
            <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
            <label>Confirm new password</label>
            <input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
            {pwErr && <div className="error">{pwErr}</div>}
            {pwMsg && <div className="success">{pwMsg}</div>}
            <button className="btn btn-primary btn-sm" onClick={savePassword}>Update password</button>
          </div>
        </>
      )}
    </div>
  );
}

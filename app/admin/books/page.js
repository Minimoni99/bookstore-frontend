"use client";
import { useEffect, useState } from "react";
import { api, apiUpload, resolveImageUrl } from "@/lib/api";
import AdminNav from "../../components/AdminNav";
import RequireAdmin from "../../components/RequireAdmin";

const emptyForm = { id: "", title: "", penName: "", price: "", description: "", coverUrl: "", downloadUrl: "" };

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function load() {
    const { books } = await api("/api/admin/books");
    setBooks(books);
  }
  useEffect(() => { load(); }, []);

  function edit(b) {
    setForm({
      id: b.id, title: b.title, penName: b.penName || "",
      price: (b.priceCents / 100).toFixed(2), description: b.description || "",
      coverUrl: b.coverUrl || "", downloadUrl: b.downloadUrl || "",
    });
    setShowForm(true);
  }

  async function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await apiUpload("/api/admin/upload", file);
      setForm((f) => ({ ...f, coverUrl: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    const payload = {
      title: form.title, penName: form.penName,
      priceCents: Math.round(parseFloat(form.price || "0") * 100),
      description: form.description, coverUrl: form.coverUrl, downloadUrl: form.downloadUrl,
    };
    try {
      if (form.id) await api(`/api/admin/books/${form.id}`, { method: "PUT", body: JSON.stringify(payload) });
      else await api("/api/admin/books", { method: "POST", body: JSON.stringify(payload) });
      setForm(emptyForm);
      setShowForm(false);
      setError("");
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function del(id) {
    if (!confirm("Delete this book?")) return;
    await api(`/api/admin/books/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="admin-main">
      <div className="section-title">
        <h2>Books</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(emptyForm); setShowForm(true); }}>+ Add book</button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{form.id ? "Edit book" : "New book"}</h3>
          <label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label>Pen name</label>
          <input value={form.penName} onChange={(e) => setForm({ ...form, penName: e.target.value })} />
          <label>Price (USD)</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <label>Cover image</label>
          {form.coverUrl && (
            <img
              src={resolveImageUrl(form.coverUrl)}
              alt="Cover preview"
              style={{ width: 100, aspectRatio: "2/3", objectFit: "cover", borderRadius: 4, marginBottom: 10, border: "1px solid var(--line)" }}
            />
          )}
          <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} style={{ marginBottom: 8 }} />
          {uploading && <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>Uploading…</p>}
          <input
            value={form.coverUrl}
            onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
            placeholder="Or paste an image URL instead"
          />

          <label>Download file URL (private — only shown to buyers)</label>
          <input value={form.downloadUrl} onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })} placeholder="https://..." />
          {error && <div className="error">{error}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={save}>Save</button>
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <table style={{ marginTop: 20 }}>
        <thead><tr><th>Title</th><th>Pen name</th><th>Price</th><th></th></tr></thead>
        <tbody>
          {books.length === 0 && <tr><td colSpan={4}>No books yet.</td></tr>}
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td><td>{b.penName}</td><td>${(b.priceCents / 100).toFixed(2)}</td>
              <td>
                <a href="#" onClick={(e) => { e.preventDefault(); edit(b); }}>Edit</a>{" · "}
                <a href="#" onClick={(e) => { e.preventDefault(); del(b.id); }}>Delete</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminBooksPage() {
  return (
    <RequireAdmin>
      <div className="admin-shell">
        <AdminNav />
        <AdminBooks />
      </div>
    </RequireAdmin>
  );
}

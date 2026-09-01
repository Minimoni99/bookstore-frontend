"use client";
import { useEffect, useState } from "react";
import { api, apiUpload, resolveImageUrl } from "@/lib/api";
import AdminNav from "../../components/AdminNav";
import RequireAdmin from "../../components/RequireAdmin";

function AdminSite() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api("/api/admin/settings").then((d) => setForm(d.settings));
  }, []);

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await apiUpload("/api/admin/upload", file);
      setForm((f) => ({ ...f, authorPhotoUrl: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    try {
      const { settings } = await api("/api/admin/settings", { method: "PUT", body: JSON.stringify(form) });
      setForm(settings);
      setSaved(true);
      setError("");
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
    }
  }

  if (!form) return <div className="admin-main">Loading…</div>;

  return (
    <div className="admin-main">
      <div className="section-title">
        <h2>Site content</h2>
      </div>
      <p style={{ color: "var(--ink-soft)", marginBottom: 24, maxWidth: 600 }}>
        This controls what shows on the homepage, your contact email, and which payment methods
        are live. Book listings themselves are managed on the Books tab.
      </p>

      {error && <div className="error" style={{ maxWidth: 560 }}>{error}</div>}
      {saved && <div className="success" style={{ maxWidth: 560 }}>Saved.</div>}

      {/* Branding */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 17 }}>Branding</h3>
        <label>Pen name</label>
        <input value={form.penName} onChange={(e) => setForm({ ...form, penName: e.target.value })} />

        <label>Homepage headline</label>
        <input value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} />

        <label>Homepage subheadline</label>
        <textarea rows={2} value={form.heroSubheadline} onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })} />

        <label>Contact email</label>
        <input
          type="email"
          value={form.contactEmail}
          onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
          placeholder="you@yourdomain.com"
        />
      </div>

      {/* Author */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 17 }}>Author</h3>
        <label>Author photo</label>
        {form.authorPhotoUrl && (
          <img
            src={resolveImageUrl(form.authorPhotoUrl)}
            alt="Author preview"
            style={{ width: 100, aspectRatio: "4/5", objectFit: "cover", borderRadius: 6, marginBottom: 10, border: "1px solid var(--line)" }}
          />
        )}
        <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} style={{ marginBottom: 8 }} />
        {uploading && <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>Uploading…</p>}
        <input
          value={form.authorPhotoUrl}
          onChange={(e) => setForm({ ...form, authorPhotoUrl: e.target.value })}
          placeholder="Or paste an image URL instead"
        />

        <label>Author bio</label>
        <textarea rows={4} value={form.authorBio} onChange={(e) => setForm({ ...form, authorBio: e.target.value })} />
      </div>

      {/* Payments */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 6, fontSize: 17 }}>Card payments (Stripe)</h3>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>
          Get these from your Stripe dashboard (dashboard.stripe.com/apikeys).
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400 }}>
          <input
            type="checkbox"
            style={{ width: "auto", margin: 0 }}
            checked={form.cardEnabled}
            onChange={(e) => setForm({ ...form, cardEnabled: e.target.checked })}
          />
          Card payments are live
        </label>
        <div style={{ height: 12 }} />
        <label>Stripe secret key</label>
        <input
          type="password"
          value={form.stripeSecretKey}
          onChange={(e) => setForm({ ...form, stripeSecretKey: e.target.value })}
          placeholder="sk_live_..."
        />
        <label>Stripe webhook signing secret</label>
        <input
          type="password"
          value={form.stripeWebhookSecret}
          onChange={(e) => setForm({ ...form, stripeWebhookSecret: e.target.value })}
          placeholder="whsec_..."
        />
        <label>Stripe subscription price ID (optional)</label>
        <input
          value={form.stripeSubscriptionPriceId}
          onChange={(e) => setForm({ ...form, stripeSubscriptionPriceId: e.target.value })}
          placeholder="price_..."
        />
      </div>

      <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 6, fontSize: 17 }}>Crypto payments (NOWPayments)</h3>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>
          Get these from your NOWPayments dashboard.
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400 }}>
          <input
            type="checkbox"
            style={{ width: "auto", margin: 0 }}
            checked={form.cryptoEnabled}
            onChange={(e) => setForm({ ...form, cryptoEnabled: e.target.checked })}
          />
          Crypto payments are live
        </label>
        <div style={{ height: 12 }} />
        <label>NOWPayments API key</label>
        <input
          type="password"
          value={form.nowpaymentsApiKey}
          onChange={(e) => setForm({ ...form, nowpaymentsApiKey: e.target.value })}
        />
        <label>NOWPayments IPN secret</label>
        <input
          type="password"
          value={form.nowpaymentsIpnSecret}
          onChange={(e) => setForm({ ...form, nowpaymentsIpnSecret: e.target.value })}
        />
      </div>

      {/* Premium subscription page */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 24, borderColor: "rgba(240,195,116,0.4)" }}>
        <h3 style={{ marginBottom: 6, fontSize: 17 }}>Premium subscription page</h3>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>
          Controls the /pricing page — the price shown, the comparison bullets, and the closing pitch.
        </p>

        <label>Price to display</label>
        <input
          value={form.subscriptionPriceLabel}
          onChange={(e) => setForm({ ...form, subscriptionPriceLabel: e.target.value })}
          placeholder="$9.99/mo"
        />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "-8px 0 14px" }}>
          Just the text shown on the button and page — set the real Stripe price separately above.
        </p>

        <label>Regular member benefits</label>
        <textarea
          rows={3}
          value={(form.subscriptionBenefitsRegular || []).join("\n")}
          onChange={(e) => setForm({ ...form, subscriptionBenefitsRegular: e.target.value.split("\n") })}
        />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "-8px 0 14px" }}>One benefit per line.</p>

        <label>Premium member benefits</label>
        <textarea
          rows={4}
          value={(form.subscriptionBenefitsPremium || []).join("\n")}
          onChange={(e) => setForm({ ...form, subscriptionBenefitsPremium: e.target.value.split("\n") })}
        />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "-8px 0 14px" }}>One benefit per line.</p>

        <label>Closing pitch (shown above the subscribe button)</label>
        <textarea
          rows={2}
          value={form.subscriptionCtaText}
          onChange={(e) => setForm({ ...form, subscriptionCtaText: e.target.value })}
        />
      </div>

      <button className="btn btn-primary" onClick={save}>Save changes</button>
    </div>
  );
}

export default function AdminSitePage() {
  return (
    <RequireAdmin>
      <div className="admin-shell">
        <AdminNav />
        <AdminSite />
      </div>
    </RequireAdmin>
  );
}

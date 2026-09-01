"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";

export default function PricingPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api("/api/settings").then((d) => setSettings(d.settings)).catch(() => {});
  }, []);

  function openModal() {
    if (!getToken()) {
      router.push("/login?next=/pricing");
      return;
    }
    setError("");
    setModalOpen(true);
  }

  async function pay(method) {
    try {
      const { checkoutUrl } = await api(`/api/checkout/${method}/subscription`, { method: "POST" });
      window.location.href = checkoutUrl;
    } catch (e) {
      setError(e.message);
      setModalOpen(false);
    }
  }

  const price = settings?.subscriptionPriceLabel || "$9.99/mo";
  const regularBenefits = settings?.subscriptionBenefitsRegular || ["Buy books one at a time", "Standard download access", "Email support"];
  const premiumBenefits = settings?.subscriptionBenefitsPremium || ["Unlimited access to the entire catalog", "Every new release, included automatically", "Priority support"];
  const ctaText = settings?.subscriptionCtaText || "Want unlimited access? Become a premium member.";

  return (
    <>
      <section style={{ padding: "70px 24px 20px", textAlign: "center" }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)" }}>
          Reader Membership
        </p>
        <h1 style={{ fontSize: "clamp(28px,4vw,42px)", maxWidth: 600, margin: "14px auto 16px" }}>
          Unlock everything, for less than one book a month
        </h1>
        <p style={{ color: "var(--ink-soft)", maxWidth: 520, margin: "0 auto", fontSize: 17 }}>
          Unlimited access to the full catalog, plus everything only members get. Cancel anytime.
        </p>
      </section>

      {error && (
        <div className="wrap" style={{ maxWidth: 500, margin: "20px auto 0" }}>
          <div className="error">{error}</div>
        </div>
      )}

      <section style={{ padding: "50px 24px 20px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: 820, margin: "0 auto",
          background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 14,
          overflow: "hidden", WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)", boxShadow: "var(--shadow)",
        }}>
          <div style={{ padding: "34px 30px" }}>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>Regular</h3>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 20 }}>What you get today</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {regularBenefits.map((b, i) => (
                <li key={i} style={{ padding: "10px 0", borderTop: i ? "1px solid var(--line)" : "none", fontSize: 14.5, color: "var(--ink-soft)", display: "flex", gap: 10 }}>
                  <span>–</span> {b}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: "34px 30px", background: "rgba(240,195,116,0.06)", borderLeft: "1px solid rgba(240,195,116,0.3)" }}>
            <h3 style={{ fontSize: 18, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gold)"><path d="M2 18h20l-1.5-9-5 4-3.5-7-3.5 7-5-4L2 18zm0 2h20v2H2v-2z" /></svg>
              Premium
            </h3>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 20 }}>Everything, unlocked</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {premiumBenefits.map((b, i) => (
                <li key={i} style={{ padding: "10px 0", borderTop: i ? "1px solid var(--line)" : "none", fontSize: 14.5, color: "var(--ink)", fontWeight: 500, display: "flex", gap: 10 }}>
                  <span style={{ color: "var(--gold)" }}>✦</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 24px 90px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px,3.2vw,32px)", maxWidth: 600, margin: "0 auto 30px" }}>{ctaText}</h2>
        <button className="btn btn-primary" style={{ padding: "16px 34px", fontSize: 17 }} onClick={openModal}>
          Subscribe — {price}
        </button>
      </section>

      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(4,6,12,0.75)", zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-mid)", border: "1px solid var(--line-strong)", borderRadius: 14,
              padding: 34, maxWidth: 420, width: "100%", textAlign: "center",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8)",
            }}
          >
            <h3 style={{ marginBottom: 8 }}>Choose how to pay</h3>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 26 }}>{price} · cancel anytime</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => pay("card")}>
                Pay by Card
              </button>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => pay("crypto")}>
                Pay by Crypto
              </button>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              style={{ marginTop: 18, background: "none", border: "none", color: "var(--ink-soft)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

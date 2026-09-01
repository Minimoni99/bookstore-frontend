"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, getToken, resolveImageUrl } from "@/lib/api";

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/books/${id}`)
      .then((data) => setBook(data.book))
      .catch((e) => setError(e.message));
  }, [id]);

  async function buy(method) {
    if (!getToken()) {
      router.push(`/login?next=/books/${id}`);
      return;
    }
    try {
      const { checkoutUrl } = await api(`/api/checkout/${method}/book/${id}`, { method: "POST" });
      window.location.href = checkoutUrl;
    } catch (e) {
      setError(e.message);
    }
  }

  if (error && !book) {
    return <div className="wrap" style={{ padding: 50 }}><div className="error">{error}</div></div>;
  }
  if (!book) return <div className="wrap" style={{ padding: 50 }}>Loading…</div>;

  const price = (book.priceCents / 100).toFixed(2);

  return (
    <>
      {/* HERO */}
      <section style={{ padding: "70px 24px 40px", textAlign: "center" }}>
        <div className="wrap">
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: ".14em",
            textTransform: "uppercase", color: "var(--gold)", marginBottom: 18,
          }}>
            A Dark Romance Novel · One Sitting
          </p>
          <h1 style={{ fontSize: "clamp(30px, 4.5vw, 48px)", maxWidth: 780, margin: "0 auto 20px" }}>
            {book.title}
          </h1>
          <p style={{ maxWidth: 600, margin: "0 auto 26px", fontSize: 18, color: "var(--ink-soft)" }}>
            {book.description}
          </p>
          <div style={{ color: "var(--gold)", letterSpacing: 2, marginBottom: 8 }}>★★★★★</div>
          <div style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 34 }}>
            4.8 · verified reader ratings
          </div>
          <div className="book-cover" style={{ width: 220, margin: "0 auto" }}>
            {book.coverUrl ? (
              <img src={resolveImageUrl(book.coverUrl)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
            ) : (
              book.title
            )}
          </div>
        </div>
      </section>

      {/* WHY THIS BOOK HITS */}
      <section style={{ padding: "70px 24px" }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: ".14em",
            textTransform: "uppercase", color: "var(--gold)", marginBottom: 14,
          }}>
            Why this book hits different
          </p>
          <h2 style={{ fontSize: "clamp(24px,3.2vw,34px)", marginBottom: 20 }}>
            This isn't a book you read for the plot twist. It's one you read for the way it makes you feel at 1am.
          </h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 16, marginBottom: 14 }}>
            Most romance leaves you satisfied and moves on. This one doesn't let go that easily — built on
            the tension readers actually come back for.
          </p>
          <p style={{ color: "var(--ink-soft)", fontSize: 16 }}>
            No filler chapters, no subplot that goes nowhere. Every scene either raises the stakes or deepens
            the pull between two people who shouldn't want each other as badly as they do.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "50px 24px 70px", textAlign: "center" }}>
        <div className="wrap">
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: ".14em",
            textTransform: "uppercase", color: "var(--gold)", marginBottom: 10,
          }}>
            What readers are saying
          </p>
          <h2 style={{ marginBottom: 30 }}>Here's what happened when readers picked this up…</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", textAlign: "left" }}>
            {[
              "Started it after dinner thinking I'd read a chapter. Looked up and it was 2am and I'd finished the whole thing.",
              "I read dark romance constantly, and the slow burn here is paced better than most of what's on the bestseller lists.",
              "Sent it to my group chat halfway through because I needed someone else to be losing it with me.",
            ].map((quote, i) => (
              <div className="card" key={i}>
                <div style={{ color: "var(--gold)", fontSize: 13, marginBottom: 10 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 14 }}>"{quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(150deg,#1c2a44,#0d1526)", border: "1px solid var(--line)" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Verified Reader</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section style={{ padding: "20px 24px 80px" }} id="order">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <h2 style={{ textAlign: "center", marginBottom: 30 }}>Get {book.title}</h2>
          <div className="card" style={{ border: "1px solid rgba(240,195,116,0.4)", boxShadow: "0 0 50px -10px rgba(240,195,116,0.15)" }}>
            <div style={{ textAlign: "center", paddingBottom: 18, borderBottom: "1px solid var(--line)", marginBottom: 20 }}>
              <div style={{ color: "var(--gold)", fontSize: 14, marginBottom: 8 }}>★★★★★</div>
              <h3 style={{ fontSize: 22 }}>{book.title}</h3>
            </div>
            <p style={{ color: "var(--ink-soft)", marginBottom: 16 }}>{book.description}</p>
            <ul style={{ listStyle: "none", margin: "0 0 20px", padding: 0 }}>
              {["Instant download — EPUB, MOBI, PDF", "Bonus epilogue scene", "Read on any device"].map((line) => (
                <li key={line} style={{ padding: "10px 0", borderTop: "1px solid var(--line)", fontSize: 14, color: "var(--ink-soft)", display: "flex", gap: 10 }}>
                  <span style={{ color: "var(--gold)" }}>◆</span> {line}
                </li>
              ))}
            </ul>
            <div className="price" style={{ fontSize: 28, marginBottom: 16, textAlign: "right" }}>${price}</div>
            {error && <div className="error">{error}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => buy("card")}>
                Pay by Card — ${price}
              </button>
              <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => buy("crypto")}>
                Pay by Crypto
              </button>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", textAlign: "center", marginTop: 12, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: ".05em" }}>
              🔒 Secure Checkout · Instant Download
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section style={{ padding: "70px 24px", textAlign: "center" }}>
        <div className="wrap" style={{ maxWidth: 560 }}>
          <div style={{
            width: 70, height: 70, borderRadius: "50%", border: "1px solid rgba(240,195,116,0.5)",
            margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Fraunces', serif", fontSize: 13, color: "var(--gold)",
            background: "var(--panel)", backdropFilter: "blur(10px)",
          }}>
            100%<br />Digital
          </div>
          <h2 style={{ marginBottom: 14 }}>Read it. If it's not for you, just let us know.</h2>
          <p style={{ color: "var(--ink-soft)", marginBottom: 22 }}>
            Contact us within 7 days of purchase for a full refund, no questions asked.
          </p>
          <a href="#order" className="btn btn-primary">Get The Book — ${price}</a>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "20px 24px 90px", maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: 26 }}>FAQ</h2>
        {[
          ["Is this a standalone, or part of a series?", "Fully standalone with a complete ending — no cliffhanger."],
          ["What formats do I get?", "EPUB, MOBI, and PDF, delivered instantly and readable on any device."],
          ["Is it also on Kindle Unlimited or Amazon?", "Buying direct here includes the bonus epilogue scene, which isn't on retail platforms."],
        ].map(([q, a]) => (
          <details key={q} style={{ borderBottom: "1px solid var(--line)", padding: "16px 4px" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>{q}</summary>
            <p style={{ color: "var(--ink-soft)", marginTop: 10, fontSize: 15 }}>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}

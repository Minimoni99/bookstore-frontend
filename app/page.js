"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, resolveImageUrl, getUser } from "@/lib/api";
import TierSlider from "./components/TierSlider";

export default function HomePage() {
  const [books, setBooks] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getUser());
    api("/api/books").then((d) => setBooks(d.books)).catch((e) => setError(e.message));
    api("/api/settings").then((d) => setSettings(d.settings)).catch(() => {});
  }, []);

  const penName = settings?.penName || "Armando Rivera";
  const flagship = books && books.length > 0 ? books[0] : null;

  return (
    <div className="wealth-home">

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="proof-strip">
            <span>The Blueprint To Generational Wealth</span><span className="dot"></span>
            <span>Read In An Evening · Kept For Life</span><span className="dot"></span>
            <span>Trusted By Readers Everywhere</span>
          </div>
          <p className="eyebrow">For anyone who earns well but still feels like they're starting from zero...</p>
          <h1>
            {settings?.heroHeadline || (
              <>How To Build Wealth That Outlives You — Without A Bigger Income, Without The Hustle</>
            )}
          </h1>
          <p className="hero-sub">
            {settings?.heroSubheadline ||
              "A short, direct blueprint for turning what you already earn into something that lasts for generations — read in one evening, usable the same night."}
          </p>
          <div className="stars">★★★★★</div>
          <div className="rating-line"><strong>4.9</strong> · readers so far</div>
          <div className="hero-cover">
            {flagship?.coverUrl ? (
              <img src={resolveImageUrl(flagship.coverUrl)} alt={flagship.title} />
            ) : (
              <>{flagship?.title || "Cover mockup"}</>
            )}
          </div>
          {!loggedIn && (
            <div style={{ marginTop: 30 }}>
              <Link href="/register" className="btn btn-primary">Begin Here</Link>
            </div>
          )}
        </div>
      </section>

      {/* PROBLEM / AGITATION */}
      <section className="section-narrow">
        <p className="eyebrow">Why doing everything "right" hasn't been enough</p>
        <h2>Earning more was never the missing piece. Structure was.</h2>
        <p className="lead">Most people who earn reasonably well were taught the same three moves: earn more, save more, find the next investment winner. It works, to a point — and then it quietly stops working, no matter how much the income grows.</p>
        <p className="lead">That's because wealth that actually lasts isn't built from income. It's built from structure — how assets are held, how they're protected, how they're taxed, and how they're passed on. Families who keep wealth across generations aren't necessarily earning more than everyone else. They're just organized differently.</p>
        <p className="lead">This is about that structure — the parts nobody teaches you in school or at work, laid out plainly enough that you can start applying it this week.</p>
      </section>

      {/* TESTIMONIALS */}
      <section className="section center">
        <div className="wrap">
          <p className="eyebrow">Real results</p>
          <h2>What readers say after going through it</h2>
          <div className="testi-grid">
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>"I've worked in wealth management for six years and still walked away with three structures I'd never implemented for my own family. Uncomfortable, honestly."</p>
              <div className="testi-who"><div className="avatar"></div><div><div className="name">Verified Reader</div><div className="loc">Verified Purchase</div></div></div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>"Bought it as a gift for my brother and now my parents want a copy too. It's turned into the thing our family actually talks about at dinner now."</p>
              <div className="testi-who"><div className="avatar"></div><div><div className="name">Verified Reader</div><div className="loc">Verified Purchase</div></div></div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>"Nobody in my family had money growing up, so none of this was ever explained to me. This is the first thing that's made it feel learnable instead of inherited."</p>
              <div className="testi-who"><div className="avatar"></div><div><div className="name">Verified Reader</div><div className="loc">Verified Purchase</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="stat-band">
        <div className="stat-row">
          <div><div className="num">★4.9</div><div className="label">Avg. rating</div></div>
          <div><div className="num">{books ? books.length : "—"}</div><div className="label">Titles available</div></div>
          <div><div className="num">[XX,XXX]+</div><div className="label">Community</div></div>
          <div><div className="num">[$X]M+</div><div className="label">Reported savings</div></div>
        </div>
      </div>

      {/* WHAT YOU'LL LEARN */}
      <section className="section">
        <div className="wrap">
          <p className="eyebrow center">What you'll learn</p>
          <h2 className="center">Two levels — start with the foundation, go deeper if you want the full system</h2>
          <div className="split-grid">
            <div className="split-card">
              <span className="tag">The Book</span>
              <h3 style={{ fontSize: 20 }}>The Foundation</h3>
              <ul>
                <li>The wealth formula — why income was never the real lever</li>
                <li>Long-term structures ordinary families can actually set up</li>
                <li>Raising heirs who grow the wealth instead of spending it</li>
                <li>A 90-day roadmap from where you are now to your first structure</li>
              </ul>
            </div>
            <div className="split-card">
              <span className="tag">Vault Edition</span>
              <h3 style={{ fontSize: 20 }}>The Complete System</h3>
              <ul>
                <li>Advanced trust and asset-protection strategies</li>
                <li>Offshore structuring, explained plainly and legally</li>
                <li>Borrowing against assets instead of selling them</li>
                <li>Crisis and exit planning, real estate, and year-round tax strategy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT LADDER — live, navigable slider over real books */}
      <section className="section" id="order">
        <div className="wrap">
          <p className="eyebrow center">Choose your path</p>
          <h2 className="center">Pick the edition that fits where you're starting</h2>

          {error && <div className="error">{error}</div>}
          {!books && !error && <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>Loading…</p>}
          {books && books.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>No books yet — add one from the admin Books tab.</p>
          )}
          {books && books.length > 0 && <TierSlider books={books} />}

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link href="/books" className="btn btn-outline">View All Books</Link>
          </div>
        </div>
      </section>

      {/* BOOK CONTENTS */}
      <section className="section">
        <div className="wrap">
          <p className="eyebrow center">Inside the book</p>
          <h2 className="center">Ten chapters, no filler</h2>
          <div className="chapters-grid">
            <div className="chapter-item"><div className="chapter-num">01</div><div><h4>Mindset</h4><p>The quiet beliefs that separate people who build lasting wealth from people who just earn a lot.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">02</div><div><h4>Appearance</h4><p>What "looking wealthy" actually costs you, and why old money rarely looks like new money.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">03</div><div><h4>Language</h4><p>How the wealthy talk about money differently — and why it changes the decisions that follow.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">04</div><div><h4>Financial Blueprint</h4><p>The core structure behind money that survives you.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">05</div><div><h4>Networks</h4><p>Why who you know compounds the same way money does.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">06</div><div><h4>Generational Wealth</h4><p>Building for a timeline longer than your own lifetime.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">07</div><div><h4>Inner Life</h4><p>The private discipline behind money that looks effortless from outside.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">08</div><div><h4>Raising Heirs</h4><p>Raising children who grow what they inherit instead of losing it.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">09</div><div><h4>Privacy</h4><p>Why the wealthy talk about money so little — and what that protects.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">10</div><div><h4>Marriage &amp; Partnership</h4><p>Getting aligned with a partner before money becomes the argument.</p></div></div>
          </div>
        </div>
      </section>

      {/* VAULT EXCLUSIVES */}
      <section className="section">
        <div className="wrap">
          <p className="eyebrow center">Vault Edition exclusives</p>
          <h2 className="center">What's added at the top tier</h2>
          <div className="chapters-grid">
            <div className="chapter-item"><div className="chapter-num">◆</div><div><h4>Advanced Structures Course</h4><p>Trusts, asset protection, and offshore basics, explained plainly.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">◆</div><div><h4>Wealth Calculator</h4><p>See how today's decisions compound over decades.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">◆</div><div><h4>Finance Tracker</h4><p>Track and command every dollar the way old money does.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">◆</div><div><h4>Offshore Guide</h4><p>How assets get held privately and legally, fully reported.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">◆</div><div><h4>Crisis &amp; Exit Plan</h4><p>What to do before a crisis forces the decision for you.</p></div></div>
            <div className="chapter-item"><div className="chapter-num">◆</div><div><h4>Lifetime Updates</h4><p>Everything added later, yours automatically.</p></div></div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section center">
        <div className="wrap">
          <p className="eyebrow">The real difference</p>
          <h2>It was never about how much you earn</h2>
          <table className="compare-table">
            <tbody>
              <tr><th>Most people</th><th>Wealthy families</th></tr>
              <tr><td>A will, written once and forgotten</td><td>A trust, reviewed and adjusted over time</td></tr>
              <tr><td>Chasing the next income spike</td><td>Accumulating assets that compound quietly</td></tr>
              <tr><td>Filing taxes once a year</td><td>Planning taxes all year round</td></tr>
              <tr><td>Owning assets personally, in their own name</td><td>Structuring who controls what, and how</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* AUTHOR STORY */}
      <section className="section">
        <div className="wrap founder-grid">
          <div className="founder-photo">
            {settings?.authorPhotoUrl ? (
              <img src={resolveImageUrl(settings.authorPhotoUrl)} alt={penName} />
            ) : (
              <>Author photo<br />4:5</>
            )}
          </div>
          <div className="founder">
            <p className="eyebrow">The story behind it</p>
            <h2>Meet {penName}</h2>
            {settings?.authorBio ? (
              <p>{settings.authorBio}</p>
            ) : (
              <>
                <p>I used to think wealth was just a bigger number in a bank account — so I did what everyone tells you to do. Earned more. Budgeted harder. Followed the popular advice. It helped, but it never felt like it was building toward anything that would outlast me.</p>
                <p>At some point I stopped asking "how do I earn more" and started asking a different question: how do wealthy families actually keep what they build, across generations, without it evaporating by the second inheritance? The answer wasn't more income. It was structure — legal, financial, and personal — applied consistently over time.</p>
                <p>I studied it, applied it to my own situation, and started writing down what I found. This is that write-up: the plain version of what I wish someone had handed me years earlier.</p>
              </>
            )}
            <div className="sign">{penName}</div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="section">
        <div className="guarantee-box">
          <div className="seal">30<br />Day</div>
          <h2>Backed by a 30-day guarantee</h2>
          <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>
            If you don't feel the material was worth substantially more than what you paid, request a refund within 30 days — no lengthy explanation required.
          </p>
          <a href="#order" className="btn btn-primary">Try It Risk-Free — Choose Your Edition</a>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-narrow">
        <p className="eyebrow center">Common questions</p>
        <h2 className="center">FAQ</h2>

        <details className="faq-item">
          <summary>Do I need to already be wealthy for this to apply to me?</summary>
          <div className="a">No — this is written specifically for people who earn reasonably well but didn't grow up with these structures explained to them. Most of it applies well before "wealthy" by most definitions.</div>
        </details>
        <details className="faq-item">
          <summary>Is the offshore material actually legal?</summary>
          <div className="a">Yes. Everything covered is framed around legal, fully-reportable structures — this isn't a tax-evasion guide, it's about legitimate structuring that's simply not commonly taught.</div>
        </details>
        <details className="faq-item">
          <summary>Does this apply outside the US?</summary>
          <div className="a">The core principles (structure, protection, transfer) are universal, though specific trust and tax mechanics vary by country — country-specific details are flagged where you'll want to confirm with a local advisor.</div>
        </details>
        <details className="faq-item">
          <summary>Is this theory, or something I can actually act on?</summary>
          <div className="a">Every chapter ends with concrete next steps, and the 90-Day Roadmap turns the whole thing into a week-by-week plan.</div>
        </details>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <span className="brand" style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "var(--gold)", display: "block", marginBottom: 10 }}>{penName}</span>
          {settings?.contactEmail && (
            <div>Questions about your order? Contact <a href={`mailto:${settings.contactEmail}`} style={{ textDecoration: "underline" }}>{settings.contactEmail}</a></div>
          )}
          <p className="legal">© 2026 {penName} · All rights reserved.<br />Nothing on this page constitutes legal, tax, or financial advice. Consult a qualified professional before acting on any strategy.</p>
        </div>
      </footer>

    </div>
  );
}

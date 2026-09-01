"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/api";

const RESUME_AFTER_MS = 30000;
const SPEED_PX_PER_FRAME = 0.8;
const CARD_WIDTH = 300;
const CARD_GAP = 20;

export default function TierSlider({ books }) {
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const lastInteractionRef = useRef(0);

  const multi = books.length > 1;
  const looped = multi ? [...books, ...books] : books;

  function markInteraction() {
    pausedRef.current = true;
    lastInteractionRef.current = Date.now();
  }

  function scrollByCard(direction) {
    markInteraction();
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (CARD_WIDTH + CARD_GAP), behavior: "smooth" });
  }

  useEffect(() => {
    if (!multi) return;

    function step() {
      const el = trackRef.current;
      if (el && !pausedRef.current) {
        el.scrollLeft += SPEED_PX_PER_FRAME;
        const singleSetWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= singleSetWidth) {
          el.scrollLeft -= singleSetWidth;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);

    const resumeCheck = setInterval(() => {
      if (pausedRef.current && Date.now() - lastInteractionRef.current >= RESUME_AFTER_MS) {
        pausedRef.current = false;
      }
    }, 1000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(resumeCheck);
    };
  }, [multi, books.length]);

  if (books.length === 0) return null;

  return (
    <div className="tiers-wrap">
      {multi && (
        <>
          <button className="tiers-nav prev" onClick={() => scrollByCard(-1)} aria-label="Previous">‹</button>
          <button className="tiers-nav next" onClick={() => scrollByCard(1)} aria-label="Next">›</button>
        </>
      )}

      <div
        ref={trackRef}
        className="tiers"
        onPointerDown={markInteraction}
        onTouchStart={markInteraction}
        onWheel={markInteraction}
      >
        {looped.map((b, i) => {
          const isBestValue = multi && b.id === books[books.length - 1].id;
          return (
            <div key={`${b.id}-${i}`} className={`tier ${isBestValue ? "featured" : ""}`}>
              {isBestValue && <span className="badge">Best Value</span>}
              <div className="tier-head">
                <div className="stars">★★★★★</div>
                <h3>{b.title}</h3>
                <div className="tier-note">{b.penName}</div>
              </div>
              <div className="tier-body">
                <div className="tier-line">{b.description}</div>
                <div className="tier-total">
                  <span className="now">${(b.priceCents / 100).toFixed(2)}</span>
                </div>
                <Link href={`/books/${b.id}`} className={`btn ${isBestValue ? "btn-primary" : "btn-outline"}`}>
                  View &amp; Buy
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/api";

const RESUME_AFTER_MS = 30000;
const SPEED_PX_PER_FRAME = 0.6;

export default function BookSlider({ books }) {
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const lastInteractionRef = useRef(0);
  const [, forceRender] = useState(0); // only used to trigger the resume-check tick

  const looped = books.length > 1 ? [...books, ...books] : books; // duplicate for a seamless loop

  function markInteraction() {
    pausedRef.current = true;
    lastInteractionRef.current = Date.now();
  }

  useEffect(() => {
    if (books.length <= 1) return; // nothing to slide

    function step() {
      const el = trackRef.current;
      if (el && !pausedRef.current) {
        el.scrollLeft += SPEED_PX_PER_FRAME;
        const singleSetWidth = el.scrollWidth / (looped.length / books.length);
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
  }, [books.length, looped.length]);

  if (books.length === 0) return null;

  return (
    <div>
      <div
        ref={trackRef}
        onPointerDown={markInteraction}
        onTouchStart={markInteraction}
        onWheel={markInteraction}
        style={{
          display: "flex", gap: 20, overflowX: "auto", scrollbarWidth: "none",
          paddingBottom: 4, scrollSnapType: "x proximity",
        }}
        className="book-slider-track"
      >
        {looped.map((b, i) => (
          <Link
            key={`${b.id}-${i}`}
            href={`/books/${b.id}`}
            className="card"
            style={{ textDecoration: "none", display: "block", flex: "0 0 200px", scrollSnapAlign: "start" }}
          >
            <div className="book-cover">
              {b.coverUrl ? (
                <img src={resolveImageUrl(b.coverUrl)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
              ) : (
                b.title
              )}
            </div>
            <h3 style={{ fontSize: 16, margin: "12px 0 4px" }}>{b.title}</h3>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 8 }}>{b.penName}</div>
            <div className="price">${(b.priceCents / 100).toFixed(2)}</div>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <Link href="/books" className="btn btn-outline">View All Books</Link>
      </div>
      <style jsx>{`
        .book-slider-track::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, resolveImageUrl } from "@/lib/api";

export default function AllBooksPage() {
  const [books, setBooks] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/books").then((d) => setBooks(d.books)).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="wrap" style={{ padding: "50px 24px 80px" }}>
      <h1 style={{ marginBottom: 24, textAlign: "center" }}>All Books</h1>

      {error && <div className="error">{error}</div>}
      {!books && !error && <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>Loading…</p>}
      {books && books.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>No books yet — check back soon.</p>
      )}

      <div className="grid grid-books">
        {books?.map((b) => (
          <Link key={b.id} className="card" href={`/books/${b.id}`} style={{ textDecoration: "none", display: "block" }}>
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
    </div>
  );
}

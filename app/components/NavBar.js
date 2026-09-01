"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, logout, api } from "@/lib/api";

function CrownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M2 18h20l-1.5-9-5 4-3.5-7-3.5 7-5-4L2 18zm0 2h20v2H2v-2z" />
    </svg>
  );
}

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [penName, setPenName] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    api("/api/settings").then((d) => setPenName(d.settings.penName)).catch(() => {});
    if (u) {
      api("/api/auth/me")
        .then((d) => setIsPremium((d.subscriptions || []).some((s) => s.status === "active")))
        .catch(() => {});
    }
  }, []);

  return (
    <header>
      <div className="nav wrap">
        <Link className="brand" href="/">{penName || "[Pen Name]"}</Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link href="/pricing" className={`user-pill ${isPremium ? "premium" : "regular"}`}>
                {isPremium && <CrownIcon />}
                {isPremium ? "Premium User" : "Regular User"}
              </Link>
              {user.role === "admin" && <Link href="/admin">Admin Settings</Link>}
              <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Sign out</a>
            </>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <Link className="btn btn-primary btn-sm" href="/register">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

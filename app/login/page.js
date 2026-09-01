"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, setSession } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const { token, user } = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(token, user);
      router.push(params.get("next") || "/account");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="form-narrow card">
      <h2 style={{ marginBottom: 18 }}>Sign in</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary" style={{ width: "100%" }} type="submit">Sign in</button>
      </form>
      <p style={{ marginTop: 14, fontSize: 14 }}>
        No account? <Link href="/register">Create one</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

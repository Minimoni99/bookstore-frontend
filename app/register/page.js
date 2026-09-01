"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setSession } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const { token, user } = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setSession(token, user);
      router.push("/account");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="form-narrow card">
      <h2 style={{ marginBottom: 18 }}>Create your account</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <button className="btn btn-primary" style={{ width: "100%" }} type="submit">Create account</button>
      </form>
      <p style={{ marginTop: 14, fontSize: 14 }}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </div>
  );
}

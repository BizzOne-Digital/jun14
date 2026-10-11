"use client";

import { useState } from "react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="flex min-h-screen w-full min-w-0 items-center justify-center overflow-x-clip bg-stone-100 px-4 py-8">
      <form
        onSubmit={submit}
        className="box-border w-full max-w-sm min-w-0 rounded-2xl bg-white p-6 shadow-lg sm:p-8"
      >
        <h1 className="text-xl font-bold text-stone-900">Admin</h1>
        <p className="mt-1 text-sm text-stone-500">View paid orders only.</p>
        <label className="mt-6 block text-sm font-medium">Email</label>
        <input
          type="email"
          autoComplete="email"
          className="box-border mt-1 w-full min-w-0 rounded-lg border border-stone-200 px-3 py-2 text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="mt-4 block text-sm font-medium">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          className="box-border mt-1 w-full min-w-0 rounded-lg border border-stone-200 px-3 py-2 text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: emailOrPhone.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-white">
            UrizInk Admin
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your studio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="emailOrPhone"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Email or phone
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <input
                id="emailOrPhone"
                type="text"
                autoComplete="username"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                placeholder="yara@urizink.com or +961..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

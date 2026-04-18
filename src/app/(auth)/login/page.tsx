"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Give it another try!");
      setLoading(false);
      return;
    }

    // Fetch session to determine role-based redirect
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;

    if (role === "DEALER") {
      router.push("/dealer/dashboard");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-teal-800">
          Welcome back!
        </h1>
        <p className="text-gray-500 mt-2">
          Sign in to pick up where you left off
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </>
          ) : "Sign in"}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-6">
        New here?{" "}
        <Link
          href="/register"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

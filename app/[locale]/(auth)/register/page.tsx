"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/toast/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Registration failed", "error");
      } else {
        showToast("Registration successful! Please login.", "success");
        router.push("/login");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">Create an Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

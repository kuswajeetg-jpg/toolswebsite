"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/toast/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      showToast(res.error, "error");
    } else {
      showToast("Logged in successfully!", "success");
      router.push("/");
      router.refresh();
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">Welcome Back</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-300 after:mt-0.5 after:flex-1 after:border-t after:border-slate-300">
          <p className="mx-4 mb-0 text-center font-semibold text-slate-500">OR</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin("google")}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white p-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialLogin("facebook")}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white p-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="h-5 w-5" />
            Continue with Facebook
          </button>
          <button
            onClick={() => handleSocialLogin("twitter")}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white p-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <img src="https://www.svgrepo.com/show/513008/twitter-154.svg" alt="Twitter" className="h-5 w-5" />
            Continue with Twitter
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

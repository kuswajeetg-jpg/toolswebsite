"use client";

import { useState } from "react";
import { useToast } from "@/components/toast/ToastContext";
import { User } from "@prisma/client";

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { showToast } = useToast();
  const [name, setName] = useState(user.name || "");
  const [mobile, setMobile] = useState(user.mobile || "");
  const [welcomeMessage, setWelcomeMessage] = useState(user.welcomeMessage || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, welcomeMessage }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      showToast("Profile updated successfully", "success");
    } catch (error) {
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Email Address (Read Only)</label>
        <input
          type="email"
          disabled
          className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-slate-500 outline-none"
          value={user.email || ""}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</label>
        <input
          type="tel"
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="+1234567890"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Welcome Message</label>
        <textarea
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={3}
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          placeholder="A short message for your profile..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

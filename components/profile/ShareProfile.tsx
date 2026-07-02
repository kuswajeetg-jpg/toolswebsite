"use client";

import { useToast } from "@/components/toast/ToastContext";
import { Share2 } from "lucide-react";

export default function ShareProfile({ username }: { username: string | null }) {
  const { showToast } = useToast();

  const handleShare = async () => {
    const url = window.location.origin;
    const title = `Check out ${username || "my"} favorite tools at Smart Document Tools!`;
    const text = "Free online tools for PDF editing, image processing, and calculators.";

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!", "success");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-200"
    >
      <Share2 className="h-4 w-4" />
      Share Website
    </button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/toast/ToastContext";

export default function BookmarkButton({ toolSlug }: { toolSlug: string }) {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const { showToast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/bookmarks")
        .then((res) => res.json())
        .then((data: string[]) => {
          if (Array.isArray(data) && data.includes(toolSlug)) {
            setIsBookmarked(true);
          }
        })
        .catch(() => {});
    }
  }, [session, toolSlug]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      showToast("Please sign in to bookmark tools", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsBookmarked(data.bookmarked);
        showToast(data.bookmarked ? "Added to bookmarks" : "Removed from bookmarks", "success");
      } else {
        showToast("Failed to update bookmark", "error");
      }
    } catch {
      showToast("Failed to update bookmark", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`rounded-full p-2 transition-colors ${
        isBookmarked ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
      }`}
      aria-label="Bookmark tool"
    >
      <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
    </button>
  );
}

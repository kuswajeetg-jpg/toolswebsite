"use client";

import { useState } from "react";
import { MessageSquare, X, Star } from "lucide-react";
import { useToast } from "@/components/toast/ToastContext";

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, rating }),
      });

      if (res.ok) {
        showToast("Thank you for your feedback!", "success");
        setIsOpen(false);
        setMessage("");
        setRating(0);
      } else {
        showToast("Failed to submit feedback", "error");
      }
    } catch (error) {
      showToast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-transform hover:scale-110 hover:bg-blue-700"
        aria-label="Give Feedback"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Send Feedback</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Rate your experience (optional)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Your Feedback</label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Tell us what you love or what we can improve..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600">
          Have a suggestion, found a bug, or want to request a new tool? Send us a message.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {sent ? (
          <div className="text-center py-12">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
            <p className="text-gray-600">Thanks for reaching out. We&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option>General Feedback</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Tell us what you think..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
            >
              <Send className="h-5 w-5" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

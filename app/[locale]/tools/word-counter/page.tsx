"use client";

import { useState, useMemo } from "react";
import { Type, Copy, RefreshCw, Check } from "lucide-react";

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).filter(p => p.trim() !== "").length;
    const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim() !== "").length;
    
    // Average reading speed is roughly 200 words per minute
    const readingTimeMinutes = words / 200;
    const readingTimeStr = Math.ceil(readingTimeMinutes) + " min read";

    return {
      characters,
      charactersNoSpaces,
      words,
      paragraphs,
      sentences,
      readingTimeStr
    };
  }, [text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
            <Type className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Word & Character Counter</h1>
        <p className="text-xl text-gray-600">Real-time counting of words, characters, sentences, and reading time.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatBox label="Words" value={stats.words} color="text-blue-600" />
          <StatBox label="Characters" value={stats.characters} color="text-purple-600" />
          <StatBox label="Without Spaces" value={stats.charactersNoSpaces} color="text-indigo-600" />
          <StatBox label="Sentences" value={stats.sentences} color="text-green-600" />
          <StatBox label="Paragraphs" value={stats.paragraphs} color="text-orange-600" />
          <StatBox label="Reading Time" value={stats.readingTimeStr} color="text-rose-600" isString />
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-80 p-6 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none resize-y text-gray-800 text-lg leading-relaxed shadow-inner"
            placeholder="Type or paste your text here to begin counting..."
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-6 justify-end">
          <button
            onClick={handleCopy}
            disabled={text.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition disabled:opacity-50"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            {copied ? "Copied!" : "Copy Text"}
          </button>
          <button
            onClick={handleClear}
            disabled={text.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition disabled:opacity-50"
          >
            <RefreshCw className="w-5 h-5" />
            Clear
          </button>
        </div>
      </div>

      <div className="mt-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 prose prose-purple max-w-none">
        <h2>Free Online Word and Character Counter</h2>
        <p>Whether you are a student writing an essay, a professional crafting an email, or a digital marketer optimizing SEO meta tags, our Word & Character Counter provides real-time, accurate text metrics.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Instant Metrics:</strong> As you type or paste, see your word, character, and sentence count instantly.</li>
          <li><strong>No Spaces Count:</strong> Essential for platforms with strict character limits that don't count spaces (like some SMS gateways or legacy systems).</li>
          <li><strong>Reading Time Estimator:</strong> Knowing how long your text takes to read is crucial for blog posts and speeches. We use the standard average reading speed of 200 words per minute.</li>
          <li><strong>Privacy First:</strong> Your text never leaves your browser. All counting is done locally on your device.</li>
        </ul>

        <h3>Why Character Limits Matter</h3>
        <p>Many social media platforms and professional tools enforce strict character limits:</p>
        <ul>
          <li><strong>Twitter (X):</strong> 280 characters</li>
          <li><strong>Instagram Captions:</strong> 2,200 characters</li>
          <li><strong>SEO Title Tags:</strong> ~60 characters</li>
          <li><strong>SEO Meta Descriptions:</strong> ~155-160 characters</li>
        </ul>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, isString = false }: { label: string, value: string | number, color: string, isString?: boolean }) {
  return (
    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center items-center h-24">
      <div className={`font-extrabold ${isString ? 'text-xl' : 'text-3xl'} ${color}`}>
        {value}
      </div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}

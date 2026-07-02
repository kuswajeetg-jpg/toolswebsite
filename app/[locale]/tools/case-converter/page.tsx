"use client";

import { useState } from "react";
import { Type, Copy, RefreshCw, Check } from "lucide-react";

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleClear = () => setText("");

  const toSentenceCase = () => {
    const converted = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(converted);
  };

  const toLowerCase = () => setText(text.toLowerCase());
  
  const toUpperCase = () => setText(text.toUpperCase());
  
  const toTitleCase = () => {
    const converted = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    setText(converted);
  };

  const toCamelCase = () => {
    const converted = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    setText(converted);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
            <Type className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Case Converter</h1>
        <p className="text-xl text-gray-600">Easily convert text between different letter cases.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={toSentenceCase} className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl font-medium transition">
            Sentence case
          </button>
          <button onClick={toLowerCase} className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl font-medium transition">
            lowercase
          </button>
          <button onClick={toUpperCase} className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl font-medium transition">
            UPPERCASE
          </button>
          <button onClick={toTitleCase} className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl font-medium transition">
            Title Case
          </button>
          <button onClick={toCamelCase} className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl font-medium transition">
            camelCase
          </button>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-72 p-6 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-y text-gray-800 text-lg leading-relaxed shadow-inner"
            placeholder="Type or paste your text here..."
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-6 justify-between items-center">
          <div className="text-sm font-medium text-gray-500">
            Character Count: <span className="text-indigo-600">{text.length}</span> | Word Count: <span className="text-indigo-600">{text.trim() === "" ? 0 : text.trim().split(/\s+/).length}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              disabled={text.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition disabled:opacity-50"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
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
      </div>

      <div className="mt-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 prose prose-indigo max-w-none">
        <h2>Free Online Text Case Converter</h2>
        <p>Our text case converter is a simple, free tool that transforms any text into the letter case of your choice instantly. Whether you accidentally left Caps Lock on, or you need to format variables for coding, this tool saves you time.</p>
        
        <h3>Available Conversions</h3>
        <ul>
          <li><strong>Sentence case:</strong> Capitalizes only the first letter of each sentence. Perfect for fixing large blocks of text where capitalization was ignored.</li>
          <li><strong>lowercase:</strong> Converts every single letter to lower case.</li>
          <li><strong>UPPERCASE:</strong> Converts every single letter to upper case (like yelling on the internet).</li>
          <li><strong>Title Case:</strong> Capitalizes the first letter of every word. Ideal for blog titles, book titles, and email subject lines.</li>
          <li><strong>camelCase:</strong> Removes spaces and capitalizes the first letter of each word (except the first). Primarily used by programmers for naming variables (e.g., <code>myVariableName</code>).</li>
        </ul>

        <h3>Why use our Case Converter?</h3>
        <p>Unlike other tools, our converter runs 100% in your browser. This means zero latency, instant conversions, and absolute privacy since your text is never sent to our servers.</p>
      </div>
    </div>
  );
}

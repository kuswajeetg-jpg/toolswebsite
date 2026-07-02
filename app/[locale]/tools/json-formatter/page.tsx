"use client";

import { useState } from "react";
import { Settings, Check, Copy, AlertCircle } from "lucide-react";
import { useToastError, useToastSuccess } from "@/lib/toast";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [spaces, setSpaces] = useState(2);
  const onError = useToastError();
  const onSuccess = useToastSuccess();

  const handleFormat = () => {
    if (!input.trim()) {
      setError(null);
      setOutput("");
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, spaces);
      setOutput(formatted);
      setError(null);
      onSuccess("JSON formatted successfully!");
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax");
      onError("Invalid JSON structure");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Settings className="w-8 h-8 text-teal-600" /> JSON Formatter & Validator
        </h1>
        <p className="text-xl text-gray-600">Beautify, format, and validate your JSON data</p>
      </div>

      <div className="flex justify-center gap-4 mb-8 items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto">
        <span className="text-sm font-semibold text-gray-600">Indent:</span>
        <button onClick={() => setSpaces(2)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${spaces === 2 ? "bg-teal-100 text-teal-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>2 Spaces</button>
        <button onClick={() => setSpaces(4)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${spaces === 4 ? "bg-teal-100 text-teal-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>4 Spaces</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
        {/* Input */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
             <span className="font-semibold text-gray-700">Input JSON</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            className={`flex-1 w-full p-4 font-mono text-sm outline-none resize-none bg-transparent ${error ? 'ring-2 ring-inset ring-red-500 bg-red-50' : ''}`}
            placeholder="Paste your minified or unformatted JSON here..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <span className="font-semibold text-gray-700">Formatted Result</span>
          </div>
          {error ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-red-50 text-red-500 p-8 text-center">
                  <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-bold">Invalid JSON</p>
                  <p className="text-sm font-mono mt-2 bg-red-100 px-3 py-2 rounded-lg">{error}</p>
              </div>
          ) : (
            <textarea
              value={output}
              readOnly
              className="flex-1 w-full p-4 font-mono text-sm outline-none resize-none bg-slate-900 text-teal-400"
              placeholder="Formatted output will appear here..."
              spellCheck={false}
            />
          )}
          
          {output && !error && (
             <button
               onClick={handleCopy}
               className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg shadow-lg hover:bg-gray-100 transition"
             >
               {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
               {copied ? "Copied!" : "Copy JSON"}
             </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={handleFormat}
          className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition shadow-lg shadow-teal-600/30"
        >
          Format & Validate
        </button>
        <button
          onClick={() => { setInput(""); setOutput(""); setError(null); }}
          className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-200 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

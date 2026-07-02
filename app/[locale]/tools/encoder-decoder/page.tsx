"use client";

import { useState } from "react";
import { RefreshCw, Check, Copy } from "lucide-react";

export default function EncoderDecoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"base64" | "url">("base64");
  const [action, setAction] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    if (!input) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      setError(null);
      let result = "";
      
      if (mode === "base64") {
        if (action === "encode") {
          // encodeURIComponent helps correctly encode unicode strings
          result = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g,
              (match, p1) => String.fromCharCode(Number('0x' + p1))
          ));
        } else {
          result = decodeURIComponent(Array.prototype.map.call(atob(input), (c: string) => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          }).join(''));
        }
      } else if (mode === "url") {
        if (action === "encode") {
          result = encodeURIComponent(input);
        } else {
          result = decodeURIComponent(input);
        }
      }
      
      setOutput(result);
    } catch (e) {
      setError("Invalid input for decoding.");
      setOutput("");
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-fuchsia-600" /> Encoder & Decoder
        </h1>
        <p className="text-xl text-gray-600">Base64 and URL encoding/decoding</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-gray-50 p-2 rounded-2xl">
            <div className="flex bg-white rounded-xl shadow-sm overflow-hidden w-full sm:w-auto">
                <button 
                    onClick={() => setMode("base64")}
                    className={`flex-1 sm:px-6 py-2.5 text-sm font-bold transition ${mode === "base64" ? "bg-fuchsia-100 text-fuchsia-700" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    Base64
                </button>
                <button 
                    onClick={() => setMode("url")}
                    className={`flex-1 sm:px-6 py-2.5 text-sm font-bold transition ${mode === "url" ? "bg-fuchsia-100 text-fuchsia-700" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    URL
                </button>
            </div>
            <div className="flex bg-white rounded-xl shadow-sm overflow-hidden w-full sm:w-auto">
                <button 
                    onClick={() => setAction("encode")}
                    className={`flex-1 sm:px-6 py-2.5 text-sm font-bold transition ${action === "encode" ? "bg-slate-800 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    Encode
                </button>
                <button 
                    onClick={() => setAction("decode")}
                    className={`flex-1 sm:px-6 py-2.5 text-sm font-bold transition ${action === "decode" ? "bg-slate-800 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    Decode
                </button>
            </div>
        </div>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Input</label>
                <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); }}
                className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 outline-none resize-y text-gray-800 font-mono text-sm"
                placeholder={`Type string to ${action}...`}
                spellCheck={false}
                />
            </div>
            
            <div className="flex justify-center">
                <button
                onClick={handleProcess}
                className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-bold transition shadow-md flex items-center gap-2"
                >
                <RefreshCw className="w-5 h-5" /> Execute
                </button>
            </div>

            <div>
                <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Output</label>
                    <button
                        onClick={handleCopy}
                        disabled={!output}
                        className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
                {error ? (
                    <div className="w-full p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium text-center">
                        {error}
                    </div>
                ) : (
                    <textarea
                    value={output}
                    readOnly
                    className="w-full h-40 p-4 bg-slate-50 border border-gray-200 rounded-xl outline-none resize-y text-gray-700 font-mono text-sm"
                    placeholder="Result will appear here..."
                    spellCheck={false}
                    />
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

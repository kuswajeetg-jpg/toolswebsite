"use client";

import { useState, useEffect } from "react";
import { Lock, Copy, Check } from "lucide-react";

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({ md5: "", sha1: "", sha256: "", sha512: "" });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    generateHashes(input);
  }, [input]);

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
      return;
    }
    
    // We use Web Crypto API for SHA algorithms
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    try {
        const sha1Buffer = await crypto.subtle.digest("SHA-1", data);
        const sha256Buffer = await crypto.subtle.digest("SHA-256", data);
        const sha512Buffer = await crypto.subtle.digest("SHA-512", data);
        
        const toHex = (buffer: ArrayBuffer) => {
            return Array.from(new Uint8Array(buffer))
                .map(b => b.toString(16).padStart(2, "0"))
                .join("");
        };
        
        // Very basic non-cryptographic pseudo-MD5 (for demo purposes if real library not imported)
        // In a real app you'd import 'spark-md5' or 'crypto-js/md5'
        const pseudoMd5 = "MD5 requires external lib (e.g. spark-md5) - " + toHex(sha256Buffer).substring(0, 32);

        setHashes({
            md5: pseudoMd5,
            sha1: toHex(sha1Buffer),
            sha256: toHex(sha256Buffer),
            sha512: toHex(sha512Buffer)
        });
    } catch (e) {
        console.error("Hashing failed", e);
    }
  };

  const handleCopy = async (text: string, type: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Lock className="w-8 h-8 text-blue-600" /> Hash Generator
        </h1>
        <p className="text-xl text-gray-600">Instantly generate cryptographic hashes from text</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-y text-gray-800 font-mono text-sm"
          placeholder="Enter text to hash..."
        />
      </div>

      <div className="space-y-4">
        <HashBlock label="MD5 (Simulated)" value={hashes.md5} type="md5" copied={copied} onCopy={handleCopy} />
        <HashBlock label="SHA-1" value={hashes.sha1} type="sha1" copied={copied} onCopy={handleCopy} />
        <HashBlock label="SHA-256" value={hashes.sha256} type="sha256" copied={copied} onCopy={handleCopy} />
        <HashBlock label="SHA-512" value={hashes.sha512} type="sha512" copied={copied} onCopy={handleCopy} />
      </div>
    </div>
  );
}

function HashBlock({ label, value, type, copied, onCopy }: { label: string, value: string, type: string, copied: string | null, onCopy: (v: string, t: string) => void }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="w-32 shrink-0 font-bold text-gray-700">{label}</div>
            <div className="flex-1 w-full bg-slate-50 p-3 rounded-lg border border-slate-100 overflow-x-auto">
                <code className="text-sm text-blue-800 break-all">{value || "Waiting for input..."}</code>
            </div>
            <button
                onClick={() => onCopy(value, type)}
                disabled={!value}
                className="shrink-0 p-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition disabled:opacity-50 flex items-center justify-center"
                title="Copy hash"
            >
                {copied === type ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
        </div>
    )
}

"use client";

import { useState } from "react";
import { Scissors, Check, Copy } from "lucide-react";
import { useToastError, useToastSuccess } from "@/lib/toast";

export default function CodeMinifierPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState<"html" | "css" | "js">("html");
  const [copied, setCopied] = useState(false);
  const onError = useToastError();
  const onSuccess = useToastSuccess();

  const minifyHTML = (html: string) => {
    return html
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/\s+/g, " ") // Collapse whitespace
      .replace(/>\s+</g, "><") // Remove space between tags
      .trim();
  };

  const minifyCSS = (css: string) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
      .replace(/\s+/g, " ") // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, "$1") // Remove space around separators
      .replace(/;}/g, "}") // Remove trailing semicolon
      .trim();
  };

  const minifyJS = (js: string) => {
    return js
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
      .replace(/\/\/.*/g, "") // Remove single-line comments
      .replace(/\s+/g, " ") // Collapse whitespace
      .replace(/\s*([{}:;,=+\-*/<>()])\s*/g, "$1") // Remove space around operators
      .trim();
  };

  const handleMinify = () => {
    if (!input) {
      onError("Please provide some code to minify.");
      return;
    }
    try {
      let minified = "";
      if (lang === "html") minified = minifyHTML(input);
      else if (lang === "css") minified = minifyCSS(input);
      else if (lang === "js") minified = minifyJS(input);
      
      setOutput(minified);
      onSuccess(`${lang.toUpperCase()} minified successfully! Reduced by ${((1 - minified.length / input.length) * 100).toFixed(1)}%`);
    } catch (e) {
      onError("Error during minification.");
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
          <Scissors className="w-8 h-8 text-orange-500" /> Code Minifier
        </h1>
        <p className="text-xl text-gray-600">Compress HTML, CSS, and JS to reduce file size</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setLang("html")} className={`px-6 py-2.5 rounded-full font-bold transition ${lang === "html" ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>HTML</button>
        <button onClick={() => setLang("css")} className={`px-6 py-2.5 rounded-full font-bold transition ${lang === "css" ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>CSS</button>
        <button onClick={() => setLang("js")} className={`px-6 py-2.5 rounded-full font-bold transition ${lang === "js" ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>JavaScript</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
        {/* Input */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <span className="font-semibold text-gray-700">Original {lang.toUpperCase()}</span>
             <span className="text-xs text-gray-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-sm outline-none resize-none bg-transparent"
            placeholder={`Paste your ${lang.toUpperCase()} here...`}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <span className="font-semibold text-gray-700">Minified Output</span>
             <span className="text-xs text-green-600 font-bold">{output.length} chars</span>
          </div>
          <textarea
            value={output}
            readOnly
            className="flex-1 w-full p-4 font-mono text-sm outline-none resize-none bg-slate-50 text-gray-600"
            placeholder="Minified output will appear here..."
            spellCheck={false}
          />
          {output && (
             <button
               onClick={handleCopy}
               className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition"
             >
               {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
               {copied ? "Copied!" : "Copy Minified"}
             </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleMinify}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition transform hover:-translate-y-1 flex items-center gap-2"
        >
          <Scissors className="w-5 h-5" /> Minify Code
        </button>
      </div>
    </div>
  );
}

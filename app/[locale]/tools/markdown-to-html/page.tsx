"use client";

import { useState } from "react";
import { marked } from "marked";
import { FileText, Code, Check, Copy, Eye } from "lucide-react";

export default function MarkdownToHtmlPage() {
  const [markdown, setMarkdown] = useState("# Hello World\n\nWrite your **markdown** here...");
  const [copied, setCopied] = useState(false);

  const htmlOutput = marked.parse(markdown) as string;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy HTML", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" /> Markdown to HTML
        </h1>
        <p className="text-xl text-gray-600">Convert Markdown to clean HTML in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        
        {/* Markdown Input */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Markdown Input
            </span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full p-6 text-gray-800 font-mono text-sm outline-none resize-none bg-transparent"
            placeholder="Type your markdown here..."
          />
        </div>

        {/* HTML Output */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <Code className="w-4 h-4" /> HTML Output
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy HTML"}
            </button>
          </div>
          <textarea
            value={htmlOutput}
            readOnly
            className="flex-1 w-full p-6 text-gray-800 font-mono text-sm outline-none resize-none bg-slate-50"
          />
        </div>
      </div>
      
      {/* Live Preview Block */}
      <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-500" /> Live Preview
          </h2>
          <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: htmlOutput }} />
      </div>
    </div>
  );
}

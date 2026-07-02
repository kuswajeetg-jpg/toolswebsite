export const toolTemplate = `
// === COPY-PASTE THIS TOOL TEMPLATE ===
// File: app/tools/[tool-name]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Download, Loader2 } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function ToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result);
    };
  }, [result]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // Add your processing logic here
      // Example: const processed = await someLibrary.process(file);
      
      setResult("result-url");
    } catch (error) {
      console.error("Processing error", error);
      onError("Error processing file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tool Name</h1>
        <p className="text-gray-600">Tool description goes here.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {!file ? (
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center hover:bg-blue-50 transition cursor-pointer relative">
            <input
              type="file"
              accept="*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">Click or drag a file here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {!result ? (
              <button
                onClick={processFile}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
              >
                {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Processing...</> : "Process"}
              </button>
            ) : (
              <a
                href={result}
                download="output"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2"
              >
                <Download className="h-5 w-5" /> Download Result
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// === OPTIONAL: Add layout.tsx for tool-specific metadata ===
// File: app/tools/[tool-name]/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tool Name - Smart Document Tools",
  description: "Tool description.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

// === THEN ADD TO config/tool-config.json ===
// Copy and add this entry to tool-config.json:
{
  "id": "tool-name",
  "name": "Tool Name",
  "path": "/tools/tool-name",
  "icon": "FileUp", // Choose from: FileUp, FileImage, Calculator, PenTool, Scissors, Merge, Zap, Calendar, Type, Image, FileText, Shield
  "desc": "Tool description",
  "category": "PDF Tools", // Options: PDF Tools, Image Tools, Calculators, Document Generators
  "enabled": true
}
`;

export const toolConfigTemplate = {
  id: "tool-name",
  name: "Tool Name",
  path: "/tools/tool-name",
  icon: "FileUp",
  desc: "Tool description",
  category: "PDF Tools",
  enabled: true,
};
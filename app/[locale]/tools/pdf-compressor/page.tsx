"use client";

import { useEffect, useState } from "react";
import { UploadCloud, Download, Loader2, FileDown, Shield, FileText } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function PdfCompressorPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [level, setLevel] = useState<"low" | "medium" | "high">("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (outputPdfUrl) URL.revokeObjectURL(outputPdfUrl);
    };
  }, [outputPdfUrl]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdf(e.target.files[0]);
      setOutputPdfUrl(null);
      setCompressedSize(null);
    }
  };

  const processPdf = async () => {
    if (!pdf) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", pdf);
      formData.append("level", level);

      const response = await fetch("/api/pdf-compress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Compression failed");
      }

      const blob = await response.blob();
      setCompressedSize(blob.size);
      setOutputPdfUrl(URL.createObjectURL(blob));
    } catch (error: any) {
      console.error("Compression error", error);
      onError("Error compressing PDF. Ensure the file is valid and API is running.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper to compute estimates
  const getEstimatedSize = (originalSize: number, compLevel: "low" | "medium" | "high") => {
    const factors = {
      low: 0.85,    // ~15% reduction
      medium: 0.55, // ~45% reduction
      high: 0.20    // ~80% reduction (Extreme compression)
    };
    return originalSize * factors[compLevel];
  };

  const calculateReduction = () => {
    if (!pdf || !compressedSize) return 0;
    const diff = pdf.size - compressedSize;
    const percent = (diff / pdf.size) * 100;
    return Math.max(0, parseFloat(percent.toFixed(1)));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Compressor</h1>
        <p className="text-gray-600 font-medium">Compress your PDF files online to reduce file size while maintaining document quality.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
        {!pdf ? (
          <div className="border-2 border-dashed border-blue-200 rounded-2xl p-12 text-center hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer relative group">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="h-16 w-16 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-bold text-lg text-slate-800 mb-1">Upload PDF File</h3>
            <p className="text-sm text-slate-500">Drag and drop your PDF here, or click to browse</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 truncate max-w-md">{pdf.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{formatSize(pdf.size)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPdf(null);
                  setOutputPdfUrl(null);
                  setCompressedSize(null);
                }}
                className="text-sm text-red-500 hover:text-red-750 font-bold hover:underline"
              >
                Remove
              </button>
            </div>

            {/* Selection & Compression Controls */}
            {!outputPdfUrl && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Choose Compression Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Low compression */}
                    <button
                      type="button"
                      onClick={() => setLevel("low")}
                      className={`p-4 border rounded-2xl text-center transition-all flex flex-col items-center justify-center min-h-[120px] ${
                        level === "low"
                          ? "border-blue-500 bg-blue-50/50 text-blue-700 font-bold shadow-md shadow-blue-100"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="text-sm font-bold block">Low Compression</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block">High Quality</span>
                      <span className="text-xs font-bold text-blue-600 mt-2 block bg-blue-100/50 px-2 py-0.5 rounded">
                        Est: ~{formatSize(getEstimatedSize(pdf.size, "low"))} (-15%)
                      </span>
                    </button>
                    {/* Medium compression */}
                    <button
                      type="button"
                      onClick={() => setLevel("medium")}
                      className={`p-4 border rounded-2xl text-center transition-all flex flex-col items-center justify-center min-h-[120px] ${
                        level === "medium"
                          ? "border-blue-500 bg-blue-50/50 text-blue-700 font-bold shadow-md shadow-blue-100"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="text-sm font-bold block">Medium Compression</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block">Recommended</span>
                      <span className="text-xs font-bold text-blue-600 mt-2 block bg-blue-100/50 px-2 py-0.5 rounded">
                        Est: ~{formatSize(getEstimatedSize(pdf.size, "medium"))} (-45%)
                      </span>
                    </button>
                    {/* High compression */}
                    <button
                      type="button"
                      onClick={() => setLevel("high")}
                      className={`p-4 border rounded-2xl text-center transition-all flex flex-col items-center justify-center min-h-[120px] ${
                        level === "high"
                          ? "border-blue-500 bg-blue-50/50 text-blue-700 font-bold shadow-md shadow-blue-100"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="text-sm font-bold block">Extreme Compression</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block">Smallest File Size</span>
                      <span className="text-xs font-bold text-emerald-600 mt-2 block bg-emerald-100/50 px-2 py-0.5 rounded">
                        Est: ~{formatSize(getEstimatedSize(pdf.size, "high"))} (-80%)
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={processPdf}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Compressing PDF...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-5 w-5" />
                      Compress PDF
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Results & Download */}
            {outputPdfUrl && (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-5 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-emerald-800">PDF Compressed Successfully!</h4>
                    <p className="text-xs text-emerald-600 font-medium">Your file has been optimized and is ready to download.</p>
                  </div>
                  <div>
                    <span className="inline-block bg-emerald-650 text-emerald-700 bg-emerald-200/60 text-sm font-bold px-3 py-1 rounded-full">
                      -{calculateReduction()}% Reduction
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm py-3.5 border-y border-emerald-100">
                  <div>
                    <span className="text-slate-500 block text-xs">Original Size:</span>
                    <strong className="text-slate-800 text-base">{formatSize(pdf.size)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Compressed Size:</span>
                    <strong className="text-slate-800 text-base">{compressedSize ? formatSize(compressedSize) : "N/A"}</strong>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={outputPdfUrl}
                    download={`compressed_${pdf.name}`}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                  >
                    <Download className="h-5 w-5" />
                    Download Compressed PDF
                  </a>
                  <button
                    onClick={() => {
                      setOutputPdfUrl(null);
                      setCompressedSize(null);
                    }}
                    className="px-5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-bold transition"
                  >
                    Compress Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Guarantee */}
      <div className="mt-8 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-xl mx-auto">
        <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
        <p className="text-xs text-slate-500">
          <strong>Privacy Guarantee:</strong> Your files are processed securely. All files are completely deleted from our secure memory buffers immediately after processing.
        </p>
      </div>
    </div>
  );
}

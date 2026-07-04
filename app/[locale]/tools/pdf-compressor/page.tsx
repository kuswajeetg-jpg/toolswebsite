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
        <p className="text-gray-600">Compress your PDF files online to reduce file size while maintaining the original quality.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {!pdf ? (
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center hover:bg-blue-50 transition cursor-pointer relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-800 mb-1">Upload PDF File</h3>
            <p className="text-sm text-slate-500">Drag and drop your PDF here, or click to browse</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 truncate max-w-md">{pdf.name}</h4>
                  <p className="text-xs text-slate-500">{formatSize(pdf.size)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPdf(null);
                  setOutputPdfUrl(null);
                  setCompressedSize(null);
                }}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>

            {!outputPdfUrl && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Compression Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setLevel("low")}
                      className={`p-4 border rounded-xl text-center transition-all ${
                        level === "low"
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-bold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="block text-sm">Low</span>
                      <span className="block text-xs font-normal opacity-70 mt-1">High quality, lower compression</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevel("medium")}
                      className={`p-4 border rounded-xl text-center transition-all ${
                        level === "medium"
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-bold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="block text-sm">Medium</span>
                      <span className="block text-xs font-normal opacity-70 mt-1">Perfect balance</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevel("high")}
                      className={`p-4 border rounded-xl text-center transition-all ${
                        level === "high"
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-bold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="block text-sm">High</span>
                      <span className="block text-xs font-normal opacity-70 mt-1">Maximum compression, lower quality</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={processPdf}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
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

            {outputPdfUrl && (
              <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-emerald-800">PDF Compressed Successfully!</h4>
                    <p className="text-xs text-emerald-600">Your file is ready for download.</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded">
                      -{calculateReduction()}% Smallest
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm py-2 border-y border-emerald-100">
                  <div>
                    <span className="text-slate-500 block">Original Size:</span>
                    <strong className="text-slate-800">{formatSize(pdf.size)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Compressed Size:</span>
                    <strong className="text-slate-800">{compressedSize ? formatSize(compressedSize) : "N/A"}</strong>
                  </div>
                </div>

                <a
                  href={outputPdfUrl}
                  download={`compressed_${pdf.name}`}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Compressed PDF
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="mt-8 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-xl mx-auto">
        <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
        <p className="text-xs text-slate-500">
          <strong>Privacy Guarantee:</strong> Your PDF is processed securely. All temp files on our servers are deleted automatically after processing.
        </p>
      </div>
    </div>
  );
}

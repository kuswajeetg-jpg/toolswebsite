"use client";

import { useEffect, useState } from "react";
import { UploadCloud, Download, Loader2, FileText, FileDown } from "lucide-react";
import { useToastError } from "@/lib/toast";
import * as pdfjsLib from "pdfjs-dist";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export default function PdfToWordPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedDocxUrl, setExtractedDocxUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (extractedDocxUrl) URL.revokeObjectURL(extractedDocxUrl);
    };
  }, [extractedDocxUrl]);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdf(file);
      setExtractedDocxUrl(null);
      setProgress(0);

      try {
        const fileBytes = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: fileBytes }).promise;
        setTotalPages(pdfDoc.numPages);
      } catch (err) {
        console.error(err);
        onError("Invalid PDF file or unable to read it.");
        setPdf(null);
      }
    }
  };

  const extractTextAndConvertToDocx = async () => {
    if (!pdf) return;
    setIsProcessing(true);
    setProgress(15);
    
    try {
      const formData = new FormData();
      formData.append("file", pdf);
      
      setProgress(40);
      const response = await fetch("/api/convert/pdf-to-word", {
        method: "POST",
        body: formData,
      });
      
      setProgress(75);
      if (!response.ok) {
        throw new Error("Server conversion failed. Please ensure the PDF is not scanned (must contain readable text).");
      }
      
      setProgress(90);
      const blob = await response.blob();
      setExtractedDocxUrl(URL.createObjectURL(blob));
      setProgress(100);
      
    } catch (error: any) {
      console.error("Conversion error", error);
      onError(error.message || "Error converting PDF. Please ensure it is a valid PDF file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to Word Converter</h1>
        <p className="text-gray-600">Convert text-based PDF files to editable Word documents (DOCX). 100% locally processed in your browser.</p>
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
            <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">Click or drag a PDF here</p>
            <p className="text-sm text-gray-500 mt-2">Text-based PDFs only (scanned images won't work)</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center text-sm border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">{pdf.name}</span>
              </div>
              <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">{totalPages} Pages</span>
            </div>

            {!extractedDocxUrl ? (
              <div className="space-y-4">
                  <button
                    onClick={extractTextAndConvertToDocx}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:bg-blue-400 shadow-sm relative overflow-hidden"
                  >
                    {isProcessing && (
                        <div className="absolute left-0 top-0 bottom-0 bg-blue-700 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Converting ({progress}%)...</> : <> <FileDown className="h-5 w-5" /> Convert to Word</>}
                    </span>
                  </button>
                  
                  <button onClick={() => setPdf(null)} disabled={isProcessing} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition">
                      Cancel
                  </button>
              </div>
            ) : (
              <div className="space-y-6 text-center max-w-lg mx-auto py-8">
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium">
                  Conversion complete! Your Word document is ready.
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={() => { setPdf(null); setExtractedDocxUrl(null); setTotalPages(null); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Convert Another
                  </button>
                  <a
                    href={extractedDocxUrl}
                    download={pdf.name.replace(".pdf", ".docx")}
                    className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-sm"
                  >
                    <Download className="h-5 w-5" /> Download DOCX
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
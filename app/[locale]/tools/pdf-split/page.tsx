"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadCloud, Download, Loader2, Check } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function PdfSplitPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (splitPdfUrl) URL.revokeObjectURL(splitPdfUrl);
    };
  }, [splitPdfUrl]);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdf(file);
      setSplitPdfUrl(null);
      setSelectedPages(new Set());

      try {
        const fileBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        setTotalPages(pdfDoc.getPageCount());
      } catch (err) {
        console.error(err);
        onError("Invalid PDF file.");
        setPdf(null);
      }
    }
  };

  const togglePage = (pageNum: number) => {
      const newSet = new Set(selectedPages);
      if (newSet.has(pageNum)) {
          newSet.delete(pageNum);
      } else {
          newSet.add(pageNum);
      }
      setSelectedPages(newSet);
  }
  
  const selectAll = () => {
      if (!totalPages) return;
      const all = new Set<number>();
      for (let i = 1; i <= totalPages; i++) all.add(i);
      setSelectedPages(all);
  }
  
  const clearSelection = () => {
      setSelectedPages(new Set());
  }

  const splitPdf = async () => {
    if (!pdf || !totalPages || selectedPages.size === 0) return;
    setIsProcessing(true);
    try {
      const pagesToExtract = Array.from(selectedPages).sort((a, b) => a - b);
      
      const fileBytes = await pdf.arrayBuffer();
      const originalPdf = await PDFDocument.load(fileBytes);
      const newPdf = await PDFDocument.create();

      const zeroIndexedPages = pagesToExtract.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(originalPdf, zeroIndexedPages);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(Array.from(pdfBytes))], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setSplitPdfUrl(url);
    } catch (error) {
      console.error("Failed to split PDF", error);
      onError("Error splitting PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Split PDF</h1>
        <p className="text-gray-600">Visually select and extract specific pages from your PDF file. Secure, fast, and local.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {!pdf ? (
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center hover:bg-blue-50 transition cursor-pointer relative">
            <input
              type="file" accept="application/pdf" onChange={handlePdfUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">Click or drag a PDF here</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center text-sm border border-gray-200 shadow-sm">
              <span className="font-semibold text-gray-900 truncate max-w-xs">{pdf.name}</span>
              <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">{totalPages} Pages Total</span>
            </div>

            {!splitPdfUrl ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-lg font-semibold text-gray-900">Select Pages to Extract</h3>
                   <div className="flex gap-2">
                       <button onClick={selectAll} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Select All</button>
                       <span className="text-gray-300">|</span>
                       <button onClick={clearSelection} className="text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline">Clear</button>
                   </div>
                </div>
                
                {totalPages && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[400px] overflow-y-auto p-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                            const isSelected = selectedPages.has(pageNum);
                            return (
                                <button
                                   key={pageNum}
                                   onClick={() => togglePage(pageNum)}
                                   className={`relative flex flex-col items-center justify-center aspect-[1/1.4] rounded-lg border-2 transition-all ${
                                       isSelected ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105' : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                                   }`}
                                >
                                    <span className={`text-lg font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>{pageNum}</span>
                                    {isSelected && (
                                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                   <div className="text-sm">
                       <span className="font-medium text-gray-900">{selectedPages.size}</span> pages selected
                   </div>
                   
                   <div className="flex gap-4">
                       <button onClick={() => { setPdf(null); setTotalPages(null); setSelectedPages(new Set()); }} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                           Cancel
                       </button>
                       <button
                         onClick={splitPdf}
                         disabled={isProcessing || selectedPages.size === 0}
                         className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:bg-blue-300 shadow-sm"
                       >
                         {isProcessing ? <><Loader2 className="animate-spin h-4 w-4" /> Splitting...</> : "Extract Selected"}
                       </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center max-w-lg mx-auto py-8">
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium">
                  PDF successfully split!
                </div>
                <div className="text-gray-600">Extracted {selectedPages.size} pages from original document.</div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={() => { setSplitPdfUrl(null); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Adjust Selection
                  </button>
                  <a
                    href={splitPdfUrl}
                    download={`extracted_${pdf.name}`}
                    className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-sm"
                  >
                    <Download className="h-5 w-5" /> Download Extracted PDF
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

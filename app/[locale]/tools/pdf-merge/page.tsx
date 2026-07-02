"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadCloud, Download, Loader2, GripVertical, Trash2, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function PdfMergePage() {
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
    };
  }, [mergedPdfUrl]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfs((prev) => [...prev, ...Array.from(e.target.files!)]);
      setMergedPdfUrl(null);
    }
  };

  const removePdf = (index: number) => {
    setPdfs(pdfs.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };
  
  const movePdf = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index > 0) {
          const newPdfs = [...pdfs];
          [newPdfs[index - 1], newPdfs[index]] = [newPdfs[index], newPdfs[index - 1]];
          setPdfs(newPdfs);
          setMergedPdfUrl(null);
      } else if (direction === 'down' && index < pdfs.length - 1) {
          const newPdfs = [...pdfs];
          [newPdfs[index + 1], newPdfs[index]] = [newPdfs[index], newPdfs[index + 1]];
          setPdfs(newPdfs);
          setMergedPdfUrl(null);
      }
  }

  const mergePdfs = async () => {
    if (pdfs.length < 2) {
      onError("Please upload at least 2 PDF files to merge.");
      return;
    }
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of pdfs) {
        const fileBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(Array.from(pdfBytes))], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error("Failed to merge PDFs", error);
      onError("Error merging PDFs. Please ensure all uploaded files are valid PDF documents.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Merge PDF Files</h1>
        <p className="text-gray-600">Combine multiple PDF documents into a single file directly in your browser. 100% Private.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center hover:bg-blue-50 transition cursor-pointer relative">
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <p className="text-lg font-medium text-gray-700">Click or drag PDF files here</p>
        </div>

        {pdfs.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">{pdfs.length} PDF(s) Selected</h3>
            <ul className="space-y-3 mb-6">
              {pdfs.map((pdf, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <span className="font-medium truncate max-w-[200px] sm:max-w-xs">{pdf.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-gray-400 mr-2">{(pdf.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button onClick={() => movePdf(idx, 'up')} disabled={idx === 0} className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition"><ArrowUp className="h-4 w-4" /></button>
                    <button onClick={() => movePdf(idx, 'down')} disabled={idx === pdfs.length - 1} className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition"><ArrowDown className="h-4 w-4" /></button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button onClick={() => removePdf(idx)} className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {!mergedPdfUrl ? (
              <button
                onClick={mergePdfs}
                disabled={isProcessing || pdfs.length < 2}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:bg-blue-300 shadow-sm"
              >
                {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Merging...</> : "Merge PDFs"}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => { setPdfs([]); setMergedPdfUrl(null); }}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Start Over
                </button>
                <a
                  href={mergedPdfUrl}
                  download="merged_document.pdf"
                  className="flex-[2] bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-sm"
                >
                  <Download className="h-5 w-5" /> Download Merged PDF
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

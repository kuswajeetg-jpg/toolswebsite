"use client";

import { useEffect, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { UploadCloud, Download, Loader2, Hash, FileText } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function PdfPageNumbersPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [startPage, setStartPage] = useState<string>("1");
  const [position, setPosition] = useState<"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right">("bottom-center");
  const [format, setFormat] = useState<"simple" | "roman" | "with-total">("simple");
  const [color, setColor] = useState<string>("#333333");
  const [fontSize, setFontSize] = useState<number>(12);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (outputPdfUrl) URL.revokeObjectURL(outputPdfUrl);
    };
  }, [outputPdfUrl]);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdf(file);
      setOutputPdfUrl(null);

      try {
        const fileBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        setTotalPages(pdfDoc.getPageCount());
      } catch (err) {
        onError("Invalid PDF file.");
        setPdf(null);
      }
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0.2, g: 0.2, b: 0.2 };
  };

  const addPageNumbers = async () => {
    if (!pdf || !totalPages) return;
    setIsProcessing(true);
    try {
      const fileBytes = await pdf.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont("Helvetica");

      const start = parseInt(startPage) || 1;
      if (start < 1) {
        onError("Invalid start page number.");
        setIsProcessing(false);
        return;
      }
      
      const { r, g, b } = hexToRgb(color);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const pageNumber = i + 1;
        
        const labelNumber = pageNumber + (start - 1);

        let text = "";
        if (format === "simple") {
          text = labelNumber.toString();
        } else if (format === "roman") {
          const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
          text = romanNumerals[labelNumber - 1] || labelNumber.toString();
        } else {
          text = `${labelNumber} / ${totalPages + (start - 1)}`;
        }

        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x = 0, y = 20;
        switch (position) {
          case "top-left": x = 30; y = height - 30; break;
          case "top-center": x = (width - textWidth) / 2; y = height - 30; break;
          case "top-right": x = width - textWidth - 30; y = height - 30; break;
          case "bottom-left": x = 30; y = 30; break;
          case "bottom-center": x = (width - textWidth) / 2; y = 30; break;
          case "bottom-right": x = width - textWidth - 30; y = 30; break;
        }

        page.drawText(text, {
          x, y,
          size: fontSize,
          font,
          color: rgb(r, g, b),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(Array.from(pdfBytes))], { type: "application/pdf" });
      setOutputPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Page numbers error", error);
      onError("Error adding page numbers. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Page Numbers</h1>
        <p className="text-gray-600">Add customizable page numbers to your PDF documents. Processed securely in your browser.</p>
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
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center text-sm border border-gray-200">
              <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{pdf.name}</span>
              </div>
              <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">{totalPages} Pages</span>
            </div>

            {!outputPdfUrl ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Numbering Options</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Starting Number (First Page)</label>
                      <input
                        type="number"
                        value={startPage}
                        onChange={(e) => setStartPage(e.target.value)}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="simple">Simple (1, 2, 3...)</option>
                        <option value="roman">Roman (I, II, III...)</option>
                        <option value="with-total">With Total (1/5, 2/5...)</option>
                      </select>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Styling & Position</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position Template</label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="top-left">Top Left</option>
                        <option value="top-center">Top Center</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size ({fontSize}pt)</label>
                          <input type="range" min="8" max="48" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-600" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                          <div className="flex gap-2">
                              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded cursor-pointer border border-gray-300" />
                          </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={addPageNumbers}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-sm"
                    >
                      {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Processing...</> : <> <Hash className="h-5 w-5" /> Apply Page Numbers</>}
                    </button>
                    <button onClick={() => setPdf(null)} className="w-full mt-3 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                       Cancel
                    </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center max-w-lg mx-auto py-8">
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium">
                  Page numbers added successfully!
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={() => { setOutputPdfUrl(null); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Adjust Settings
                  </button>
                  <a
                    href={outputPdfUrl}
                    download={`numbered_${pdf.name}`}
                    className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-sm"
                  >
                    <Download className="h-5 w-5" /> Download PDF
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
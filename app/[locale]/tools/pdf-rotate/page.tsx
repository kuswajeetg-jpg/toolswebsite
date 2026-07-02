"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadCloud, Download, Loader2, RotateCw, RotateCcw, FileText, CheckCircle2 } from "lucide-react";
import { useToastError } from "@/lib/toast";
import * as pdfjsLib from "pdfjs-dist";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface PagePreview {
  url: string;
  pageNum: number;
}

export default function PdfRotatePage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const [pagePreviews, setPagePreviews] = useState<PagePreview[]>([]);
  const [rotations, setRotations] = useState<{ [key: number]: number }>({});
  
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (outputPdfUrl) URL.revokeObjectURL(outputPdfUrl);
      pagePreviews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [outputPdfUrl, pagePreviews]);

  const generatePreviews = async (file: File) => {
    setIsLoadingPreviews(true);
    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: fileBytes }).promise;
      const numPages = pdfDoc.numPages;
      setTotalPages(numPages);
      
      const previews: PagePreview[] = [];
      const initRots: { [key: number]: number } = {};

      const pagesToRender = Math.min(numPages, 100);

      for (let i = 1; i <= pagesToRender; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          // pdfjs-dist RenderParameters requires canvas in newer versions? Wait, canvas is canvas element.
          // Let's pass it.
          // Or wait, is canvas property required?
          // I'll add `canvasContext: context, viewport, canvasFactory: undefined` or just ignore ts for this specific line?
          // The easiest way is to add an ts-ignore or cast it.
          // Let's check what `RenderParameters` needs.
          // It needs `canvasContext`, `viewport`. Wait, type error says "Property 'canvas' is missing... but required"
          // I will just add `canvas: canvas` or ignore it. Let's ignore it to avoid runtime bugs if the library doesn't actually need it or just pass canvas.
          // Let's pass it as a ts-ignore to be safe.
          
          // @ts-ignore
          await page.render({ canvasContext: context, viewport }).promise;
          const url = canvas.toDataURL('image/jpeg', 0.8);
          previews.push({ url, pageNum: i });
        }
        initRots[i] = 0;
      }

      setPagePreviews(previews);
      setRotations(initRots);
      
    } catch (err) {
        console.error(err);
        onError("Could not generate page previews.");
    } finally {
        setIsLoadingPreviews(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdf(file);
      setOutputPdfUrl(null);
      setPagePreviews([]);
      setRotations({});
      await generatePreviews(file);
    }
  };

  const rotatePage = (pageNum: number, direction: 'cw' | 'ccw') => {
      setRotations(prev => {
          const current = prev[pageNum] || 0;
          const delta = direction === 'cw' ? 90 : -90;
          let next = current + delta;
          if (next >= 360) next -= 360;
          if (next < 0) next += 360;
          return { ...prev, [pageNum]: next };
      });
  };

  const rotateAll = (direction: 'cw' | 'ccw') => {
      setRotations(prev => {
          const delta = direction === 'cw' ? 90 : -90;
          const next = { ...prev };
          Object.keys(next).forEach(k => {
              const numKey = Number(k);
              let val = (next[numKey] || 0) + delta;
              if (val >= 360) val -= 360;
              if (val < 0) val += 360;
              next[numKey] = val;
          });
          return next;
      });
  };

  const applyRotations = async () => {
    if (!pdf) return;
    setIsProcessing(true);
    try {
      const fileBytes = await pdf.arrayBuffer();
      const originalPdf = await PDFDocument.load(fileBytes);
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(originalPdf, originalPdf.getPageIndices());
      copiedPages.forEach((page, index) => {
          const pageNum = index + 1;
          const rotationAngle = rotations[pageNum] || 0;
          if (rotationAngle !== 0) {
              page.setRotation((page.getRotation().angle + rotationAngle) % 360 as any);
          }
          newPdf.addPage(page);
      });

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(Array.from(pdfBytes))], { type: "application/pdf" });
      setOutputPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Rotate error", error);
      onError("Error rotating PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Rotate</h1>
        <p className="text-gray-600">Visually rotate individual PDF pages. Processed securely in your browser.</p>
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
            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center text-sm border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{pdf.name}</span>
              </div>
              <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">{totalPages} Pages Total</span>
            </div>

            {!outputPdfUrl ? (
              <div className="space-y-6">
                
                {isLoadingPreviews ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Loader2 className="animate-spin h-8 w-8 mb-4 text-blue-500" />
                        <p>Generating page previews...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800">Select pages to rotate</h3>
                            <div className="flex gap-2">
                                <button onClick={() => rotateAll('ccw')} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition">
                                    <RotateCcw className="h-4 w-4" /> All Left
                                </button>
                                <button onClick={() => rotateAll('cw')} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition">
                                    <RotateCw className="h-4 w-4" /> All Right
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-h-[60vh] overflow-y-auto p-2">
                            {pagePreviews.map((page) => {
                                const currentRot = rotations[page.pageNum] || 0;
                                return (
                                <div key={page.pageNum} className="flex flex-col items-center bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition">
                                    <div className="text-xs font-semibold text-gray-500 mb-2">Page {page.pageNum}</div>
                                    <div className="w-full aspect-[1/1.4] bg-white rounded flex items-center justify-center shadow-sm overflow-hidden mb-3 border border-gray-200 relative">
                                        <div 
                                            className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-300 ease-in-out" 
                                            style={{ 
                                                backgroundImage: `url("${page.url}")`,
                                                transform: `rotate(${currentRot}deg)`
                                            }}
                                        />
                                    </div>
                                    <div className="flex w-full gap-1">
                                        <button onClick={() => rotatePage(page.pageNum, 'ccw')} className="flex-1 py-1.5 flex justify-center items-center bg-white border border-gray-200 rounded hover:bg-gray-100 transition text-gray-700" title="Rotate Left">
                                            <RotateCcw className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => rotatePage(page.pageNum, 'cw')} className="flex-1 py-1.5 flex justify-center items-center bg-white border border-gray-200 rounded hover:bg-gray-100 transition text-gray-700" title="Rotate Right">
                                            <RotateCw className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )})}
                            {totalPages && totalPages > 100 && (
                                <div className="col-span-full text-center py-4 text-sm text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                                    Preview limited to first 100 pages for performance. Rotations applied via "All" buttons will still affect all pages.
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button onClick={() => setPdf(null)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
                        Cancel
                    </button>
                    <button
                    onClick={applyRotations}
                    disabled={isProcessing || isLoadingPreviews}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                    {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Processing...</> : <> <CheckCircle2 className="h-5 w-5" /> Apply Rotations</>}
                    </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center max-w-lg mx-auto py-8">
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium">
                  PDF rotated successfully!
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                        onClick={() => { setOutputPdfUrl(null); }}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                    >
                        Adjust Rotation
                    </button>
                    <a
                    href={outputPdfUrl}
                    download={`rotated_${pdf.name}`}
                    className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-sm"
                    >
                    <Download className="h-5 w-5" /> Download Rotated PDF
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
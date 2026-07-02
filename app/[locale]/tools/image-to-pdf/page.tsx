"use client";

import { useEffect, useState } from "react";
import { PDFDocument, PageSizes } from "pdf-lib";
import { UploadCloud, Download, Loader2, GripVertical, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function ImageToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<string>("fit");
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)]);
      setPdfUrl(null);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const moveImage = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index > 0) {
          const newImages = [...images];
          [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
          setImages(newImages);
      } else if (direction === 'down' && index < images.length - 1) {
          const newImages = [...images];
          [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
          setImages(newImages);
      }
  }

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const image of images) {
        const imageBytes = await image.arrayBuffer();
        let pdfImage;
        if (image.type === 'image/jpeg' || image.type === 'image/jpg') {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (image.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          continue;
        }

        let width = pdfImage.width;
        let height = pdfImage.height;
        
        let page;
        if (pageSize === "a4") {
            page = pdfDoc.addPage(PageSizes.A4);
            const scale = Math.min(PageSizes.A4[0] / width, PageSizes.A4[1] / height);
            width *= scale;
            height *= scale;
            page.drawImage(pdfImage, {
              x: (PageSizes.A4[0] - width) / 2,
              y: (PageSizes.A4[1] - height) / 2,
              width, height
            });
        } else if (pageSize === "letter") {
            page = pdfDoc.addPage(PageSizes.Letter);
            const scale = Math.min(PageSizes.Letter[0] / width, PageSizes.Letter[1] / height);
            width *= scale;
            height *= scale;
            page.drawImage(pdfImage, {
              x: (PageSizes.Letter[0] - width) / 2,
              y: (PageSizes.Letter[1] - height) / 2,
              width, height
            });
        } else {
            page = pdfDoc.addPage([width, height]);
            page.drawImage(pdfImage, { x: 0, y: 0, width, height });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(Array.from(pdfBytes))], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      onError("Failed to generate PDF. Ensure images are valid JPG or PNG.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Image to PDF Converter</h1>
        <p className="text-gray-600">Convert your JPG and PNG images into a single PDF document. 100% Secure, processed locally in your browser.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center hover:bg-blue-50 transition cursor-pointer relative">
          <input
            type="file"
            multiple
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <p className="text-lg font-medium text-gray-700">Click or drag images here</p>
          <p className="text-sm text-gray-500 mt-2">Supports JPG and PNG up to 20MB</p>
        </div>

        {images.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">{images.length} Image(s) selected</h3>
            <ul className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {images.map((img, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="truncate flex-1 font-medium">{img.name}</span>
                  <div className="flex items-center gap-2">
                     <span className="mr-4 text-xs text-gray-400">{(img.size / 1024 / 1024).toFixed(2)} MB</span>
                     <button onClick={() => moveImage(idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                     <button onClick={() => moveImage(idx, 'down')} disabled={idx === images.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                     <button onClick={() => removeImage(idx)} className="p-1 hover:bg-red-100 text-red-500 rounded ml-2"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
               <select value={pageSize} onChange={e => setPageSize(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="fit">Fit to Image Size</option>
                  <option value="a4">A4 (Standard Document)</option>
                  <option value="letter">US Letter</option>
               </select>
            </div>

            {!pdfUrl ? (
              <button
                onClick={generatePdf}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:bg-blue-400"
              >
                {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Processing...</> : "Generate PDF"}
              </button>
            ) : (
               <div className="flex gap-4 mt-6">
                 <button onClick={() => { setPdfUrl(null); setImages([]); }} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">Start Over</button>
                 <a
                    href={pdfUrl}
                    download="converted.pdf"
                    className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2"
                  >
                    <Download className="h-5 w-5" /> Download PDF
                  </a>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

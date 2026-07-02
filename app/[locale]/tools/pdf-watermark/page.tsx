"use client";

import { useEffect, useState, useRef } from "react";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { UploadCloud, Download, Loader2, Image as ImageIcon, Type, FileText, CheckCircle2 } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function PdfWatermarkPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [type, setType] = useState<"text" | "image">("text");
  
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  
  const [opacity, setOpacity] = useState(0.3);
  const [position, setPosition] = useState<"center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tiled">("center");
  const [angle, setAngle] = useState(45);
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState<string>("#888888");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkedPdfUrl, setWatermarkedPdfUrl] = useState<string | null>(null);
  const onError = useToastError();
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (watermarkedPdfUrl) URL.revokeObjectURL(watermarkedPdfUrl);
    };
  }, [watermarkedPdfUrl]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdf(e.target.files[0]);
      setWatermarkedPdfUrl(null);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setWatermarkImage(e.target.files[0]);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0.5, g: 0.5, b: 0.5 };
  };

  const applyWatermark = async () => {
    if (!pdf) return;
    if (type === "image" && !watermarkImage) {
        onError("Please select an image for the watermark.");
        return;
    }
    
    setIsProcessing(true);
    try {
      const fileBytes = await pdf.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();
      
      let font: any = null;
      let imgObj: any = null;
      let imgDims: { width: number, height: number } = { width: 0, height: 0 };
      
      if (type === "text") {
        font = await pdfDoc.embedFont("Helvetica");
      } else if (watermarkImage) {
          const imgBytes = await watermarkImage.arrayBuffer();
          if (watermarkImage.type === "image/png") {
              imgObj = await pdfDoc.embedPng(imgBytes);
          } else if (watermarkImage.type === "image/jpeg" || watermarkImage.type === "image/jpg") {
              imgObj = await pdfDoc.embedJpg(imgBytes);
          } else {
              throw new Error("Unsupported image format. Use PNG or JPG.");
          }
          imgDims = imgObj.scale(0.5); // scale down a bit by default
      }
      
      const { r, g, b } = hexToRgb(color);

      for (const page of pages) {
        const { width, height } = page.getSize();
        
        const drawItem = (x: number, y: number) => {
            if (type === "text") {
                page.drawText(watermarkText, {
                  x, y,
                  size: fontSize,
                  font,
                  color: rgb(r, g, b),
                  opacity,
                  rotate: degrees(angle),
                });
            } else if (imgObj) {
                // center image around x, y when rotating, pdf-lib rotates around bottom-left. 
                // We'll simplify and just draw at x,y with rotation.
                page.drawImage(imgObj, {
                    x, y,
                    width: imgDims.width,
                    height: imgDims.height,
                    opacity,
                    rotate: degrees(angle)
                });
            }
        };

        let itemW = 0;
        let itemH = 0;
        if (type === "text") {
            itemW = font.widthOfTextAtSize(watermarkText, fontSize);
            itemH = fontSize;
        } else {
            itemW = imgDims.width;
            itemH = imgDims.height;
        }

        if (position === "tiled") {
            // Tiled watermark
            const stepX = itemW * 1.5;
            const stepY = itemH * 3;
            // Add some margin and loop
            for (let x = -width; x < width * 2; x += stepX) {
                for (let y = -height; y < height * 2; y += stepY) {
                    drawItem(x, y);
                }
            }
        } else {
            let x = 0, y = 0;
            switch (position) {
              case "center": x = (width - itemW) / 2; y = (height - itemH) / 2; break;
              case "top-left": x = 50; y = height - itemH - 50; break;
              case "top-right": x = width - itemW - 50; y = height - itemH - 50; break;
              case "bottom-left": x = 50; y = 50; break;
              case "bottom-right": x = width - itemW - 50; y = 50; break;
            }
            drawItem(x, y);
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(Array.from(pdfBytes))], { type: "application/pdf" });
      setWatermarkedPdfUrl(URL.createObjectURL(blob));
    } catch (error: any) {
      console.error("Watermark error", error);
      onError(error.message || "Error applying watermark. Please ensure the PDF is valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Watermark Adder</h1>
        <p className="text-gray-600">Add customizable text or image watermarks to PDF files. Secure and processed locally.</p>
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
          <div className="space-y-8">
            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center text-sm border border-gray-200">
              <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{pdf.name}</span>
              </div>
              <span className="text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{(pdf.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            {!watermarkedPdfUrl ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 flex flex-col gap-3 border-r border-gray-100 pr-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Watermark Type</h3>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 transition cursor-pointer ${type === "text" ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input type="radio" value="text" checked={type === "text"} onChange={(e) => setType(e.target.value as any)} className="hidden" />
                    <Type className={`h-6 w-6 ${type === "text" ? 'text-blue-600' : 'text-gray-400'}`} /> 
                    <div>
                        <div className="font-semibold text-gray-900">Text</div>
                        <div className="text-xs text-gray-500">Custom text watermark</div>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 transition cursor-pointer ${type === "image" ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input type="radio" value="image" checked={type === "image"} onChange={(e) => setType(e.target.value as any)} className="hidden" />
                    <ImageIcon className={`h-6 w-6 ${type === "image" ? 'text-blue-600' : 'text-gray-400'}`} /> 
                    <div>
                        <div className="font-semibold text-gray-900">Image</div>
                        <div className="text-xs text-gray-500">Logo or image watermark</div>
                    </div>
                  </label>
                </div>

                <div className="md:col-span-8 space-y-6">
                    {type === "text" ? (
                        <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
                              <input
                                type="text"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. CONFIDENTIAL"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size ({fontSize}pt)</label>
                                  <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-600" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded cursor-pointer border border-gray-300" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Image (PNG/JPG)</label>
                            <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} ref={imageInputRef} className="hidden" />
                            <div 
                                onClick={() => imageInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer"
                            >
                                {watermarkImage ? (
                                    <div className="text-blue-600 font-medium flex items-center justify-center gap-2">
                                        <ImageIcon className="h-5 w-5" /> {watermarkImage.name} (Click to change)
                                    </div>
                                ) : (
                                    <div className="text-gray-500 font-medium">Click to select image</div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Opacity ({Math.round(opacity * 100)}%)</label>
                            <input
                              type="range"
                              min="0.05" max="1" step="0.05"
                              value={opacity}
                              onChange={(e) => setOpacity(parseFloat(e.target.value))}
                              className="w-full accent-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Angle ({angle}°)</label>
                            <input
                              type="range"
                              min="-180" max="180" step="15"
                              value={angle}
                              onChange={(e) => setAngle(Number(e.target.value))}
                              className="w-full accent-blue-600"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <select
                          value={position}
                          onChange={(e) => setPosition(e.target.value as any)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="center">Center</option>
                          <option value="tiled">Tiled (Repeated across page)</option>
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button onClick={() => setPdf(null)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
                            Cancel
                        </button>
                        <button
                          onClick={applyWatermark}
                          disabled={isProcessing}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-sm"
                        >
                          {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Processing...</> : <><CheckCircle2 className="h-5 w-5" /> Apply Watermark</>}
                        </button>
                    </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center max-w-lg mx-auto py-8">
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium">
                  Watermark successfully added!
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={() => { setPdf(null); setWatermarkedPdfUrl(null); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Process Another
                  </button>
                  <a
                    href={watermarkedPdfUrl}
                    download={`watermarked_${pdf.name}`}
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
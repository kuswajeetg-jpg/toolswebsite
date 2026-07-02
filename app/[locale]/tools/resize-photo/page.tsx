"use client";

import { useEffect, useState, useRef } from "react";
import { UploadCloud, Download, Loader2, ArrowRight } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function ResizePhotoWhPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [unit, setUnit] = useState<"px" | "%">("px");
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [percentage, setPercentage] = useState<number>(50);
  
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const onError = useToastError();

  const previewRef = useRef<string | null>(null);
  const resizedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      if (resizedUrlRef.current) URL.revokeObjectURL(resizedUrlRef.current);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setResizedUrl(null);
      resizedUrlRef.current = null;

      const url = URL.createObjectURL(file);
      previewRef.current = url;
      setPreview(url);

      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalDimensions({ width: img.width, height: img.height });
        setAspectRatio(img.width / img.height);
      };
      img.src = url;
    }
  };

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (maintainRatio) setHeight(Math.round(w / aspectRatio));
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (maintainRatio) setWidth(Math.round(h * aspectRatio));
  };

  const resizeImage = () => {
    if (!preview) return;
    setIsProcessing(true);
    
    let targetWidth = width;
    let targetHeight = height;
    
    if (unit === "%") {
        targetWidth = Math.round(originalDimensions.width * (percentage / 100));
        targetHeight = Math.round(originalDimensions.height * (percentage / 100));
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resizedUrlRef.current = url;
          setResizedUrl(url);
        }
        setIsProcessing(false);
      }, image?.type || "image/jpeg", 0.9);
    };
    img.onerror = () => {
      onError("Failed to load image.");
      setIsProcessing(false);
    };
    img.src = preview;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Resize Photo</h1>
        <p className="text-gray-600">Resize your image by exact pixels or percentage.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {!image ? (
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center hover:bg-blue-50 transition cursor-pointer relative">
            <input
              type="file" accept="image/*" onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">Click or drag an image here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {!resizedUrl ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <img src={preview!} alt="Preview" className="w-full h-auto rounded-lg border border-gray-200 object-contain max-h-64" />
                  <div className="mt-2 text-sm text-center text-gray-500">
                     Original size: {originalDimensions.width} × {originalDimensions.height} px
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                      <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                         <button onClick={() => setUnit("px")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${unit === "px" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"}`}>Pixels</button>
                         <button onClick={() => setUnit("%")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${unit === "%" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"}`}>Percentage</button>
                      </div>
                      
                      {unit === "px" ? (
                          <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                                    <input type="number" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                                    <input type="number" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <input type="checkbox" id="ratio" checked={maintainRatio} onChange={(e) => setMaintainRatio(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                                <label htmlFor="ratio" className="text-sm text-gray-700 cursor-pointer select-none">Maintain Aspect Ratio</label>
                              </div>
                          </div>
                      ) : (
                          <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Scale Percentage (%)</label>
                                <input type="number" value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} min={1} max={500} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                             </div>
                             <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                 New size will be: <span className="font-semibold text-blue-800">{Math.round(originalDimensions.width * (percentage/100))} × {Math.round(originalDimensions.height * (percentage/100))} px</span>
                             </div>
                          </div>
                      )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex gap-4">
                    <button onClick={() => { setImage(null); setPreview(null); }} className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
                       Cancel
                    </button>
                    <button onClick={resizeImage} disabled={isProcessing} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2">
                      {isProcessing ? <Loader2 className="animate-spin" /> : <>Resize Image <ArrowRight className="h-4 w-4"/></>}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center max-w-md mx-auto">
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium">
                  Image resized successfully!
                </div>
                <img src={resizedUrl} alt="Resized" className="mx-auto max-h-64 object-contain border rounded-lg shadow-sm" />
                
                <div className="flex gap-4">
                  <button onClick={() => setResizedUrl(null)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                    Make Changes
                  </button>
                  <a href={resizedUrl} download={`resized_${image.name}`} className="flex-[2] flex justify-center items-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                    <Download className="h-5 w-5"/> Download Image
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

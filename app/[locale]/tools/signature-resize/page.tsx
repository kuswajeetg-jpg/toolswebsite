"use client";

import { useEffect, useState, useRef } from "react";
import { UploadCloud, Download, Loader2, RefreshCcw } from "lucide-react";
import { useToastError } from "@/lib/toast";

const PRESETS = [
    { name: "Custom", width: 300, height: 100 },
    { name: "SSC / UPSC", width: 140, height: 60 },
    { name: "PAN Card", width: 213, height: 213 },
    { name: "Bank Exams", width: 140, height: 60 },
    { name: "Passport", width: 600, height: 600 }
];

export default function SignatureResizePage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(100);
  const [activePreset, setActivePreset] = useState("Custom");
  
  const [grayscale, setGrayscale] = useState(true);
  const [contrast, setContrast] = useState(120); 
  const [threshold, setThreshold] = useState(150); 
  
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
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
      setActivePreset(preset.name);
      setWidth(preset.width);
      setHeight(preset.height);
  }

  const processSignature = () => {
    if (!preview) return;
    setIsProcessing(true);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.filter = `contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0, width, height);
      ctx.filter = "none"; 

      if (grayscale) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const adjusted = avg > threshold ? 255 : 0;
          data[i] = adjusted;
          data[i + 1] = adjusted;
          data[i + 2] = adjusted;
        }
        ctx.putImageData(imageData, 0, 0);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resizedUrlRef.current = url;
          setResizedUrl(url);
        }
        setIsProcessing(false);
      }, "image/jpeg", 0.9);
    };
    img.onerror = () => {
      onError("Failed to load image.");
      setIsProcessing(false);
    };
    img.src = preview;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Signature Resize Tool</h1>
        <p className="text-gray-600">Resize, enhance, and optimize signatures for online forms (e.g. SSC, UPSC, PAN).</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {!image ? (
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center hover:bg-blue-50 transition cursor-pointer relative">
            <input
              type="file" accept="image/*" onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">Upload Signature Image</p>
          </div>
        ) : (
          <div className="space-y-6">
            {!resizedUrl ? (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Preview</h3>
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center justify-center min-h-[300px]">
                    <img src={preview!} alt="Preview" className="max-w-full max-h-[250px] object-contain shadow-sm" />
                  </div>
                  <button onClick={() => { setImage(null); setPreview(null); }} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                      Upload Different Image
                  </button>
                </div>
                
                <div className="w-full lg:w-96 space-y-6">
                  <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Dimension Presets</h3>
                      <div className="flex flex-wrap gap-2">
                          {PRESETS.map(p => (
                             <button
                                key={p.name}
                                onClick={() => applyPreset(p)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activePreset === p.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                             >
                                {p.name}
                             </button>
                          ))}
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                      <input type="number" value={width} onChange={(e) => { setWidth(Number(e.target.value)); setActivePreset("Custom"); }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                      <input type="number" value={height} onChange={(e) => { setHeight(Number(e.target.value)); setActivePreset("Custom"); }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div>
                          <div className="flex justify-between text-sm mb-1">
                             <span className="font-medium text-gray-700">Contrast</span>
                             <span className="text-gray-500">{contrast}%</span>
                          </div>
                          <input type="range" min={100} max={300} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-blue-600" />
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="bw" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                        <label htmlFor="bw" className="text-sm text-gray-700 cursor-pointer select-none">Convert to Black & White (Crisp)</label>
                      </div>
                      
                      {grayscale && (
                          <div>
                              <div className="flex justify-between text-sm mb-1">
                                 <span className="font-medium text-gray-700">B&W Threshold</span>
                                 <span className="text-gray-500">{threshold}</span>
                              </div>
                              <input type="range" min={50} max={220} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full accent-blue-600" />
                              <p className="text-xs text-gray-500 mt-1">Adjust if signature looks too faded or has noise.</p>
                          </div>
                      )}
                  </div>
                  
                  <button onClick={processSignature} disabled={isProcessing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 mt-4">
                    {isProcessing ? <Loader2 className="animate-spin" /> : "Process Signature"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center max-w-lg mx-auto">
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium">
                  Signature processed!
                </div>
                
                <div>
                   <p className="text-sm text-gray-500 mb-2">Final Dimensions: {width} × {height} px</p>
                   <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 inline-block mx-auto shadow-inner">
                     <img src={resizedUrl} alt="Resized Signature" className="object-contain bg-white shadow-sm border border-gray-100" style={{width: `${width}px`, height: `${height}px`}} />
                   </div>
                </div>
                
                <div className="flex gap-4">
                  <button onClick={() => setResizedUrl(null)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                    Adjust Settings
                  </button>
                  <a href={resizedUrl} download="signature_ready.jpg" className="flex-[2] flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                    <Download className="h-5 w-5" /> Download Result
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

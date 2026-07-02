"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Crop, Download, RotateCcw } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function ImageCropperPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [croppedUrl, setCroppedUrl] = useState<string>("");
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onError = useToastError();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      onError("Please select a valid image file");
      return;
    }
    setSelectedFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setCroppedUrl("");
  }, [onError]);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = originalUrl;
      await new Promise((resolve) => (image.onload = resolve));
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxSize = Math.max(image.width, image.height);
      const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

      canvas.width = safeArea;
      canvas.height = safeArea;
      
      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-safeArea / 2, -safeArea / 2);
      
      ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
      );
      
      const data = ctx.getImageData(0, 0, safeArea, safeArea);
      
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - croppedAreaPixels.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - croppedAreaPixels.y)
      );

      canvas.toBlob((blob) => {
        if (blob) setCroppedUrl(URL.createObjectURL(blob));
      }, 'image/jpeg');
    } catch (e) {
      console.error(e);
      onError("Error cropping image");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Image Cropper</h1>
        <p className="text-gray-600">Crop, zoom, and rotate your images precisely</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        {!selectedFile ? (
          <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition">
            <Crop className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Click to upload an image</p>
          </button>
        ) : !croppedUrl ? (
          <div className="space-y-6">
            <div className="relative h-96 w-full bg-gray-100 rounded-xl overflow-hidden">
              <Cropper
                image={originalUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                rotation={rotation}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "1:1", value: 1 },
                    { label: "4:3", value: 4/3 },
                    { label: "16:9", value: 16/9 },
                    { label: "3:4", value: 3/4 },
                    { label: "9:16", value: 9/16 },
                  ].map(ar => (
                    <button
                      key={ar.label}
                      onClick={() => setAspect(ar.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${aspect === ar.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zoom: {zoom.toFixed(1)}x</label>
                  <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Rotation: {rotation}°</label>
                    <button onClick={() => setRotation(r => (r + 90) % 360)} className="text-blue-600 hover:bg-blue-50 p-1 rounded transition">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                  <input type="range" min={0} max={360} step={1} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
               <button onClick={() => { setSelectedFile(null); setOriginalUrl(""); }} className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium">
                Cancel
              </button>
              <button onClick={createCroppedImage} className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                Crop Image
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <img src={croppedUrl} alt="Cropped" className="max-h-96 mx-auto rounded-xl border border-gray-200 shadow-sm" />
            <div className="flex gap-4 max-w-md mx-auto">
              <button onClick={() => setCroppedUrl("")} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium">
                Adjust Crop
              </button>
              <a href={croppedUrl} download={`cropped_${selectedFile.name}`} className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium">
                <Download className="h-5 w-5" /> Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
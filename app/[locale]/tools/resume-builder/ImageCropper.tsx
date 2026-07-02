"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedBase64: string) => void;
  aspectRatio?: number;
}

export default function ImageCropper({ imageSrc, onClose, onCropComplete, aspectRatio = 1 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        onClose();
        return;
      }

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const base64Image = canvas.toDataURL("image/jpeg", 0.9);
      onCropComplete(base64Image);
    } catch (e) {
      console.error(e);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 text-lg">Crop Image</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="relative w-full h-80 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={createCroppedImage}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Check className="w-4 h-4" /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

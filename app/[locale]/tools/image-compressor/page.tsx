"use client";

import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud, Download, Loader2 } from "lucide-react";
import { useToastError } from "@/lib/toast";
import SplitScreenSlider from "@/components/common/SplitScreenSlider";

export default function ImageCompressorPage() {
  const [image, setImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetKB, setTargetKB] = useState<number | "">("");
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (compressedPreview) URL.revokeObjectURL(compressedPreview);
    };
  }, [imagePreview, compressedPreview]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const prev = imagePreview;
      const prevComp = compressedPreview;
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setImage(file);
      setCompressedImage(null);
      setCompressedPreview(null);
      if (prev) URL.revokeObjectURL(prev);
      if (prevComp) URL.revokeObjectURL(prevComp);
    }
  };

  const compressImage = async () => {
    if (!image) return;
    setIsProcessing(true);
    try {
      const targetMB = targetKB ? Number(targetKB) / 1024 : (image.size / 1024 / 1024) * 0.8;
      const options = {
        maxSizeMB: targetMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      let compressedFile = await imageCompression(image, options);
      
      // Iterative compression if strict target is set and missed
      if (targetKB && compressedFile.size / 1024 > Number(targetKB)) {
         let iterOptions = { ...options, maxSizeMB: targetMB * 0.8 };
         compressedFile = await imageCompression(image, iterOptions);
      }

      setCompressedImage(compressedFile);
      setCompressedPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Compression error", error);
      onError("Error compressing image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Image Compressor</h1>
        <p className="text-gray-600">Reduce image size locally in your browser. Fast, free, and secure.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {!image && (
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center hover:bg-blue-50 transition cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">Click or drag an image here</p>
          </div>
        )}

        {image && imagePreview && (
          <div className="mt-4">
            {compressedImage && compressedPreview ? (
              <div className="mb-6">
                <SplitScreenSlider originalImage={imagePreview} processedImage={compressedPreview} />
              </div>
            ) : (
              <div className="mb-6 rounded-xl overflow-hidden bg-gray-100 flex justify-center max-h-96">
                <img src={imagePreview} alt="Preview" className="max-h-96 object-contain" />
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex justify-between items-center text-sm">
              <span className="font-medium truncate max-w-xs">{image.name}</span>
              <span className="text-gray-500">Original: {(image.size / 1024).toFixed(1)} KB</span>
            </div>

            {!compressedImage ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Size (KB) [Optional]</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={targetKB}
                    onChange={(e) => setTargetKB(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Leave empty for auto-compression</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setImage(null); setImagePreview(null); }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={compressImage}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
                  >
                    {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Compressing...</> : "Compress Image"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 text-green-800 p-4 rounded-lg flex justify-between items-center text-sm border border-green-200">
                  <span className="font-medium">Compressed successfully!</span>
                  <span className="font-bold text-green-700">New Size: {(compressedImage.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setImage(null); setCompressedImage(null); setImagePreview(null); setCompressedPreview(null); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Compress another
                  </button>
                  <a
                    href={compressedPreview!}
                    download={`compressed_${image.name}`}
                    className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2"
                  >
                    <Download className="h-5 w-5" /> Download Compressed Image
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

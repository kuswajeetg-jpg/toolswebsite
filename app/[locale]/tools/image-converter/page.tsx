"use client";

import { useState, useRef, useCallback } from "react";
import { FileImage, Download, Loader2, Trash2 } from "lucide-react";
import { useToastError } from "@/lib/toast";
import JSZip from "jszip";

export default function ImageConverterPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedUrls, setConvertedUrls] = useState<{ url: string; name: string }[]>([]);
  const [targetFormat, setTargetFormat] = useState<string>("webp");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onError = useToastError();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      onError("Some files were skipped as they are not valid images.");
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setConvertedUrls([]);
  }, [onError]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setConvertedUrls([]);
  };

  const convertImages = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    setConvertedUrls([]);
    try {
      const results: { url: string; name: string }[] = [];
      
      for (const file of selectedFiles) {
        const originalUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = originalUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, `image/${targetFormat}`, 0.9);
        });
        
        if (blob) {
          results.push({
            url: URL.createObjectURL(blob),
            name: `${file.name.split(".")[0]}.${targetFormat}`
          });
        }
        URL.revokeObjectURL(originalUrl);
      }
      
      setConvertedUrls(results);
    } catch (error) {
      console.error(error);
      onError("Conversion failed for some images.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadConverted = async () => {
    if (convertedUrls.length === 0) return;
    
    if (convertedUrls.length === 1) {
      const a = document.createElement("a");
      a.href = convertedUrls[0].url;
      a.download = convertedUrls[0].name;
      a.click();
    } else {
      const zip = new JSZip();
      for (const item of convertedUrls) {
        const response = await fetch(item.url);
        const blob = await response.blob();
        zip.file(item.name, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipBlob);
      a.download = `converted_images.zip`;
      a.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Batch Image Converter</h1>
        <p className="text-gray-600">Convert multiple images to JPG, PNG, WebP, or BMP simultaneously.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        
        {selectedFiles.length === 0 ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition"
          >
            <FileImage className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Click to upload images</p>
            <p className="text-sm text-gray-500">Supports JPG, PNG, WebP, BMP, GIF</p>
          </button>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">{selectedFiles.length} Images Selected</h3>
              <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 hover:underline text-sm font-medium">Add More</button>
            </div>
            
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {selectedFiles.map((file, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                  <span className="truncate flex-1 font-medium">{file.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                    <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-6">
              <label className="block text-sm font-semibold text-blue-900 mb-3">Target Format</label>
              <div className="flex flex-wrap gap-3">
                {["webp", "jpeg", "png", "bmp"].map(fmt => (
                  <label key={fmt} className={`flex-1 min-w-[100px] text-center p-3 rounded-lg border cursor-pointer font-medium transition ${targetFormat === fmt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    <input type="radio" name="format" value={fmt} checked={targetFormat === fmt} onChange={(e) => setTargetFormat(e.target.value)} className="hidden" />
                    {fmt.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            {convertedUrls.length === 0 ? (
              <button
                onClick={convertImages}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-4"
              >
                {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Processing...</> : "Convert All"}
              </button>
            ) : (
              <div className="p-6 bg-green-50 rounded-xl border border-green-200 mt-6 text-center">
                <p className="font-semibold text-green-800 mb-4">Successfully converted {convertedUrls.length} image(s)!</p>
                <div className="flex gap-4">
                  <button onClick={() => { setSelectedFiles([]); setConvertedUrls([]); }} className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
                    Convert More
                  </button>
                  <button
                    onClick={downloadConverted}
                    className="flex-[2] flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    <Download className="h-5 w-5" /> Download {convertedUrls.length > 1 ? "ZIP" : "Image"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
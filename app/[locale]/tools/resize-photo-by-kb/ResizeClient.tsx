"use client";

import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud, Download, Loader2, ArrowRight } from "lucide-react";
import { useToastError } from "@/lib/toast";
import SplitScreenSlider from "@/components/common/SplitScreenSlider";

interface ResizeClientProps {
  initialKb?: number;
}

export default function ResizeClient({ initialKb = 50 }: ResizeClientProps) {
  const [image, setImage] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  
  const [targetKb, setTargetKb] = useState<number>(initialKb);
  
  const [resizedImage, setResizedImage] = useState<File | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    };
  }, [originalUrl, resizedUrl]);

  useEffect(() => {
    setTargetKb(initialKb);
  }, [initialKb]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setOriginalUrl(URL.createObjectURL(file));
      setResizedImage(null);
      setResizedUrl(null);
    }
  };

  const resizeImage = async () => {
    if (!image || targetKb <= 0) return;
    setIsProcessing(true);
    try {
      const options = {
        maxSizeMB: targetKb / 1024,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: 0.9,
      };

      const compressedFile = await imageCompression(image, options);
      
      setResizedImage(compressedFile);
      setResizedUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Compression error", error);
      onError("Error resizing image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const PRESETS = [20, 50, 100, 200, 500, 1024];

  return (
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
        <div className="flex flex-col lg:flex-row gap-8">
           <div className="flex-1 space-y-4">
               <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                   {resizedUrl && originalUrl ? (
                       <SplitScreenSlider originalImage={originalUrl} processedImage={resizedUrl} />
                   ) : originalUrl ? (
                       <img src={originalUrl} alt="Original" className="w-full h-auto object-contain max-h-96" />
                   ) : null}
               </div>
               
               {resizedImage && (
                  <div className="bg-green-50 text-green-800 p-4 rounded-xl flex justify-between items-center text-sm border border-green-200 font-medium">
                    <span>Target: {targetKb} KB</span>
                    <span>Final Size: {(resizedImage.size / 1024).toFixed(1)} KB</span>
                  </div>
               )}
           </div>

           <div className="w-full lg:w-80 space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
                <div className="font-semibold text-gray-900 mb-1 truncate" title={image.name}>{image.name}</div>
                <div className="text-gray-500">Original Size: {(image.size / 1024).toFixed(1)} KB</div>
              </div>

              {!resizedImage ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Size (in KB)</label>
                    <input
                      type="number" value={targetKb} onChange={(e) => setTargetKb(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Common Presets</label>
                     <div className="flex flex-wrap gap-2">
                         {PRESETS.map(kb => (
                             <button key={kb} onClick={() => setTargetKb(kb)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${targetKb === kb ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                 {kb} KB
                             </button>
                         ))}
                     </div>
                  </div>

                  <button onClick={resizeImage} disabled={isProcessing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2">
                    {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Processing...</> : <>Resize Image <ArrowRight className="h-4 w-4"/></>}
                  </button>
                  
                  <button onClick={() => { setImage(null); setOriginalUrl(null); }} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                     Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <a href={resizedUrl!} download={`resized_${image.name}`} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-sm">
                    <Download className="h-5 w-5" /> Download Result
                  </a>
                  
                  <button onClick={() => { setResizedImage(null); setResizedUrl(null); }} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                    Try Different Size
                  </button>
                  
                  <button onClick={() => { setImage(null); setOriginalUrl(null); setResizedImage(null); setResizedUrl(null); }} className="w-full text-gray-500 font-medium py-2 hover:text-gray-700 transition">
                    Upload New Image
                  </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Filter, Download, SlidersHorizontal, RefreshCcw, Image as ImageIcon } from "lucide-react";
import { useToastError } from "@/lib/toast";
import SplitScreenSlider from "@/components/common/SplitScreenSlider";

const PRESETS = ["Normal", "Vintage", "B&W", "Cinematic", "Vibrant", "Faded", "Cool"];

export default function ImageFiltersPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [filteredUrl, setFilteredUrl] = useState<string>("");
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [blur, setBlur] = useState(0);
  
  const [activePreset, setActivePreset] = useState("Normal");
  
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
    setFilteredUrl("");
    resetFilters();
  }, [onError]);

  const resetFilters = () => {
    setBrightness(100); setContrast(100); setSaturation(100);
    setSepia(0); setGrayscale(0); setHueRotate(0); setBlur(0);
    setActivePreset("Normal");
  };

  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    switch(presetName) {
      case "Normal": resetFilters(); setActivePreset("Normal"); break;
      case "Vintage": setBrightness(90); setContrast(120); setSaturation(150); setSepia(50); setGrayscale(0); setHueRotate(0); setBlur(0); break;
      case "B&W": setBrightness(100); setContrast(120); setSaturation(100); setSepia(0); setGrayscale(100); setHueRotate(0); setBlur(0); break;
      case "Cinematic": setBrightness(85); setContrast(130); setSaturation(120); setSepia(0); setGrayscale(0); setHueRotate(350); setBlur(0); break;
      case "Vibrant": setBrightness(100); setContrast(110); setSaturation(200); setSepia(0); setGrayscale(0); setHueRotate(0); setBlur(0); break;
      case "Faded": setBrightness(110); setContrast(80); setSaturation(80); setSepia(20); setGrayscale(0); setHueRotate(0); setBlur(0); break;
      case "Cool": setBrightness(95); setContrast(100); setSaturation(120); setSepia(0); setGrayscale(0); setHueRotate(180); setBlur(0); break;
    }
  };

  const currentFilterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`;

  useEffect(() => {
    if (!selectedFile || !originalUrl) return;
    
    let isMounted = true;
    const generateFiltered = async () => {
      const img = new Image();
      img.src = originalUrl;
      await new Promise((resolve) => (img.onload = resolve));
      if (!isMounted) return;
      
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.filter = currentFilterString;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob && isMounted) {
            setFilteredUrl(URL.createObjectURL(blob));
        }
      });
    };
    
    const timeoutId = setTimeout(() => generateFiltered(), 150);
    return () => { isMounted = false; clearTimeout(timeoutId); };
  }, [originalUrl, brightness, contrast, saturation, sepia, grayscale, hueRotate, blur]);

  const updateFilter = (setter: any) => (e: any) => {
      setActivePreset("Custom");
      setter(Number(e.target.value));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Advanced Image Filters</h1>
        <p className="text-gray-600">Apply cinematic presets or fine-tune individual adjustments</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        
        {!selectedFile ? (
          <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition">
            <Filter className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Click to upload an image</p>
          </button>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                {filteredUrl ? (
                   <SplitScreenSlider originalImage={originalUrl} processedImage={filteredUrl} />
                ) : (
                   <div className="w-full aspect-video bg-gray-100 animate-pulse flex items-center justify-center">
                       <ImageIcon className="h-8 w-8 text-gray-400" />
                   </div>
                )}
              </div>
              
              <div className="flex gap-4">
                 <button onClick={() => { setSelectedFile(null); setOriginalUrl(""); setFilteredUrl(""); }} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                    Upload New
                 </button>
                 <a href={filteredUrl} download={`filtered_${selectedFile.name}`} className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                    <Download className="h-5 w-5" /> Download Result
                 </a>
              </div>
            </div>
            
            <div className="w-full lg:w-80 space-y-8">
               <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Presets</h3>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map(p => (
                       <button
                         key={p}
                         onClick={() => applyPreset(p)}
                         className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activePreset === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                       >
                          {p}
                       </button>
                    ))}
                  </div>
               </div>
               
               <div>
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-semibold text-gray-900 flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Adjustments</h3>
                     <button onClick={resetFilters} className="text-gray-500 hover:text-blue-600 transition" title="Reset all"><RefreshCcw className="h-4 w-4" /></button>
                  </div>
                  
                  <div className="space-y-4">
                     <FilterSlider label="Brightness" value={brightness} min={0} max={200} onChange={updateFilter(setBrightness)} />
                     <FilterSlider label="Contrast" value={contrast} min={0} max={200} onChange={updateFilter(setContrast)} />
                     <FilterSlider label="Saturation" value={saturation} min={0} max={200} onChange={updateFilter(setSaturation)} />
                     <FilterSlider label="Sepia" value={sepia} min={0} max={100} onChange={updateFilter(setSepia)} />
                     <FilterSlider label="Grayscale" value={grayscale} min={0} max={100} onChange={updateFilter(setGrayscale)} />
                     <FilterSlider label="Hue" value={hueRotate} min={0} max={360} onChange={updateFilter(setHueRotate)} suffix="°" />
                     <FilterSlider label="Blur" value={blur} min={0} max={20} onChange={updateFilter(setBlur)} suffix="px" />
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSlider({ label, value, min, max, onChange, suffix = "%" }: { label: string, value: number, min: number, max: number, onChange: any, suffix?: string }) {
    return (
        <div>
           <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{label}</span>
              <span className="text-gray-500">{value}{suffix}</span>
           </div>
           <input type="range" min={min} max={max} value={value} onChange={onChange} className="w-full accent-blue-600" />
        </div>
    );
}
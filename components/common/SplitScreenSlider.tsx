"use client";

import { useState, useRef, useEffect } from "react";

interface SplitScreenSliderProps {
  originalImage: string;
  processedImage: string;
}

export default function SplitScreenSlider({ originalImage, processedImage }: SplitScreenSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging) return;
    handleMove((e as React.MouseEvent).clientX || (e as MouseEvent).clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isDragging) return;
    handleMove((e as React.TouchEvent).touches[0].clientX || (e as TouchEvent).touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden rounded-xl select-none bg-gray-100"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <div className="absolute inset-0">
        <img
          src={originalImage}
          alt="Original"
          className="w-full h-full object-contain pointer-events-none"
        />
        <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
          Original
        </div>
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={processedImage}
          alt="Processed"
          className="w-full h-full object-contain max-w-[100vw] pointer-events-none"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
        />
        <div className="absolute top-4 left-4 bg-blue-600/80 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm z-10 whitespace-nowrap">
          Processed
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="m9 18 6-6-6-6" />
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

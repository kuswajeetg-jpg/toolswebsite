"use client";

import { useEffect, useState } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  responsive?: "true" | "false";
  style?: React.CSSProperties;
  className?: string;
  ezoicId?: string; // Optional Ezoic placeholder ID
}

export default function AdBanner({
  slot,
  format = "auto",
  responsive = "true",
  style = { display: "block" },
  className = "",
  ezoicId,
}: AdBannerProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    // Only attempt to initialize AdSense in browser and if client ID is set and is not the default placeholder
    if (
      typeof window !== "undefined" &&
      adsenseClientId &&
      adsenseClientId !== "ca-pub-XXXXXXXXXXXXXXXX"
    ) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (err) {
        console.error("AdSense placement error:", err);
      }
    }
  }, [adsenseClientId]);

  // If in development or default placeholder is active, show a clean mockup banner
  const isDev =
    process.env.NODE_ENV === "development" ||
    !adsenseClientId ||
    adsenseClientId === "ca-pub-XXXXXXXXXXXXXXXX";

  if (isDev) {
    return (
      <div
        className={`w-full my-6 bg-gradient-to-r from-slate-50 to-slate-100 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center py-8 px-4 text-center select-none ${className}`}
        style={{ minHeight: "120px", ...style }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Sponsored Advertisement
        </span>
        <span className="text-sm font-medium text-slate-500">
          Ad Slot: {slot}
        </span>
        {ezoicId && (
          <span className="text-xs text-slate-400 mt-1">
            Ezoic Placeholder: {ezoicId}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full my-6 flex justify-center overflow-hidden ${className}`}
      style={{ minHeight: "90px" }}
    >
      {ezoicId ? (
        // Ezoic placeholder structure
        <div id={`ezoic-pub-ad-placeholder-${ezoicId}`} style={style}></div>
      ) : (
        // Google AdSense structure
        <ins
          className="adsbygoogle"
          style={style}
          data-ad-client={adsenseClientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      )}
    </div>
  );
}

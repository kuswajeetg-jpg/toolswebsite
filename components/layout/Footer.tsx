"use client";

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Navigation");

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Smart Document Tools</h3>
          <p className="text-sm text-gray-400">
            Free, fast, and privacy-friendly online tools. Your files are processed locally in your browser. We never store your data.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Popular Tools</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/tools/image-to-pdf" className="hover:text-white">Image to PDF</Link></li>
            <li><Link href="/tools/pdf-merge" className="hover:text-white">Merge PDF</Link></li>
            <li><Link href="/tools/image-compressor" className="hover:text-white">Compress Image</Link></li>
            <li><Link href="/tools/resize-photo-by-kb" className="hover:text-white">Resize Photo (KB)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Calculators</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/tools/age-calculator" className="hover:text-white">Age Calculator</Link></li>
            <li><Link href="/tools/percentage-calculator" className="hover:text-white">Percentage Calculator</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy-policy" className="hover:text-white">{t("privacy")}</Link></li>
            <li><Link href="/terms" className="hover:text-white">{t("terms")}</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white">{t("disclaimer")}</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} Smart Document Tools. All rights reserved.</p>
      </div>
    </footer>
  );
}

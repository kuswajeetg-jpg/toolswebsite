import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Smart Document Tools",
  description: "Learn about Smart Document Tools, our mission to provide free, privacy-friendly online document and image processing tools.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About Smart Document Tools</h1>
        <p className="text-gray-600">
          We build free, fast, and privacy-friendly tools to help you work with documents and images directly in your browser.
        </p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-gray-700 mt-2">
              Smart Document Tools was created with a simple belief: powerful document tools should be free, accessible, and private. 
              All processing happens in your browser. We never upload your files to any server.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">What We Offer</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
              <li>PDF tools: merge, split, convert to Word, password protection, watermarks, and more</li>
              <li>Image tools: compress, resize, crop, format conversion, and filters</li>
              <li>Calculators: EMI, BMI, GST, currency, unit, scientific, and utility tools</li>
              <li>Document generators: resumes, invoices, certificates, and templates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Privacy First</h2>
            <p className="text-gray-700 mt-2">
              Your files never leave your device. Every tool runs entirely client-side using modern web technologies. 
              No data is collected, stored, or shared.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Contact</h2>
            <p className="text-gray-700 mt-2">
              Have feedback, suggestions, or found a bug? We&apos;d love to hear from you. 
              Reach out through our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

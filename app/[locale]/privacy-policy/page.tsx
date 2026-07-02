import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Smart Document Tools",
  description: "Privacy policy for Smart Document Tools. We never store or share your files.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: June 2025</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 prose prose-blue max-w-none">
        <section>
          <h2 className="text-xl font-bold text-gray-900">Overview</h2>
          <p className="text-gray-700 mt-2">
            Smart Document Tools (&quot;we&quot;, &quot;us&quot;) operates a collection of free online tools for document and image processing. 
            This page informs you of our policies regarding the collection and use of personal data when you use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">No File Storage</h2>
          <p className="text-gray-700 mt-2">
            All processing happens entirely in your browser. We do not upload, store, or access any files you process. 
            Your documents and images never leave your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">No Personal Data Collection</h2>
          <p className="text-gray-700 mt-2">
            We do not require accounts, logins, or personal information to use our tools. We do not track individual users or build user profiles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Cookies & Analytics</h2>
          <p className="text-gray-700 mt-2">
            We may use anonymous, aggregated analytics to understand overall usage patterns. This does not identify individual users. 
            No Personally Identifiable Information (PII) is collected.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Third-Party Services</h2>
          <p className="text-gray-700 mt-2">
            Our tools rely on open-source libraries loaded via CDN (e.g., pdf-lib, browser-image-compression). 
            These libraries execute locally in your browser. We do not share data with third-party advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Children&apos;s Privacy</h2>
          <p className="text-gray-700 mt-2">
            Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Changes to This Policy</h2>
          <p className="text-gray-700 mt-2">
            We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Contact</h2>
          <p className="text-gray-700 mt-2">
            If you have questions about this privacy policy, please visit our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

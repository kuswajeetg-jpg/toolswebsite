import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Smart Document Tools",
  description: "Terms and conditions for using Smart Document Tools free online document and image processing services.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        <p className="text-gray-600">Last updated: June 2025</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 prose prose-blue max-w-none">
        <section>
          <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mt-2">
            By accessing and using Smart Document Tools, you accept and agree to be bound by these terms. 
            If you do not agree, please discontinue use of our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">2. Service Description</h2>
          <p className="text-gray-700 mt-2">
            Smart Document Tools provides free, client-side online tools for PDF manipulation, image processing, and document generation. 
            All features are provided &quot;as is&quot; without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">3. User Responsibilities</h2>
          <p className="text-gray-700 mt-2">
            You are responsible for the files you process and any content you generate. You agree not to use our tools for any unlawful purpose, 
            or to process content that infringes on the rights of others.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">4. Intellectual Property</h2>
          <p className="text-gray-700 mt-2">
            The tools, design, and code of Smart Document Tools are our intellectual property. You retain all rights to your own files and data processed through our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">5. Limitation of Liability</h2>
          <p className="text-gray-700 mt-2">
            We are not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our services. 
            We do not guarantee uninterrupted or error-free operation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">6. Modifications</h2>
          <p className="text-gray-700 mt-2">
            We reserve the right to modify or discontinue any tool at any time without notice. We may also update these terms periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">7. Governing Law</h2>
          <p className="text-gray-700 mt-2">
            These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">8. Contact</h2>
          <p className="text-gray-700 mt-2">
            For questions about these terms, please visit our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

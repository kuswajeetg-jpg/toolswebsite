import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - Smart Document Tools",
  description: "Disclaimer for Smart Document Tools free online document processing services.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Disclaimer</h1>
        <p className="text-gray-600">Last updated: June 2025</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 prose prose-blue max-w-none">
        <section>
          <h2 className="text-xl font-bold text-gray-900">General Disclaimer</h2>
          <p className="text-gray-700 mt-2">
            The information and tools provided by Smart Document Tools are for general informational and utility purposes only. 
            While we strive to keep the information accurate and functional, we make no representations or warranties of any kind, 
            express or implied, about the completeness, accuracy, reliability, suitability, or availability of the tools or information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Professional Advice</h2>
          <p className="text-gray-700 mt-2">
            The tools on this website do not constitute professional advice. Always verify important documents, calculations, 
            and outputs with qualified professionals before relying on them for legal, financial, or official purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">File Processing</h2>
          <p className="text-gray-700 mt-2">
            While all processing is performed locally in your browser, we do not guarantee the output quality, compatibility, 
            or accuracy of converted documents. Always review generated files before submission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Limitation</h2>
          <p className="text-gray-700 mt-2">
            In no event shall Smart Document Tools or its contributors be liable for any loss or damage, including without limitation, 
            indirect or consequential loss or damage arising from the use of our tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">External Links</h2>
          <p className="text-gray-700 mt-2">
            Our site may contain links to external websites. We have no control over the content and nature of these sites 
            and bear no responsibility for their content or practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Consent</h2>
          <p className="text-gray-700 mt-2">
            By using our website, you hereby consent to our disclaimer and agree to its terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Contact</h2>
          <p className="text-gray-700 mt-2">
            If you have questions about this disclaimer, please visit our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

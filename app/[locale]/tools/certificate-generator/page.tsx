"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function CertificateGeneratorPage() {
  const [title, setTitle] = useState("Certificate of Completion");
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("This is to certify that");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [signature, setSignature] = useState("");
  const [template, setTemplate] = useState("classic");
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (certificateUrl) URL.revokeObjectURL(certificateUrl);
    };
  }, [certificateUrl]);

  const generateCertificate = () => {
    if (!recipient) {
      onError("Please enter recipient name");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 900;

    const templates: Record<string, () => void> = {
      classic: () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      },
      modern: () => {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#f0f4ff");
        gradient.addColorStop(1, "#ffffff");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
      elegant: () => {
        ctx.fillStyle = "#faf8f5";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#8b5cf6";
        ctx.fillRect(0, 0, canvas.width, 15);
        ctx.fillRect(0, canvas.height - 15, canvas.width, 15);
      }
    };

    templates[template]();

    ctx.textAlign = "center";
    ctx.fillStyle = "#1e293b";

    ctx.font = "bold 48px Georgia, serif";
    ctx.fillText(title, canvas.width / 2, 120);

    ctx.font = "24px Georgia, serif";
    ctx.fillText(description, canvas.width / 2, 200);

    ctx.font = "bold 42px Georgia, serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(recipient, canvas.width / 2, 280);

    ctx.font = "20px Georgia, serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("Date: " + new Date(date).toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), canvas.width / 2, 340);

    ctx.font = "20px Georgia, serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Signature: _______________________", canvas.width / 2, 420);

    if (signature) {
      ctx.fillStyle = "#0f172a";
      ctx.fillText(signature, canvas.width / 2, 460);
      ctx.font = "16px Georgia, serif";
      ctx.fillText("Authorized Signatory", canvas.width / 2, 490);
    }

    ctx.font = "14px Georgia, serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("This certificate is generated digitally and is valid.", canvas.width / 2, canvas.height - 40);

    setCertificateUrl(canvas.toDataURL("image/png"));
  };

  const downloadCertificate = () => {
    if (!certificateUrl) return;
    const a = document.createElement("a");
    a.href = certificateUrl;
    a.download = `${recipient.replace(/\s+/g, "_")}_certificate.png`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Certificate Generator</h1>
        <p className="text-gray-600">Create professional certificates for any occasion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Certificate Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Style</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="elegant">Elegant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description Text</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature (Optional)</label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Authorized person"
              />
            </div>

            <button
              onClick={generateCertificate}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
            >
              <FileText className="h-5 w-5" /> Generate Certificate
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
          <div className="flex justify-center">
            {certificateUrl ? (
              <div className="space-y-4">
                <img src={certificateUrl} alt="Certificate" className="max-w-full border border-gray-200 rounded-lg" />
                <button
                  onClick={downloadCertificate}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2"
                >
                  <Download className="h-5 w-5" /> Download Certificate
                </button>
              </div>
            ) : (
              <canvas ref={canvasRef} className="hidden" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
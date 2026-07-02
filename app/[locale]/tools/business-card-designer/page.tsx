"use client";

import { useState, useRef, useEffect } from "react";
import { CreditCard, Download, Loader2, UploadCloud } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function BusinessCardDesignerPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [cardStyle, setCardStyle] = useState<"classic" | "modern" | "minimal">("classic");
  const [photo, setPhoto] = useState<string | null>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (cardUrl) URL.revokeObjectURL(cardUrl);
    };
  }, [cardUrl]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file");
      return;
    }
    setPhoto(URL.createObjectURL(file));
  };

  const generateCard = () => {
    if (!name || !title || !company) {
      onError("Please enter name, title, and company");
      return;
    }
    setIsProcessing(true);

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsProcessing(false);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    canvas.width = 400;
    canvas.height = 250;

    if (cardStyle === "classic") {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.1;
      ctx.font = "bold 120px Arial";
      ctx.textAlign = "center";
      ctx.fillText("B", canvas.width / 2, 160);

      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 1;
      ctx.textAlign = "left";
      ctx.font = "bold 22px Arial";
      ctx.fillText(name, photo ? 110 : 30, 60);

      ctx.font = "14px Arial";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(title, photo ? 110 : 30, 85);
      ctx.fillText(company, photo ? 110 : 30, 105);

      ctx.textAlign = "center";
      ctx.font = "12px Arial";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`Email: ${email}`, canvas.width / 2, 140);
      ctx.fillText(`Phone: ${phone}`, canvas.width / 2, 155);
      ctx.fillText(website, canvas.width / 2, 170);

    } else if (cardStyle === "modern") {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#6366f1");
      gradient.addColorStop(1, "#8b5cf6");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "bold 24px Arial";
      ctx.fillText(company, canvas.width / 2, 50);

      ctx.font = "16px Arial";
      ctx.fillText(name, canvas.width / 2, 90);
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText(title, canvas.width / 2, 110);

      ctx.fillStyle = "#f1f5f9";
      ctx.textAlign = "left";
      if (email) ctx.fillText(`✉ ${email}`, 30, 160);
      if (phone) ctx.fillText(`📞 ${phone}`, 30, 185);
      if (website) ctx.fillText(`🌐 ${website}`, 30, 210);

    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.font = "bold 26px Arial";
      ctx.fillText(name, canvas.width / 2, 60);

      ctx.font = "14px Arial";
      ctx.fillStyle = "#64748b";
      ctx.fillText(title, canvas.width / 2, 85);
      ctx.fillText(company, canvas.width / 2, 105);

      ctx.beginPath();
      ctx.moveTo(50, 120);
      ctx.lineTo(350, 120);
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.font = "12px Arial";
      ctx.fillStyle = "#475569";
      if (email) ctx.fillText(email, canvas.width / 2, 145);
      if (phone) ctx.fillText(phone, canvas.width / 2, 165);
      if (website) ctx.fillText(website, canvas.width / 2, 185);
    }

    setTimeout(() => {
      setCardUrl(canvas.toDataURL("image/png"));
      setIsProcessing(false);
    }, 100);
  };

  const downloadCard = () => {
    if (!cardUrl) return;
    const a = document.createElement("a");
    a.href = cardUrl;
    a.download = `${name.replace(/\s+/g, "_")}_business_card.png`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Card Designer</h1>
        <p className="text-gray-600">Create professional business cards with customizable templates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Card Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  value={cardStyle}
                  onChange={(e) => setCardStyle(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="classic">Classic Dark</option>
                  <option value="modern">Modern Gradient</option>
                  <option value="minimal">Minimal Light</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Product Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Company Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://company.com"
                />
              </div>
            </div>
          </div>

          <button
            onClick={generateCard}
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Generating...</> : "Generate Business Card"}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="hidden" />
            {cardUrl ? (
              <div className="space-y-4">
                <img src={cardUrl} alt="Business Card" className="border border-gray-200 rounded-lg shadow-md" />
                <button
                  onClick={downloadCard}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2"
                >
                  <Download className="h-5 w-5" /> Download Business Card
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <CreditCard className="h-12 w-12 mx-auto mb-2" />
                  <p>Fill details and generate to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { CreditCard, Download, UploadCloud, Loader2 } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function IdCardMakerPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardType, setCardType] = useState<"employee" | "student" | "member">("employee");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
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
    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
  };

  const generateIdCard = () => {
    if (!name || !title || !company) {
      onError("Please fill in name, title, and company/organization");
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

    const drawClassicCard = () => {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(5, 5, canvas.width - 10, canvas.height - 10);

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("ID CARD", canvas.width / 2, 30);

      if (photo) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 20, 45, 80, 90);
          drawTextContent();
        };
        img.src = photo;
      } else {
        drawTextContent();
      }
    };

    const drawModernCard = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#3b82f6");
      gradient.addColorStop(1, "#8b5cf6");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, 50);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 50, canvas.width, canvas.height - 50);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.fillText("ID CARD", canvas.width / 2, 33);

      if (photo) {
        const img = new Image();
        img.onload = () => {
          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 2;
          ctx.strokeRect(20, 65, 80, 90);
          ctx.drawImage(img, 20, 65, 80, 90);
          drawTextContent(60);
        };
        img.src = photo;
      } else {
        drawTextContent(60);
      }
    };

    const drawTextContent = (textX = 110) => {
      ctx.textAlign = "left";
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 16px Arial";
      ctx.fillText(`Name: ${name}`, textX, 80);
      ctx.font = "14px Arial";
      ctx.fillText(`Title: ${title}`, textX, 105);
      ctx.fillText(`Org: ${company}`, textX, 125);
      if (email) ctx.fillText(`Email: ${email}`, textX, 145);
      if (phone) ctx.fillText(`Phone: ${phone}`, textX, 165);

      ctx.fillStyle = "#64748b";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Valid: ${new Date().toLocaleDateString()}`, canvas.width / 2, canvas.height - 20);
    };

    if (cardType === "employee") {
      drawClassicCard();
    } else if (cardType === "student") {
      drawModernCard();
    } else {
      drawClassicCard();
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
    a.download = `${name.replace(/\s+/g, "_")}_id_card.png`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ID Card Maker</h1>
        <p className="text-gray-600">Design professional ID cards for employees, students, or members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Card Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employee">Employee ID</option>
                  <option value="student">Student ID</option>
                  <option value="member">Member Card</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Title/Role *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization/School *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {photo ? "Change Photo" : "Upload Photo"}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={generateIdCard}
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Generating...</> : "Generate ID Card"}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="hidden" />
            {cardUrl ? (
              <div className="space-y-4">
                <img src={cardUrl} alt="ID Card" className="border border-gray-200 rounded-lg shadow-md" />
                <button
                  onClick={downloadCard}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2"
                >
                  <Download className="h-5 w-5" /> Download ID Card
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
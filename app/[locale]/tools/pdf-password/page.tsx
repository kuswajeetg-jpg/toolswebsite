"use client";

import { useEffect, useState } from "react";
import { UploadCloud, Download, Loader2, Lock, Unlock, FileText, Shield } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function PdfPasswordPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [mode, setMode] = useState<"protect" | "remove">("protect");
  
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [encryption, setEncryption] = useState("AES-256");
  
  const [currentPassword, setCurrentPassword] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (outputPdfUrl) URL.revokeObjectURL(outputPdfUrl);
    };
  }, [outputPdfUrl]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdf(e.target.files[0]);
      setOutputPdfUrl(null);
    }
  };

  const processPdf = async () => {
    if (!pdf) return;
    if (mode === "protect" && !userPassword && !ownerPassword) {
      onError("Please enter at least a user or owner password for protection.");
      return;
    }
    if (mode === "remove" && !currentPassword) {
      onError("Please enter the current password to unlock the PDF.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", pdf);
      formData.append("mode", mode);
      
      if (mode === "protect") {
          formData.append("userPassword", userPassword);
          formData.append("ownerPassword", ownerPassword);
          formData.append("encryption", encryption);
      } else {
          formData.append("password", currentPassword);
      }

      const response = await fetch("/api/pdf-password", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Invalid password");
        }
        throw new Error("Processing failed");
      }

      const blob = await response.blob();
      setOutputPdfUrl(URL.createObjectURL(blob));
    } catch (error: any) {
      console.error("Password error", error);
      if (error.message === "Invalid password") {
        onError("Invalid password provided for this PDF.");
      } else {
        onError("Error processing PDF. Ensure the file is valid and API is running.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Password Protection</h1>
        <p className="text-gray-600">Secure your PDFs with 256-bit AES encryption or remove existing passwords.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {!pdf ? (
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center hover:bg-blue-50 transition cursor-pointer relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">Click or drag a PDF here</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center text-sm border border-gray-200">
              <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{pdf.name}</span>
              </div>
              <span className="text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{(pdf.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            {!outputPdfUrl ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 flex flex-col gap-3 border-r border-gray-100 pr-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mode</h3>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 transition cursor-pointer ${mode === "protect" ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input type="radio" value="protect" checked={mode === "protect"} onChange={(e) => setMode(e.target.value as any)} className="hidden" />
                    <Shield className={`h-6 w-6 ${mode === "protect" ? 'text-blue-600' : 'text-gray-400'}`} /> 
                    <div>
                        <div className="font-semibold text-gray-900">Protect PDF</div>
                        <div className="text-xs text-gray-500">Add encryption & passwords</div>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 transition cursor-pointer ${mode === "remove" ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input type="radio" value="remove" checked={mode === "remove"} onChange={(e) => setMode(e.target.value as any)} className="hidden" />
                    <Unlock className={`h-6 w-6 ${mode === "remove" ? 'text-blue-600' : 'text-gray-400'}`} /> 
                    <div>
                        <div className="font-semibold text-gray-900">Unlock PDF</div>
                        <div className="text-xs text-gray-500">Remove existing password</div>
                    </div>
                  </label>
                </div>

                <div className="md:col-span-8 space-y-6">
                    {mode === "protect" ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">User Password (Open PDF)</label>
                                  <input
                                    type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter password..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Password (Permissions)</label>
                                  <input
                                    type="password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Optional"
                                  />
                                </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Encryption Level</label>
                              <select value={encryption} onChange={(e) => setEncryption(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                  <option value="AES-256">256-bit AES (Recommended, Highly Secure)</option>
                                  <option value="AES-128">128-bit AES (Standard)</option>
                                  <option value="RC4-128">128-bit RC4 (Legacy)</option>
                              </select>
                            </div>
                            
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 flex gap-3">
                                <Lock className="h-5 w-5 flex-shrink-0" />
                                <p>Your file will be encrypted using military-grade {encryption} encryption. If you forget this password, the file cannot be recovered.</p>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Current PDF Password</label>
                              <input
                                type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter current password to unlock..."
                              />
                            </div>
                            <p className="text-sm text-gray-500">You must know the current password to permanently remove it from the document.</p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button onClick={() => setPdf(null)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
                            Cancel
                        </button>
                        <button
                          onClick={processPdf}
                          disabled={isProcessing}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-sm"
                        >
                          {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> Processing...</> : mode === "protect" ? "Encrypt PDF" : "Unlock PDF"}
                        </button>
                    </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center max-w-lg mx-auto py-8">
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium">
                  {mode === "protect" ? "PDF successfully encrypted!" : "Password successfully removed!"}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={() => { setPdf(null); setOutputPdfUrl(null); setUserPassword(""); setOwnerPassword(""); setCurrentPassword(""); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Process Another
                  </button>
                  <a
                    href={outputPdfUrl}
                    download={mode === "protect" ? `protected_${pdf.name}` : `unlocked_${pdf.name}`}
                    className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-sm"
                  >
                    <Download className="h-5 w-5" /> Download Result
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
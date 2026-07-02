"use client";

import { useState } from "react";
import { PenTool, Copy, CheckCircle2 } from "lucide-react";

type Tone = "formal" | "urgent" | "notice" | "leave" | "simple";

const templates: Record<Tone, { prefix: string; suffix: string }> = {
  formal: {
    prefix: "महोदय / महोदया,\n\nसविनय निवेदन है कि,\n",
    suffix: "\n\nसधन्यवाद,\nभवदीय",
  },
  urgent: {
    prefix: "अति आवश्यक सूचना,\n\nसभी संबंधित ध्यान दें:\n",
    suffix: "\n\nकृपया इसे सर्वोच्च प्राथमिकता दें।",
  },
  notice: {
    prefix: "कार्यालय आदेश / सूचना\nदिनांक: " + new Date().toLocaleDateString("hi-IN") + "\n\nसभी कर्मचारियों को सूचित किया जाता है कि:\n",
    suffix: "\n\nआदेशानुसार,\nप्रबंधन",
  },
  leave: {
    prefix: "विषय: अवकाश हेतु आवेदन\nमहोदय,\n\nनिवेदन है कि मुझे निम्नलिखित कारण से अवकाश की आवश्यकता है:\n",
    suffix: "\n\nकृपया मुझे अवकाश प्रदान करने की कृपा करें।\nधन्यवाद।",
  },
  simple: {
    prefix: "प्रिय महोदय,\n\n",
    suffix: "\n\nधन्यवाद।",
  }
};

export default function HindiMessageFormatterPage() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [copied, setCopied] = useState(false);

  const generatedMessage = `${templates[tone].prefix}${message}${templates[tone].suffix}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hindi Official Message Formatter</h1>
        <p className="text-gray-600">Instantly generate properly formatted Hindi messages for office, leave, or notices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Input Message</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Format Type</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="formal">Formal Letter / Application</option>
                <option value="urgent">Urgent Notice</option>
                <option value="notice">Office Order (कार्यालय आदेश)</option>
                <option value="leave">Leave Application (अवकाश)</option>
                <option value="simple">Simple Polite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Body (Type in Hindi/English)</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your main message here..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Generated Output</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap text-gray-800 font-medium font-serif leading-relaxed">
            {generatedMessage}
          </div>
        </div>
      </div>
    </div>
  );
}

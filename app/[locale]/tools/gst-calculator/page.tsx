"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Calculator } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function GstCalculatorPage() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");
  const [result, setResult] = useState<{ gst: number; total: number } | null>(null);
  const onError = useToastError();
  const t = useTranslations("GstCalculator");

  const calculate = () => {
    const amt = parseFloat(amount);
    const gstRate = parseFloat(rate);

    if (!amt || !gstRate) {
      onError("Please enter amount and GST rate");
      return;
    }

    const gst = (amt * gstRate) / 100;
    setResult({ gst, total: amt + gst });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("amount")}</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder={t("placeholder_amount") || "e.g. 1000"} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("rate")}</label>
            <select value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
              <option value="5">{t("essential_goods")}</option>
              <option value="12">{t("standard_rate")}</option>
              <option value="18">{t("most_services")}</option>
              <option value="28">{t("luxury_items")}</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">{t("calculate_btn")}</button>
        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div><span className="block text-2xl font-bold text-blue-600">₹{result.gst.toFixed(2)}</span><span className="text-sm">{t("gst_amount")}</span></div>
              <div><span className="block text-2xl font-bold text-blue-600">₹{result.total.toFixed(2)}</span><span className="text-sm">{t("total_with_gst")}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Calendar, Calculator as CalcIcon } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function DateCalculatorPage() {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result, setResult] = useState<{ days: number; months: number; years: number } | null>(null);
  const onError = useToastError();

  const calculate = () => {
    if (!date1 || !date2) {
      onError("Please select both dates");
      return;
    }

    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.ceil(diffMs / (1000 * 3600 * 24));
    const months = Math.floor(days / 30.44);
    const years = Math.floor(months / 12);

    setResult({ days, months, years });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Date Calculator</h1>
        <p className="text-gray-600">Calculate the difference between two dates</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button onClick={calculate} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <CalcIcon className="h-5 w-5" /> Calculate Difference
        </button>
        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Date Difference</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><span className="block text-3xl font-bold text-blue-600">{result.days}</span><span className="text-sm">Days</span></div>
              <div><span className="block text-3xl font-bold text-blue-600">{result.months}</span><span className="text-sm">Months</span></div>
              <div><span className="block text-3xl font-bold text-blue-600">{result.years}</span><span className="text-sm">Years</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
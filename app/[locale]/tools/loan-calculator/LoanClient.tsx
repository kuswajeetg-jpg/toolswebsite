"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function LoanClient() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number } | null>(null);
  const onError = useToastError();

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure) * 12;

    if (!p || !r || !n) {
      onError("Please enter all values");
      return;
    }

    const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - p;

    setResult({
      monthly: Math.round(monthly),
      total: Math.round(total),
      interest: Math.round(interest),
    });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="e.g. 250000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="e.g. 4.5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Years)</label>
          <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="e.g. 30" />
        </div>
      </div>
      <button onClick={calculate} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">Calculate</button>
      {result && (
        <div className="mt-8 space-y-6">
          <div className="p-6 bg-blue-50 rounded-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><span className="block text-2xl font-bold text-blue-600">${result.monthly.toLocaleString()}/mo</span><span className="text-sm">Monthly</span></div>
              <div><span className="block text-2xl font-bold text-blue-600">${result.total.toLocaleString()}</span><span className="text-sm">Total</span></div>
              <div><span className="block text-2xl font-bold text-blue-600">${result.interest.toLocaleString()}</span><span className="text-sm">Interest</span></div>
            </div>
          </div>
          
          {/* Affiliate CTA Placeholder */}
          <div className="mt-8 border border-green-200 bg-green-50 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-1">Looking for the best loan rates?</h3>
              <p className="text-green-700 text-sm">Compare pre-approved loan offers from top lenders with no impact to your credit score.</p>
            </div>
            <a href="#" className="mt-4 md:mt-0 whitespace-nowrap bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
              Compare Offers
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

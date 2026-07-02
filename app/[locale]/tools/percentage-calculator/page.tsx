"use client";

import { useState } from "react";
import { Calculator, Percent } from "lucide-react";

export default function PercentageCalculatorPage() {
  const [val1, setVal1] = useState("");
  const [total1, setTotal1] = useState("");
  const [res1, setRes1] = useState<string | null>(null);

  const [pct2, setPct2] = useState("");
  const [total2, setTotal2] = useState("");
  const [res2, setRes2] = useState<string | null>(null);
  
  const [val3, setVal3] = useState("");
  const [total3, setTotal3] = useState("");
  const [res3, setRes3] = useState<string | null>(null);

  const calcPercentage = () => {
    const v = parseFloat(val1);
    const t = parseFloat(total1);
    if (!isNaN(v) && !isNaN(t) && t !== 0) {
      setRes1(((v / t) * 100).toFixed(2));
    } else {
      setRes1(null);
    }
  };

  const calcValueFromPct = () => {
    const p = parseFloat(pct2);
    const t = parseFloat(total2);
    if (!isNaN(p) && !isNaN(t)) {
      setRes2(((p / 100) * t).toFixed(2));
    } else {
      setRes2(null);
    }
  };
  
  const calcPercentageChange = () => {
    const v1 = parseFloat(val3);
    const v2 = parseFloat(total3);
    if (!isNaN(v1) && !isNaN(v2) && v1 !== 0) {
      setRes3((((v2 - v1) / Math.abs(v1)) * 100).toFixed(2));
    } else {
      setRes3(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Percent className="w-8 h-8 text-blue-600" /> Percentage Calculator
        </h1>
        <p className="text-gray-600 text-lg">Quickly calculate percentages, values, and percentage changes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Calc 1 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">What is the % ?</h2>
          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Value</label>
              <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all" placeholder="e.g. 45" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Out of Total</label>
              <input type="number" value={total1} onChange={(e) => setTotal1(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all" placeholder="e.g. 50" />
            </div>
            <button onClick={calcPercentage} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">
              Calculate
            </button>
            {res1 !== null && (
              <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-xl text-center border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                <span className="block text-sm font-medium opacity-80 mb-1">{val1} is what % of {total1}?</span>
                <span className="font-extrabold text-3xl">{res1}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Calc 2 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-10 -mt-10 z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">What is the Value ?</h2>
          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Percentage (%)</label>
              <input type="number" value={pct2} onChange={(e) => setPct2(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-gray-50 focus:bg-white outline-none transition-all" placeholder="e.g. 20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Of Total Value</label>
              <input type="number" value={total2} onChange={(e) => setTotal2(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-gray-50 focus:bg-white outline-none transition-all" placeholder="e.g. 150" />
            </div>
            <button onClick={calcValueFromPct} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-sm">
              Calculate
            </button>
            {res2 !== null && (
              <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl text-center border border-green-100 animate-in fade-in slide-in-from-bottom-2">
                <span className="block text-sm font-medium opacity-80 mb-1">{pct2}% of {total2} is</span>
                <span className="font-extrabold text-3xl">{res2}</span>
              </div>
            )}
          </div>
        </div>

        {/* Calc 3 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-10 -mt-10 z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">Percentage Change</h2>
          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From Value</label>
              <input type="number" value={val3} onChange={(e) => setVal3(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white outline-none transition-all" placeholder="e.g. 100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To Value</label>
              <input type="number" value={total3} onChange={(e) => setTotal3(e.target.value)} className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white outline-none transition-all" placeholder="e.g. 125" />
            </div>
            <button onClick={calcPercentageChange} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-sm">
              Calculate
            </button>
            {res3 !== null && (
              <div className={`mt-4 p-4 rounded-xl text-center border animate-in fade-in slide-in-from-bottom-2 ${parseFloat(res3) >= 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                <span className="block text-sm font-medium opacity-80 mb-1">{val3} to {total3} is a</span>
                <span className="font-extrabold text-3xl">
                  {parseFloat(res3) > 0 ? '+' : ''}{res3}%
                </span>
                <span className="block text-xs font-bold mt-1 uppercase tracking-wider">{parseFloat(res3) >= 0 ? 'Increase' : 'Decrease'}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";

export default function ROICalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [years, setYears] = useState("1");
  const [results, setResults] = useState<{
    roi: number;
    annualizedRoi: number;
    profit: number;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("roi_calc_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.initialInvestment) setInitialInvestment(parsed.initialInvestment);
        if (parsed.finalValue) setFinalValue(parsed.finalValue);
        if (parsed.years) setYears(parsed.years);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("roi_calc_history", JSON.stringify({
      initialInvestment, finalValue, years
    }));
  }, [initialInvestment, finalValue, years]);

  const calculateROI = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const y = parseFloat(years);

    if (isNaN(initial) || isNaN(final) || initial <= 0) return;

    const profit = final - initial;
    const roi = (profit / initial) * 100;
    
    let annualizedRoi = 0;
    if (!isNaN(y) && y > 0) {
      annualizedRoi = (Math.pow(final / initial, 1 / y) - 1) * 100;
    } else {
      annualizedRoi = roi;
    }

    setResults({ roi, annualizedRoi, profit });
  };

  const reset = () => {
    setInitialInvestment("");
    setFinalValue("");
    setYears("1");
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            <TrendingUp className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">ROI Calculator</h1>
        <p className="text-xl text-gray-600">Calculate Return on Investment and Annualized ROI easily.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Investment ($)</label>
              <input 
                type="number" 
                value={initialInvestment} 
                onChange={(e) => setInitialInvestment(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                placeholder="e.g. 10000" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Final Value ($)</label>
              <input 
                type="number" 
                value={finalValue} 
                onChange={(e) => setFinalValue(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                placeholder="e.g. 15000" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Duration (Years)</label>
            <input 
              type="number" 
              value={years} 
              onChange={(e) => setYears(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="e.g. 5" 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={calculateROI} 
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" /> Calculate ROI
            </button>
            <button 
              onClick={reset} 
              className="px-6 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Reset
            </button>
          </div>

          {results && (
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Investment Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                  <div className="text-sm text-gray-500 mb-1">Total Profit</div>
                  <div className={`text-2xl font-bold ${results.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${results.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                  <div className="text-sm text-gray-500 mb-1">Total ROI</div>
                  <div className={`text-2xl font-bold ${results.roi >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    {results.roi.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                  <div className="text-sm text-gray-500 mb-1">Annualized ROI</div>
                  <div className={`text-2xl font-bold ${results.annualizedRoi >= 0 ? "text-indigo-600" : "text-red-600"}`}>
                    {results.annualizedRoi.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 prose prose-blue max-w-none">
        <h2>What is Return on Investment (ROI)?</h2>
        <p>Return on Investment (ROI) is a popular financial metric used to evaluate the likelihood of gaining a return from an investment. It is a ratio that compares the gain or loss from an investment relative to its cost. It is as useful in evaluating personal financial decisions as it is in comparing business projects.</p>
        
        <h3>How is ROI Calculated?</h3>
        <p>The standard formula for calculating ROI is:</p>
        <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm border border-slate-200">
          ROI = (Net Profit / Cost of Investment) × 100
        </div>
        <p>While simple ROI is a great metric, it does not account for the holding period of an investment. This is where <strong>Annualized ROI</strong> comes in. Annualized ROI considers the time period to provide an average annual return rate, making it easier to compare investments held for different lengths of time.</p>

        <h3>Why use our ROI Calculator?</h3>
        <ul>
          <li><strong>Instant Results:</strong> Calculate your total profit, simple ROI, and annualized ROI simultaneously.</li>
          <li><strong>100% Free & Private:</strong> All calculations happen locally in your browser. No financial data is sent to our servers.</li>
          <li><strong>Easy to Use:</strong> Designed with a clean, intuitive interface that works beautifully on mobile and desktop.</li>
        </ul>
      </div>
    </div>
  );
}

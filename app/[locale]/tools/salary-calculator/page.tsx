"use client";

import { useState, useMemo, useEffect } from "react";
import { DollarSign, RefreshCw, Calculator } from "lucide-react";

export default function SalaryCalculatorPage() {
  const [salaryStr, setSalaryStr] = useState("");
  const [bonusStr, setBonusStr] = useState("");
  const [taxRateStr, setTaxRateStr] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("salary_calc_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.salaryStr) setSalaryStr(parsed.salaryStr);
        if (parsed.bonusStr) setBonusStr(parsed.bonusStr);
        if (parsed.taxRateStr) setTaxRateStr(parsed.taxRateStr);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("salary_calc_history", JSON.stringify({
      salaryStr, bonusStr, taxRateStr
    }));
  }, [salaryStr, bonusStr, taxRateStr]);

  const calculateResults = () => {
    const salary = parseFloat(salaryStr) || 0;
    const bonus = parseFloat(bonusStr) || 0;
    const taxRate = parseFloat(taxRateStr) || 0;

    if (salary === 0) return null;

    const grossAnnual = salary + bonus;
    const totalTax = grossAnnual * (taxRate / 100);
    const netAnnual = grossAnnual - totalTax;

    return {
      grossAnnual,
      totalTax,
      netAnnual,
      netMonthly: netAnnual / 12,
      netBiweekly: netAnnual / 26,
      netWeekly: netAnnual / 52,
    };
  };

  const results = useMemo(() => calculateResults(), [salaryStr, bonusStr, taxRateStr]);

  const reset = () => {
    setSalaryStr("");
    setBonusStr("");
    setTaxRateStr("");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-full">
            <DollarSign className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Salary Calculator</h1>
        <p className="text-xl text-gray-600">Calculate your take-home pay, monthly salary, and tax deductions.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Base Salary ($)</label>
              <input 
                type="number" 
                value={salaryStr} 
                onChange={(e) => setSalaryStr(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                placeholder="e.g. 75000" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Bonus ($)</label>
              <input 
                type="number" 
                value={bonusStr} 
                onChange={(e) => setBonusStr(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                placeholder="e.g. 5000" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Tax Rate (%)</label>
            <input 
              type="number" 
              value={taxRateStr} 
              onChange={(e) => setTaxRateStr(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
              placeholder="e.g. 22" 
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              onClick={reset} 
              className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Clear All Fields
            </button>
          </div>

          {results && (
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Your Estimated Take-Home Pay</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-1">Annual Take-Home</div>
                  <div className="text-3xl font-extrabold text-green-600">
                    {formatCurrency(results.netAnnual)}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-1">Monthly Take-Home</div>
                  <div className="text-3xl font-extrabold text-blue-600">
                    {formatCurrency(results.netMonthly)}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Breakdown</th>
                      <th className="px-6 py-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Gross Annual Income</td>
                      <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(results.grossAnnual)}</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Total Estimated Tax</td>
                      <td className="px-6 py-4 text-right text-red-600">-{formatCurrency(results.totalTax)}</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Bi-Weekly Take-Home</td>
                      <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(results.netBiweekly)}</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Weekly Take-Home</td>
                      <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(results.netWeekly)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 prose prose-green max-w-none">
        <h2>About the Salary Calculator</h2>
        <p>Understanding your true take-home pay is crucial for personal budgeting and financial planning. Our Free Salary Calculator helps you estimate your net income after taxes, breaking it down into easy-to-understand periods: annual, monthly, bi-weekly, and weekly.</p>
        
        <h3>Gross vs. Net Pay</h3>
        <ul>
          <li><strong>Gross Pay:</strong> Your total earnings before any taxes or deductions are applied. This includes your base salary and any bonuses.</li>
          <li><strong>Net Pay (Take-Home):</strong> The actual amount of money that lands in your bank account after federal, state, and local taxes, as well as other deductions like health insurance or retirement contributions, are taken out.</li>
        </ul>

        <h3>How to use this tool</h3>
        <ol>
          <li>Enter your <strong>Annual Base Salary</strong>.</li>
          <li>Add any expected <strong>Annual Bonus</strong> (leave as 0 if none).</li>
          <li>Estimate your total <strong>Tax Rate (%)</strong>. If you are unsure, look at a recent pay stub to see what percentage of your gross income was withheld for taxes.</li>
        </ol>

        <p><em>Disclaimer: This calculator provides an estimate based on a flat tax rate. Actual tax obligations may vary significantly depending on progressive tax brackets, state laws, filing status, and specific deductions.</em></p>
      </div>
    </div>
  );
}

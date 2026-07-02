"use client";

import { useState } from "react";
import { Calendar, DollarSign } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState("");
  const [retireAge, setRetireAge] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [result, setResult] = useState<{ years: number; totalSavings: number } | null>(null);
  const onError = useToastError();

  const calculate = () => {
    const current = parseFloat(currentAge);
    const retire = parseFloat(retireAge);
    const monthly = parseFloat(monthlySavings);
    const rate = parseFloat(returnRate) / 12 / 100;

    if (!current || !retire || !monthly || !rate) {
      onError("Please enter all values");
      return;
    }

    const months = (retire - current) * 12;
    const futureValue = monthly * ((Math.pow(1 + rate, months) - 1) / rate);

    setResult({ years: retire - current, totalSavings: Math.round(futureValue) });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Retirement Calculator</h1>
        <p className="text-gray-600">Calculate retirement savings needed for your goal</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
            <input type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age</label>
            <input type="number" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Savings ($)</label>
            <input type="number" value={monthlySavings} onChange={(e) => setMonthlySavings(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
            <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
        </div>
        <button onClick={calculate} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">Calculate</button>
        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Retirement Savings Projection</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div><span className="block text-2xl font-bold text-blue-600">{result.years} years</span><span className="text-sm">Until Retirement</span></div>
              <div><span className="block text-2xl font-bold text-blue-600">${result.totalSavings.toLocaleString()}</span><span className="text-sm">Total Savings</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
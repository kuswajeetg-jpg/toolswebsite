"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

export default function TimeCalculatorPage() {
  const [hours1, setHours1] = useState("");
  const [minutes1, setMinutes1] = useState("");
  const [hours2, setHours2] = useState("");
  const [minutes2, setMinutes2] = useState("");
  const [result, setResult] = useState<{ totalHours: number; totalMinutes: number } | null>(null);

  const calculate = () => {
    const h1 = parseFloat(hours1) || 0;
    const m1 = parseFloat(minutes1) || 0;
    const h2 = parseFloat(hours2) || 0;
    const m2 = parseFloat(minutes2) || 0;

    const total = h1 + h2 + (m1 + m2) / 60;
    setResult({ totalHours: Math.floor(total), totalMinutes: Math.round((total % 1) * 60) });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Time Calculator</h1>
        <p className="text-gray-600">Add or subtract time values</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
            <input type="number" value={hours1} onChange={(e) => setHours1(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="e.g. 2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
            <input type="number" value={minutes1} onChange={(e) => setMinutes1(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="e.g. 30" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hours to Add</label>
            <input type="number" value={hours2} onChange={(e) => setHours2(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="e.g. 1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minutes to Add</label>
            <input type="number" value={minutes2} onChange={(e) => setMinutes2(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="e.g. 45" />
          </div>
        </div>
        <button onClick={calculate} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">Calculate</button>
        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl text-center">
            <span className="text-2xl font-bold text-blue-600">{result.totalHours}h {result.totalMinutes}m</span>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Calculator, Copy, CheckCircle2 } from "lucide-react";

export default function LifeCalculatorPage() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [expectedLifespan, setExpectedLifespan] = useState(80);
  const [result, setResult] = useState<{
    lifeExpectancyDays: number;
    lifeExpectancyWeeks: number;
    lifeExpectancyMonths: number;
    lifeExpectancyPercentage: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateLife = () => {
    if (!dateOfBirth || !expectedLifespan) return;

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    if (birthDate > today) return;

    const expectedDeath = new Date(birthDate);
    expectedDeath.setFullYear(birthDate.getFullYear() + expectedLifespan);

    const timeDiff = expectedDeath.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const weeksLeft = Math.floor(daysLeft / 7);
    const monthsLeft = Math.floor(daysLeft / 30.44);
    const percentageLived = ((expectedLifespan * 365.25 - daysLeft) / (expectedLifespan * 365.25)) * 100;

    setResult({
      lifeExpectancyDays: daysLeft,
      lifeExpectancyWeeks: weeksLeft,
      lifeExpectancyMonths: monthsLeft,
      lifeExpectancyPercentage: Math.max(0, Math.min(100, 100 - percentageLived))
    });
  };

  const copyResult = () => {
    if (result && dateOfBirth) {
      const text = `Life Calculations:
Days remaining: ${result.lifeExpectancyDays.toLocaleString()}
Weeks remaining: ${result.lifeExpectancyWeeks.toLocaleString()}
Months remaining: ${result.lifeExpectancyMonths.toLocaleString()}
Life percentage: ${result.lifeExpectancyPercentage.toFixed(1)}% lived`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Life Calculator</h1>
        <p className="text-gray-600">Calculate remaining time based on your date of birth and expected lifespan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Input Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Lifespan (years)</label>
              <input
                type="number"
                value={expectedLifespan}
                onChange={(e) => setExpectedLifespan(Number(e.target.value))}
                min="1"
                max="150"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={calculateLife}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
            >
              <Calculator className="h-5 w-5" /> Calculate Life Remaining
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Life Statistics</h2>
              <button
                onClick={copyResult}
                className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="space-y-4 flex-1">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <span className="block text-3xl font-extrabold text-blue-600">{result.lifeExpectancyDays.toLocaleString()}</span>
                <span className="text-sm text-gray-600">Days Remaining</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <span className="block text-2xl font-bold text-green-600">{result.lifeExpectancyWeeks.toLocaleString()}</span>
                <span className="text-sm text-gray-600">Weeks Remaining</span>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <span className="block text-2xl font-bold text-purple-600">{result.lifeExpectancyMonths.toLocaleString()}</span>
                <span className="text-sm text-gray-600">Months Remaining</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Life Percentage Lived</span>
                  <span className="text-sm font-bold text-gray-900">{result.lifeExpectancyPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${result.lifeExpectancyPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
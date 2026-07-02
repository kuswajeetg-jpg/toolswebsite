"use client";

import { useState } from "react";
import { Calculator, Activity } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function BmiCalculatorPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [result, setResult] = useState<{ bmi: number; category: string; percent: number } | null>(null);
  const onError = useToastError();

  const calculateBMI = () => {
    if (!height || !weight) {
      onError("Please enter height and weight");
      return;
    }

    let bmi: number;
    
    if (unit === "metric") {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      bmi = w / (h * h);
    } else {
      const h = parseFloat(height);
      const w = parseFloat(weight);
      bmi = (w / (h * h)) * 703;
    }

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    // Calculate percentage for visual scale (clamped between 15 and 40 for display purposes)
    const minBMI = 15;
    const maxBMI = 40;
    const clampedBMI = Math.max(minBMI, Math.min(bmi, maxBMI));
    const percent = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;

    setResult({ bmi: Math.round(bmi * 10) / 10, category, percent });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">BMI Calculator</h1>
        <p className="text-gray-600 text-lg">Calculate your Body Mass Index and find out your healthy weight</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setUnit("metric")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${unit === "metric" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Metric (cm/kg)
              </button>
              <button
                onClick={() => setUnit("imperial")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${unit === "imperial" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Imperial (in/lbs)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {unit === "metric" ? "Height (cm)" : "Height (inches)"}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-lg bg-gray-50 focus:bg-white transition-all"
                placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-lg bg-gray-50 focus:bg-white transition-all"
                placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
              />
            </div>
          </div>

          <button
            onClick={calculateBMI}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Activity className="h-6 w-6" /> Calculate BMI
          </button>

          {result && (
            <div className="mt-10 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-gray-500 mb-4 uppercase tracking-wider">Your Result</h3>
              <div className="text-7xl font-extrabold text-gray-900 mb-4">{result.bmi}</div>
              
              <div className="mb-8">
                <span className={`inline-flex px-4 py-2 rounded-full text-lg font-bold
                  ${result.category === 'Underweight' ? 'bg-blue-100 text-blue-700' : 
                    result.category === 'Normal weight' ? 'bg-green-100 text-green-700' : 
                    result.category === 'Overweight' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'}`}
                >
                  {result.category}
                </span>
              </div>

              <div className="relative w-full max-w-md mx-auto h-4 rounded-full bg-gray-200 overflow-hidden mb-2 flex">
                <div className="h-full bg-blue-400" style={{ width: '14%' }}></div>
                <div className="h-full bg-green-400" style={{ width: '26%' }}></div>
                <div className="h-full bg-yellow-400" style={{ width: '20%' }}></div>
                <div className="h-full bg-red-400" style={{ width: '40%' }}></div>
              </div>
              
              <div className="relative w-full max-w-md mx-auto h-6">
                <div 
                  className="absolute top-0 -ml-2 text-gray-800 transition-all duration-700 ease-out flex flex-col items-center"
                  style={{ left: `${result.percent}%` }}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-white bg-gray-900 shadow-md"></div>
                </div>
              </div>
              
              <div className="flex justify-between max-w-md mx-auto text-xs font-semibold text-gray-400 mt-2 px-1 uppercase">
                <span>Under</span>
                <span>Normal</span>
                <span>Over</span>
                <span>Obese</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
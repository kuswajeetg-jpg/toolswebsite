"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

export default function UnitConverterPage() {
  const [category, setCategory] = useState("length");
  const [fromValue, setFromValue] = useState("");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("feet");
  const [result, setResult] = useState(0);

  const units: Record<string, string[]> = {
    length: ["meter", "kilometer", "centimeter", "millimeter", "feet", "inch", "yard", "mile"],
    weight: ["gram", "kilogram", "milligram", "pound", "ounce"],
    area: ["sqmeter", "sqkilometer", "acre", "hectare", "sqfeet", "sqinch"],
  };

  const conversions: Record<string, Record<string, number>> = {
    meter: { feet: 3.28084, inch: 39.3701 },
    kilometer: { meter: 1000, mile: 0.621371 },
    feet: { meter: 0.3048, inch: 12 },
    gram: { kilogram: 0.001, pound: 0.00220462 },
    sqmeter: { sqfeet: 10.7639 },
  };

  const convert = () => {
    const val = parseFloat(fromValue) || 0;
    let converted = val;

    // Simple conversion logic
    const convRate = conversions[fromUnit]?.[toUnit] || 1;
    setResult(val * convRate);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Unit Converter</h1>
        <p className="text-gray-600">Convert between different units of measurement</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="length">Length</option>
              <option value="weight">Weight</option>
              <option value="area">Area</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Unit</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                {units[category].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Unit</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                {units[category].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Enter value"
            />
          </div>

          <button
            onClick={convert}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Convert
          </button>

          {result > 0 && (
            <div className="p-6 bg-blue-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-600">{result.toFixed(4)} {toUnit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
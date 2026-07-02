"use client";

import { useState } from "react";
import { Calculator, TrendingUp, Table } from "lucide-react";
import { useToastError } from "@/lib/toast";
import FinancialChart from "@/components/common/FinancialChart";

type YearlySchedule = {
  year: number;
  invested: number;
  returns: number;
  balance: number;
};

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("10");
  const [frequency, setFrequency] = useState("1");
  const [monthlyAddition, setMonthlyAddition] = useState("0");
  
  const [result, setResult] = useState<{ amount: number; interest: number; invested: number } | null>(null);
  const [schedule, setSchedule] = useState<YearlySchedule[]>([]);
  const onError = useToastError();

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(frequency);
    const mAdd = parseFloat(monthlyAddition) || 0;

    if (!p || !r || !t || !n) {
      onError("Please enter all required values");
      return;
    }

    const months = t * 12;
    let balance = p;
    let totalInvested = p;
    const newSchedule: YearlySchedule[] = [];
    
    newSchedule.push({
        year: 0,
        invested: p,
        returns: 0,
        balance: p
    });

    const compoundInterval = 12 / n; // months per compound
    
    let yearlyInvested = p;
    for (let month = 1; month <= months; month++) {
        balance += mAdd;
        totalInvested += mAdd;
        
        if (month % compoundInterval === 0) {
            balance += balance * (r / n);
        }
        
        if (month % 12 === 0) {
            newSchedule.push({
                year: month / 12,
                invested: totalInvested,
                returns: balance - totalInvested,
                balance: balance
            });
        }
    }

    setResult({ amount: balance, interest: balance - totalInvested, invested: totalInvested });
    setSchedule(newSchedule);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Compound Interest Calculator</h1>
        <p className="text-gray-600">Calculate compound interest on investments with optional regular additions</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Initial Principal (₹)</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 10000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Addition (₹) <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input type="number" value={monthlyAddition} onChange={(e) => setMonthlyAddition(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 1000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Rate (%)</label>
            <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time (Years)</label>
            <input type="number" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="1">Annually</option>
              <option value="2">Semi-annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
            </select>
          </div>
        </div>
        
        <button onClick={calculate} className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm">
            <TrendingUp className="h-5 w-5" /> Calculate Interest
        </button>
        
        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Investment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-50">
                <span className="block text-2xl font-bold text-blue-600">₹{Math.round(result.invested).toLocaleString('en-IN')}</span>
                <span className="text-sm font-medium text-gray-600">Total Invested</span>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-50">
                <span className="block text-2xl font-bold text-blue-600">₹{Math.round(result.interest).toLocaleString('en-IN')}</span>
                <span className="text-sm font-medium text-gray-600">Interest Earned</span>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-green-50 ring-2 ring-green-100">
                <span className="block text-2xl font-bold text-green-600">₹{Math.round(result.amount).toLocaleString('en-IN')}</span>
                <span className="text-sm font-medium text-gray-600">Total Value</span>
              </div>
            </div>
          </div>
        )}

        {schedule.length > 0 && (
          <>
            <FinancialChart data={schedule.map(s => ({ name: s.year, invested: s.invested, returns: s.returns }))} />
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
                <Table className="h-5 w-5 text-gray-600" /> Year-wise Projection
                </h3>
                <div className="overflow-x-auto max-h-96 rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Invested (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Returns (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Balance (₹)</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {schedule.filter(r => r.year > 0).map((row) => (
                        <tr key={row.year} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{row.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {Math.round(row.invested).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium text-right">
                            +{Math.round(row.returns).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                            {Math.round(row.balance).toLocaleString('en-IN')}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
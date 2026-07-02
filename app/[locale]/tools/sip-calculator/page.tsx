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

export default function SipCalculatorPage() {
  const [sipAmount, setSipAmount] = useState("5000");
  const [lumpsum, setLumpsum] = useState("0");
  const [rate, setRate] = useState("12");
  const [tenure, setTenure] = useState("10");
  const [stepUp, setStepUp] = useState("0");
  
  const [result, setResult] = useState<{ totalInvested: number; totalReturns: number; totalValue: number } | null>(null);
  const [schedule, setSchedule] = useState<YearlySchedule[]>([]);
  const onError = useToastError();

  const calculateSIP = () => {
    const pSip = parseFloat(sipAmount) || 0;
    const pLump = parseFloat(lumpsum) || 0;
    const r = parseFloat(rate);
    const t = parseFloat(tenure);
    const step = parseFloat(stepUp) || 0;

    if (!pSip && !pLump) {
      onError("Please enter either SIP or Lumpsum amount");
      return;
    }
    if (!r || !t) {
      onError("Please enter valid Rate and Tenure");
      return;
    }
    if (r <= 0 || t <= 0) {
      onError("Rate and Tenure must be greater than 0");
      return;
    }

    const monthlyRate = r / 12 / 100;
    const months = t * 12;
    
    let currentBalance = pLump;
    let totalInvested = pLump;
    let currentSip = pSip;
    
    const newSchedule: YearlySchedule[] = [];
    
    // Add year 0 if lumpsum exists, for better chart start point
    if (pLump > 0 && pSip === 0) {
       newSchedule.push({
           year: 0,
           invested: pLump,
           returns: 0,
           balance: pLump
       });
    }

    for (let month = 1; month <= months; month++) {
      if (month > 1 && (month - 1) % 12 === 0) {
        currentSip += currentSip * (step / 100);
      }
      
      currentBalance += currentSip;
      totalInvested += currentSip;
      
      const interestForMonth = currentBalance * monthlyRate;
      currentBalance += interestForMonth;
      
      if (month % 12 === 0) {
        newSchedule.push({
          year: month / 12,
          invested: Math.round(totalInvested),
          returns: Math.round(currentBalance - totalInvested),
          balance: Math.round(currentBalance)
        });
      }
    }

    setResult({
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(currentBalance - totalInvested),
      totalValue: Math.round(currentBalance)
    });
    setSchedule(newSchedule);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">SIP Calculator</h1>
        <p className="text-gray-600">Calculate wealth accumulation through Systematic Investment Plan (SIP) with Step-Up option</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Investment (₹)</label>
            <input
              type="number"
              value={sipAmount}
              onChange={(e) => setSipAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 5000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Initial Lumpsum (₹) <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input
              type="number"
              value={lumpsum}
              onChange={(e) => setLumpsum(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 100000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Return Rate (% p.a.)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 12"
              min="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (Years)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 10"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Step-up (%) <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input
              type="number"
              value={stepUp}
              onChange={(e) => setStepUp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 10"
              min="0"
            />
          </div>
        </div>

        <button
          onClick={calculateSIP}
          className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <TrendingUp className="h-5 w-5" /> Calculate Wealth
        </button>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Investment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-50">
                <span className="block text-2xl font-bold text-blue-600">₹{result.totalInvested.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-600 font-medium">Total Invested</span>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-50">
                <span className="block text-2xl font-bold text-blue-600">₹{result.totalReturns.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-600 font-medium">Estimated Returns</span>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-green-50 ring-2 ring-green-100">
                <span className="block text-2xl font-bold text-green-600">₹{result.totalValue.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-600 font-medium">Total Wealth</span>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6 border border-green-200 bg-green-50 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-1">Ready to start investing?</h3>
              <p className="text-green-700 text-sm">Open a free Demat account today and start your wealth creation journey with zero brokerage on investments.</p>
            </div>
            <a href="#" className="mt-4 md:mt-0 whitespace-nowrap bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
              Open Free Account
            </a>
          </div>
        )}

        {schedule.length > 0 && (
          <>
            <FinancialChart data={schedule.map(s => ({ name: s.year, invested: s.invested, returns: s.returns }))} />
            
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Table className="h-5 w-5 text-gray-600" /> Year-wise Projection
                </h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Invested (₹)</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Returns (₹)</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Balance (₹)</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {schedule.map((row) => (
                        <tr key={row.year} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{row.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {row.invested.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium text-right">
                            +{row.returns.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                            {row.balance.toLocaleString('en-IN')}
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

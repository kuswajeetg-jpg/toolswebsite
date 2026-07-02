"use client";

import { useState } from "react";
import { Calculator, ArrowDownToLine, Table } from "lucide-react";
import { useToastError } from "@/lib/toast";
import BalanceChart from "@/components/common/BalanceChart";

type YearlySchedule = {
  year: number;
  withdrawn: number;
  returns: number;
  balance: number;
};

export default function SwpCalculatorPage() {
  const [corpus, setCorpus] = useState("5000000");
  const [withdrawal, setWithdrawal] = useState("30000");
  const [rate, setRate] = useState("8");
  const [tenure, setTenure] = useState("10");
  const [inflation, setInflation] = useState("0");
  
  const [result, setResult] = useState<{ totalWithdrawn: number; finalBalance: number; monthsLasted: number; isDepleted: boolean } | null>(null);
  const [schedule, setSchedule] = useState<YearlySchedule[]>([]);
  const onError = useToastError();

  const calculateSWP = () => {
    const c = parseFloat(corpus);
    const w = parseFloat(withdrawal);
    const r = parseFloat(rate);
    const t = parseFloat(tenure);
    const inf = parseFloat(inflation) || 0;

    if (!c || !w) {
      onError("Please enter Corpus and Withdrawal amount");
      return;
    }
    if (!r || !t) {
      onError("Please enter valid Rate and Tenure");
      return;
    }
    if (r < 0 || t <= 0) {
      onError("Rate and Tenure must be valid");
      return;
    }

    const monthlyRate = r / 12 / 100;
    const months = t * 12;
    
    let currentBalance = c;
    let currentWithdrawal = w;
    let totalWithdrawn = 0;
    
    let yearlyWithdrawn = 0;
    let yearlyReturns = 0;
    
    const newSchedule: YearlySchedule[] = [];
    let isDepleted = false;
    let monthsLasted = 0;
    
    newSchedule.push({
        year: 0,
        withdrawn: 0,
        returns: 0,
        balance: c
    });
    
    for (let month = 1; month <= months; month++) {
      if (currentBalance <= 0) {
        isDepleted = true;
        break;
      }
      
      // Step up withdrawal every 12 months for inflation
      if (month > 1 && (month - 1) % 12 === 0) {
        currentWithdrawal += currentWithdrawal * (inf / 100);
      }
      
      let actualWithdrawal = currentWithdrawal;
      if (currentBalance < currentWithdrawal) {
        actualWithdrawal = currentBalance;
      }
      
      currentBalance -= actualWithdrawal;
      totalWithdrawn += actualWithdrawal;
      yearlyWithdrawn += actualWithdrawal;
      monthsLasted++;
      
      const interestForMonth = currentBalance * monthlyRate;
      currentBalance += interestForMonth;
      yearlyReturns += interestForMonth;
      
      // Store yearly schedule
      if (month % 12 === 0 || isDepleted || month === months) {
        newSchedule.push({
          year: Math.ceil(month / 12),
          withdrawn: Math.round(yearlyWithdrawn),
          returns: Math.round(yearlyReturns),
          balance: Math.round(currentBalance)
        });
        yearlyWithdrawn = 0;
        yearlyReturns = 0;
      }
      
      if (currentBalance <= 0) {
        isDepleted = true;
        break;
      }
    }

    setResult({
      totalWithdrawn: Math.round(totalWithdrawn),
      finalBalance: Math.max(0, Math.round(currentBalance)),
      monthsLasted,
      isDepleted
    });
    setSchedule(newSchedule);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">SWP Calculator</h1>
        <p className="text-gray-600">Calculate Systematic Withdrawal Plan to plan your regular income and retirement</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Investment (₹)</label>
            <input
              type="number"
              value={corpus}
              onChange={(e) => setCorpus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 5000000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Withdrawal (₹)</label>
            <input
              type="number"
              value={withdrawal}
              onChange={(e) => setWithdrawal(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 30000"
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
              placeholder="e.g. 8"
              min="0"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Inflation Adjust (% p.a.) <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input
              type="number"
              value={inflation}
              onChange={(e) => setInflation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 5"
              min="0"
            />
          </div>
        </div>

        <button
          onClick={calculateSWP}
          className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <ArrowDownToLine className="h-5 w-5" /> Calculate SWP
        </button>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Withdrawal Summary</h3>
            
            {result.isDepleted && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center font-medium shadow-sm">
                Warning: Your fund will be completely depleted in {Math.floor(result.monthsLasted / 12)} Years and {result.monthsLasted % 12} Months.
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-50">
                <span className="block text-2xl font-bold text-blue-600">₹{result.totalWithdrawn.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-600 font-medium">Total Amount Withdrawn</span>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-50">
                <span className={`block text-2xl font-bold ${result.isDepleted ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{result.finalBalance.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-gray-600 font-medium">Final Balance</span>
              </div>
            </div>
          </div>
        )}

        {schedule.length > 0 && (
          <>
            <BalanceChart data={schedule.map(s => ({ name: s.year, balance: s.balance }))} />
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
                <Table className="h-5 w-5 text-gray-600" /> Year-wise Projection
                </h3>
                <div className="overflow-x-auto max-h-96 rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Withdrawn (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Interest Earned (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Balance (₹)</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {schedule.filter(r => r.year > 0).map((row) => (
                        <tr key={row.year} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{row.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium text-right">
                            -{row.withdrawn.toLocaleString('en-IN')}
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

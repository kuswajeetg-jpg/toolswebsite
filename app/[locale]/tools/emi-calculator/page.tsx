"use client";

import { useState } from "react";
import { Calculator, DollarSign, Table } from "lucide-react";
import { useToastError } from "@/lib/toast";
import BalanceChart from "@/components/common/BalanceChart";

type ScheduleItem = {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
};

export default function EmiCalculatorPage() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("15");
  const [result, setResult] = useState<{ emi: number; total: number; interest: number } | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const onError = useToastError();

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure) * 12;

    if (!p || !r || !n) {
      onError("Please enter all values");
      return;
    }

    if (p <= 0 || r < 0 || n <= 0) {
      onError("Please enter valid positive numbers");
      return;
    }

    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const totalInterest = total - p;

    setResult({
      emi: Math.round(emi),
      total: Math.round(total),
      interest: Math.round(totalInterest),
    });

    let balance = p;
    const newSchedule: ScheduleItem[] = [];
    
    for (let month = 1; month <= n; month++) {
      const interestForMonth = balance * r;
      let principalForMonth = emi - interestForMonth;
      
      if (month === n) {
        principalForMonth = balance;
      }
      
      balance -= principalForMonth;
      if (balance < 0) balance = 0;

      newSchedule.push({
        month,
        emi: month === n ? principalForMonth + interestForMonth : emi,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: balance
      });
    }

    setSchedule(newSchedule);
  };

  const chartData = [
      { name: 0, balance: parseFloat(principal) || 0 },
      ...schedule.filter(s => s.month % 12 === 0 || s.month === schedule.length).map(s => ({
          name: Math.ceil(s.month / 12),
          balance: s.balance
      }))
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">EMI Calculator</h1>
        <p className="text-gray-600">Calculate monthly loan payments (EMI) for personal, home, or car loans</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₹)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 1000000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (% p.a.)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 8.5"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Years)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 15"
              min="1"
            />
          </div>
        </div>

        <button
          onClick={calculateEMI}
          className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Calculator className="h-5 w-5" /> Calculate EMI
        </button>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Loan Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-50">
                <span className="block text-2xl font-bold text-blue-600">₹{result.emi.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-600 font-medium">Monthly EMI</span>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-50">
                <span className="block text-2xl font-bold text-blue-600">₹{result.total.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-600 font-medium">Total Payable</span>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-red-50 ring-2 ring-red-100">
                <span className="block text-2xl font-bold text-red-600">₹{result.interest.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-600 font-medium">Total Interest</span>
              </div>
            </div>
          </div>
        )}

        {schedule.length > 0 && (
          <>
            <BalanceChart data={chartData} />
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
                <Table className="h-5 w-5 text-gray-600" /> Amortization Schedule
                </h3>
                <div className="overflow-x-auto max-h-[500px] rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">EMI (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Principal (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Interest (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Balance (₹)</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{row.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {row.emi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium text-right">
                            {row.principal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium text-right">
                            {row.interest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                            {row.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
"use client";

import { useState } from "react";
import { Calculator, Combine, Table, ArrowRight } from "lucide-react";
import { useToastError } from "@/lib/toast";
import BalanceChart from "@/components/common/BalanceChart";

type ScheduleRow = {
  phase: 1 | 2;
  year: number;
  invested: number;
  withdrawn: number;
  returns: number;
  balance: number;
};

export default function CombinedSipSwpPage() {
  // Phase 1: Accumulation (SIP)
  const [lumpsum, setLumpsum] = useState("100000");
  const [sipAmount, setSipAmount] = useState("10000");
  const [sipRate, setSipRate] = useState("12");
  const [sipTenure, setSipTenure] = useState("15");

  // Phase 2: Distribution (SWP)
  const [swpAmount, setSwpAmount] = useState("50000");
  const [swpRate, setSwpRate] = useState("8");
  const [swpTenure, setSwpTenure] = useState("20");

  const [result, setResult] = useState<{
    phase1Invested: number;
    phase1Corpus: number;
    phase2Withdrawn: number;
    phase2FinalBalance: number;
    isDepleted: boolean;
    monthsLasted: number;
  } | null>(null);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const onError = useToastError();

  const calculateCombined = () => {
    // Parse Phase 1
    const lump = parseFloat(lumpsum) || 0;
    const sip = parseFloat(sipAmount) || 0;
    const r1 = parseFloat(sipRate);
    const t1 = parseFloat(sipTenure);

    // Parse Phase 2
    const swp = parseFloat(swpAmount);
    const r2 = parseFloat(swpRate);
    const t2 = parseFloat(swpTenure);

    if (!r1 || !t1 || !swp || !r2 || !t2) {
      onError("Please fill all required fields correctly.");
      return;
    }

    const newSchedule: ScheduleRow[] = [];
    
    // Add year 0 if lumpsum exists
    if (lump > 0 && sip === 0) {
        newSchedule.push({
            phase: 1,
            year: 0,
            invested: lump,
            withdrawn: 0,
            returns: 0,
            balance: lump
        });
    }

    // --- Phase 1: SIP ---
    const monthlyRate1 = r1 / 12 / 100;
    const months1 = t1 * 12;
    let balance = lump;
    let totalInvested = lump;
    let yearlyInvested = lump; // For year 1, lump sum is counted
    let yearlyReturns = 0;

    for (let m = 1; m <= months1; m++) {
      balance += sip;
      totalInvested += sip;
      yearlyInvested += sip;
      
      const interest = balance * monthlyRate1;
      balance += interest;
      yearlyReturns += interest;

      if (m % 12 === 0) {
        newSchedule.push({
          phase: 1,
          year: m / 12,
          invested: yearlyInvested,
          withdrawn: 0,
          returns: Math.round(yearlyReturns),
          balance: Math.round(balance)
        });
        yearlyInvested = 0;
        yearlyReturns = 0;
      }
    }
    const phase1Corpus = balance;

    // --- Phase 2: SWP ---
    const monthlyRate2 = r2 / 12 / 100;
    const months2 = t2 * 12;
    let totalWithdrawn = 0;
    let isDepleted = false;
    let monthsLasted = 0;
    
    let yearlyWithdrawn = 0;
    yearlyReturns = 0;

    for (let m = 1; m <= months2; m++) {
      if (balance <= 0) {
        isDepleted = true;
        break;
      }

      let actualWithdrawal = swp;
      if (balance < swp) {
        actualWithdrawal = balance;
      }

      balance -= actualWithdrawal;
      totalWithdrawn += actualWithdrawal;
      yearlyWithdrawn += actualWithdrawal;
      monthsLasted++;

      const interest = balance * monthlyRate2;
      balance += interest;
      yearlyReturns += interest;

      if (m % 12 === 0 || isDepleted || m === months2) {
        newSchedule.push({
          phase: 2,
          year: t1 + Math.ceil(m / 12),
          invested: 0,
          withdrawn: Math.round(yearlyWithdrawn),
          returns: Math.round(yearlyReturns),
          balance: Math.max(0, Math.round(balance))
        });
        yearlyWithdrawn = 0;
        yearlyReturns = 0;
      }

      if (balance <= 0) {
        isDepleted = true;
        break;
      }
    }

    setResult({
      phase1Invested: Math.round(totalInvested),
      phase1Corpus: Math.round(phase1Corpus),
      phase2Withdrawn: Math.round(totalWithdrawn),
      phase2FinalBalance: Math.max(0, Math.round(balance)),
      isDepleted,
      monthsLasted
    });
    setSchedule(newSchedule);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Combined SIP + SWP Calculator</h1>
        <p className="text-gray-600">Plan your complete financial lifecycle: Accumulate wealth through SIP, then generate passive income via SWP.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Phase 1 Setup */}
          <div>
            <h2 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
              Phase 1: Accumulation (SIP)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Lumpsum (₹)</label>
                <input
                  type="number"
                  value={lumpsum}
                  onChange={(e) => setLumpsum(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly SIP (₹)</label>
                <input
                  type="number"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  min="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sipRate}
                    onChange={(e) => setSipRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Yrs)</label>
                  <input
                    type="number"
                    value={sipTenure}
                    onChange={(e) => setSipTenure(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 Setup */}
          <div>
            <h2 className="text-xl font-bold text-green-600 mb-6 flex items-center gap-2">
              <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
              Phase 2: Distribution (SWP)
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 mb-2">
                The corpus generated from Phase 1 will automatically act as the starting investment for Phase 2.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Withdrawal (₹)</label>
                <input
                  type="number"
                  value={swpAmount}
                  onChange={(e) => setSwpAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  min="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={swpRate}
                    onChange={(e) => setSwpRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Yrs)</label>
                  <input
                    type="number"
                    value={swpTenure}
                    onChange={(e) => setSwpTenure(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        <button
          onClick={calculateCombined}
          className="mt-10 w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-lg shadow-md"
        >
          <Combine className="h-6 w-6" /> Calculate Lifecycle Plan
        </button>

        {result && (
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center shadow-sm">
                <h3 className="text-lg font-bold text-blue-800 mb-4">End of Phase 1</h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-gray-500 text-sm">Total Invested</span>
                    <span className="text-xl font-bold text-gray-900">₹{result.phase1Invested.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-sm">Accumulated Corpus</span>
                    <span className="text-2xl font-bold text-blue-600">₹{result.phase1Corpus.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center relative shadow-sm">
                <div className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border border-gray-200 items-center justify-center z-10 shadow-sm">
                  <ArrowRight className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-4">End of Phase 2</h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-gray-500 text-sm">Total Withdrawn</span>
                    <span className="text-xl font-bold text-gray-900">₹{result.phase2Withdrawn.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-sm">Final Balance</span>
                    <span className={`text-2xl font-bold ${result.isDepleted ? 'text-red-600' : 'text-green-600'}`}>₹{result.phase2FinalBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {result.isDepleted && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center font-medium shadow-sm">
                Warning: Your fund will be completely depleted in Phase 2 after {Math.floor(result.monthsLasted / 12)} Years and {result.monthsLasted % 12} Months.
              </div>
            )}
          </div>
        )}

        {schedule.length > 0 && (
          <>
            <BalanceChart data={schedule.map(s => ({ name: s.year, balance: s.balance }))} />
            <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
                <Table className="h-5 w-5 text-gray-600" /> Complete Lifecycle Projection
                </h3>
                <div className="overflow-x-auto max-h-[500px] rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Phase</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Invested (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Withdrawn (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Returns (₹)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Balance (₹)</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {schedule.map((row) => (
                        <tr key={`${row.phase}-${row.year}`} className={row.phase === 1 ? 'bg-white hover:bg-blue-50 transition' : 'bg-green-50/30 hover:bg-green-100/50 transition'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Year {row.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-center">
                            <span className={`px-2 py-1 rounded-full font-semibold ${row.phase === 1 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {row.phase === 1 ? 'SIP' : 'SWP'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium text-right">
                            {row.invested > 0 ? `+${row.invested.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium text-right">
                            {row.withdrawn > 0 ? `-${row.withdrawn.toLocaleString('en-IN')}` : '-'}
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

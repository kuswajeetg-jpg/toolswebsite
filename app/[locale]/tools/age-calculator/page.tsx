"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Calculator, Calendar, Clock } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalMonths: number; totalWeeks: number; totalDays: number; totalHours: number; totalMinutes: number } | null>(null);
  const onError = useToastError();
  const t = useTranslations("AgeCalculator");

  const calculateAge = () => {
    if (!dob || !targetDate) {
        onError("Please select both dates.");
        return;
    }

    const d1 = new Date(dob);
    const d2 = new Date(targetDate);

    if (d1 > d2) {
      onError("Date of Birth cannot be after the Target Date.");
      return;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    const totalMonths = (years * 12) + months;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    setResult({ years, months, days, totalMonths, totalWeeks, totalDays, totalHours, totalMinutes });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-gray-600 text-lg">{t("subtitle")}</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" /> {t("dob")}
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> {t("target_date")}
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          onClick={calculateAge}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-sm"
        >
          <Calculator className="h-6 w-6" /> {t("btn_calculate")}
        </button>

        {result && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 mb-6 text-center">
              <h3 className="text-lg font-bold text-blue-800 mb-6 uppercase tracking-widest">{t("your_exact_age")}</h3>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <div className="text-center bg-white p-6 rounded-2xl shadow-sm min-w-[120px] border border-blue-50">
                  <span className="block text-5xl font-extrabold text-blue-600 mb-2">{result.years}</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-bold">{t("years")}</span>
                </div>
                <div className="text-center bg-white p-6 rounded-2xl shadow-sm min-w-[120px] border border-blue-50">
                  <span className="block text-5xl font-extrabold text-blue-600 mb-2">{result.months}</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-bold">{t("months")}</span>
                </div>
                <div className="text-center bg-white p-6 rounded-2xl shadow-sm min-w-[120px] border border-blue-50">
                  <span className="block text-5xl font-extrabold text-blue-600 mb-2">{result.days}</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-bold">{t("days")}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center col-span-2 md:col-span-1">
                <span className="block text-xl font-bold text-gray-900 mb-1">{result.totalMonths.toLocaleString()}</span>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t("total_months")}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center col-span-2 md:col-span-1">
                <span className="block text-xl font-bold text-gray-900 mb-1">{result.totalWeeks.toLocaleString()}</span>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t("total_weeks")}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center col-span-2 md:col-span-1">
                <span className="block text-xl font-bold text-gray-900 mb-1">{result.totalDays.toLocaleString()}</span>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t("total_days")}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center col-span-2 md:col-span-1">
                <span className="block text-xl font-bold text-gray-900 mb-1">{result.totalHours.toLocaleString()}</span>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t("total_hours")}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center col-span-2 md:col-span-1">
                <span className="block text-xl font-bold text-gray-900 mb-1">{result.totalMinutes.toLocaleString()}</span>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t("total_minutes")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

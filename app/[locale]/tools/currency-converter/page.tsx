"use client";

import { useState, useEffect } from "react";
import { Globe, ArrowRightLeft, DollarSign } from "lucide-react";

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [rate, setRate] = useState(0);
  const [converted, setConverted] = useState(0);

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "INR", name: "Indian Rupee" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "AED", name: "UAE Dirham" }
  ];
  
  const mockRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.5,
    JPY: 154.2,
    AUD: 1.53,
    CAD: 1.37,
    CHF: 0.89,
    CNY: 7.24,
    AED: 3.67,
  };

  const [rates, setRates] = useState<Record<string, number>>(mockRates);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
        const useKeyedApi = apiKey && apiKey !== "YOUR_FREE_EXCHANGE_RATE_API_KEY" && apiKey.trim() !== "";
        const url = useKeyedApi 
          ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`
          : `https://open.er-api.com/v6/latest/${fromCurrency}`;
          
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch exchange rates");
        const data = await response.json();
        
        if (data.result === "success") {
          const fetchedRates = useKeyedApi ? data.conversion_rates : data.rates;
          if (fetchedRates) {
            setRates(fetchedRates);
          } else {
            throw new Error("No rates data returned");
          }
        } else {
          throw new Error(data["error-type"] || "API returned failure");
        }
      } catch (err: any) {
        console.error("Currency API Error:", err);
        setError("Failed to fetch live rates. Using cached rates.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency]);

  useEffect(() => {
    const conversionRate = rates[toCurrency] || (mockRates[toCurrency] / mockRates[fromCurrency]) || 1;
    setRate(conversionRate);
    
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount)) {
        setConverted(numAmount * conversionRate);
    } else {
        setConverted(0);
    }
  }, [amount, toCurrency, rates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Globe className="w-8 h-8 text-indigo-600" /> Currency Converter
        </h1>
        <p className="text-gray-600 text-lg">Convert currencies with live-like exchange rates</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto relative overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 z-0 opacity-60"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-end mb-10">
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Amount & From</label>
            <div className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white outline-none transition-all"
                    />
                </div>
                <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-4 text-lg font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white outline-none appearance-none cursor-pointer transition-all"
                >
                    {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                </select>
            </div>
          </div>

          <div className="flex justify-center pb-6 md:pb-12">
            <button 
                onClick={handleSwap}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-4 rounded-full transition-all hover:scale-110 hover:rotate-180 duration-500 shadow-sm"
                title="Swap Currencies"
            >
                <ArrowRightLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Converted To</label>
            <div className="space-y-4">
                <div className="relative">
                    <div className="w-full px-4 py-4 text-2xl font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden text-ellipsis whitespace-nowrap">
                        {converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
                <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-4 text-lg font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white outline-none appearance-none cursor-pointer transition-all"
                >
                    {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                </select>
            </div>
          </div>

        </div>

        <div className="relative z-10 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-center text-white shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <p className="text-indigo-100 font-semibold mb-2 uppercase tracking-widest text-sm">
            {isLoading ? "Fetching Live Rates..." : error ? error : "Live Exchange Rate (ExchangeRate-API)"}
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
              <span className="text-2xl md:text-3xl font-light">1 {fromCurrency}</span>
              <span className="text-xl opacity-75">=</span>
              <span className="text-3xl md:text-4xl font-bold">
                {isLoading ? "..." : rate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {toCurrency}
              </span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
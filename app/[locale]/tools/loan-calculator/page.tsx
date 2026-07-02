import { Metadata } from "next";
import LoanClient from "./LoanClient";

export const metadata: Metadata = {
  title: "Loan Calculator - Free Online EMI & Payment Calculator",
  description: "Calculate your loan payments, interest rates, and schedule for personal, auto, or mortgage loans.",
};

export default function LoanCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Loan Calculator</h1>
        <p className="text-gray-600">Calculate loan payments for personal, auto, or mortgage loans</p>
      </div>
      
      <LoanClient />
    </div>
  );
}
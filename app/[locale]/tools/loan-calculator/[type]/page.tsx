import { Metadata } from "next";
import LoanClient from "../LoanClient";

interface Props {
  params: {
    type: string;
  };
}

// Helper to format the URL slug into a readable title
function formatType(type: string) {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const typeName = formatType(params.type);
  
  return {
    title: `${typeName} Calculator - Free EMI & Payment Estimator`,
    description: `Easily calculate your ${typeName} payments, interest rates, and loan schedule online for free.`,
  };
}

export default function DynamicLoanPage({ params }: Props) {
  const typeName = formatType(params.type);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{typeName} Calculator</h1>
        <p className="text-gray-600">Calculate payments and interest for your {typeName.toLowerCase()}.</p>
      </div>

      <LoanClient />
    </div>
  );
}

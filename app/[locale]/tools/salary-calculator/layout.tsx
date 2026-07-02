import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Salary Calculator - Take Home Pay & Tax Estimator",
  description: "Calculate your net take-home salary after deductions like PF, Professional Tax, and Income Tax. Plan your finances better.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="salary-calculator" />
    </>
  );
}
